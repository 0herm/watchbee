import MediaCard from '@components/mediaCard/mediaCard'

type SectionProps = {
    title: string
    items: MediaListProps | string
    lists: ListProps[]
    type?: MediaType
}

export default function MediaSection({title, items, lists, type }: SectionProps) {
    return (
        <section className='flex flex-col gap-[0.25rem] font-medium'>
            <h1>{title}</h1>
            <div className='flex flex-row gap-[1rem] w-full overflow-auto noscroll'>
                {typeof items !== 'string' && items.results.map((item: MediaItemProps, index: number) => (
                    <div key={index}>
                        <MediaCard item={item} lists={lists} type={type} />
                    </div>
                ))}
            </div>
        </section>
    )
}