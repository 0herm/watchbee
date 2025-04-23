import dotenv from 'dotenv'

dotenv.config()

const { version } = require('./package.json')

const config = {
    url: {
        API_URL:    'https://api.themoviedb.org/',
        IMAGE_URL:  'https://image.tmdb.org/t/p/w500'
    },
    version
}

export default config
