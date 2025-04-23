import { Clapperboard } from 'lucide-react'
import config from '@config'

export default function Footer() {
    return (
        <div className='flex flex-row items-center w-full p-4'>
            <div>
                <div className='flex flex-row items-center'>
                    <Clapperboard className='h-full w-auto p-2 text-[#599459]' />
                    <h1>WatchBee</h1>
                </div>
                <p className='text-sm p-[0.5rem]'>Opphavsrett © {new Date().getFullYear()} WatchBee</p>
            </div>
            <p className='ml-auto bg-primary-foreground p-[0.5rem_1rem] rounded-md font-semibold text-[#599459]'>v{config.version}</p>
        </div>
    )
}