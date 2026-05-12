import pg from 'pg'
import config from '@config'

const {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DB
} = config.database

const { Pool } = pg
const pool = new Pool({
    host: HOST,
    port: PORT ? Number(PORT) : undefined,
    user: USER,
    password: PASSWORD,
    database: DB
})

export default async function run(query: string, params: (string | number | boolean | null | Buffer | string[])[]) {
    const con = await pool.connect()
    try {
        return await con.query(query, params)
    } finally {
        con.release()
    }
}
