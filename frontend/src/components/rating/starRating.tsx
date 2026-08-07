'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

const DIMS = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' } as const

type StarRatingProps = {
    value: number | null
    onChange?: (rating: number | null) => void
    readOnly?: boolean
    size?: keyof typeof DIMS
}

export function StarRating({ value, onChange, readOnly = false, size = 'md' }: StarRatingProps) {
    const [hover, setHover] = useState(0)
    const dim = DIMS[size]

    if (readOnly) {
        return (
            <div className='inline-flex items-center gap-0.5'>
                {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                        key={n}
                        className={`${dim} ${n <= (value ?? 0) ? 'fill-amber-400 stroke-none' : 'fill-none stroke-white/25'}`}
                    />
                ))}
            </div>
        )
    }

    const active = hover || value || 0

    return (
        <div className='inline-flex items-center gap-1' onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type='button'
                    aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => onChange?.(value === n ? null : n)}
                    className='p-0.5 -m-0.5 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-90'
                >
                    <Star
                        className={`${dim} transition-colors ${
                            n <= active ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-white/30 hover:stroke-white/60'
                        }`}
                    />
                </button>
            ))}
        </div>
    )
}
