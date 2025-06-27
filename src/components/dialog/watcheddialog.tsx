'use client'

import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { addWatched, getWatchedById, removeWatched, updateWatchedSeasons, updateShowStatus, updateTotalSeasons } from '@/utils/api'
import { useEffect, useState } from 'react'
import { revalidate } from './actions'

type ListToolProps = {
  tmdbID: number
  mediaType: MediaType
  media: MovieDetailsProps | ShowDetailsProps
}

export default function WatchedTool({ tmdbID, mediaType, media }: ListToolProps) {
    const [seen, setSeen] = useState<WatchedProps | null>(null)
    const [watchedSeasons, setWatchedSeasons] = useState<number[]>([])

    const title = mediaType === 'movie' ? (media as MovieDetailsProps).title : (media as ShowDetailsProps).name
    const totalSeasons = mediaType === 'show' ? (media as ShowDetailsProps).number_of_seasons : undefined
    const showStatus = mediaType === 'show' ? (media as ShowDetailsProps).status : undefined

    useEffect(() => {
        async function fetchData() {
            const data = await getWatchedById(tmdbID)
            setSeen(data)
            setWatchedSeasons(data && 'watched_seasons' in data ? (data.watched_seasons ?? []) : [])
        }
        fetchData()
    }, [tmdbID])

    useEffect(() => {
        if (mediaType === 'show' && seen) {
            if (totalSeasons !== seen.total_seasons) {
                updateTotalSeasons(tmdbID, totalSeasons || 0)
            }
            if (showStatus !== seen.show_status) {
                updateShowStatus(tmdbID, showStatus || '')
            }
        }
    }, [totalSeasons, showStatus, seen, mediaType, tmdbID])

    async function handleToggleMovie() {
        if (seen) {
            const result = await removeWatched(tmdbID)
            if (result) setSeen(null)
        } else {
            const result = await addWatched(tmdbID, mediaType, title, totalSeasons, showStatus)
            if (result) setSeen(result)
        }
        revalidate('/account')
    }

    function handleSeasonToggle(season: number) {
        const updatedSeasons = watchedSeasons.includes(season)
            ? watchedSeasons.filter((s) => s !== season)
            : [...watchedSeasons, season]
        setWatchedSeasons(updatedSeasons)
    }

    async function updateShowWatched() {
        if (watchedSeasons.length < 1 && seen) {
            const result = await removeWatched(tmdbID)
            if (result) setSeen(null); setWatchedSeasons([])
        } else if (watchedSeasons.length > 0) {
            if (seen) {
                const result = await updateWatchedSeasons(tmdbID, watchedSeasons)
                if (result) setSeen({...seen, watched_seasons: watchedSeasons})
            } else {
                const result = await addWatched(tmdbID, 'show', title, totalSeasons, showStatus, watchedSeasons)
                if (result) setSeen(result)
            }
        }
    }

    return (
        mediaType === 'movie' ? (
            <Button variant='secondary' type='submit' className='w-[2.5rem] h-[2.5rem] cursor-pointer' onClick={handleToggleMovie}>
                {seen ? 
                    <Eye className='stroke-white size-[1rem]' /> :
                    <EyeOff className='stroke-white size-[1rem]' />
                }
            </Button>
        ) : (
            <Dialog onOpenChange={(open) => { if (!open) updateShowWatched() }}>
                <DialogTrigger asChild>
                    <Button variant='secondary' className='w-[2.5rem] h-[2.5rem] cursor-pointer'>
                        {seen && 'watched_seasons' in seen && (seen.watched_seasons ?? []).length === totalSeasons ? 
                            <Eye className='stroke-white size-[1rem]' /> : 
                            <EyeOff className='stroke-white size-[1rem]' />}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Watched</DialogTitle>
                        <DialogDescription>Select the seasons you have watched</DialogDescription>
                    </DialogHeader>
                    <div className='w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-[0.5rem] max-h-[30rem] overflow-y-auto pr-[1rem]'>
                        {Array.from({ length: totalSeasons || 0 }, (_, i) => i + 1).map((season) => (
                            <Button
                                key={season}
                                variant={watchedSeasons.includes(season) ? 'default' : 'secondary'}
                                className='w-[8rem] xs:w-full mx-auto xs:mx-0'
                                onClick={() => handleSeasonToggle(season)}
                            >
                                Season {season}
                            </Button>
                        ))}
                    </div>
                    <div className='flex justify-between items-center mt-[1rem] gap-[0.5rem]'>
                        <Button
                            variant='outline'
                            className='flex-1'
                            onClick={() => setWatchedSeasons(Array.from({ length: totalSeasons || 0 }, (_, i) => i + 1))}
                        >
                            Add All Seasons
                        </Button>
                        <Button
                            variant='destructive'
                            className='flex-1'
                            onClick={() => setWatchedSeasons([])}
                        >
                            Remove All Seasons
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    )
}