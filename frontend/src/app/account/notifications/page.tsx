import { headers } from 'next/headers'
import { type ElementType, type ReactNode } from 'react'
import { Bell, Film, Share, Smartphone, Tv } from 'lucide-react'
import { getNotifications } from '@/utils/queries'
import { PushNotificationManager } from './client'

function CardPanel({ icon: Icon, title, subtitle, children }: { icon: ElementType; title: string; subtitle: string; children: ReactNode }) {
    return (
        <div className='rounded-2xl border border-border/60 overflow-hidden bg-surface-1'>
            <div className='flex items-center gap-3 px-4 py-4 border-b border-border/60'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 shrink-0'>
                    <Icon className='h-4 w-4 text-muted-foreground/70' />
                </div>
                <div>
                    <p className='text-sm font-semibold'>{title}</p>
                    <p className='text-xs text-muted-foreground/60 mt-0.5'>{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    )
}

function InstallPrompt({ isIOS }: { isIOS: boolean }) {
    return (
        <div className='hide-in-app text-[13px] text-muted-foreground/70 flex items-center gap-2.5 bg-muted/40 p-3.5 rounded-xl border border-border/50'>
            <Smartphone className='h-4 w-4 shrink-0' />
            <div className='leading-relaxed'>
                <strong className='text-foreground font-medium'>Install App:</strong>{' '}
                {isIOS ? (
                    <>
                        Tap the{' '}
                        <Share className='inline-block align-middle mb-0.5 h-3.5 w-3.5 mx-0.5' />{' '}
                        share button then{' '}
                        <strong className='text-foreground font-medium'>Add to Home Screen</strong>
                    </>
                ) : (
                    <>Open your browser menu and select <strong className='text-foreground font-medium'>Add to Home Screen</strong></>
                )}{' '}
                for a native app experience.
            </div>
        </div>
    )
}

function RecentAlerts({ entries }: { entries: NotificationEntry[] }) {
    return (
        <CardPanel icon={Bell} title='Recent Alerts' subtitle='Notifications sent by Tendril'>
            <div className='divide-y divide-border/60'>
                {entries.length === 0 ? (
                    <div className='flex flex-col items-center gap-2 px-4 py-8 text-center'>
                        <Bell className='h-5 w-5 text-muted-foreground/30' />
                        <p className='text-sm text-muted-foreground/60'>No notifications sent yet.</p>
                    </div>
                ) : entries.map(e => (
                    <div key={e.id} className='flex items-start gap-3 px-4 py-3.5'>
                        <div className='mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground/60 shrink-0'>
                            {e.type.includes('movie') || e.type.includes('collection') ? <Film className='h-3.5 w-3.5' />
                                : e.type.includes('show') || e.type.includes('season') || e.type.includes('episode') ? <Tv className='h-3.5 w-3.5' />
                                    : <Bell className='h-3.5 w-3.5' />}
                        </div>
                        <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                            <p className='text-sm font-medium truncate'>{e.notif_title}</p>
                            <p className='text-xs text-muted-foreground leading-relaxed'>{e.notif_body}</p>
                            <p className='text-[11px] text-muted-foreground/50 mt-0.5'>
                                {new Date(e.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </CardPanel>
    )
}

export default async function Page() {
    const ua = (await headers()).get('user-agent') ?? ''
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const { data } = await getNotifications()

    return (
        <div className='w-full flex flex-col gap-6 max-w-xl'>
            <div className='flex flex-col gap-1'>
                <h1 className='display text-2xl sm:text-3xl font-bold'>Notifications</h1>
                <p className='text-xs text-muted-foreground/70'>Push notifications and app installation.</p>
            </div>
            <InstallPrompt isIOS={isIOS} />
            <PushNotificationManager />
            <RecentAlerts entries={data ?? []} />
        </div>
    )
}
