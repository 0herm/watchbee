import { Clapperboard } from 'lucide-react'
import config from '@config'

export default function Footer() {
    return (
        <div className='flex items-center justify-between w-full px-5 py-3 text-xs text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
                <Clapperboard className='h-4 w-4 text-brand' />
                <span className='font-medium text-foreground'>WatchBee</span>
                <span>© {new Date().getFullYear()}</span>
            </div>
            <span className='font-medium text-brand'>v{config.version}</span>
        </div>
    )
}
