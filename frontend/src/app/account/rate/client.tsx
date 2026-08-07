'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import config, { POSTER_SIZES } from '@config'
import { Image as ImageIcon, Film, Tv, Check } from 'lucide-react'
import { setRating } from '@/utils/queries'
import { StarRating } from '@/components/rating/starRating'

export type RateItem = {
    tmdbId: number
    type: 'movie' | 'show'
    title: string
    poster: string | null
    year: string
}

export default function RateClient({ items }: { items: RateItem[] }) {
    const [queue, setQueue] = useState(items)
    const [ratedIds, setRatedIds] = useState<Set<number>>(new Set())
    const total = items.length
    const remaining = queue.length

    async function rate(item: RateItem, value: number | null) {
        if (value == null) return
        const { error } = await setRating(item.tmdbId, item.type, item.title, value)
        if (error) { console.error(error); return }
        // Mark rated for a brief confirm animation, then drop it from the queue.
        setRatedIds((prev) => new Set(prev).add(item.tmdbId))
        setTimeout(() => {
            setQueue((prev) => prev.filter((i) => i.tmdbId !== item.tmdbId))
            setRatedIds((prev) => { const s = new Set(prev); s.delete(item.tmdbId); return s })
        }, 500)
    }

    if (total === 0) {
        return <EmptyState />
    }

    const done = total - remaining

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between text-xs'>
                    <span className='font-medium text-foreground/80 tabular-nums'>
                        {remaining > 0 ? `${remaining} left to rate` : 'All done'}
                    </span>
                    <span className='text-muted-foreground/60 tabular-nums'>{done} / {total}</span>
                </div>
                <div className='h-1.5 rounded-full bg-muted/80 overflow-hidden'>
                    <div
                        className='h-full rounded-full bg-linear-to-r from-brand/60 to-ambient/80 transition-[width] duration-500'
                        style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {remaining === 0 ? (
                <EmptyState done />
            ) : (
                <ul className='flex flex-col divide-y divide-border/60'>
                    {queue.map((item) => {
                        const rated = ratedIds.has(item.tmdbId)
                        return (
                            <li
                                key={item.tmdbId}
                                className={`flex items-center gap-4 py-3 transition-all duration-500 ${
                                    rated ? 'opacity-0 scale-[0.97] -translate-x-2' : 'opacity-100'
                                }`}
                            >
                                <Link
                                    href={`/${item.type}/${item.tmdbId}`}
                                    className='relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/8 bg-muted'
                                >
                                    {item.poster ? (
                                        <Image
                                            src={`${config.url.POSTER_URL}${item.poster}`}
                                            alt={item.title}
                                            fill
                                            className='object-cover'
                                            sizes={POSTER_SIZES}
                                        />
                                    ) : (
                                        <div className='flex h-full w-full items-center justify-center'>
                                            <ImageIcon className='h-4 w-4 text-muted-foreground' />
                                        </div>
                                    )}
                                </Link>

                                <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                                    <Link href={`/${item.type}/${item.tmdbId}`} className='text-sm font-medium text-foreground truncate hover:text-ambient transition-colors'>
                                        {item.title}
                                    </Link>
                                    <span className='inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/60 tabular-nums'>
                                        {item.type === 'movie' ? <Film className='h-3 w-3' /> : <Tv className='h-3 w-3' />}
                                        {item.year}
                                    </span>
                                </div>

                                <div className='shrink-0'>
                                    {rated ? (
                                        <div className='flex items-center justify-center h-7 w-7 rounded-full bg-brand/15 text-brand'>
                                            <Check className='h-4 w-4' />
                                        </div>
                                    ) : (
                                        <StarRating value={null} onChange={(v) => rate(item, v)} />
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

function EmptyState({ done = false }: { done?: boolean }) {
    return (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60'>
                <Check className='h-6 w-6 text-muted-foreground/40' />
            </div>
            <div className='flex flex-col gap-1.5'>
                <p className='text-sm font-semibold'>{done ? 'Nicely done' : 'Nothing to rate'}</p>
                <p className='text-xs text-muted-foreground/60 max-w-xs leading-relaxed'>
                    {done
                        ? 'You have rated everything on your list.'
                        : 'Rate titles from their detail page, or mark more as watched to see them here.'}
                </p>
            </div>
        </div>
    )
}
