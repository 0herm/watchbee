import { getUnratedWatched } from '@/utils/queries'
import { getDetailsMovie, getDetailsShow } from '@/utils/tmdbApi'
import { getSessionUserId } from '@/utils/auth'
import { redirect } from 'next/navigation'
import RateClient, { type RateItem } from './client'

async function toRateItem(w: WatchedProps): Promise<RateItem | null> {
    if (w.type === 'movie') {
        const { data } = await getDetailsMovie(w.tmdb_id)
        if (!data) return null
        return { tmdbId: w.tmdb_id, type: 'movie', title: data.title, poster: data.poster_path, year: data.release_date?.slice(0, 4) ?? '' }
    }
    const { data } = await getDetailsShow(w.tmdb_id)
    if (!data) return null
    return { tmdbId: w.tmdb_id, type: 'show', title: data.name, poster: data.poster_path, year: data.first_air_date?.slice(0, 4) ?? '' }
}

export default async function Page() {
    const userId = await getSessionUserId()
    if (!userId) redirect('/passkey/login')

    const { data } = await getUnratedWatched()
    const items = (await Promise.all((data ?? []).map(toRateItem))).filter(Boolean) as RateItem[]

    return (
        <div className='w-full flex flex-col gap-8 max-w-xl'>
            <div className='flex flex-col gap-1'>
                <h1 className='display text-2xl sm:text-3xl font-bold'>Rate</h1>
                <p className='text-xs text-muted-foreground/70'>Give a rating to everything you have watched but not scored yet.</p>
            </div>
            <RateClient items={items} />
        </div>
    )
}
