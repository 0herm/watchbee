'use client'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { useState } from 'react'
import { addMedia, removeMedia } from '@/utils/api'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popoverdialog'

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
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const [selectedList, setSelectedList] = useState<string | null>(null)
    const [selectedListID, setSelectedListID] = useState<number | null>(null)


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

    return (
        <DialogContent className='sm:max-w-md'>
            <DialogHeader>
                <DialogTitle>Manage Media in Lists</DialogTitle>
                <DialogDescription>Search for a list to add or remove the media from existing lists.</DialogDescription>
            </DialogHeader>
            <div className='space-y-[2rem]'>
                <div className='w-full flex xs:flex-row flex-col gap-[1rem]'>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant='outline'
                                role='combobox'
                                className='w-full xs:max-w-[13rem] justify-between'
                            >
                                {selectedList || 'Select list'}
                                <ChevronsUpDown className='opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full xs:max-w-[13rem] p-0 z-[100]'>
                            <Command>
                                <CommandInput placeholder='Search lists' className='h-[2.25rem]' />
                                <CommandList>
                                    <CommandEmpty className='py-[1rem] text-center text-sm'>No lists found.</CommandEmpty>
                                    <CommandGroup>
                                        {lists.map((list) => (
                                            <CommandItem
                                                key={list.id}
                                                value={String(list.id)}
                                                onSelect={() => {
                                                    setSelectedList(list.name)
                                                    setSelectedListID(list.id)
                                                    setPopoverOpen(false)
                                                }}
                                            >
                                                {list.name}
                                                <Check className={`ml-auto ${selectedListID === list.id ? 'opacity-100' : 'opacity-0'}`} />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    
                    {selectedListID && (
                        currentLists.find((list) => list.id === selectedListID) ? (
                            <Button size='sm' variant='destructive' onClick={() => handleRemoveFromList(selectedListID)}>
                                Remove
                            </Button>
                        ) : (
                            <Button size='sm' variant='default' onClick={() => handleAddToList(selectedListID)}>
                                Add
                            </Button>
                        )
                    )}
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