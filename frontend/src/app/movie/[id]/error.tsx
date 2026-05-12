'use client'

import Link from 'next/link'
import { Button } from '@/ui/button'

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-3 py-16 text-center'>
            <h2 className='text-xl font-semibold'>Movie failed to load.</h2>
            <p className='text-sm text-muted-foreground'>Try again or head back to browse.</p>
            <div className='flex gap-2'>
                <Button onClick={() => reset()}>Try again</Button>
                <Link href='/' className='inline-flex'>
                    <Button variant='outline'>Go home</Button>
                </Link>
            </div>
        </div>
    )
}
