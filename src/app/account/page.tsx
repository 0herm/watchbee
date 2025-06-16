export const dynamic = 'force-dynamic'

import { getAllLists, getMediaByListId } from '@/utils/api'
import MediaSection from '@/components/mediaSection/mediasection'
import { getDetailsShow, getDetailsMovie } from '@/utils/tmdbApi'

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

    return (
        <div>
            {listsMedia.map((listMedia) => (
                <div key={listMedia.list.id}>
                    <MediaSection title={listMedia.list.name} lists={lists} items={listMedia.data} />
                </div>
            ))}
        </div>
    )
}