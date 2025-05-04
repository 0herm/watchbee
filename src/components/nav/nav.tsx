'use client'

import { Clapperboard, Moon, Search, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NavBar() {
    const inputRef = useRef<HTMLInputElement>(null)
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    return (
        <div className='flex flex-col justify-between items-center w-full h-full'>
            <div className='flex flex-row justify-between items-center w-full h-full'>
                <div className='flex flex-row h-full items-center'>
                    <Link href={'/'} className='h-full'>
                        <Clapperboard className='h-full w-auto p-2 text-[#599459]' />
                    </Link>
                    <h1 className='hidden sm:block'>WatchBee</h1>
                </div>

                <div className='flex flex-row items-center gap-[0.5rem] py-1 px-3'>
                    <div className='relative flex justify-center items-center'>
                        <Input 
                            className='hidden sm:block w-[12rem] h-[1.8rem] pr-[2rem]' 
                            ref={inputRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && inputRef.current) {
                                    router.push(`/search/${inputRef.current.value}`)
                                }
                            }}
                        />
                        <Button 
                            className='group absolute top-1/2 right-0 transform -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer'
                            onClick={() => {
                                if (inputRef.current) router.push(`/search/${inputRef.current.value}`)
                            }}
                        >
                            <Search className='stroke-white group-hover:stroke-primary sm:w-[1rem] sm:h-[1rem] w-[1.4rem] h-[1.4rem] size-full'/>
                        </Button>
                    </div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className='h-full w-auto'
                    >
                        <Sun className='dark:hidden' style={{ height: '100%', width: '100%' }} />
                        <Moon className='hidden dark:block' style={{ height: '100%', width: '100%' }} />
                        <span className='sr-only'>Toggle theme</span>
                    </Button>
                    <Link 
                        href={'/account'}
                        className=''
                    >
                        <User />
                    </Link>
                </div>
            </div>

            <div className='absolute h-full flex items-center'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link 
                                href='/'
                                className='block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground text-center text-[1rem]'
                            >
                                Home
                            </Link>	
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link 
                                href='/lists'
                                className='block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground text-center text-[1rem]'
                            >
                                Lists
                            </Link>	
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}