'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type DialogContextValue = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue>({
    open: false,
    onOpenChange: () => {},
})

function Dialog({
    open: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    children,
}: {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    defaultOpen?: boolean
    children: React.ReactNode
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    function handleOpenChange(value: boolean) {
        if (!isControlled) setUncontrolledOpen(value)
        onOpenChange?.(value)
    }

    return (
        <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
    const { onOpenChange } = React.useContext(DialogContext)

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
        return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
                child.props.onClick?.(e)
                onOpenChange(true)
            },
        })
    }

    return <button onClick={() => onOpenChange(true)}>{children}</button>
}

function DialogPortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    if (!mounted) return null
    return createPortal(children, document.body)
}

function DialogClose({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
    const { onOpenChange } = React.useContext(DialogContext)

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
        return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
                child.props.onClick?.(e)
                onOpenChange(false)
            },
        })
    }

    return <button onClick={() => onOpenChange(false)}>{children}</button>
}

function DialogContent({
    className = '',
    children,
    showCloseButton = true,
}: {
    className?: string
    children: React.ReactNode
    showCloseButton?: boolean
}) {
    const { open, onOpenChange } = React.useContext(DialogContext)

    React.useEffect(() => {
        if (!open) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onOpenChange(false)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onOpenChange])

    if (!open) return null

    return (
        <DialogPortal>
            <div
                className='fixed inset-0 z-50 bg-black/50'
                onClick={() => onOpenChange(false)}
            />
            <div
                className={
                    'bg-background fixed top-1/2 left-1/2 z-50 grid w-full ' +
                    'max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 ' +
                    `gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg ${className}`
                }
            >
                {children}
                {showCloseButton && (
                    <button
                        onClick={() => onOpenChange(false)}
                        className='absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100'
                        aria-label='Close'
                    >
                        <X className='size-4' />
                    </button>
                )}
            </div>
        </DialogPortal>
    )
}

function DialogHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
    return <div className={`flex flex-col gap-2 text-center sm:text-left ${className}`} {...props} />
}

function DialogTitle({ className = '', ...props }: React.ComponentProps<'h2'>) {
    return <h2 className={`text-lg leading-none font-semibold ${className}`} {...props} />
}

function DialogDescription({ className = '', ...props }: React.ComponentProps<'p'>) {
    return <p className={`text-muted-foreground text-sm ${className}`} {...props} />
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
}
