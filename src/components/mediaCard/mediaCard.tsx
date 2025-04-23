import { Card, CardContent, CardFooter } from '@components/ui/card'
import Image from 'next/image'
import config from '@config'
import Link from 'next/link';

interface MediaCardProps {
    item: TrendingItemProp;
}

export default function MediaCard({ item }: MediaCardProps) {
    return (
        <Link
            href={`/${item.media_type}/${item.id}`}
        >
            <Card className="w-[8rem] h-full py-0 gap-0 overflow-hidden border-none shadow-lg text-white">
                <CardContent className="p-0">
                    <div className="relative">
                        <div className="relative w-full aspect-[2/3] overflow-hidden">
                            <Image
                                src={`${config.url.IMAGE_URL}${item.poster_path}`}
                                alt={'Media poster'}
                                fill={true}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between bg-zinc-900 py-3 px-4">
                    <h1 className="text-sm font-medium truncate text-gray-300">
                        {item.media_type === 'movie'
                                        ? config.setting.ORIGINAL_TITLE
                                            ? item.original_title
                                            : item.title
                                        : config.setting.ORIGINAL_TITLE
                                            ? item.original_name
                                            : item.name}
                    </h1>
                </CardFooter>
            </Card>
        </Link>
    )
}