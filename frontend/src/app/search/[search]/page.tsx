import MediaCard from '@/components/mediaCard/mediaCard'
import { getAllLists } from '@/utils/api'
import { getSearch } from '@/utils/tmdbApi'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function Page({ params }: { params: Promise<{ search: string }> }) {
    const param = (await params).search
    const query = decodeURIComponent(param)

    const [{ data: searchResult }, { data: listsData }] = await Promise.all([getSearch(param), getAllLists()])
    const lists: ListProps[] = listsData ?? []

    const sortedResults = searchResult
        ? [...searchResult.results].sort((a, b) =>
            wilsonLowerBound(b.vote_average, b.vote_count) - wilsonLowerBound(a.vote_average, a.vote_count)
        )
        : []

    const results = sortedResults.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
    )

    return (
        <div className='w-full flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
                <Link
                    href='/search'
                    className='flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm shrink-0'
                >
                    <ArrowLeft className='h-4 w-4' />
                    <span className='hidden xs:inline'>Search</span>
                </Link>
                <h1 className='text-base font-semibold truncate'>
                    {results.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}
                </h1>
            </div>

            {results.length > 0 ? (
                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3'>
                    {results.map((item, index) => (
                        <MediaCard key={index} item={item} lists={lists} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-16 text-muted-foreground text-sm'>
                    Try a different search term.
                </div>
            )}
        </div>
    )
}

function wilsonLowerBound(voteAverage: number, voteCount: number, z = 1.96): number {
    if (voteCount === 0) return 0
    const p = voteAverage / 10
    const denominator = 1 + (z ** 2) / voteCount
    const center = p + (z ** 2) / (2 * voteCount)
    const margin = z * Math.sqrt((p * (1 - p) + (z ** 2) / (4 * voteCount)) / voteCount)
    return (center - margin) / denominator
}
