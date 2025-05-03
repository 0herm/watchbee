import MediaCard from "@/components/mediaCard/mediaCard";
import { getTrending, getNewMovies, getNewShows, getPopularMovies, getPopularShows, getTopRatedMovies, getTopRatedShows, getUpcomingMovies, getUpcomingShows } from "@/utils/api"

type SectionProps = {
    title: string
    items: TrendingItemsProp | string
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

    return (
        <div className='flex flex-col gap-[1rem] max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <Section title="Trending"       items={trending} />
            <Section title='New Movies'      items={newMovies} />
            <Section title='New Shows'       items={newShows} />
            <Section title='Popular Movies'  items={popularMovies} />
            <Section title='Popular Shows'   items={popularShows} />
            <Section title='TopRated Movies' items={topRatedMovies} />
            <Section title='TopRated Shows'  items={topRatedShows} />
            <Section title='Upcoming Movies' items={upcomingMovies} />
            <Section title='Upcoming Shows'  items={upcomingShows} />
        </div>
    )
}

function Section({title, items }: SectionProps) {
    return (
        <section className='flex flex-col gap-[0.25rem] font-medium'>
            <h1>{title}</h1>
            <div className='flex flex-row gap-[1rem] w-full overflow-auto noscroll'>
                {typeof items !== 'string' && items.results.map((item: TrendingItemProp, index: number) => (
                    <div key={index}>
                        <MediaCard item={item} />
                    </div>
                ))}
            </div>
        </section>
    )
}