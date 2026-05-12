'use client'

import { Home, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/account', icon: User, label: 'Account' },
]

export default function BottomNav() {
    const pathname = usePathname()

    function isActive(href: string) {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <nav
            className='fixed bottom-0 left-0 right-0 sm:hidden z-50 bg-background/95 backdrop-blur-md border-t border-border'
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className='flex items-center justify-around h-14'>
                {tabs.map(({ href, icon: Icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-lg transition-colors ${
                            isActive(href) ? 'text-brand' : 'text-muted-foreground'
                        }`}
                    >
                        <Icon className={`h-5 w-5 transition-transform ${isActive(href) ? 'scale-110' : ''}`} />
                        <span className='text-[10px] font-medium'>{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}
