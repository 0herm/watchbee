import config from '@config'
import Image from 'next/image'

type MediaPageProp = {
    item: MovieDetailsProp | ShowDetailsProp
    media: 'movie' | 'show'
}

export default async function mediaPage({ item, media }: MediaPageProp) {
    const customOrder       = ['flatrate', 'rent', 'buy']
    const providers         = Object.fromEntries(Object.entries(item['watch/providers']?.results[config.setting.REGION] || {}).filter(([key]) => key !== 'link'))
    const sortedProviders   = customOrder.reduce((item, key) => (key in providers ? { ...item, [key]: providers[key] } : item), {})
    
    return (
        <div className='w-full h-full'>
            <div className='relative w-full h-[24rem] flex items-center'>
                <div className='absolute w-full h-full'>
                    <Image
                        src={`${config.url.IMAGE_URL}${item.backdrop_path}`}
                        alt={''}
                        className='object-cover blur-[0.6rem] opacity-70'
                        fill
                    />
                </div>
                <div className='w-full h-full flex flex-col xs:flex-row gap-[1rem] items-center pt-[1rem] xs:p-0 z-10'>
                    <div className='relative aspect-[2/3] w-auto h-[60%] xs:h-[80%]'>
                        <Image
                            src={`${config.url.IMAGE_URL}${item.poster_path}`}
                            alt={''}
                            className='object-contain rounded-sm'
                            fill
                        />
                    </div>
                    <div className='w-full h-[80%] flex justify-center xs:justify-start'>
                        <h1 className='text-2xl'>{media === 'movie' ? (item as MovieDetailsProp).original_title : (item as ShowDetailsProp).name}</h1>
                    </div>
                </div>
            </div>
            <div className='p-4'>
                <h1 className='text-lg font-semibold mb-2'>Where to watch {media === 'movie' ? (item as MovieDetailsProp).original_title : (item as ShowDetailsProp).name}</h1>
                {Object.keys(sortedProviders).length > 0 ? (
                    <ul className='flex flex-col gap-[1rem]'>
                        {Object.entries(sortedProviders).map(([key, value]) => (
                            <li key={key}>
                                <h1 className='capitalize'>{key === 'flatrate' ? 'Subscription' : key}:</h1>
                                <div className='flex flex-row gap-[1rem] w-full overflow-x-scroll noscroll'>
                                    {Array.isArray(value) &&
                                        value.map((provider, index) => (
                                            <div key={index} className='relative w-[3rem] h-[3rem] flex-shrink-0'>
                                                <Image
                                                    src={`${config.url.IMAGE_URL}${provider.logo_path}`}
                                                    alt={''}
                                                    className='object-contain rounded-sm'
                                                    fill
                                                />
                                            </div>
                                        ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No watch providers available</p>
                )}
            </div>
        </div>
    )
}
