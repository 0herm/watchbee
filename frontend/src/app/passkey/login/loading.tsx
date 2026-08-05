export default function Loading() {
    return (
        <div className='relative w-full max-w-[22rem] flex flex-col items-center gap-14 px-6'>
            <div className='flex flex-col items-center gap-2.5'>
                <div className='w-14 h-14 rounded-[18px] bg-muted animate-pulse' />
                <div className='h-6 w-32 bg-muted/80 animate-pulse rounded-lg' />
                <div className='h-3.5 w-48 bg-muted/50 animate-pulse rounded' />
            </div>
            <div className='w-full flex flex-col gap-3'>
                <div className='h-[3.25rem] w-full bg-muted/70 animate-pulse rounded-2xl' />
                <div className='h-3 w-40 mx-auto bg-muted/40 animate-pulse rounded' />
            </div>
        </div>
    )
}
