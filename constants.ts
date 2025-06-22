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
        HOST: process.env.POSTGRES_HOST                         || 'localhost',
        PORT: process.env.POSTGRES_PORT                         || '5432',
        USER: process.env.POSTGRES_USER                         || 'admin',
        PASSWORD: process.env.POSTGRES_PASSWORD,
        DB: process.env.POSTGRES_DB                             || 'watchbee',
    },
    webpush: {
        VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
        EMAIL: process.env.EMAIL || 'your-email@example.com'
    },
    version
}

export default config
