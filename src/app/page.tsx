import MediaCard from '@/components/mediaCard/mediaCard'
import { getTrending, getNewMovies, getNewShows, getPopularMovies, getPopularShows, getTopRatedMovies, getTopRatedShows, getUpcomingMovies, getUpcomingShows } from '@/utils/tmdbApi'
import { getAllLists } from '@/utils/api'

type SectionProps = {
    title: string
    items: TrendingProp | string
    lists: ListProp[]
}

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
    const lists: ListProp[] = Array.isArray(listsData) ? listsData : []

    return (
        <div className='flex flex-col gap-[1rem] max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <Section title='Trending'        lists={lists} items={trending} />
            <Section title='New Movies'      lists={lists} items={newMovies} />
            <Section title='New Shows'       lists={lists} items={newShows} />
            <Section title='Popular Movies'  lists={lists} items={popularMovies} />
            <Section title='Popular Shows'   lists={lists} items={popularShows} />
            <Section title='TopRated Movies' lists={lists} items={topRatedMovies} />
            <Section title='TopRated Shows'  lists={lists} items={topRatedShows} />
            <Section title='Upcoming Movies' lists={lists} items={upcomingMovies} />
            <Section title='Upcoming Shows'  lists={lists} items={upcomingShows} />
        </div>
    )
}

function Section({title, items, lists }: SectionProps) {
    return (
        <section className='flex flex-col gap-[0.25rem] font-medium'>
            <h1>{title}</h1>
            <div className='flex flex-row gap-[1rem] w-full overflow-auto noscroll'>
                {typeof items !== 'string' && items.results.map((item: TrendingItemProp, index: number) => (
                    <div key={index}>
                        <MediaCard item={item} lists={lists} />
                    </div>
                ))}
            </div>
        </section>
    )
}