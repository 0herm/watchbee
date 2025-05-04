import config from "@config"
import Image from "next/image"

type MediaPageProp = {
    item: MovieDetailsProp | ShowDetailsProp
    media: "movie" | "show"
}
export default async function mediaPage({ item, media }: MediaPageProp) {
    return (
        <div className="w-full h-full">
            <div className="relative w-full h-64 md:h-96 ">
                <Image
                    src={`${config.url.IMAGE_URL}${item.backdrop_path}`}
                    alt={''}
                    className="absolute top-0 left-0 w-full h-full object-cover blur-[0.3rem] opacity-70"
                    fill
                />
            </div>
            <div className="p-4">
                <h1 className="text-lg font-semibold mb-2">Watch Providers</h1>
                {item['watch/providers']?.results[config.setting.REGION] ? (
                    <ul>
                        {Object.entries(item['watch/providers'].results[config.setting.REGION])
                            .filter(([key]) => key !== 'link')
                            .map(([key, value]) => (
                                <li key={key}>
                                    <h1 className="capitalize">{key === 'flatrate' ? 'Subscription' : key}:</h1>
                                    <div className="flex flex-row gap-[1rem]">
                                        {Array.isArray(value)
                                            && value.map((provider, index) => (
                                                <div key={index} className="relative size-[2rem]">
                                                    <Image 
                                                        src={`${config.url.IMAGE_URL}${provider.logo_path}`}
                                                        alt={''}
                                                        className="object-contain rounded-sm"
                                                        fill
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p>No watch providers available</p>
                )}
            </div>
        </div>
    );
}
