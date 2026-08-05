import PageContainer from '@/components/pageContainer'

export default function Loading() {
    return (
        <PageContainer className='flex flex-col gap-6 w-full'>
            <div className='flex items-center justify-between gap-4'>
                <div className='h-8 w-40 bg-muted animate-pulse rounded-lg' />
                <div className='h-9 w-44 bg-muted/70 animate-pulse rounded-xl' />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5'>
                {Array.from({ length: 12 }, (_, i) => (
                    <div
                        key={i}
                        className='h-24 rounded-2xl bg-muted animate-pulse'
                        style={{ animationDelay: `${i * 25}ms` }}
                    />
                ))}
            </div>
        </PageContainer>
    )
}
