'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

export function TrailerButton({ videos }: { videos: VideoItem[] }) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = overflow
        }
    }, [open])

    const trailer =
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
        videos.find((v) => v.site === 'YouTube')

    if (!trailer) return null

    return (
        <>
            <button
                onClick={() => {
                    setOpen(true)
                    dialogRef.current?.showModal()
                }}
                className={
                    'inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl glass border border-white/12 cursor-pointer ' +
                    'text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors'
                }
            >
                <Play className='h-3.5 w-3.5 shrink-0 fill-current' />
                <span className='hidden xs:inline'>Trailer</span>
            </button>

            <dialog
                ref={dialogRef}
                onClose={() => setOpen(false)}
                onClick={(e) => {
                    if (e.target === dialogRef.current) dialogRef.current?.close()
                }}
                style={{
                    padding:
                        'calc(env(safe-area-inset-top, 0px) + 1rem) calc(env(safe-area-inset-right, 0px) + 1rem) ' +
                        'calc(env(safe-area-inset-bottom, 0px) + 1rem) calc(env(safe-area-inset-left, 0px) + 1rem)',
                }}
                className={
                    'm-auto w-full max-w-4xl bg-transparent text-white ' +
                    'backdrop:bg-black/85 backdrop:backdrop-blur-sm'
                }
            >
                <div className='flex w-full flex-col gap-2'>
                    <button
                        onClick={() => dialogRef.current?.close()}
                        className='self-end flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm cursor-pointer'
                    >
                        <X className='h-4 w-4' />
                        Close
                    </button>
                    <div className='relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10'>
                        {open && (
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                                title={trailer.name}
                                allow='autoplay; encrypted-media; fullscreen'
                                allowFullScreen
                                className='absolute inset-0 w-full h-full'
                            />
                        )}
                    </div>
                </div>
            </dialog>
        </>
    )
}
