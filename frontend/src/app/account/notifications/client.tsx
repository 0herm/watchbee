'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser } from './actions'
import { Button } from '@/ui/button'
import { Bell, BellOff } from 'lucide-react'

const toUint8 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0))

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [ready, setReady] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [permissionDenied, setPermissionDenied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            setPermissionDenied(Notification.permission === 'denied')
            navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
                .then((reg) => reg.pushManager.getSubscription().then(setSubscription))
                .catch((err) => setError(`Service worker failed to register: ${err instanceof Error ? err.message : String(err)}`))
                .finally(() => setReady(true))
        } else {
            setReady(true)
        }
    }, [])

    async function subscribeToPush() {
        setError(null); setLoading(true)
        try {
            if (await Notification.requestPermission() !== 'granted') { setPermissionDenied(true); return }
            const reg = await navigator.serviceWorker.ready
            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) { setError('VAPID public key is not configured.'); return }
            const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toUint8(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) })
            setSubscription(sub)
            const result = await subscribeUser(JSON.parse(JSON.stringify(sub)))
            if (!result.success) { setError(`Failed to save subscription: ${result.error}`); await sub.unsubscribe(); setSubscription(null) }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally { setLoading(false) }
    }

    async function unsubscribeFromPush() {
        setError(null); setLoading(true)
        try { await subscription?.unsubscribe(); setSubscription(null); await unsubscribeUser() }
        catch (err) { setError(err instanceof Error ? err.message : String(err)) }
        finally { setLoading(false) }
    }

    return (
        <div className='rounded-2xl border border-border/60 overflow-hidden bg-surface-1'>
            <div className='flex items-center gap-3 px-4 py-4 border-b border-border/60'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 shrink-0'><Bell className='h-4 w-4 text-muted-foreground/70' /></div>
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium'>Push Notifications</p>
                        {ready && isSupported && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                                subscription ? 'bg-ambient/15 text-ambient' : 'bg-muted text-muted-foreground'
                            }`}>
                                {subscription ? 'Active' : 'Off'}
                            </span>
                        )}
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5'>{ready && !isSupported ? 'Not supported in this browser' : 'Get notified about new releases'}</p>
                </div>
            </div>
            <div className='px-4 py-4 flex flex-col gap-3 min-h-[5.25rem] justify-center'>
                {!ready ? null : !isSupported ? (
                    <p className='text-sm text-muted-foreground'>Push notifications are not supported in this browser.</p>
                ) : permissionDenied ? (
                    <p className='text-sm text-muted-foreground'>Notifications are blocked. Enable them in your browser or device settings.</p>
                ) : subscription ? (
                    <Button variant='destructive' onClick={unsubscribeFromPush} disabled={loading} className='w-full'><BellOff className='h-4 w-4' />Unsubscribe</Button>
                ) : (
                    <Button onClick={subscribeToPush} disabled={loading} className='w-full'>
                        <Bell className='h-4 w-4' />
                        {loading ? 'Subscribing…' : 'Subscribe to Notifications'}
                    </Button>
                )}
                {error && <p className='text-xs text-destructive'>{error}</p>}
            </div>
        </div>
    )
}
