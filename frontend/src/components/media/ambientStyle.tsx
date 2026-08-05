import { getAmbientColor } from '@/utils/ambient'

export default async function AmbientStyle({ scope, path }: { scope: number; path: string | null | undefined }) {
    const ambient = await getAmbientColor(path)
    if (!ambient) return null
    return <style>{`[data-ambient="${scope}"]{--ambient:${ambient}}`}</style>
}
