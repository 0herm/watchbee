import type { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    return {
        name: 'WatchBee',
        short_name: 'WatchBee',
        theme_color: '#0A0A0A',
        description: 'Movie tracker',
        start_url: '/',
        display: 'standalone',
        icons: [
            {
                src: 'images/logo/logo_192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'images/logo/logo_512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}