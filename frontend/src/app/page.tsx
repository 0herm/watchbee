import MediaSection from '@/components/mediaSection/mediasection'
import {
    getTrending, getNewMovies, getNewShows,
    getPopularMovies, getPopularShows,
    getTopRatedMovies, getTopRatedShows,
    getUpcomingMovies, getUpcomingShows,
} from '@/utils/tmdbApi'
import { getSessionUserId } from '@/utils/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
    if (!await getSessionUserId()) redirect('/passkey/login')

    const [
        trendingResult,
        newMoviesResult,
        newShowsResult,
        popularMoviesResult,
        popularShowsResult,
        topRatedMoviesResult,
        topRatedShowsResult,
        upcomingMoviesResult,
        upcomingShowsResult,
    ] = await Promise.all([
        getTrending(),
        getNewMovies(),
        getNewShows(),
        getPopularMovies(),
        getPopularShows(),
        getTopRatedMovies(),
        getTopRatedShows(),
        getUpcomingMovies(),
        getUpcomingShows(),
    ])

    const results = [
        trendingResult, newMoviesResult, newShowsResult,
        popularMoviesResult, popularShowsResult,
        topRatedMoviesResult, topRatedShowsResult,
        upcomingMoviesResult, upcomingShowsResult,
    ]
    const hasContent = results.some((r) => (r.data as MediaListProps | null)?.results?.length)

    if (!hasContent) {
        const tmdbError = results.find((r) => r.error)?.error
        return (
            <div className='w-full flex flex-col items-center justify-center gap-2 py-16 text-center'>
                <p className='text-sm text-muted-foreground'>No content available.</p>
                {tmdbError && (
                    <p className='text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-1.5 max-w-sm'>{tmdbError}</p>
                )}
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 w-full overflow-hidden'>
            <MediaSection title='Trending'        items={trendingResult.data} />
            <MediaSection title='New Movies'      items={newMoviesResult.data}       type={'movie'} />
            <MediaSection title='New Shows'       items={newShowsResult.data}        type={'show'} />
            <MediaSection title='Popular Movies'  items={popularMoviesResult.data}   type={'movie'} />
            <MediaSection title='Popular Shows'   items={popularShowsResult.data}    type={'show'} />
            <MediaSection title='Top Rated Movies' items={topRatedMoviesResult.data} type={'movie'} />
            <MediaSection title='Top Rated Shows'  items={topRatedShowsResult.data}  type={'show'} />
            <MediaSection title='Upcoming Movies' items={upcomingMoviesResult.data}  type={'movie'} />
            <MediaSection title='Upcoming Shows'  items={upcomingShowsResult.data}   type={'show'} />
        </div>
    )
}
