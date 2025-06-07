import { SquareCheckBig } from 'lucide-react'

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
import { getAllLists } from '@/utils/api'

export default async function WatchTool() {
    const lists = await getAllLists()
    
    if (typeof lists === 'string') {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='secondary' className='w-[2.5rem] h-[2.5rem]'>
                        <SquareCheckBig className='stroke-white p-[0.3rem] size-full w-[2rem] h-[2rem]' />
                    </Button>
                </DialogTrigger>

                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Watchlist</DialogTitle>
                        <DialogDescription>
                            No lists available.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary' className='w-[2.5rem] h-[2.5rem]'>
                    <SquareCheckBig className='stroke-white p-[0.3rem] size-full w-[2rem] h-[2rem]' />
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Watchlist</DialogTitle>
                    <DialogDescription>
                        Edit the watchlists
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <label className='block text-sm font-medium mb-2'>
                        Select a Watchlist
                    </label>
                    <Select>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a Watchlist' />
                        </SelectTrigger>
                        <SelectContent>
                            {lists.map((list) => (
                                <SelectItem key={list.id} value={String(list.id)}>
                                    {list.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter className='sm:justify-start'>
                    <Button type='submit'>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
