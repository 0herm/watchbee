import { getSessionUserId } from '@/utils/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Eye } from 'lucide-react'
import { getAllWatched, getUserSettings, getDefaultListState } from '@/utils/queries'
import { getForYouData } from '@/utils/recommendations'
import { MediaStateProvider } from '@/components/watched/mediaStateContext'
import MediaSection from '@/components/media/mediaSection'
import PageContainer from '@/components/pageContainer'

export const metadata = { title: 'For You · Tendril' }

export default async function ForYouPage() {
    const userId = await getSessionUserId()
    if (!userId) redirect('/passkey/login')

    const [settingsResult, watchedResult, listState] = await Promise.all([
        getUserSettings(userId),
        getAllWatched(),
        getDefaultListState(),
    ])

    const watched = watchedResult.data ?? []
    const watchedIds = watched.map((w) => w.tmdb_id)
    const excludeIds = [...watchedIds, ...listState.listedIds]

    const data = await getForYouData(watched, excludeIds)

    const Header = (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2.5'>
                <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-ambient/12 text-ambient'>
                    <Sparkles className='h-4 w-4' />
                </div>
                <h1 className='display text-2xl sm:text-3xl font-bold'>For You</h1>
            </div>
        </div>
    )

    if (data.seedCount === 0) {
        return (
            <PageContainer className='flex flex-col gap-8'>
                {Header}
                <div className='flex flex-col items-center justify-center gap-5 py-20 text-center'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60'>
                        <Eye className='h-7 w-7 text-muted-foreground/40' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold'>Nothing to learn from yet</p>
                        <p className='text-xs text-muted-foreground/60 max-w-xs leading-relaxed'>
                            Mark a few titles as watched and rate the ones you loved. The more you do, the sharper these picks get.
                        </p>
                    </div>
                    <Link
                        href='/'
                        className={
                            'inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-brand hover:bg-brand-dim ' +
                            'active:bg-brand-dimmer text-white text-sm font-medium transition-colors'
                        }
                    >
                        Browse titles
                    </Link>
                </div>
            </PageContainer>
        )
    }

    return (
        <MediaStateProvider
            listId={listState.listId}
            watchedIds={watchedIds}
            listedIds={listState.listedIds}
            streamingProviders={settingsResult.data?.streaming_providers ?? []}
            region={settingsResult.data?.region ?? 'GB'}
        >
            <PageContainer className='flex flex-col gap-10'>
                {Header}

                {data.topPicks.length > 0 && (
                    <MediaSection title='Top Picks for You' items={data.topPicks} filterable />
                )}

                {data.seedRows.length > 0 && (
                    <div className='flex flex-col gap-8'>
                        <div className='-mx-5 sm:-mx-6 h-px bg-white/[0.05]' />
                        {data.seedRows.map(({ seed, items }) => (
                            <MediaSection
                                key={seed.id}
                                title={
                                    <span className='inline-flex items-baseline gap-1.5'>
                                        <span className='text-muted-foreground/60 font-normal text-sm'>Because you loved</span>
                                        <Link
                                            href={`/${seed.type}/${seed.id}`}
                                            className='hover:text-ambient transition-colors underline-offset-4 hover:underline'
                                        >
                                            {seed.title}
                                        </Link>
                                    </span>
                                }
                                items={items}
                            />
                        ))}
                    </div>
                )}

                {(data.genreRows.length > 0 || data.hiddenGems.length > 0 || data.freshPicks.length > 0) && (
                    <div className='flex flex-col gap-8'>
                        <div className='-mx-5 sm:-mx-6 h-px bg-white/[0.05]' />
                        {data.freshPicks.length >= 4 && (
                            <MediaSection title='Fresh for You' items={data.freshPicks} filterable />
                        )}
                        {data.hiddenGems.length >= 4 && (
                            <MediaSection title='Hidden Gems' items={data.hiddenGems} filterable />
                        )}
                        {data.genreRows.map((row) => (
                            <MediaSection key={row.genreId} title={row.title} items={row.items} filterable />
                        ))}
                    </div>
                )}
            </PageContainer>
        </MediaStateProvider>
    )
}
