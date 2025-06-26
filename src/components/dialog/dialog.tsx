'use client'

import { useState, useEffect } from 'react'
import { SquareCheckBig } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import ContentDialog from './dialogcontent'
import { checkMediaInAllLists } from '@/utils/api'
import { revalidate } from './actions'

type ListToolProps = {
  tmdbId: number
  mediaType: MediaType
  lists: ListProps[]
}

export default function ListTool({ tmdbId, mediaType, lists = [] }: ListToolProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [mediaInLists, setResult] = useState<{id: number;name: string}[] | null>(null)

    useEffect(() => {
        if (dialogOpen) {
            const fetchData = async () => {
                const data = await checkMediaInAllLists(tmdbId)
                setResult(data)
            }
            fetchData()
        }
    }, [dialogOpen, tmdbId])
    

    return (
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); revalidate('/account') }}>
            <DialogTrigger asChild>
                <Button variant='secondary' className='w-[2.5rem] h-[2.5rem] cursor-pointer'>
                    <SquareCheckBig className='stroke-white size-[1rem]' />
                </Button>
            </DialogTrigger>
            {dialogOpen && mediaInLists ? 
                (
                    <ContentDialog tmdbId={tmdbId} mediaType={mediaType} lists={lists} mediaInLists={mediaInLists} />
                ) : (
                    <DialogContent className='sm:max-w-md'>
                        <DialogHeader>
                            <DialogTitle>Watchlist</DialogTitle>
                            <DialogDescription>Loading...</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                )
            }
        </Dialog>
    )
}