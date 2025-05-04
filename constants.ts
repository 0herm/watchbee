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
        REGION:         process.env.REGION                      || 'GB', 
        LANGUAGE:       process.env.LANGUAGE                    || 'en-GB', 
        ORIGINAL_TITLE: process.env.ORIGINAL_TITLE === 'true'   || false,
        INCLUDE_ADULT:  process.env.INCLUDE_ADULT === 'true'    || false,
        TIMEZONE:       process.env.TIMEZONE                    || 'Europe/London',
    },
    database: {
        HOST: process.env.POSTGRES_HOST                         || 'postgres',
        PORT: process.env.POSTGRES_PORT                         || '5432',
        USER: process.env.POSTGRES_USER                         || 'admin',
        PASSWORD: process.env.POSTGRES_PASSWORD                 || 'CHANGEME',
        DB: process.env.POSTGRES_DB                             || 'watchbee',
    },
    lists: ['seen', 'watch'],
    version
}

export default config
