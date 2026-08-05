import PageContainer from '@/components/pageContainer'

export default function Loading() {
    return (
        <PageContainer className='flex flex-col gap-8 max-w-xl mx-auto'>
            <div className='flex flex-col gap-5'>
                <div className='h-8 w-32 bg-muted animate-pulse rounded-lg' />
                <div className='h-12 w-full bg-muted/70 animate-pulse rounded-2xl' />
            </div>
            <div className='flex flex-col gap-3'>
                <div className='h-2.5 w-24 bg-muted/50 animate-pulse rounded' />
                <div className='flex flex-wrap gap-2'>
                    {['w-20', 'w-24', 'w-16', 'w-20', 'w-28', 'w-24'].map((w, i) => (
                        <div key={i} className={`h-8 ${w} bg-muted/60 animate-pulse rounded-full`} />
                    ))}
                </div>
            </div>
        </PageContainer>
    )
}
