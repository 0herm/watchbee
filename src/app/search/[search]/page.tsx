import MediaCard from '@/components/mediaCard/mediaCard'
import { getAllLists } from '@/utils/api'
import { getSearch } from '@/utils/tmdbApi'

type SectionProps = {
    title: string
    items: SearchProps | string
    lists: ListProps[]
}

export default async function Page({ params }: { params: Promise<{ search: string }> }) {
    const param = (await params).search

    const searchResult = await getSearch(param)
    const listsData = await getAllLists()
    const lists: ListProps[] = Array.isArray(listsData) ? listsData : []

    let sortedItems: SearchProps | string = searchResult
    
    if (typeof searchResult !== 'string') {
        searchResult.results.forEach(item => {
            (item as SearchItemProps & { score?: number }).score = wilsonLowerBound(item.vote_average, item.vote_count)
        })

        sortedItems = {
            ...searchResult,
            results: [...searchResult.results].sort((a, b) => 
                ((b as SearchItemProps & { score?: number }).score ?? 0) - 
                ((a as SearchItemProps & { score?: number }).score ?? 0)
            )
        }
    }


    return (
        <div className='w-full max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <Section title='' items={sortedItems} lists={lists} />
        </div>
    )
}

function Section({ title, items, lists }: SectionProps) {
    return (
        <section className='flex flex-col font-medium'>
            <h1>{title}</h1>
            <div className='grid [grid-template-columns:repeat(auto-fill,_minmax(8rem,_1fr))] gap-[2rem] items-center justify-items-center'>
                {typeof items !== 'string' && items.results.map((item: SearchItemProps, index: number) => (
                    (item.media_type === 'movie' || item.media_type === 'tv') && 
                        <MediaCard key={index} item={item} lists={lists} />
                ))}
            </div>
        </section>
    )
}

function wilsonLowerBound(voteAverage: number, voteCount: number, z: number = 1.96): number {
    if (voteCount === 0) return 0

    const p = voteAverage / 10 
    const n = voteCount

    const denominator = 1 + (z ** 2) / n
    const center = p + (z ** 2) / (2 * n)
    const margin = z * Math.sqrt((p * (1 - p) + (z ** 2) / (4 * n)) / n)

    return (center - margin) / denominator
}