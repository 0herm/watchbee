import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

type LoadImageProps = {
    source: string
    error?: string | null
    alternativeText?: string
    className?: string
    fill?: boolean
}

export default function LoadImage({source, error, alternativeText = '', className = '', fill = false}: LoadImageProps){
    return (
        error ? (
            <Image
                src={source}
                alt={alternativeText}
                className={className}
                fill={fill}
            />
        ) : (
            <div className='flex items-center justify-center h-full w-full'>
                <ImageIcon className='w-full h-full p-8' />
            </div>
        )
    )
}
