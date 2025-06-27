import config from '@config'
import LoadImage from '@components/loadImage/loadimage'
import { Globe, Star } from 'lucide-react'
import Link from 'next/link'
import ListTool from '../dialog/dialog'
import { getAllLists } from '@/utils/api'
import WatchedTool from '../dialog/watcheddialog'

type MediaPageProps = {
    item: MovieDetailsProps | ShowDetailsProps
    media: 'movie' | 'show'
}

export default async function mediaPage({ item, media }: MediaPageProps) {
    const customOrder       = ['flatrate', 'rent', 'buy']
    const providers         = Object.fromEntries(Object.entries(item['watch/providers']?.results[config.setting.REGION] || {}).filter(([key]) => key !== 'link'))
    const sortedProviders   = customOrder.reduce((item, key) => (key in providers ? { ...item, [key]: providers[key] } : item), {})    // Format release date
    const releaseDate = media === 'movie' 
        ? new Date((item as MovieDetailsProps).release_date).toLocaleDateString(config.setting.LANGUAGE)
        : new Date((item as ShowDetailsProps).first_air_date).toLocaleDateString(config.setting.LANGUAGE)

    const title = media === 'movie' ? (item as MovieDetailsProps).title : (item as ShowDetailsProps).name
    const originalTitle = media === 'movie' ? (item as MovieDetailsProps).original_title : (item as ShowDetailsProps).original_name

    const listsData = await getAllLists()
    const lists: ListProps[] = Array.isArray(listsData) ? listsData : []
    

    return (
        <div className='w-full h-full'>
            <div className='relative w-full h-full flex items-end'>
                <div className='absolute w-full h-full top-0'>
                    <LoadImage 
                        source={`${config.url.IMAGE_URL}${item.backdrop_path}`}
                        error={item.backdrop_path}
                        className='object-cover w-full h-full blur-[0.6rem] opacity-50'
                        fill={true} 
                    />
                </div>
                <div className='container mx-auto w-full z-10 py-[3rem] px-[1rem]'>
                    <div className='flex flex-col md:flex-row gap-[2rem]'>
                        <div className='relative aspect-[2/3] w-[12.5rem] md:w-[15rem] rounded-lg overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0 mx-auto md:mx-0'>
                            <LoadImage 
                                source={`${config.url.IMAGE_URL}${item.poster_path}`}
                                error={item.poster_path}
                                className='object-cover'
                                fill={true} 
                            />
                        </div>
                        <div className='flex flex-col md:pt-[4rem]'>
                            <div className='space-y-[1rem]'>
                                <h1 className='text-3xl md:text-5xl font-bold text-center md:text-left'>{title}</h1>
                                {originalTitle !== title && (
                                    <h2 className='text-xl opacity-75 text-center md:text-left'>{originalTitle}</h2>
                                )}
                                <div className='flex flex-wrap items-center justify-center md:justify-start gap-[0.5rem] text-sm md:text-base'>
                                    <span className='text-white/90'>{releaseDate}</span>
                                    <span className='inline-block w-[0.375rem] h-[0.375rem] bg-white/50 rounded-full'></span>
                                    <div className='flex items-center gap-[0.25rem]'>
                                        <Star className='h-4 w-4 fill-yellow-400 stroke-1 stroke-yellow-400' />
                                        <span className='font-medium'>{item.vote_average.toFixed(1)}/10</span>
                                    </div>
                                </div>
                                {item.tagline && (
                                    <p className='text-lg md:text-xl italic text-white/80 text-center md:text-left'>'{item.tagline}'</p>
                                )}
                                <div className='flex flex-wrap justify-center md:justify-start gap-[0.5rem]'>
                                    {item.genres.map(genre => (
                                        <span key={genre.id} className='px-[0.75rem] py-[0.25rem] bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm border border-white/10 hover:bg-white/20 transition-colors duration-200'>
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                                <div className='flex justify-center md:justify-start gap-[0.5rem]'>
                                    <ListTool tmdbId={item.id} mediaType={media} lists={lists} />
                                    <WatchedTool tmdbID={item.id} mediaType={media} media={item} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-[1rem] py-[2rem]'>
                <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] mb-[2rem] shadow-lg'>
                    <h2 className='text-3xl font-bold mb-[1rem] text-white/90'>Description</h2>
                    <p className='text-lg leading-relaxed text-white/80'>{item.overview || 'No description available.'}</p>
                </div>

                <div className='mb-[2rem]'>
                    <h2 className='text-3xl font-bold mb-[1.5rem] text-white/90'>Where to Watch</h2>
                    {Object.keys(sortedProviders).length > 0 ? (
                        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] shadow-lg'>
                            <ul className='flex flex-col gap-[1.5rem]'>
                                {Object.entries(sortedProviders).map(([key, value]) => (
                                    <li key={key}>
                                        <div className='flex items-center gap-[0.5rem]'>
                                            <h3 className='text-xl font-bold capitalize text-white/90'>
                                                {key === 'flatrate' ? 'Subscription' : key}
                                            </h3>
                                        </div>
                                        <div className='flex flex-row gap-[1rem] w-full overflow-x-auto p-[1rem]'>
                                            {Array.isArray(value) &&
                                                value.map((provider, index) => (
                                                    <div key={index} className='group flex flex-col items-center'>
                                                        <div className='relative w-[4rem] h-[4rem] flex-shrink-0 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-105'>
                                                            <LoadImage 
                                                                source={`${config.url.IMAGE_URL}${provider.logo_path}`}
                                                                error={provider.logo_path}
                                                                className='object-cover'
                                                                fill={true} 
                                                            />
                                                        </div>
                                                        <span className='text-sm mt-[0.5rem] text-center text-white/80 max-w-[4.5rem] truncate transition-colors duration-200 group-hover'>{provider.provider_name}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] shadow-lg text-center'>
                            <p className='text-lg text-white/70'>No watch providers available for your region.</p>
                        </div>
                    )}
                </div>

                {media === 'show' && (item as ShowDetailsProps).seasons.length > 0 && (
                    <div className='mb-[2rem]'>
                        <h2 className='text-3xl font-bold mb-[1.5rem] text-white/90'>Seasons</h2>
                        <div className='relative'>
                            <div className='flex overflow-x-auto pb-[1.5rem] gap-[1rem] snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
                                {(item as ShowDetailsProps).seasons.map(season => (
                                    <div key={season.id} className='cursor-pointer flex-none w-[10rem] sm:w-[11.25rem] md:w-[12.5rem] snap-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow hover:shadow-lg hover:bg-white/10 transition-all duration-200'>
                                        <div className='relative aspect-[2/3] w-full'>
                                            <LoadImage 
                                                source={season.poster_path ? `${config.url.IMAGE_URL}${season.poster_path}` : ''}
                                                error={season.poster_path}
                                                className='object-cover'
                                                fill={true} 
                                            />
                                        </div>
                                        <div className='p-[0.75rem]'>
                                            <h3 className='font-medium text-sm mb-[0.25rem] truncate'>{season.name}</h3>
                                            <div className='text-xs text-white/70'>
                                                <span className='bg-white/10 px-[0.375rem] py-[0.125rem] rounded mr-[0.25rem]'>Eps: {season.episode_count}</span>
                                                <span>{season.air_date?.split('-')[0] || 'TBA'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className='mb-[2rem]'>
                    <h2 className='text-3xl font-bold mb-[1.5rem] text-white/90'>Details</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]'>
                        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] shadow-lg'>
                            <h3 className='text-xl font-bold mb-[1rem] text-white/90'>General Information</h3>
                            <ul className='space-y-[0.75rem] text-white/80'>
                                <ListItem attribute='Status' value={item.status} />
                                <ListItem attribute='Language' value={item.original_language.toUpperCase()} />
                                <ListItem attribute='Popularity' value={item.popularity.toFixed(1)} />
                                {media === 'movie' ? (
                                    <>
                                        <ListItem attribute='Runtime' value={(item as MovieDetailsProps).runtime && (item as MovieDetailsProps).runtime} suffix='minutes' />
                                        <ListItem attribute='Budget' value={(item as MovieDetailsProps).budget > 0 && (item as MovieDetailsProps).budget.toLocaleString(config.setting.LANGUAGE)} suffix='$' />
                                        <ListItem attribute='Revenue' value={(item as MovieDetailsProps).revenue > 0 && (item as MovieDetailsProps).revenue.toLocaleString(config.setting.LANGUAGE)} suffix='$' />
                                        <ListItem attribute='IMDB' value={(item as MovieDetailsProps).imdb_id} />
                                    </>
                                ) : (
                                    <>
                                        <ListItem attribute='Seasons' value={(item as ShowDetailsProps).number_of_seasons} />
                                        <ListItem attribute='Episodes' value={(item as ShowDetailsProps).number_of_episodes} />
                                        <ListItem attribute='First Air' value={new Date ((item as ShowDetailsProps).first_air_date).toLocaleDateString(config.setting.LANGUAGE)} />
                                        <ListItem attribute='Last Air' value={new Date ((item as ShowDetailsProps).last_air_date).toLocaleDateString(config.setting.LANGUAGE)} />
                                        <ListItem attribute='In Production' value={(item as ShowDetailsProps).in_production ? 'Yes' : 'No'} />
                                        <ListItem attribute='Runtime' value={(item as ShowDetailsProps).episode_run_time?.length > 0 && (item as ShowDetailsProps).episode_run_time.join(', ')} suffix='minutes' />
                                        <ListItem attribute='Type' value={(item as ShowDetailsProps).type} />
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] shadow-lg'>
                            <h3 className='text-xl font-bold mb-[1rem] text-white/90'>Production Information</h3>

                            <InfoSection title='Production Companies' items={item.production_companies} />
                            <InfoSection title='Production Countries' items={item.production_countries} />
                            <InfoSection title='Spoken Languages' items={item.spoken_languages.map(lang => ({ id: lang.iso_639_1, name: lang.english_name }))} />

                            {media === 'show' && (
                                <>
                                    <InfoSection title='Networks' items={(item as ShowDetailsProps).networks} />
                                    <InfoSection title='Created By' items={(item as ShowDetailsProps).created_by} />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {item.homepage && (
                    <div className='mb-[2rem] flex justify-center md:justify-start'>
                        <Link 
                            href={item.homepage}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center px-[1.5rem] py-[0.75rem] bg-gradient-to-r from-blue-600 to-blue-500 rounded-full font-medium shadow-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5'
                        >
                            <Globe className='h-[1.25rem] w-[1.25rem] mr-[0.5rem]' />
                            Visit Official Website
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

type ListItemProps = {
    attribute: string
    value: string | number | null | boolean | undefined
    suffix?: string
}

function ListItem({ attribute, value, suffix }: ListItemProps) {
    return (
        value &&
        <li className='flex items-center'>
            <span className='font-medium bg-white/10 px-[0.5rem] py-[0.25rem] rounded mr-[0.5rem] text-xs'>{attribute}</span>
            {value} {suffix}
        </li>
    )
}

type InfoSectionProps = {
    title: string
    items: Array<{id?: number | string, name: string}> | undefined
}

function InfoSection({ title, items }: InfoSectionProps) {
    if (!items?.length) return null
    
    return (
        <div className='mb-[0.75rem]'>
            <h4 className='font-medium mb-[0.25rem]'>{title}:</h4>
            <ul className='list-disc pl-[1.25rem]'>
                {items.map((item, i) => (
                    <li key={item.id || i}>{item.name}</li>
                ))}
            </ul>
        </div>
    )
}