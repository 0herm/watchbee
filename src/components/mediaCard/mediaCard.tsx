import { Card, CardContent } from '@components/ui/card'
import Image from 'next/image'
import config from '@config'
import Link from 'next/link'
import ListTool from '@/components/dialog/dialog'
import { Image as ImageIcon } from 'lucide-react'

interface MediaCardProps {
    item: MediaItemProps
    lists: ListProps[]
    type?: MediaType
}

export default function MediaCard({ item, lists, type }: MediaCardProps) {
    const mediaType = item.media_type === 'movie' || type === 'movie' ? 'movie' : item.media_type === 'tv' || type === 'show' ? 'show' : 'movie'

    return (
        <Card className='relative w-[8rem] h-full py-0 gap-0 overflow-hidden border-none shadow-lg text-white'>
            <CardContent className='group p-0 w-full h-full'>
                <div className='relative flex w-full h-full items-center justify-center overflow-hidden'>
                    <Link href={`/${mediaType}/${item.id}`} >
                        <div className='relative h-full w-[8rem] aspect-[2/3] overflow-hidden group-hover:opacity-50 group-hover:blur-sm transition-all duration-300'>
                            {item.poster_path ? (
                                <Image
                                    src={`${config.url.IMAGE_URL}${item.poster_path}`}
                                    alt={'poster'}
                                    fill
                                    className='object-cover flex items-center justify-center'
                                />
                            ) : (
                                <div className='flex items-center justify-center h-full w-full'>
                                    <ImageIcon className='w-full h-full p-[2rem]' />
                                </div>
                            )}
                        </div>
                    </Link>
                    <div className='hidden group-hover:block absolute'>
                        <ListTool tmdbId={item.id} mediaType={mediaType} lists={lists} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}