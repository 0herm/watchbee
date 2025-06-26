'use client'
 
import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser } from './actions'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null
    )

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }

    async function subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            })
            setSubscription(sub)

            // Serialize the subscription object to send to the server
            const serializedSub = JSON.parse(JSON.stringify(sub))
            const response = await subscribeUser(serializedSub)

            if (response.success) {
                console.log('User subscribed successfully!')
            } else {
                console.error('Failed to subscribe user:', response.error)
            }
        } catch (error) {
            console.error('Error during subscription:', error)
        }
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    if (!isSupported) {
        return <p>Push notifications are not supported in this browser.</p>
    }

    return (
        <div className='container mx-auto px-[1rem] py-[1.5rem]'>
            <Card className='max-w-lg mx-auto'>
                <CardHeader>
                    <h3 className='text-xl font-semibold'>Push Notifications</h3>
                </CardHeader>
                <CardContent>
                    {subscription ? (
                        <>
                            <p className='mb-[1rem]'>You are subscribed to push notifications.</p>
                            <Button onClick={unsubscribeFromPush} className='mb-[1rem] cursor-pointer'>Unsubscribe</Button>
                        </>
                    ) : (
                        <>
                            <p className='mb-[1rem]'>You are not subscribed to push notifications.</p>
                            <Button onClick={subscribeToPush} className='cursor-pointer'>Subscribe</Button>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <p className='text-sm text-muted-foreground'>Manage your push notification preferences here.</p>
                </CardFooter>
            </Card>
        </div>
    )
}

function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        setIsIOS(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        )

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])

    if (isStandalone) {
        return null
    }

    return (
        <div className='container mx-auto px-[1rem] py-[1.5rem]'>
            <Card className='max-w-lg mx-auto'>
                <CardHeader>
                    <h3 className='text-xl font-semibold'>Install App</h3>
                </CardHeader>
                <CardContent>
                    <p className='mb-[1rem]'>Add this app to your home screen for a better experience.</p>
                    {isIOS ? (
                        <p className='text-sm text-muted-foreground'>
                            To install this app on your iOS device, tap the share button
                            <span role='img' aria-label='share icon'> ⎋ </span>
                            and then 'Add to Home Screen'
                            <span role='img' aria-label='plus icon'> ➕ </span>.
                        </p>
                    ) : (
                        <Button className='cursor-pointer'>Add to Home Screen</Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
    
export default function Page() {
    return (
        <div className='relative w-full h-full items-center'>
            <div className='absolute left-[2rem] top-0'>
                <Link href='/account' className='flex items-center text-white/80 hover:text-white transition-colors'>
                    <ArrowLeft />
                    <span>Back</span>
                </Link>
            </div>
            <PushNotificationManager />
            <InstallPrompt />
        </div>
    )
}