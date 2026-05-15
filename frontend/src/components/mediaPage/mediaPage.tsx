import config from '@config'
import LoadImage from '@components/loadImage/loadimage'
import { Globe, Star } from 'lucide-react'
import Link from 'next/link'
import ListTool from '../dialog/dialog'
import WatchedTool from '../dialog/watcheddialog'

type MediaPageProps = {
    item: MovieDetailsProps | ShowDetailsProps
    media: 'movie' | 'show'
}

export default function mediaPage({ item, media }: MediaPageProps) {
    const customOrder = ['flatrate', 'rent', 'buy']
    const regionProviders = (item['watch/providers']?.results[config.setting.REGION] ?? {}) as Record<string, unknown>
    const sortedProviders = Object.fromEntries(
        customOrder.filter((k) => k in regionProviders).map((k) => [k, regionProviders[k]])
    )

    const releaseDate =
        media === 'movie'
            ? new Date((item as MovieDetailsProps).release_date).toLocaleDateString(config.setting.LANGUAGE)
            : new Date((item as ShowDetailsProps).first_air_date).toLocaleDateString(config.setting.LANGUAGE)

    const title = media === 'movie' ? (item as MovieDetailsProps).title : (item as ShowDetailsProps).name
    const originalTitle =
        media === 'movie' ? (item as MovieDetailsProps).original_title : (item as ShowDetailsProps).original_name

    return (
        <div className='w-full flex flex-col gap-6'>

            <div className='relative -mx-4 sm:-mx-5 overflow-hidden min-h-72 sm:min-h-[26rem] flex flex-col justify-end'>
                <div className='absolute inset-0'>
                    <LoadImage
                        source={`${config.url.IMAGE_URL}${item.backdrop_path}`}
                        error={item.backdrop_path}
                        className='object-cover w-full h-full blur-md opacity-25 scale-105'
                        fill={true}
                    />
                    <div className='absolute inset-0 bg-black/55' />
                    <div className='absolute inset-0 bg-linear-to-b from-transparent from-20% via-background/60 via-75% to-background' />
                    <div className='absolute inset-0 bg-linear-to-r from-background/30 to-transparent hidden sm:block' />
                </div>

                <div className='relative z-10 px-4 sm:px-5 pb-8 pt-6'>
                    <div className='flex flex-col items-center sm:flex-row sm:items-end gap-5 sm:gap-8'>

                        <div className='relative aspect-[2/3] w-32 sm:w-44 md:w-52 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/15 shrink-0'>
                            <LoadImage
                                source={`${config.url.IMAGE_URL}${item.poster_path}`}
                                error={item.poster_path}
                                className='object-cover'
                                fill={true}
                            />
                        </div>

                        <div className='flex flex-col gap-3 sm:pb-1 text-center sm:text-left flex-1'>

                            <div className='flex justify-center sm:justify-start'>
                                <span className='text-[10px] font-bold tracking-widest text-brand uppercase'>
                                    {media === 'movie' ? '● Movie' : '● TV Series'}
                                </span>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <h1 className='text-3xl sm:text-4xl font-bold leading-tight text-white drop-shadow-sm'>
                                    {title}
                                </h1>
                                {originalTitle !== title && (
                                    <p className='text-sm text-white/55'>{originalTitle}</p>
                                )}
                            </div>

                            <div className='flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-white/75'>
                                <span>{releaseDate}</span>
                                <span className='w-1 h-1 bg-white/30 rounded-full' />
                                <div className='flex items-center gap-1'>
                                    <Star className='h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400' />
                                    <span className='font-semibold text-white'>{item.vote_average.toFixed(1)}</span>
                                    <span className='text-white/40 text-xs'>/10</span>
                                </div>
                            </div>

                            {item.tagline && (
                                <p className='text-sm italic text-white/50 text-center sm:text-left'>
                                    &ldquo;{item.tagline}&rdquo;
                                </p>
                            )}

                            {item.genres.length > 0 && (
                                <div className='flex flex-wrap justify-center sm:justify-start gap-1.5'>
                                    {item.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className='px-2.5 py-0.5 bg-white/10 border border-white/15 rounded-full text-xs text-white/80 hover:bg-white/20 transition-colors'
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className='flex justify-center sm:justify-start gap-2 pt-1'>
                                <ListTool tmdbId={item.id} mediaType={media} />
                                <WatchedTool tmdbID={item.id} mediaType={media} media={item} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {item.overview && (
                <section className='flex flex-col gap-2.5'>
                    <h2 className='text-sm font-semibold tracking-tight text-foreground'>Overview</h2>
                    <div className='bg-card border border-border rounded-xl p-4 shadow-sm'>
                        <p className='text-sm leading-relaxed text-muted-foreground'>{item.overview}</p>
                    </div>
                </section>
            )}

            <section className='flex flex-col gap-2.5'>
                <h2 className='text-sm font-semibold tracking-tight text-foreground'>Where to Watch</h2>
                {Object.keys(sortedProviders).length > 0 ? (
                    <div className='bg-card border border-border rounded-xl overflow-hidden shadow-sm'>
                        {Object.entries(sortedProviders).map(([key, value], idx, arr) => (
                            <div
                                key={key}
                                className={`px-4 py-3 ${idx < arr.length - 1 ? 'border-b border-border' : ''}`}
                            >
                                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                                    {key === 'flatrate' ? 'Subscription' : key}
                                </p>
                                <div className='flex flex-row gap-3 overflow-x-auto noscroll pb-0.5'>
                                    {Array.isArray(value) &&
                                        value.map((provider, i) => (
                                            <div key={i} className='flex flex-col items-center gap-1.5 shrink-0'>
                                                <div className='relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-border shadow-sm'>
                                                    <LoadImage
                                                        source={`${config.url.IMAGE_URL}${provider.logo_path}`}
                                                        error={provider.logo_path}
                                                        className='object-cover'
                                                        fill={true}
                                                    />
                                                </div>
                                                <span className='text-[10px] text-muted-foreground max-w-14 truncate text-center leading-tight'>
                                                    {provider.provider_name}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='bg-card border border-border rounded-xl p-4 shadow-sm'>
                        <p className='text-sm text-muted-foreground'>No providers available for your region.</p>
                    </div>
                )}
            </section>

            {media === 'show' && (item as ShowDetailsProps).seasons.length > 0 && (
                <section className='flex flex-col gap-2.5'>
                    <h2 className='text-sm font-semibold tracking-tight text-foreground'>Seasons</h2>
                    <div className='-mx-4 sm:-mx-5 px-4 sm:px-5 flex gap-3 overflow-x-auto noscroll pb-1'>
                        {(item as ShowDetailsProps).seasons.map((season) => (
                            <div
                                key={season.id}
                                className='flex-none w-32 sm:w-36 bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-brand/40 transition-colors'
                            >
                                <div className='relative aspect-[2/3] w-full bg-muted'>
                                    <LoadImage
                                        source={season.poster_path ? `${config.url.IMAGE_URL}${season.poster_path}` : ''}
                                        error={season.poster_path}
                                        className='object-cover'
                                        fill={true}
                                    />
                                </div>
                                <div className='p-2.5 flex flex-col gap-0.5'>
                                    <p className='font-medium text-xs leading-snug truncate'>{season.name}</p>
                                    <p className='text-[10px] text-muted-foreground'>
                                        {season.episode_count} eps · {season.air_date?.split('-')[0] || 'TBA'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className='flex flex-col gap-2.5'>
                <h2 className='text-sm font-semibold tracking-tight text-foreground'>Details</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>

                    <div className='bg-card border border-border rounded-xl overflow-hidden shadow-sm'>
                        <p className='px-4 pt-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border'>
                            General
                        </p>
                        <div className='px-4 divide-y divide-border'>
                            <DetailRow label='Status' value={item.status} />
                            <DetailRow label='Language' value={item.original_language.toUpperCase()} />
                            <DetailRow label='Popularity' value={item.popularity.toFixed(0)} />
                            {media === 'movie' ? (
                                <>
                                    <DetailRow
                                        label='Runtime'
                                        value={(item as MovieDetailsProps).runtime
                                            ? `${(item as MovieDetailsProps).runtime} min`
                                            : null}
                                    />
                                    <DetailRow
                                        label='Budget'
                                        value={(item as MovieDetailsProps).budget > 0
                                            ? `$${(item as MovieDetailsProps).budget.toLocaleString(config.setting.LANGUAGE)}`
                                            : null}
                                    />
                                    <DetailRow
                                        label='Revenue'
                                        value={(item as MovieDetailsProps).revenue > 0
                                            ? `$${(item as MovieDetailsProps).revenue.toLocaleString(config.setting.LANGUAGE)}`
                                            : null}
                                    />
                                    <DetailRow label='IMDB' value={(item as MovieDetailsProps).imdb_id} />
                                </>
                            ) : (
                                <>
                                    <DetailRow label='Seasons' value={(item as ShowDetailsProps).number_of_seasons} />
                                    <DetailRow label='Episodes' value={(item as ShowDetailsProps).number_of_episodes} />
                                    <DetailRow
                                        label='First Air'
                                        value={new Date((item as ShowDetailsProps).first_air_date).toLocaleDateString(config.setting.LANGUAGE)}
                                    />
                                    <DetailRow
                                        label='Last Air'
                                        value={new Date((item as ShowDetailsProps).last_air_date).toLocaleDateString(config.setting.LANGUAGE)}
                                    />
                                    <DetailRow
                                        label='In Production'
                                        value={(item as ShowDetailsProps).in_production ? 'Yes' : 'No'}
                                    />
                                    <DetailRow
                                        label='Runtime'
                                        value={(item as ShowDetailsProps).episode_run_time?.length > 0
                                            ? `${(item as ShowDetailsProps).episode_run_time.join(', ')} min`
                                            : null}
                                    />
                                    <DetailRow label='Type' value={(item as ShowDetailsProps).type} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className='bg-card border border-border rounded-xl overflow-hidden shadow-sm'>
                        <p className='px-4 pt-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border'>
                            Production
                        </p>
                        <div className='px-4 py-3 flex flex-col gap-4'>
                            <InfoSection title='Companies' items={item.production_companies} />
                            <InfoSection title='Countries' items={item.production_countries} />
                            <InfoSection
                                title='Languages'
                                items={item.spoken_languages.map((l) => ({ id: l.iso_639_1, name: l.english_name }))}
                            />
                            {media === 'show' && (
                                <>
                                    <InfoSection title='Networks' items={(item as ShowDetailsProps).networks} />
                                    <InfoSection title='Created By' items={(item as ShowDetailsProps).created_by} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {item.homepage && (
                <div className='flex justify-center sm:justify-start pb-2'>
                    <Link
                        href={item.homepage}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={
                            'inline-flex items-center gap-2 px-5 py-2.5 ' +
                            'bg-brand hover:bg-brand-dim active:bg-brand-dimmer ' +
                            'text-white rounded-full text-sm font-medium shadow-sm transition-colors'
                        }
                    >
                        <Globe className='h-4 w-4' />
                        Official Website
                    </Link>
                </div>
            )}
        </div>
    )
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (!value && value !== 0) return null
    return (
        <div className='flex items-center justify-between py-2.5 min-h-10'>
            <span className='text-xs text-muted-foreground shrink-0 pr-4'>{label}</span>
            <span className='text-xs font-medium text-foreground/90 text-right truncate max-w-48'>{String(value)}</span>
        </div>
    )
}

type InfoSectionProps = {
    title: string
    items: Array<{ id?: number | string; name: string }> | undefined
}

function InfoSection({ title, items }: InfoSectionProps) {
    if (!items?.length) return null
    return (
        <div className='flex flex-col gap-1.5'>
            <p className='text-xs text-muted-foreground font-medium'>{title}</p>
            <div className='flex flex-wrap gap-1'>
                {items.map((item, i) => (
                    <span key={item.id || i} className='text-xs bg-muted text-foreground/80 px-2 py-0.5 rounded-md'>
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
