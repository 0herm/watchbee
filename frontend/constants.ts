import { version } from './package.json'

export const POSTER_SIZES = '(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 11rem'

const config = {
    url: {
        API_URL:    'https://api.themoviedb.org/',
        IMAGE_URL:  'https://image.tmdb.org/t/p/w500',
        POSTER_URL: 'https://image.tmdb.org/t/p/w342',
        BACKDROP_URL: 'https://image.tmdb.org/t/p/original'
    },
    database: {
        HOST: process.env.POSTGRES_HOST,
        PORT: process.env.POSTGRES_PORT,
        USER: process.env.POSTGRES_USER,
        PASSWORD: process.env.POSTGRES_PASSWORD,
        DB: process.env.POSTGRES_DB,
    },
    version
}

export default config
