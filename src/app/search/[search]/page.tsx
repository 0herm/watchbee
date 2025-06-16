import MediaCard from '@/components/mediaCard/mediaCard'
import { getAllLists } from '@/utils/api'
import { getSearch } from '@/utils/tmdbApi'

type SectionProps = {
    title: string
    items: TrendingProp | string
    lists: ListProp[]
}

export default async function Page({ params }: { params: Promise<{ search: string }> }) {
    const param = (await params).search

    const items = await getSearch(param)
    const listsData = await getAllLists()
    const lists: ListProp[] = Array.isArray(listsData) ? listsData : []

    return (
        <div className='w-full max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <Section title='' items={items} lists={lists} />
        </div>
    )
}

function Section({ title, items, lists }: SectionProps) {
    return (
        <section className='flex flex-col font-medium'>
            <h1>{title}</h1>
            <div className='grid [grid-template-columns:repeat(auto-fill,_minmax(8rem,_1fr))] gap-[2rem] items-center justify-items-center'>
                {typeof items !== 'string' && items.results.map((item: TrendingItemProp, index: number) => (
                    (item.media_type === 'movie' || item.media_type === 'tv') && 
                        <MediaCard key={index} item={item} lists={lists} />
                ))}
            </div>
        </section>
    )
}