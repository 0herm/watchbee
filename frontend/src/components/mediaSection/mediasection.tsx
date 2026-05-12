import MediaCard from '@components/mediaCard/mediaCard'

type SectionProps = {
    title: string
    items: MediaListProps | null
    lists: ListProps[]
    type?: MediaType
}

export default function MediaSection({ title, items, lists, type }: SectionProps) {
    const results = items?.results ?? []

    if (results.length === 0) return null

    return (
        <section className='flex flex-col gap-3'>
            <h2 className='text-sm font-semibold tracking-tight text-foreground'>{title}</h2>
            <div className='flex flex-row gap-3 w-full overflow-x-auto noscroll pb-1'>
                {results.map((item, index) => (
                    <div key={index} className='w-[clamp(7.5rem,20vw,11rem)] shrink-0'>
                        <MediaCard item={item} lists={lists} type={type} />
                    </div>
                ))}
            </div>
        </section>
    )
}
