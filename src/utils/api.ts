'use server'

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

// User API functions
export async function getUser() {
    const query = 'SELECT * FROM Users WHERE id = 1'
    const result = await dbWrapper(query)
    return Array.isArray(result) && result.length > 0 ? result[0] : null
}

export async function getUserSettings() {
    const query = 'SELECT region, language, original_title, include_adult, timezone FROM Users WHERE id = 1'
    const result = await dbWrapper(query)
    return Array.isArray(result) && result.length > 0 ? result[0] : null
}

export async function updateUser(data: {
    region?: string,
    language?: string,
    original_title?: boolean,
    include_adult?: boolean,
    timezone?: string,
    subscription?: string | null
}) {
    const fields: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    let paramIndex = 1
    
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            fields.push(`${key} = $${paramIndex++}`)
            values.push(value)
        }
    }
    
    if (fields.length === 0) return null
    
    const query = `UPDATE Users SET ${fields.join(', ')} WHERE id = 1 RETURNING *`
    const result = await dbWrapper(query, values)
    return Array.isArray(result) ? result[0] : result
}

// List API functions
export async function createList(name: string) {
    const query = 'INSERT INTO Lists (name) VALUES ($1) RETURNING *'
    const result = await dbWrapper(query, [name])
    return Array.isArray(result) ? result[0] : result
}

export async function deleteList(id: number) {
    const query = 'DELETE FROM Lists WHERE id = $1 RETURNING *'
    const result = await dbWrapper(query, [id])
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

export async function removeMedia(tmdbId: number, listId: number) {
    const query = 'DELETE FROM Media WHERE tmdb_id = $1 AND list_id = $2 RETURNING *'
    const result = await dbWrapper(query, [tmdbId, listId])
    return Array.isArray(result) ? result[0] : result
}

export async function getMediaByListId(listId: number) {
    const query = 'SELECT * FROM Media WHERE list_id = $1 ORDER BY added_at DESC'
    return await dbWrapper(query, [listId])
}

export async function checkMediaInList(tmdbId: number, listId: number) {
    const query = 'SELECT COUNT(*) as count FROM Media WHERE tmdb_id = $1 AND list_id = $2'
    const result = await dbWrapper(query, [tmdbId, listId])
    return Array.isArray(result) && result[0] && result[0].count > 0
}

export async function checkMediaInAllLists(tmdbId: number) {
    const query = 'SELECT list_id, name FROM Media INNER JOIN Lists ON Media.list_id = Lists.id WHERE tmdb_id = $1'
    const result = await dbWrapper(query, [tmdbId])
    return Array.isArray(result) ? result.map((row) => ({ id: row.list_id, name: row.name })) : []
}

// Watched API functions
export async function addWatched(tmdbId: number, type: 'movie' | 'show', name: string, totalSeasons?: number, showStatus?: string, watchedSeasons?: number[]) {
    const query = 'INSERT INTO Watched (tmdb_id, type, name, total_seasons, show_status, watched_seasons) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    const formattedArray = watchedSeasons ? `{${watchedSeasons.join(',')}}` : null
    const result = await dbWrapper(query, [tmdbId, type, name, type === 'show' ? totalSeasons : null, type === 'show' ? showStatus : null, formattedArray])
    return Array.isArray(result) ? result[0] : result
}

export async function removeWatched(tmdbId: number) {
    const query = 'DELETE FROM Watched WHERE tmdb_id = $1 RETURNING *'
    const result = await dbWrapper(query, [tmdbId])
    return Array.isArray(result) ? result[0] : result
}

export async function getAllWatched() {
    const query = 'SELECT * FROM Watched ORDER BY added_at DESC'
    const result = await dbWrapper(query)
    return Array.isArray(result) ? result : []
}

export async function getWatchedById(tmdbId: number) {
    const query = 'SELECT * FROM Watched WHERE tmdb_id = $1'
    const result = await dbWrapper(query, [tmdbId])
    return Array.isArray(result) ? result[0] : result
}

export async function updateWatchedSeasons(tmdbId: number, watchedSeasons: number[]) {
    const query = 'UPDATE Watched SET watched_seasons = $2 WHERE tmdb_id = $1 RETURNING *'
    const formattedArray = `{${watchedSeasons.join(',')}}`
    const result = await dbWrapper(query, [tmdbId, formattedArray])
    return Array.isArray(result) ? result[0] : result
}

export async function updateShowStatus(tmdbId: number, showStatus: string) {
    const query = 'UPDATE Watched SET show_status = $2 WHERE tmdb_id = $1 RETURNING *'
    const result = await dbWrapper(query, [tmdbId, showStatus])
    return Array.isArray(result) ? result[0] : result
}

export async function updateTotalSeasons(tmdbId: number, totalSeasons: number) {
    const query = 'UPDATE Watched SET total_seasons = $2 WHERE tmdb_id = $1 RETURNING *'
    const result = await dbWrapper(query, [tmdbId, totalSeasons])
    return Array.isArray(result) ? result[0] : result
}

export async function getContinueWatching() {
    const query = `
        SELECT * FROM Watched
        WHERE ARRAY_LENGTH(watched_seasons, 1) < total_seasons
        ORDER BY added_at DESC
    `
    const result = await dbWrapper(query)
    return Array.isArray(result) ? result : []
}