'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/ui/button'
import { addMedia, removeMedia, checkMediaInList } from '@/utils/api'
import { revalidate } from './actions'

type ListToolProps = {
    tmdbId: number
    mediaType: MediaType
    lists: ListProps[]
}

export default function ListTool({ tmdbId, mediaType, lists = [] }: ListToolProps) {
    const [inList, setInList] = useState<boolean>(false)
    const listId = lists[0]?.id

    useEffect(() => {
        if (!listId) return
        const fetchData = async () => {
            const { data } = await checkMediaInList(tmdbId, listId)
            setInList(data ?? false)
        }
        fetchData()
    }, [tmdbId, listId])

    async function handleToggle() {
        if (!listId) return
        if (inList) {
            const { data, error } = await removeMedia(tmdbId, listId)
            if (error) { console.error(error); return }
            if (data) { setInList(false); revalidate('/account') }
        } else {
            const { data, error } = await addMedia(tmdbId, mediaType, listId)
            if (error) { console.error(error); return }
            if (data) { setInList(true); revalidate('/account') }
        }
    }

    return (
        <Button
            variant={inList ? 'default' : 'secondary'}
            size='icon'
            className='size-10'
            onClick={handleToggle}
        >
            <Bookmark className={`size-5${inList ? ' fill-current' : ''}`} />
        </Button>
    )
}
