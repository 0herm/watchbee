import dotenv from 'dotenv'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('./package.json')

const config = {
    url: {
        API_URL:    'https://api.themoviedb.org/',
        IMAGE_URL:  'https://image.tmdb.org/t/p/w500'
    },
    setting: {
        REGION:         process.env.REGION                      || 'NO', 
        LANGUAGE:       process.env.LANGUAGE                    || 'en-US', 
        ORIGINAL_TITLE: process.env.ORIGINAL_TITLE === 'true'   || false,
        INCLUDE_ADULT:  process.env.INCLUDE_ADULT === 'true'    || false
    },
    database: {
        HOST: process.env.POSTGRES_HOST                         || 'localhost',
        PORT: process.env.POSTGRES_PORT                         || '5432',
        USER: process.env.POSTGRES_USER                         || 'admin',
        PASSWORD: process.env.POSTGRES_PASSWORD                 || 'CHANGEME',
        DB: process.env.POSTGRES_DB                             || 'watchbee',
        MAX_CONN: process.env.POSTGRES_MAX_CONN                 || '10',
        IDLE_TIMEOUT_MS: process.env.POSTGRES_IDLE_TIMEOUT_MS   || '5000',
        TIMEOUT_MS: process.env.POSTGRES_TIMEOUT_MS             || '3000'
    },
    version
}

export default config
