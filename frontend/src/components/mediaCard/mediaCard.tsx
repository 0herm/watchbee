'use client'

import Image from 'next/image'
import config from '@config'
import Link from 'next/link'
import { Image as ImageIcon, Star, Bookmark, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { addMedia, removeMedia, checkMediaInList, addWatched, removeWatched, getWatchedById, updateWatchedSeasons, getShowTotalSeasons } from '@/utils/api'
import { revalidate } from '@/components/dialog/actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/ui/dialog'
import { Button } from '@/ui/button'

interface MediaCardProps {
    item: MediaItemProps
    lists: ListProps[]
    type?: MediaType
}

export default function MediaCard({ item, lists, type }: MediaCardProps) {
    const mediaType: MediaType = type ?? (item.media_type === 'tv' ? 'show' : 'movie')
    const listId = lists[0]?.id

    const title = ('title' in item ? item.title : null) ?? ('name' in item ? item.name : null) ?? ''

    const dates = item as { release_date?: string; first_air_date?: string }
    const year = (dates.release_date ?? dates.first_air_date ?? '').split('-')[0]

    const rating = item.vote_average && item.vote_average > 0 ? item.vote_average.toFixed(1) : null

    const [inList, setInList] = useState(false)
    const [watched, setWatched] = useState(false)
    const [watchedSeasons, setWatchedSeasons] = useState<number[]>([])
    const [totalSeasons, setTotalSeasons] = useState(0)

    useEffect(() => {
        if (listId) checkMediaInList(item.id, listId).then(({ data }) => setInList(data ?? false))
        getWatchedById(item.id).then(({ data }) => {
            setWatched(!!data)
            if (data) setWatchedSeasons(data.watched_seasons ?? [])
        })
    }, [item.id, listId])

    async function handleSave() {
        if (!listId) return
        if (inList) {
            const { data, error } = await removeMedia(item.id, listId)
            if (error) { console.error(error); return }
            if (data) { setInList(false); revalidate('/account') }
        } else {
            const { data, error } = await addMedia(item.id, mediaType, listId)
            if (error) { console.error(error); return }
            if (data) { setInList(true); revalidate('/account') }
        }
    }

    async function handleWatched() {
        if (watched) {
            const { data, error } = await removeWatched(item.id)
            if (error) { console.error(error); return }
            if (data) { setWatched(false); revalidate('/account') }
        } else {
            const { data, error } = await addWatched(item.id, mediaType, title)
            if (error) { console.error(error); return }
            if (data) {
                setWatched(true)
                if (inList && listId) { await removeMedia(item.id, listId); setInList(false) }
                revalidate('/account')
            }
        }
    }

    async function fetchSeasonData() {
        if (totalSeasons) return
        const existing = (item as { number_of_seasons?: number }).number_of_seasons
        setTotalSeasons(existing || await getShowTotalSeasons(item.id))
    }

    async function closeShowDialog() {
        if (watchedSeasons.length === 0) {
            if (watched) {
                const { data, error } = await removeWatched(item.id)
                if (!error && data) setWatched(false)
            }
        } else if (watched) {
            await updateWatchedSeasons(item.id, watchedSeasons)
        } else {
            const { data, error } = await addWatched(item.id, 'show', title, totalSeasons || undefined, undefined, watchedSeasons)
            if (!error && data) {
                setWatched(true)
                if (inList && listId) { await removeMedia(item.id, listId); setInList(false) }
            }
        }
        revalidate('/account')
    }

    function handleSeasonToggle(season: number) {
        setWatchedSeasons((prev) => prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season])
    }

    const watchedBtn = (onClick?: () => void) => (
        <button
            onClick={onClick}
            className={'flex flex-1 items-center justify-center gap-1.5 py-1.5 text-xs ' +
                `font-medium transition-colors ${watched ? 'bg-brand/80 text-white' : 'text-white/80 hover:bg-white/10'}`}
        >
            {watched ? <Eye className='h-3.5 w-3.5' /> : <EyeOff className='h-3.5 w-3.5' />}
            Watched
        </button>
    )

    return (
        <div className='group relative w-full'>
            <Link href={`/${mediaType}/${item.id}`}>
                <div className='relative aspect-2/3 w-full overflow-hidden rounded-lg shadow-md ring-1 ring-border/50'>
                    {item.poster_path ? (
                        <Image
                            src={`${config.url.IMAGE_URL}${item.poster_path}`}
                            alt={title || 'poster'}
                            fill
                            className='object-cover transition-transform duration-300 group-hover:scale-105'
                            sizes='(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 11rem'
                        />
                    ) : (
                        <div className='flex h-full w-full items-center justify-center bg-muted'>
                            <ImageIcon className='h-8 w-8 text-muted-foreground' />
                        </div>
                    )}
                    <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    <div className='absolute bottom-10 left-0 right-0 px-2 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                        {title && <p className='text-white text-xs font-semibold line-clamp-2 leading-tight'>{title}</p>}
                        <div className='flex items-center gap-1.5 mt-0.5'>
                            {year && <span className='text-white/70 text-xs'>{year}</span>}
                            {rating && (
                                <>
                                    <span className='text-white/40 text-xs'>·</span>
                                    <span className='flex items-center gap-0.5 text-white/70 text-xs'>
                                        <Star className='h-2.5 w-2.5 fill-yellow-400 stroke-yellow-400' />
                                        {rating}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            <div className='absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                <div className='flex rounded-md overflow-hidden bg-black/60 backdrop-blur-sm border border-white/10'>
                    <button
                        onClick={handleSave}
                        className={'flex flex-1 items-center justify-center gap-1.5 py-1.5 text-xs ' +
                            `font-medium transition-colors ${inList ? 'bg-primary/80 text-primary-foreground' : 'text-white/80 hover:bg-white/10'}`}
                    >
                        <Bookmark className={`h-3.5 w-3.5${inList ? ' fill-current' : ''}`} />
                        Save
                    </button>
                    <div className='w-px bg-white/10' />
                    {mediaType === 'show' ? (
                        <Dialog onOpenChange={(open) => { if (!open) closeShowDialog() }}>
                            <DialogTrigger asChild>
                                {watchedBtn(fetchSeasonData)}
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Watched Seasons</DialogTitle>
                                    <DialogDescription>Select the seasons you have watched</DialogDescription>
                                </DialogHeader>
                                <div className='w-full grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-[30rem] overflow-y-auto'>
                                    {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
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
                                    <Button variant='outline' className='flex-1'
                                        onClick={() => setWatchedSeasons(Array.from({ length: totalSeasons }, (_, i) => i + 1))}>
                                        All Seasons
                                    </Button>
                                    <Button variant='destructive' className='flex-1' onClick={() => setWatchedSeasons([])}>
                                        Clear All
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        watchedBtn(handleWatched)
                    )}
                </div>
            </div>
        </div>
    )
}
