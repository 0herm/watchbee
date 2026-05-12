import MediaPage from '@/components/mediaPage/mediaPage'
import { getDetailsMovie } from '@/utils/tmdbApi'

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    const { data, error } = await getDetailsMovie(id)

    if (error || !data) throw new Error('Error loading movie')
    return <MediaPage item={data} media='movie' />
}
