export const dynamic = 'force-dynamic'

import { getAllLists, getMediaByListId } from '@/utils/api'

export default async function Page() {
    const lists = await getAllLists()

    const listsWithMedia = await Promise.all(
        (Array.isArray(lists) ? lists : []).map(async (list) => {
            const media = await getMediaByListId(list.id)
            return { ...list, media }
        })
    )

    return (
        <div>
            {listsWithMedia.map((list) => (
                <div key={list.id}>
                    <h1>{list.name}</h1>
                    <ul>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {Array.isArray(list.media) && list.media.map((media: any) => (
                            <li key={media.id}>
                                <strong>{media.title}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}