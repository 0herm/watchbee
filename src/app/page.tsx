import MediaCard from "@/components/mediaCard/mediaCard";
import { getTrending } from "@/utils/api"

type SectionProps = {
    title: string
    items: TrendingItemsProp | string
}

export default async function Home() {

    const trending = await getTrending()

    return (
        <div className='max-w-[calc(100vw-1.25rem)] pr-[1.25rem]'>
            <Section title="Trending" items={trending} />
        </div>
    )
}

function Section({title, items }: SectionProps) {
    return (
        <section className='flex flex-col gap-[0.5rem] font-medium'>
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