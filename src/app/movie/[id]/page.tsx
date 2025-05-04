import MediaPage from "@/components/mediaPage/mediaPage";
import { getDetailsMovie } from "@/utils/api";

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    const result = await getDetailsMovie(id)
    
    if (typeof result === 'string') {
        return (
            <p>Error loading movie</p>
        )
    }
    
    return (
        <MediaPage item={result} media='movie' />
    )
}