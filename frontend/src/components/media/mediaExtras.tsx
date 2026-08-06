import { getSimilarMovies, getSimilarShows, getMovieCollection } from '@/utils/tmdbApi'
import MediaSection from '@/components/media/mediaSection'

type Props = {
    id: number
    media: 'movie' | 'show'
    collectionId?: number
    watchedIds: number[]
}

export default async function MediaExtras({ id, media, collectionId, watchedIds }: Props) {
    const [{ data: similar }, { data: collection }] = await Promise.all([
        media === 'movie' ? getSimilarMovies(id) : getSimilarShows(id),
        media === 'movie' && collectionId
            ? getMovieCollection(collectionId)
            : Promise.resolve({ data: null, error: null }),
    ])

    const watchedSet = new Set(watchedIds)
    const watchedInSimilar = similar?.results.filter(r => watchedSet.has(r.id)).length ?? 0

    return (
        <>
            {collection && collection.parts.length > 0 && (
                <MediaSection
                    title={collection.name}
                    items={[...collection.parts].sort((a, b) => +new Date(a.release_date ?? '') - +new Date(b.release_date ?? ''))}
                    type='movie'
                />
            )}

            {similar && similar.results.length > 0 && (
                <MediaSection
                    title={
                        <span className='flex items-baseline gap-2'>
                            More Like This
                            {watchedInSimilar > 0 && (
                                <span className='text-xs font-normal text-ambient'>{watchedInSimilar} watched</span>
                            )}
                        </span>
                    }
                    items={similar}
                    type={media}
                />
            )}
        </>
    )
}

export function MediaExtrasSkeleton() {
    return (
        <section className='sm:hidden flex flex-col gap-3' aria-hidden>
            <div className='h-5 w-40 rounded-md bg-muted animate-pulse' />
            <div className='flex flex-row gap-3 -mx-5 px-5 overflow-hidden'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='shrink-0 w-[clamp(7.5rem,20vw,11rem)] aspect-2/3 rounded-xl bg-muted animate-pulse' />
                ))}
            </div>
        </section>
    )
}
