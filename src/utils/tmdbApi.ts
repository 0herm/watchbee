import config from '@config'
import dotenv from 'dotenv'

dotenv.config()
const { ACCESS_TOKEN } = process.env
const baseURL = config.url.API_URL
const { LANGUAGE, REGION, INCLUDE_ADULT, TIMEZONE } = config.setting

// Configuration
export async function getCountries(): Promise<Country[] | string> {
    const queryParts = new URLSearchParams()

    if (LANGUAGE) queryParts.append('language', LANGUAGE)

    const path = `3/configuration/countries?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getLanguages(): Promise<Language[] | string> {
    const path = '3/configuration/languages'
    return await getWrapper(path)
}

export async function getTimezones(): Promise<Timezone[] | string> {
    const path = '3/configuration/timezones'
    return await getWrapper(path)
}

export async function getTrending(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    
    const path = `3/trending/all/week?${queryParts.toString()}`
    return await getWrapper(path)
}

// Movies
export async function getNewMovies(): Promise<NewMoviesProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (REGION) queryParts.append('region', REGION)
    
    const path = `3/movie/now_playing?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getPopularMovies(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (REGION) queryParts.append('region', REGION)
    
    const path = `3/movie/popular?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getTopRatedMovies(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (REGION) queryParts.append('region', REGION)
    
    const path = `3/movie/top_rated?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getUpcomingMovies(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (REGION) queryParts.append('region', REGION)
    
    const path = `3/movie/upcoming?${queryParts.toString()}`
    return await getWrapper(path)
}

// Movie
export async function getDetailsMovie(id:number): Promise<MovieDetailsProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    queryParts.append('append_to_response', 'watch/providers')
    
    const path = `3/movie/${id}?${queryParts.toString()}`
    return await getWrapper(path)
}

// TV Shows
export async function getNewShows(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (TIMEZONE) queryParts.append('timezone', TIMEZONE)
    
    const path = `3/tv/airing_today?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getPopularShows(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    
    const path = `3/tv/popular?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getTopRatedShows(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    
    const path = `3/tv/top_rated?${queryParts.toString()}`
    return await getWrapper(path)
}

export async function getUpcomingShows(): Promise<TrendingProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (TIMEZONE) queryParts.append('region', TIMEZONE)
    
    const path = `3/tv/on_the_air?${queryParts.toString()}`
    return await getWrapper(path)
}

// TV Show
export async function getDetailsShow(id:number): Promise<ShowDetailsProps | string> {
    const queryParts = new URLSearchParams()
    
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    queryParts.append('append_to_response', 'watch/providers')
    
    const path = `3/tv/${id}?${queryParts.toString()}`
    return await getWrapper(path)
}

// Search
export async function getSearch(query: string, page: number | number = 1): Promise<SearchProps | string> {
    const queryParts = new URLSearchParams({ query: query })

    if (INCLUDE_ADULT) queryParts.append('include_adult', String(INCLUDE_ADULT))
    if (LANGUAGE) queryParts.append('language', LANGUAGE)
    if (page) queryParts.append('page', String(page))

    const path = `3/search/multi?${queryParts.toString()}`
    return await getWrapper(path)
}

async function getWrapper(path: string, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type':     'application/json',
            'Authorization':    `Bearer ${ACCESS_TOKEN}`
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${baseURL}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.json())
        }
        
        const data = await response.json()

        return data
    // eslint-disable-next-line
    } catch (error: any) {
        console.error(JSON.stringify(error))
        return JSON.stringify(error.message) || 'Unknown error!'
    }
}