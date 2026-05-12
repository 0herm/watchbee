export default function Loading() {
    return (
        <div className='w-full flex flex-col gap-6 py-8'>
            <div className='h-72 w-full rounded-lg bg-muted animate-pulse' />
            <div className='space-y-3'>
                <div className='h-6 w-1/2 rounded bg-muted animate-pulse' />
                <div className='h-4 w-2/3 rounded bg-muted animate-pulse' />
                <div className='h-4 w-1/3 rounded bg-muted animate-pulse' />
            </div>
        </div>
    )
}
