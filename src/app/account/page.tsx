import { getAllLists, getMediaByListId, getAllWatched } from '@/utils/api'
import MediaSection from '@/components/mediaSection/mediasection'
import { getDetailsShow, getDetailsMovie } from '@/utils/tmdbApi'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page() {
    const listsData = await getAllLists()
    const lists: ListProps[] = Array.isArray(listsData) ? listsData : []

    const listsMedia = await Promise.all(
        (Array.isArray(lists) ? lists : []).map(async (list) => {
            const mediaItems = await getMediaByListId(list.id)
            
            const mediaResults = await Promise.all(
                (Array.isArray(mediaItems) ? mediaItems : []).map(async (media: MediaProps) => {
                    if (media.type === 'show') {
                        const details = await getDetailsShow(media.tmdb_id) as ShowDetailsProps
                        return {...details, media_type: 'tv'}
                    } else if (media.type === 'movie') {
                        const details = await getDetailsMovie(media.tmdb_id) as MovieDetailsProps
                        return {...details, media_type: 'movie'}
                    }
                })
            )
            
            return {
                list: list,
                data: { 
                    page: 1,
                    total_pages: 1,
                    total_results: mediaResults.length,
                    results: mediaResults.filter(Boolean) as (ShowDetailsProps | MovieDetailsProps)[]
                }
            }
        })
    )

    const watchedItems = await getAllWatched()
    const watchedResults = await Promise.all(
        (Array.isArray(watchedItems) ? watchedItems : []).map(async (media: MediaProps) => {
            if (media.type === 'show') {
                const details = await getDetailsShow(media.tmdb_id) as ShowDetailsProps
                return { ...details, media_type: 'tv' }
            } else if (media.type === 'movie') {
                const details = await getDetailsMovie(media.tmdb_id) as MovieDetailsProps
                return { ...details, media_type: 'movie' }
            }
        })
    )

    return (
        <div className='p-[1.5rem] space-y-[1.5rem]'>
            <div className='flex space-x-[1rem]'>
                <Link href='/account/settings'>
                    <Button className='px-[1rem] py-[0.5rem] text-sm'>
                        Settings
                    </Button>
                </Link>
                <Link href='/account/notifications'>
                    <Button className='px-[1rem] py-[0.5rem] text-sm'>
                        Notifications
                    </Button>
                </Link>
                <Link href='/account/lists'>
                    <Button className='px-[1rem] py-[0.5rem] text-sm'>
                        Lists
                    </Button>
                </Link>
            </div>
            <div className='space-y-[2rem]'>
                <div className='space-y-[1rem]'>
                    <MediaSection
                        title='Watched'
                        lists={lists}
                        items={{
                            page: 1,
                            total_pages: 1,
                            total_results: watchedResults.filter(Boolean).length,
                            results: watchedResults.filter(Boolean) as (ShowDetailsProps | MovieDetailsProps)[]
                        }}
                    />
                </div>
                {/* User-created lists */}
                {listsMedia.map((listMedia) => (
                    <div key={listMedia.list.id} className='space-y-[1rem]'>
                        <MediaSection 
                            title={listMedia.list.name} 
                            lists={lists} 
                            items={listMedia.data} 
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}