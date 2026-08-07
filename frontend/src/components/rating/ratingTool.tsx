'use client'

import { useEffect, useState } from 'react'
import { getWatchedById, setRating } from '@/utils/queries'
import { StarRating } from '@/components/rating/starRating'

type RatingToolProps = {
    tmdbID: number
    mediaType: MediaType
    title: string
}

export default function RatingTool({ tmdbID, mediaType, title }: RatingToolProps) {
    const [rating, setRatingState] = useState<number | null>(null)

    useEffect(() => {
        getWatchedById(tmdbID).then(({ data, error }) => {
            if (error) console.error(error)
            setRatingState(data?.rating ?? null)
        })
    }, [tmdbID])

    async function handleChange(next: number | null) {
        const prev = rating
        setRatingState(next)
        const { error } = await setRating(tmdbID, mediaType, title, next)
        if (error) { console.error(error); setRatingState(prev) }
    }

    return (
        <div className='flex items-center gap-2.5 pt-1'>
            <span className='text-[10px] font-bold tracking-widest text-white/40 uppercase shrink-0'>Your Rating</span>
            <StarRating value={rating} onChange={handleChange} />
        </div>
    )
}
