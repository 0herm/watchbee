'use client'

import { Clapperboard, Search, User } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

export default function NavBar() {
    const desktopInputRef = useRef<HTMLInputElement>(null)
    const mobileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

    const handleSearch = (value?: string) => {
        const query = value?.trim()
        if (!query) return
        router.push(`/search/${encodeURIComponent(query)}`)
        setMobileSearchOpen(false)
        if (desktopInputRef.current) desktopInputRef.current.value = ''
        if (mobileInputRef.current) mobileInputRef.current.value = ''
    }

    return (
        <div className='relative flex flex-col w-full h-full'>
            <div className='flex flex-row justify-between items-center w-full h-full px-4'>
                <Link href='/' className='flex items-center gap-2 h-full'>
                    <Clapperboard className='h-full w-auto p-2.5 text-brand' />
                    <span className='font-semibold text-sm hidden xs:block'>WatchBee</span>
                </Link>

                <div className='flex items-center gap-1'>
                    <div className='relative hidden sm:flex items-center'>
                        <Input
                            className='w-52 h-8 pr-8 text-sm'
                            placeholder='Search...'
                            ref={desktopInputRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch(desktopInputRef.current?.value)
                            }}
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            className='absolute top-1/2 right-0.5 -translate-y-1/2 h-7 w-7'
                            onClick={() => handleSearch(desktopInputRef.current?.value)}
                            aria-label='Search'
                        >
                            <Search className='w-3.5 h-3.5' />
                        </Button>
                    </div>

                    <Link
                        href='/account'
                        className='hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors'
                        aria-label='Account'
                    >
                        <User className='h-4 w-4' />
                    </Link>

                    <Button
                        variant='ghost'
                        size='icon'
                        className='sm:hidden h-9 w-9'
                        onClick={() => {
                            setMobileSearchOpen((o) => !o)
                            setTimeout(() => mobileInputRef.current?.focus(), 50)
                        }}
                        aria-label='Search'
                    >
                        <Search className='w-4 h-4' />
                    </Button>
                </div>
            </div>

            {mobileSearchOpen && (
                <div className='absolute top-full left-0 right-0 border-b border-border bg-background/98 backdrop-blur-md px-3 py-2 sm:hidden z-50'>
                    <div className='relative flex items-center'>
                        <Input
                            ref={mobileInputRef}
                            className='w-full h-10 pr-10 text-base'
                            placeholder='Search movies or shows...'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch(mobileInputRef.current?.value)
                                if (e.key === 'Escape') setMobileSearchOpen(false)
                            }}
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            className='absolute right-0.5 h-9 w-9'
                            onClick={() => handleSearch(mobileInputRef.current?.value)}
                            aria-label='Search'
                        >
                            <Search className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
