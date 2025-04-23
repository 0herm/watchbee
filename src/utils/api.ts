import config from "@config"
import dotenv from 'dotenv'

dotenv.config()

const { ACCESS_TOKEN } = process.env
const baseURL = config.url.API_URL

export async function getTrending(): Promise<TrendingItemsProp|string> {
    return await getWrapper('3/trending/all/week?language=en-US')
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