export default function Loading() {
    return (
        <div className='w-full flex flex-col gap-8 max-w-xl'>
            <div className='flex flex-col gap-1'>
                <div className='h-6 w-16 bg-muted animate-pulse rounded-md' />
                <div className='h-3.5 w-64 bg-muted/60 animate-pulse rounded' />
            </div>

            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <div className='h-3 w-24 bg-muted animate-pulse rounded' />
                        <div className='h-3 w-10 bg-muted/60 animate-pulse rounded' />
                    </div>
                    <div className='h-1.5 rounded-full bg-muted/80' />
                </div>

                <div className='flex flex-col divide-y divide-border/60'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='flex items-center gap-4 py-3'>
                            <div className='aspect-2/3 w-12 shrink-0 rounded-lg bg-muted animate-pulse' style={{ animationDelay: `${i * 50}ms` }} />
                            <div className='flex flex-col gap-1.5 flex-1'>
                                <div className='h-3.5 w-40 bg-muted animate-pulse rounded' />
                                <div className='h-3 w-16 bg-muted/60 animate-pulse rounded' />
                            </div>
                            <div className='h-5 w-28 bg-muted/60 animate-pulse rounded shrink-0' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
