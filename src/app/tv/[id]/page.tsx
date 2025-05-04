import MediaPage from "@/components/mediaPage/mediaPage";
import { getDetailsShow } from "@/utils/api";

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    const result = await getDetailsShow(id)
    
    if (typeof result === 'string') {
        return (
            <p>Error loading TV show</p>
        )
    }
    
    return (
        <MediaPage item={result} media='show' />
    )
}