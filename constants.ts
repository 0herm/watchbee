import dotenv from 'dotenv'

dotenv.config()

const { REGION, LANGUAGE, ORIGINAL_TITLE, INCLUDE_ADULT } = process.env;

const { version } = require('./package.json')

const config = {
    url: {
        API_URL:    'https://api.themoviedb.org/',
        IMAGE_URL:  'https://image.tmdb.org/t/p/w500'
    },
    setting: {
        REGION: REGION || 'NO', 
        LANGUAGE: LANGUAGE || 'en-US', 
        ORIGINAL_TITLE: ORIGINAL_TITLE === 'true' || false,
        INCLUDE_ADULT: INCLUDE_ADULT === 'true' || false
    },
    version
}

export default config
