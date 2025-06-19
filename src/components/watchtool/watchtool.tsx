'use client'

import { useState, useEffect } from 'react'
import { SquareCheckBig, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { addMedia, removeMedia, checkMediaInList } from '@/utils/api'

type WatchToolProps = {
  tmdbId: number
  mediaType: MediaType
  lists: ListProps[]
}

export default function WatchTool({ tmdbId, mediaType, lists = [] }: WatchToolProps) {
    const [selectedListId, setSelectedListId] = useState<string>('')
    const [isInList, setIsInList] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [containingLists, setContainingLists] = useState<Array<{ id: number; name: string }>>([])
    const [checkingLists, setCheckingLists] = useState<boolean>(false)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    
    useEffect(() => {
        if (!selectedListId) return;
        
        (async () => {
            try {
                const result = await checkMediaInList(tmdbId, Number(selectedListId))
                setIsInList(!!result)
            } catch (error) {
                console.error('Error checking if media is in list:', error)
            }
        })()
    }, [tmdbId, selectedListId])

    useEffect(() => {
        if (!dialogOpen || lists.length === 0) {
            if (!dialogOpen) {
                setCheckingLists(false)
            }
            return
        }
        
        setCheckingLists(true);
        
        (async () => {
            try {
                const results = await Promise.all(
                    lists.map(async list => {
                        const isInList = await checkMediaInList(tmdbId, list.id)
                        return isInList ? list : null
                    })
                )
                setContainingLists(results.filter(Boolean) as Array<{ id: number; name: string }>)
            } catch (error) {
                console.error('Error checking lists:', error)
            } finally {
                setCheckingLists(false)
            }
        })()
    }, [tmdbId, lists, dialogOpen])
    
    async function handleToggleMedia() {
        if (!selectedListId) return
        
        setIsLoading(true)
        try {
            if (isInList) {
                await removeMedia(tmdbId, Number(selectedListId))
                setIsInList(false)
                setContainingLists(prev => prev.filter(list => list.id !== Number(selectedListId)))
            } else {
                await addMedia(tmdbId, mediaType, Number(selectedListId))
                setIsInList(true)
                const selectedList = lists.find(list => list.id === Number(selectedListId))
                if (selectedList && !containingLists.find(list => list.id === selectedList.id)) {
                    setContainingLists(prev => [...prev, selectedList])
                }
            }
        } catch (error) {
            console.error('Error toggling media in list:', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleRemoveFromList(listId: number) {
        setIsLoading(true)
        try {
            await removeMedia(tmdbId, listId)
            setContainingLists(prev => prev.filter(list => list.id !== listId))
            if (Number(selectedListId) === listId) {
                setIsInList(false)
            }
        } catch (error) {
            console.error('Error removing media from list:', error)
        } finally {
            setIsLoading(false)
        }
    }
    
    if (!Array.isArray(lists) || lists.length === 0) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='secondary' className='w-[2.5rem] h-[2.5rem]'>
                        <SquareCheckBig className='stroke-white p-[0.3rem] w-[2rem] h-[2rem] cursor-pointer'/>
                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Watchlist</DialogTitle>
                        <DialogDescription>No lists available.</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant='secondary' className='w-[2.5rem] h-[2.5rem] cursor-pointer'>
                    <SquareCheckBig className='stroke-white size-[1rem]' />
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Watchlist</DialogTitle>
                    <DialogDescription>Add or remove from your lists</DialogDescription>
                </DialogHeader>
                <div>
                    <label className='block text-sm font-medium mb-[0.5rem]'>Select a Watchlist</label>
                    <Select onValueChange={setSelectedListId} value={selectedListId}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a Watchlist' />
                        </SelectTrigger>
                        <SelectContent>
                            {lists.map((list) => (
                                <SelectItem key={list.id} value={String(list.id)}>{list.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter className='sm:justify-start'>
                    <Button 
                        onClick={handleToggleMedia} 
                        disabled={!selectedListId || isLoading}
                    >
                        {isLoading ? 'Loading...' : isInList ? 'Remove from list' : 'Add to list'}
                    </Button>
                </DialogFooter>

                <div className='mt-[4rem]'>
                    <h3 className='text-sm font-medium mb-[1rem]'>Currently in these lists:</h3>
                    {checkingLists ? (
                        <p className='text-sm text-gray-500'>Checking lists...</p>
                    ) : containingLists.length === 0 ? (
                        <p className='text-sm text-gray-500'>Not in any lists yet</p>
                    ) : (
                        <div className='space-y-[0.5rem]'>
                            {containingLists.map((list) => (
                                <div key={list.id} className='flex items-center justify-between bg-secondary/30 p-[0.5rem] rounded-md'>
                                    <span className='text-sm'>{list.name}</span>
                                    <Button 
                                        variant='ghost' 
                                        size='sm'
                                        onClick={() => handleRemoveFromList(list.id)}
                                        disabled={isLoading}
                                        className='h-[2rem] w-[2rem] p-[0rem]'
                                    >
                                        <XCircle className='h-[1rem] w-[1rem]' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}