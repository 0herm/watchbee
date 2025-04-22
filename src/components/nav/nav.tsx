'use client'

import { Clapperboard, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

export default function NavBar() {
    const { theme, setTheme } = useTheme()

    return (
        <div className='flex flex-row justify-between items-center w-full h-full pr-1'>
                
            <div className='flex flex-row h-full items-center'>
                <Link href={'/'} className='h-full'> 
                    {/* text-[#599459] */}
                    <Clapperboard className='h-full w-auto p-2 text-[#599459]' />
                </Link>
                <h1 className='hidden md:block'>WatchBee</h1>
            </div>
            
            <NavigationMenu>
               
            </NavigationMenu>

            <div className='flex flex-row items-center py-1 px-3'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className='h-full w-auto p-1'
                >
                    <Sun className='dark:hidden' style={{ height: '100%', width: '100%' }} />
                    <Moon className='hidden dark:block' style={{ height: '100%', width: '100%' }} />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
                <Link 
                    href={'/login'}
                    className='p-1'
                >
                    <User />
                </Link>
            </div>
        </div>
    )
}