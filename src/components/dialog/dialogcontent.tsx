'use client'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { useState } from 'react'
import { addMedia, removeMedia } from '@/utils/api'

type ContentDialogProps = {
    tmdbId: number
    mediaType: MediaType
    lists: ListProps[]
    mediaInLists: {
        id: number
        name: string
    }[]
}

export default function ContentDialog({ tmdbId, mediaType, lists = [], mediaInLists }: ContentDialogProps) {
    const [search, setSearch] = useState<string>('')
    const [currentLists, setCurrentLists] = useState(mediaInLists)

    async function handleAddToList(listId: number) {
        const result = await addMedia(tmdbId, mediaType, listId)
        if (result) {
            setCurrentLists([...currentLists, { id: listId, name: lists.find((list) => list.id === listId)?.name || '' }])
        }
    }

    async function handleRemoveFromList(listId: number) {
        const result = await removeMedia(tmdbId, listId)
        if (result) {
            setCurrentLists(currentLists.filter((list) => list.id !== listId))
        }
    }

    const filteredLists = lists.filter(
        (list) =>
            list.name.toLowerCase().includes(search.toLowerCase()) &&
            !currentLists.some((item) => item.id === list.id)
    )

    return (
        <DialogContent className='sm:max-w-md'>
            <DialogHeader>
                <DialogTitle>Manage Media in Lists</DialogTitle>
                <DialogDescription>Search for a list to add or remove the media from existing lists.</DialogDescription>
            </DialogHeader>
            <div className='space-y-[1rem]'>
                <Input
                    placeholder='Search lists...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full'
                />
                <div>
                    <h3 className='text-sm font-semibold'>Add to List</h3>
                    <div className='space-y-[0.5rem]'>
                        {filteredLists.map((list) => (
                            <div key={list.id} className='flex items-center justify-between'>
                                <span>{list.name}</span>
                                <Button size='sm' onClick={() => handleAddToList(list.id)}>
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className='text-sm font-semibold'>Currently in Lists</h3>
                    <div className='space-y-[0.5rem]'>
                        {currentLists.map((list) => (
                            <div key={list.id} className='flex items-center justify-between'>
                                <span>{list.name}</span>
                                <Button size='sm' variant='destructive' onClick={() => handleRemoveFromList(list.id)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}