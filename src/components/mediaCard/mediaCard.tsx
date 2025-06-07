import { Card, CardContent, CardFooter } from '@components/ui/card'
import Image from 'next/image'
import config from '@config'
import Link from 'next/link'
import WatchTool from '@components/watchtool/watchtool'
import { Image as ImageIcon } from 'lucide-react'

interface MediaCardProps {
    item: TrendingItemProp
}

export default function MediaCard({ item }: MediaCardProps) {
    return (
        <Card className='relative w-[8rem] h-full py-0 gap-0 overflow-hidden border-none shadow-lg text-white'>
            <CardContent className='group p-0 w-full h-full'>
                <div className='relative flex w-full h-full items-center justify-center overflow-hidden'>
                    <Link href={`/${item.media_type}/${item.id}`} >
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
                        <WatchTool />
                    </div>
                </div>
            </CardContent>
            <CardFooter className='flex items-center justify-between bg-zinc-900 py-3 px-4'>
                <Link href={`/${item.media_type}/${item.id}`} className='w-full'>
                    <h1 className='text-sm font-medium truncate text-gray-300 w-full'>
                        {item.media_type === 'movie'
                                        ? config.setting.ORIGINAL_TITLE
                                            ? item.original_title
                                            : item.title
                        : item.media_type === 'tv'
                                        ? config.setting.ORIGINAL_TITLE
                                            ? item.original_name
                                            : item.name
                                        : '(No name)'}
                    </h1>
                </Link>
            </CardFooter>
        </Card>
    )
}