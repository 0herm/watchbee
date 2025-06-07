import MediaCard from '@/components/mediaCard/mediaCard'
import { getSearch } from '@/utils/tmdbApi'

type SectionProps = {
    title: string
    items: TrendingProp | string
}

export default async function Page({ params }: { params: Promise<{ search: string }> }) {
    const param = (await params).search

    const items = await getSearch(param)

    return (
        <div className='w-full max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <Section title='' items={items} />
        </div>
    )
}

function Section({ title, items }: SectionProps) {
    return (
        <section className='flex flex-col font-medium'>
            <h1>{title}</h1>
            <div className='grid [grid-template-columns:repeat(auto-fill,_minmax(8rem,_1fr))] gap-[2rem] items-center justify-items-center'>
                {typeof items !== 'string' && items.results.map((item: TrendingItemProp, index: number) => (
                    (item.media_type === 'movie' || item.media_type === 'tv') && 
                        <MediaCard key={index} item={item} />
                ))}
            </div>
        </section>
    )
}