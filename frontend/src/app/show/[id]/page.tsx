import MediaPage from '@/components/mediaPage/mediaPage'
import { getDetailsShow } from '@/utils/tmdbApi'

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    const { data, error } = await getDetailsShow(id)

    if (error || !data) throw new Error('Error loading TV show')
    return <MediaPage item={data} media='show' />
}
