'use client'

import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/ui/dialog'
import { addWatched, getWatchedById, removeWatched, removeMedia, updateWatchedSeasons, updateShowStatus, updateTotalSeasons } from '@/utils/api'
import { useEffect, useState } from 'react'
import { revalidate } from './actions'

type ListToolProps = {
    tmdbID: number
    mediaType: MediaType
    media: MovieDetailsProps | ShowDetailsProps
    lists?: ListProps[]
}

export default function WatchedTool({ tmdbID, mediaType, media, lists }: ListToolProps) {
    const [seen, setSeen] = useState<WatchedProps | null>(null)
    const [watchedSeasons, setWatchedSeasons] = useState<number[]>([])

    const title = mediaType === 'movie' ? (media as MovieDetailsProps).title : (media as ShowDetailsProps).name
    const totalSeasons = mediaType === 'show' ? (media as ShowDetailsProps).number_of_seasons : undefined
    const showStatus = mediaType === 'show' ? (media as ShowDetailsProps).status : undefined

    useEffect(() => {
        async function fetchData() {
            const { data, error } = await getWatchedById(tmdbID)
            if (error) console.error(error)
            setSeen(data ?? null)
            setWatchedSeasons(data?.watched_seasons ?? [])
        }
        fetchData()
    }, [tmdbID])

    useEffect(() => {
        if (mediaType === 'show' && seen) {
            const syncShowState = async () => {
                if (totalSeasons !== seen.total_seasons) {
                    const { error } = await updateTotalSeasons(tmdbID, totalSeasons || 0)
                    if (error) console.error(error)
                }
                if (showStatus !== seen.show_status) {
                    const { error } = await updateShowStatus(tmdbID, showStatus || '')
                    if (error) console.error(error)
                }
            }
            void syncShowState()
        }
    }, [totalSeasons, showStatus, seen, mediaType, tmdbID])

    async function handleToggleMovie() {
        if (seen) {
            const { data, error } = await removeWatched(tmdbID)
            if (error) { console.error(error); return }
            if (data) setSeen(null)
        } else {
            const { data, error } = await addWatched(tmdbID, mediaType, title, totalSeasons, showStatus)
            if (error) { console.error(error); return }
            if (data) {
                setSeen(data)
                if (lists?.[0]?.id) await removeMedia(tmdbID, lists[0].id)
            }
        }
        revalidate('/account')
    }

    function handleSeasonToggle(season: number) {
        setWatchedSeasons((prev) =>
            prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]
        )
    }

    async function updateShowWatched() {
        if (watchedSeasons.length < 1 && seen) {
            const { data, error } = await removeWatched(tmdbID)
            if (error) { console.error(error); return }
            if (data) { setSeen(null); setWatchedSeasons([]) }
        } else if (watchedSeasons.length > 0) {
            if (seen) {
                const { data, error } = await updateWatchedSeasons(tmdbID, watchedSeasons)
                if (error) { console.error(error); return }
                if (data) setSeen({ ...seen, watched_seasons: watchedSeasons })
            } else {
                const { data, error } = await addWatched(tmdbID, 'show', title, totalSeasons, showStatus, watchedSeasons)
                if (error) { console.error(error); return }
                if (data) {
                    setSeen(data)
                    if (lists?.[0]?.id) await removeMedia(tmdbID, lists[0].id)
                }
            }
        }
    }

    const allWatched = mediaType === 'show' && !!totalSeasons && (seen?.watched_seasons?.length ?? 0) === totalSeasons

    return mediaType === 'movie' ? (
        <Button variant='secondary' size='icon' className='size-10' onClick={handleToggleMovie}>
            {seen ? <Eye className='size-5' /> : <EyeOff className='size-5' />}
        </Button>
    ) : (
        <Dialog onOpenChange={(open) => { if (!open) updateShowWatched() }}>
            <DialogTrigger asChild>
                <Button variant='secondary' size='icon' className='size-10'>
                    {allWatched ? <Eye className='size-5' /> : <EyeOff className='size-5' />}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Watched Seasons</DialogTitle>
                    <DialogDescription>Select the seasons you have watched</DialogDescription>
                </DialogHeader>
                <div className='w-full grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-[30rem] overflow-y-auto'>
                    {Array.from({ length: totalSeasons || 0 }, (_, i) => i + 1).map((season) => (
                        <Button
                            key={season}
                            variant={watchedSeasons.includes(season) ? 'default' : 'secondary'}
                            onClick={() => handleSeasonToggle(season)}
                        >
                            Season {season}
                        </Button>
                    ))}
                </div>
                <div className='flex justify-between gap-2'>
                    <Button
                        variant='outline'
                        className='flex-1'
                        onClick={() => setWatchedSeasons(Array.from({ length: totalSeasons || 0 }, (_, i) => i + 1))}
                    >
                        All Seasons
                    </Button>
                    <Button
                        variant='destructive'
                        className='flex-1'
                        onClick={() => setWatchedSeasons([])}
                    >
                        Clear All
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
