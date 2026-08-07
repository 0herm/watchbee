'use client'

import Image from 'next/image'
import config, { POSTER_SIZES } from '@config'
import { Film, Tv, Star, Bookmark, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { formatVotes } from '@/utils/format'
import { SkeletonHeading } from '@/components/media/sectionHeading'
import ExpandableText from '@/components/media/expandableText'
import { Button } from '@/ui/button'

type Hero = {
    poster: string
    backdrop: string
    title: string
    originalTitle?: string
    type: 'movie' | 'show'
    rating: string | null
    votes: number
    year: string
    tagline?: string
    overview: string
    inList: boolean
    watched: boolean
}

function readHero(): Hero | null {
    if (typeof window === 'undefined') return null
    try {
        return JSON.parse(sessionStorage.getItem('vt-hero') ?? 'null') as Hero | null
    } catch {
        return null
    }
}

export function MediaPageSkeleton({ isShow = false }: { isShow?: boolean }) {
    const [hero] = useState(readHero)

    return (
        <div className='relative w-full flex flex-col'>

            {/* Hero */}
            <div className='relative w-full flex flex-col justify-end overflow-hidden min-h-[60vh] sm:min-h-[min(72vh,43.75rem)]'>
                <div className='absolute inset-0'>
                    {hero?.backdrop ? (
                        <Image
                            src={`https://image.tmdb.org/t/p/w780${hero.backdrop}`}
                            alt='' fill priority sizes='100vw' quality={75}
                            className='object-cover opacity-60 blur-sm'
                            style={{ objectPosition: 'center 25%' }}
                        />
                    ) : (
                        <div className='absolute inset-0 bg-muted/30' />
                    )}
                    <div className='absolute inset-0 bg-linear-to-t from-background from-[2%] via-background/45 via-[45%] to-background/15' />
                    <div className='absolute inset-0 bg-linear-to-r from-background/55 via-background/15 to-transparent hidden sm:block' />
                </div>

                <div className='relative z-10 w-full px-5 sm:px-6'>
                    <div className='max-w-6xl mx-auto flex items-end gap-8 pb-8 sm:pb-12 pt-[calc(3.5rem_+_env(safe-area-inset-top,0px)_+_3.5rem)] sm:pt-0'>
                        <div
                            className='hidden sm:block relative w-36 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden bg-muted shrink-0'
                            style={{ viewTransitionName: 'active-poster' } as React.CSSProperties}
                        >
                            {hero?.poster ? (
                                <Image
                                    src={`${config.url.POSTER_URL}${hero.poster}`}
                                    alt='' fill priority sizes={POSTER_SIZES} className='object-cover'
                                />
                            ) : (
                                <span className='block h-full w-full animate-pulse' />
                            )}
                        </div>

                        <div className='flex flex-col gap-3.5 flex-1 min-w-0'>
                            {hero ? (
                                <>
                                    <div className='flex items-center gap-2.5 flex-wrap'>
                                        <span className='inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-ambient uppercase'>
                                            {hero.type === 'movie' ? <><Film className='h-3 w-3' />Movie</> : <><Tv className='h-3 w-3' />TV Series</>}
                                        </span>
                                        {hero.rating && (
                                            <span
                                                className={
                                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 ' +
                                                    'border border-yellow-400/20 text-[10px] font-bold text-yellow-400 tabular-nums'
                                                }
                                            >
                                                <Star className='h-2.5 w-2.5 fill-current stroke-none' />
                                                {hero.rating}
                                                {hero.votes > 0 && <span className='font-normal text-yellow-400/50 ml-0.5'>· {formatVotes(hero.votes)}</span>}
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-1.5'>
                                        <h1
                                            className='display font-black leading-[0.95] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.7)] wrap-break-word line-clamp-2 sm:line-clamp-none'
                                            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.25rem)' }}
                                        >
                                            {hero.title}
                                        </h1>
                                        {hero.originalTitle && <p className='text-sm text-white/35 font-light'>{hero.originalTitle}</p>}
                                    </div>
                                    <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/45 tabular-nums'>
                                        {hero.year && <span>{hero.year}</span>}
                                        <span className='text-white/20'>·</span>
                                        <span className='inline-block h-3 w-16 bg-white/20 animate-pulse rounded align-middle' />
                                    </div>
                                    {hero.tagline
                                        ? <p className='text-[13px] italic text-white/35 leading-snug font-light tracking-wide line-clamp-1'>&ldquo;{hero.tagline}&rdquo;</p>
                                        : hero.tagline === undefined
                                            ? <p className='text-[13px] leading-snug'><span className='inline-block h-3 w-64 max-w-full bg-white/15 animate-pulse rounded align-middle' /></p>
                                            : null}
                                    <div className='flex gap-1.5 overflow-hidden'>
                                        {['w-12', 'w-16', 'w-10'].map((w) => (
                                            <span key={w} className='inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/10 px-3 py-1.5 animate-pulse'>
                                                <span className={`block h-3 ${w} rounded bg-white/20`} />
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='h-3 w-14 bg-white/20 animate-pulse rounded-full' />
                                    <div className='h-12 sm:h-16 w-3/4 max-w-md bg-white/20 animate-pulse rounded-lg' />
                                    <div className='h-3 w-48 bg-white/12 animate-pulse rounded' />
                                    <div className='flex gap-1.5 overflow-hidden'>
                                        {['w-12', 'w-16', 'w-10'].map((w) => (
                                            <span key={w} className='inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/10 px-3 py-1.5 animate-pulse'>
                                                <span className={`block h-3 ${w} rounded bg-white/20`} />
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                            <div className='flex gap-2 pt-1'>
                                {hero ? (
                                    <>
                                        <Button variant={hero.inList ? 'default' : 'secondary'} size='icon' className='size-9 rounded-xl'>
                                            <Bookmark className={`size-5${hero.inList ? ' fill-current' : ''}`} />
                                        </Button>
                                        <Button variant='secondary' size='icon' className='size-9 rounded-xl'>
                                            {hero.watched ? <Eye className='size-5' /> : <EyeOff className='size-5' />}
                                        </Button>
                                        <div className='h-9 w-24 rounded-xl bg-white/10 animate-pulse' />
                                        <div className='h-9 w-9 rounded-xl bg-white/10 animate-pulse' />
                                    </>
                                ) : (
                                    <>
                                        <div className='h-9 w-9 rounded-xl bg-white/10 animate-pulse' />
                                        <div className='h-9 w-9 rounded-xl bg-white/10 animate-pulse' />
                                        <div className='h-9 w-24 rounded-xl bg-white/10 animate-pulse' />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full px-5 sm:px-6'>
                <div className='max-w-6xl mx-auto flex flex-col gap-10 pt-10'>

                    {/* Overview */}
                    <div className='flex flex-col gap-3'>
                        <SkeletonHeading width='w-28' />
                        {hero?.overview ? (
                            <ExpandableText text={hero.overview} />
                        ) : (
                            <div className='flex flex-col gap-2.5'>
                                <div className='h-3.5 w-full max-w-3xl bg-muted animate-pulse rounded' />
                                <div className='h-3.5 w-5/6 max-w-2xl bg-muted animate-pulse rounded' />
                                <div className='h-3.5 w-3/4 max-w-xl bg-muted animate-pulse rounded' />
                            </div>
                        )}
                    </div>

                    {/* Where to Watch */}
                    <div className='flex flex-col gap-4'>
                        <SkeletonHeading width='w-40' />
                        <div className='flex flex-col gap-3'>
                            <div className='h-2 w-12 bg-muted/50 animate-pulse rounded' />
                            <div className='flex gap-3'>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className='flex flex-col items-center gap-2 shrink-0'>
                                        <div className='w-13 h-13 rounded-2xl bg-muted animate-pulse' />
                                        <div className='h-2 w-10 bg-muted animate-pulse rounded' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Seasons (shows only) */}
                    {isShow && (
                        <div className='flex flex-col gap-3'>
                            <SkeletonHeading width='w-24' />
                            <div className='flex gap-3 overflow-hidden'>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className='flex-none w-28 sm:w-32 bg-surface-1 border border-border rounded-xl overflow-hidden shrink-0'>
                                        <div className='aspect-[2/3] w-full bg-muted animate-pulse' />
                                        <div className='p-2.5 flex flex-col gap-1'>
                                            <div className='h-3 w-16 bg-muted animate-pulse rounded' />
                                            <div className='h-2.5 w-12 bg-muted/70 animate-pulse rounded' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Details */}
                    <div className='flex flex-col gap-4'>
                        <SkeletonHeading width='w-24' />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10'>
                            {[0, 1].map((col) => (
                                <div key={col} className='flex flex-col divide-y divide-border/60'>
                                    {Array.from({ length: isShow ? 5 : 4 }, (_, i) => (
                                        <div key={i} className='flex justify-between items-center py-3'>
                                            <div className='h-3 w-16 bg-muted animate-pulse rounded' />
                                            <div className='h-3 w-24 bg-muted animate-pulse rounded' />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* More Like This */}
                    <div className='flex flex-col gap-3'>
                        <SkeletonHeading width='w-40' />
                        <div className='flex gap-3 overflow-hidden'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className='w-[clamp(7.5rem,20vw,11rem)] shrink-0 aspect-[2/3] rounded-xl bg-muted animate-pulse'
                                    style={{ animationDelay: `${i * 50}ms` }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
