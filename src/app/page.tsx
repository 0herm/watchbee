import MediaSection from '@/components/mediaSection/mediasection'
import { getTrending, getNewMovies, getNewShows, getPopularMovies, getPopularShows, getTopRatedMovies, getTopRatedShows, getUpcomingMovies, getUpcomingShows } from '@/utils/tmdbApi'
import { getAllLists } from '@/utils/api'

export default async function Home() {

    const trending          = await getTrending()
    const newMovies         = await getNewMovies()
    const newShows          = await getNewShows()
    const popularMovies     = await getPopularMovies()
    const popularShows      = await getPopularShows()
    const topRatedMovies    = await getTopRatedMovies()
    const topRatedShows     = await getTopRatedShows()
    const upcomingMovies    = await getUpcomingMovies()
    const upcomingShows     = await getUpcomingShows()

    const listsData = await getAllLists()
    const lists: ListProps[] = Array.isArray(listsData) ? listsData : []

    return (
        <div className='flex flex-col gap-[1rem] max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <MediaSection title='Trending'        lists={lists} items={trending} />
            <MediaSection title='New Movies'      lists={lists} items={newMovies}       type={'movie'} />
            <MediaSection title='New Shows'       lists={lists} items={newShows}        type={'show'} />
            <MediaSection title='Popular Movies'  lists={lists} items={popularMovies}   type={'movie'} />
            <MediaSection title='Popular Shows'   lists={lists} items={popularShows}    type={'show'} />
            <MediaSection title='TopRated Movies' lists={lists} items={topRatedMovies}  type={'movie'} />
            <MediaSection title='TopRated Shows'  lists={lists} items={topRatedShows}   type={'show'} />
            <MediaSection title='Upcoming Movies' lists={lists} items={upcomingMovies}  type={'movie'} />
            <MediaSection title='Upcoming Shows'  lists={lists} items={upcomingShows}   type={'show'} />
        </div>
    )
}