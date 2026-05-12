'use client'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Button } from '@/ui/button'
import { useEffect, useRef, useState } from 'react'
import { addMedia, removeMedia } from '@/utils/api'
import { Check, ChevronsUpDown, Search } from 'lucide-react'

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
    const [currentLists, setCurrentLists] = useState(mediaInLists)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedList, setSelectedList] = useState<{ id: number; name: string } | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filtered = lists.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        if (dropdownOpen) document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [dropdownOpen])

    async function handleAddToList(listId: number) {
        const { data, error } = await addMedia(tmdbId, mediaType, listId)
        if (error) { console.error(error); return }
        if (data) {
            setCurrentLists([...currentLists, { id: listId, name: lists.find((l) => l.id === listId)?.name || '' }])
        }
    }

    async function handleRemoveFromList(listId: number) {
        const { data, error } = await removeMedia(tmdbId, listId)
        if (error) { console.error(error); return }
        if (data) {
            setCurrentLists(currentLists.filter((l) => l.id !== listId))
        }
    }

    return (
        <DialogContent className='sm:max-w-md'>
            <DialogHeader>
                <DialogTitle>Manage Lists</DialogTitle>
                <DialogDescription>Add or remove this title from your lists.</DialogDescription>
            </DialogHeader>
            <div className='space-y-6'>
                <div className='flex gap-2 items-start'>
                    <div ref={dropdownRef} className='relative flex-1'>
                        <button
                            type='button'
                            onClick={() => setDropdownOpen((v) => !v)}
                            className={
                                'flex w-full items-center justify-between gap-2 ' +
                                'rounded-md border border-input bg-background ' +
                                'px-3 py-2 text-sm shadow-xs transition-colors ' +
                                'hover:bg-accent hover:text-accent-foreground'
                            }
                        >
                            <span className='truncate'>{selectedList?.name ?? 'Select list'}</span>
                            <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
                        </button>

                        {dropdownOpen && (
                            <div className='absolute top-full mt-1 z-[100] w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
                                <div className='flex items-center gap-2 border-b px-3 py-2'>
                                    <Search className='size-4 shrink-0 opacity-50' />
                                    <input
                                        autoFocus
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder='Search lists...'
                                        className='w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground'
                                    />
                                </div>
                                <div className='max-h-52 overflow-y-auto p-1'>
                                    {filtered.length === 0 ? (
                                        <p className='py-4 text-center text-sm text-muted-foreground'>No lists found.</p>
                                    ) : (
                                        filtered.map((list) => (
                                            <button
                                                key={list.id}
                                                type='button'
                                                onClick={() => {
                                                    setSelectedList(list)
                                                    setDropdownOpen(false)
                                                    setSearch('')
                                                }}
                                                className='flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground'
                                            >
                                                <span className='capitalize'>{list.name}</span>
                                                {selectedList?.id === list.id && <Check className='size-4' />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedList && (
                        currentLists.find((l) => l.id === selectedList.id) ? (
                            <Button size='sm' variant='destructive' onClick={() => handleRemoveFromList(selectedList.id)}>
                                Remove
                            </Button>
                        ) : (
                            <Button size='sm' onClick={() => handleAddToList(selectedList.id)}>
                                Add
                            </Button>
                        )
                    )}
                </div>

                {currentLists.length > 0 && (
                    <div>
                        <h3 className='text-sm font-semibold mb-2'>Currently in</h3>
                        <div className='space-y-2'>
                            {currentLists.map((list) => (
                                <div key={list.id} className='flex items-center justify-between'>
                                    <span className='text-sm capitalize'>{list.name}</span>
                                    <Button size='sm' variant='destructive' onClick={() => handleRemoveFromList(list.id)}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    )
}
