'use client'

import { useEffect } from 'react'

// My Iphone PWA lagged to much when using the native view transition API, so this component disables it on mobile.
// It is not a perfect solution, but it is better than nothing.
export default function MobileViewTransitions() {
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 639px)')
        const native = document.startViewTransition?.bind(document)
        if (!native) return

        const apply = () => {
            if (mq.matches) {
                // @ts-expect-error intentionally removing the API to opt out on mobile
                document.startViewTransition = undefined
            } else {
                document.startViewTransition = native
            }
        }

        apply()
        mq.addEventListener('change', apply)
        return () => {
            mq.removeEventListener('change', apply)
            document.startViewTransition = native
        }
    }, [])

    return null
}
