import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

import NavBar from '@/components/nav/nav'
import Footer from '@/components/footer/footer'

export const metadata: Metadata = {
    title: 'WatchBee',
    description: 'Movie tracker',
}

export const viewport: Viewport = {
    themeColor: 'background',
}

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
    return (
        <>
            <html lang='en' suppressHydrationWarning>
                <head/>
                <body className='w-screen h-screen m-0 p-0 font-[family-name:Inter] antialiased align-middle break-words leading-[1.5] tracking-normal'>
                    <ThemeProvider attribute='class' defaultTheme='dark' >
                        <div className='flex flex-col w-full min-h-screen'>
                            <nav className='fixed h-[3rem] w-full border-solid border-b border-accent backdrop-blur-md z-50 print:hidden'>
                                <NavBar />
                            </nav>
                            <main className='w-full bg-background flex flex-grow p-[1.25rem] pt-[5rem]'>
                                {children}
                            </main>
                            <footer className='mt-10 border-solid border-t border-accent'>
                                <Footer />
                            </footer>
                        </div>
                    </ThemeProvider>
                </body>
            </html>
        </>
    )
}
