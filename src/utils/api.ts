import run from './db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function dbWrapper(query: string, params: any[] = []) {
    try {
        const result = await run(query, params)
        return result.rows
    // eslint-disable-next-line
    } catch (error: any) {
        console.error(JSON.stringify(error))
        return JSON.stringify(error.message) || 'Unknown error!'
    }
}

// List API functions
export async function createList(name: string) {
    const query = 'INSERT INTO Lists (name) VALUES ($1) RETURNING *'
    const result = await dbWrapper(query, [name])
    return Array.isArray(result) ? result[0] : result
}

export async function getAllLists() {
    const query = 'SELECT * FROM Lists ORDER BY created_at DESC'
    return await dbWrapper(query)
}

export async function getListById(id: number) {
    const query = 'SELECT * FROM Lists WHERE id = $1'
    const result = await dbWrapper(query, [id])
    return Array.isArray(result) ? result[0] : result
}

// Media API functions
export async function addMedia(tmdbId: number, type: 'movie' | 'show', listId: number) {
    const query = 'INSERT INTO Media (tmdb_id, type, list_id) VALUES ($1, $2, $3) RETURNING *'
    const result = await dbWrapper(query, [tmdbId, type, listId])
    return Array.isArray(result) ? result[0] : result
}