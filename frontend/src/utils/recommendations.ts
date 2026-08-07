import {
    getSimilarMovies, getSimilarShows,
    discoverMovies, discoverShows,
    getMovieGenres, getTvGenres,
} from './tmdbApi'

export type RecSeed = {
    id: number
    type: MediaType
    title: string
    rating: number | null
    weight: number
}

type SeedRecs = { seed: RecSeed; items: TrendingItemProps[] }

type ScoredItem = { item: TrendingItemProps; score: number; sources: number }

const MAX_SEEDS_HOME = 8
const MAX_SEEDS_FULL = 14
const GOOD_RATING = 4

export function selectSeeds(watched: WatchedProps[], limit: number): RecSeed[] {
    const rated = watched
        .filter((w) => (w.rating ?? 0) >= GOOD_RATING)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .map((w) => ({ id: w.tmdb_id, type: w.type, title: w.name, rating: w.rating ?? null, weight: (w.rating ?? GOOD_RATING) - 1 }))

    if (rated.length >= limit) return rated.slice(0, limit)

    const seededIds = new Set(rated.map((s) => s.id))
    const recent = watched
        .filter((w) => !seededIds.has(w.tmdb_id))
        .map((w) => ({ id: w.tmdb_id, type: w.type, title: w.name, rating: w.rating ?? null, weight: 1.5 }))

    return [...rated, ...recent].slice(0, limit)
}

async function fetchSeedRecs(seed: RecSeed): Promise<SeedRecs> {
    const { data } = seed.type === 'show' ? await getSimilarShows(seed.id) : await getSimilarMovies(seed.id)
    const media_type = seed.type === 'show' ? 'tv' : 'movie'
    const items = (data?.results ?? [])
        .filter((i): i is TrendingItemProps => !!(i as TrendingItemProps).poster_path)
        .map((i) => ({ ...(i as TrendingItemProps), media_type }))
    return { seed, items }
}

function aggregate(seedRecs: SeedRecs[], exclude: Set<number>): ScoredItem[] {
    const map = new Map<number, ScoredItem>()
    for (const { seed, items } of seedRecs) {
        items.forEach((item, index) => {
            if (exclude.has(item.id)) return
            const positional = 1 / (1 + index * 0.12)
            const inc = seed.weight * positional
            const existing = map.get(item.id)
            if (existing) {
                existing.score += inc
                existing.sources += 1
            } else {
                map.set(item.id, { item, score: inc, sources: 1 })
            }
        })
    }
    return [...map.values()]
        .map((s) => ({ ...s, score: s.score * (1 + (s.sources - 1) * 0.3) }))
        .sort((a, b) => b.score - a.score)
}

function topGenres(seedRecs: SeedRecs[], kind: 'movie' | 'tv', count: number): number[] {
    const scores = new Map<number, number>()
    for (const { seed, items } of seedRecs) {
        if ((seed.type === 'show' ? 'tv' : 'movie') !== kind) continue
        for (const item of items) {
            for (const g of item.genre_ids ?? []) scores.set(g, (scores.get(g) ?? 0) + 1)
        }
    }
    return [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, count).map(([id]) => id)
}

export async function getTopPicks(watched: WatchedProps[], excludeIds: number[], count = 20): Promise<TrendingItemProps[]> {
    const seeds = selectSeeds(watched, MAX_SEEDS_HOME)
    if (!seeds.length) return []
    const exclude = new Set<number>([...excludeIds, ...seeds.map((s) => s.id)])
    const seedRecs = await Promise.all(seeds.map(fetchSeedRecs))
    return aggregate(seedRecs, exclude).slice(0, count).map((s) => s.item)
}

export type GenreRow = { genreId: number; title: string; items: TrendingItemProps[] }

export type ForYouData = {
    topPicks: TrendingItemProps[]
    seedRows: { seed: RecSeed; items: TrendingItemProps[] }[]
    genreRows: GenreRow[]
    hiddenGems: TrendingItemProps[]
    freshPicks: TrendingItemProps[]
    seedCount: number
    ratedCount: number
}

const recent = (dateStr?: string, withinDays = 120): boolean => {
    if (!dateStr) return false
    const date = new Date(dateStr).getTime()
    if (Number.isNaN(date)) return false
    const diff = date - Date.now()
    return diff > 0 || diff > -withinDays * 24 * 60 * 60 * 1000
}

const dateOf = (i: TrendingItemProps) => i.release_date ?? (i as { first_air_date?: string }).first_air_date

export async function getForYouData(watched: WatchedProps[], excludeIds: number[]): Promise<ForYouData> {
    const seeds = selectSeeds(watched, MAX_SEEDS_FULL)
    const ratedCount = watched.filter((w) => w.rating != null).length
    if (!seeds.length) {
        return { topPicks: [], seedRows: [], genreRows: [], hiddenGems: [], freshPicks: [], seedCount: 0, ratedCount }
    }

    const exclude = new Set<number>([...excludeIds, ...seeds.map((s) => s.id)])
    const seedRecs = await Promise.all(seeds.map(fetchSeedRecs))
    const ranked = aggregate(seedRecs, exclude)
    const topPicks = ranked.slice(0, 24).map((s) => s.item)

    const seedRows = seedRecs
        .filter(({ seed, items }) => (seed.rating ?? 0) >= GOOD_RATING && items.length > 0)
        .slice(0, 4)
        .map(({ seed, items }) => ({ seed, items: items.filter((i) => !excludeIds.includes(i.id)).slice(0, 20) }))
        .filter((row) => row.items.length >= 4)

    const hiddenGems = ranked
        .filter((s) => s.item.vote_average >= 7 && s.item.vote_count >= 200 && s.item.popularity < 40)
        .slice(0, 20)
        .map((s) => s.item)

    const freshPicks = ranked
        .filter((s) => recent(dateOf(s.item)))
        .sort((a, b) => new Date(dateOf(b.item) ?? 0).getTime() - new Date(dateOf(a.item) ?? 0).getTime())
        .slice(0, 20)
        .map((s) => s.item)

    const movieGenreIds = topGenres(seedRecs, 'movie', 2)
    const tvGenreIds = topGenres(seedRecs, 'tv', 2)
    const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()])
    const movieGenreName = new Map((movieGenres.data?.genres ?? []).map((g) => [g.id, g.name]))
    const tvGenreName = new Map((tvGenres.data?.genres ?? []).map((g) => [g.id, g.name]))

    const genreFetches = [
        ...movieGenreIds.map((id) => ({ id, kind: 'movie' as const, name: movieGenreName.get(id) })),
        ...tvGenreIds.map((id) => ({ id, kind: 'tv' as const, name: tvGenreName.get(id) })),
    ].filter((g) => !!g.name)

    const genreRows = (await Promise.all(genreFetches.map(async ({ id, kind, name }) => {
        const { data } = kind === 'movie' ? await discoverMovies(id) : await discoverShows(id)
        const items = (data?.results ?? [])
            .filter((i): i is TrendingItemProps => !!(i as TrendingItemProps).poster_path && !exclude.has(i.id))
            .map((i) => ({ ...(i as TrendingItemProps), media_type: kind }))
            .slice(0, 20)
        return { genreId: id, title: `More ${name}`, items }
    }))).filter((row) => row.items.length >= 6)

    return { topPicks, seedRows, genreRows, hiddenGems, freshPicks, seedCount: seeds.length, ratedCount }
}
