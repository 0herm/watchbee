import PageContainer from '@/components/pageContainer'

function SkeletonRow({ titleW, count = 7 }: { titleW: string; count?: number }) {
    return (
        <div className='flex flex-col gap-3'>
            <div className={`h-2.5 ${titleW} bg-muted animate-pulse rounded shrink-0`} />
            <div className='-mx-5 sm:-mx-6 px-5 sm:px-6 flex gap-3 overflow-hidden'>
                {Array.from({ length: count }, (_, i) => (
                    <div
                        key={i}
                        className='w-[clamp(7.5rem,20vw,11rem)] shrink-0 aspect-[2/3] rounded-xl bg-muted animate-pulse'
                        style={{ animationDelay: `${i * 60}ms` }}
                    />
                ))}
            </div>
        </div>
    )
}

export default function Loading() {
    return (
        <PageContainer className='flex flex-col gap-10'>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2.5'>
                    <div className='h-8 w-8 rounded-xl bg-muted animate-pulse' />
                    <div className='h-7 w-40 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='h-2.5 w-72 max-w-full bg-muted animate-pulse rounded' />
            </div>
            <SkeletonRow titleW='w-40' />
            <SkeletonRow titleW='w-52' count={5} />
            <SkeletonRow titleW='w-32' />
            <SkeletonRow titleW='w-28' />
        </PageContainer>
    )
}
