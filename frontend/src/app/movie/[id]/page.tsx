import { Suspense } from 'react'
import MediaPage from '@/components/media/mediaPage'
import AmbientStyle from '@/components/media/ambientStyle'
import MediaExtras, { MediaExtrasSkeleton } from '@/components/media/mediaExtras'
import { getDetailsMovie } from '@/utils/tmdbApi'
import { getSessionUserId } from '@/utils/auth'
import { getUserSettings, getAllWatched, getDefaultListState } from '@/utils/queries'
import { MediaStateProvider } from '@/components/watched/mediaStateContext'

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    const userId = await getSessionUserId()
    const { data, error } = await getDetailsMovie(id)

    if (error || !data) throw new Error('Error loading movie')

    const [{ data: settings }, { data: watchedData }, listState] = await Promise.all([
        userId ? getUserSettings(userId) : Promise.resolve({ data: null, error: null }),
        getAllWatched(),
        getDefaultListState(),
    ])

    const watchedIdList = (watchedData ?? []).map(w => w.tmdb_id)

    return (
        <MediaStateProvider
            listId={listState.listId}
            watchedIds={watchedIdList}
            listedIds={listState.listedIds}
        >
            <Suspense fallback={null}>
                <AmbientStyle scope={data.id} path={data.poster_path} />
            </Suspense>
            <MediaPage
                item={data} media='movie' region={settings?.region} language={settings?.language}
                extras={
                    <Suspense fallback={<MediaExtrasSkeleton />}>
                        <MediaExtras
                            id={id} media='movie'
                            collectionId={data.belongs_to_collection?.id}
                            watchedIds={watchedIdList}
                        />
                    </Suspense>
                }
            />
        </MediaStateProvider>
    )
}
