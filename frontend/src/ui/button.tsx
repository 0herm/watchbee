import * as React from 'react'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90',
    outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md gap-1.5 px-3',
    lg: 'h-10 rounded-md px-6',
    icon: 'size-9',
}

interface ButtonProps extends React.ComponentProps<'button'> {
    variant?: ButtonVariant
    size?: ButtonSize
}

function Button({ className = '', variant = 'default', size = 'default', ...props }: ButtonProps) {
    const cls = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ' +
        'text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ' +
        'outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer ' +
        `${variantClasses[variant]} ${sizeClasses[size]} ${className}`
    return (
        <button
            className={cls}
            {...props}
        />
    )
}

export { Button }
export type { ButtonVariant, ButtonSize }
