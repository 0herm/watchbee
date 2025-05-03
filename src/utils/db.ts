import pg from 'pg'
import config from '@config'

const {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DB,
    MAX_CONN,
    IDLE_TIMEOUT_MS,
    TIMEOUT_MS
} = config.database

const { Pool } = pg
const pool = new Pool({
    host: HOST,
    port: Number(PORT),
    user: USER,
    password: PASSWORD,
    database: DB,
    max: Number(MAX_CONN),
    idleTimeoutMillis: Number(IDLE_TIMEOUT_MS),
    connectionTimeoutMillis: Number(TIMEOUT_MS)
})

export default async function run(query: string, params: (string | number | null)[]) {
    const con = await pool.connect()
    try {
        return await con.query(query, params)
    } catch (error) {
        throw error
    } finally {
        con.release()
    }
}
