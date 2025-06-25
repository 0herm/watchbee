'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createList, deleteList, getAllLists } from '@/utils/api'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page() {
    const [lists, setLists] = useState<ListProps[]>([])
    const [filteredLists, setFilteredLists] = useState<ListProps[]>(lists)
    const [listExists, setListExists] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        async function fetchLists() {
            const data = await getAllLists()
            if (Array.isArray(data)) {
                setLists(data)
            } else {
                console.error('Unexpected data format')
            }
        }
        fetchLists()
    }, [])

    useEffect(() => {
        if (search.trim() !== '') {
            const filtered = lists.filter((list) =>
                list.name.toLowerCase().includes(search.toLowerCase())
            )
            setFilteredLists(filtered)
            setListExists(filtered.some((list) => list.name.toLowerCase() === search.toLowerCase()))
        } else {
            setFilteredLists(lists)
            setListExists(false)
        }
    }, [search, lists])

    async function handleCreateList(name: string) {
        const result = await createList(name)
        if (result) {
            setLists([...lists, { id: result.id, name: result.name, created_at: result.created_at }])
        }
    }

    async function handleDeleteList(listID: number) {
        const result = await deleteList(listID)
        if (result) {
            setLists(lists.filter((list) => list.id !== listID))
        }
    }

    return (
        <div className='relative w-full h-full flex items-center justify-center'>
            <div className='absolute left-[2rem] top-0'>
                <Link href='/account' className='flex items-center text-white/80 hover:text-white transition-colors'>
                    <ArrowLeft />
                    <span>Back</span>
                </Link>
            </div>
            <div className='w-full max-w-[30rem] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] shadow-lg'>
                <h1 className='text-xl font-bold mb-[1rem] text-white/90'>Manage Lists</h1>
                <div className='w-full flex xs:flex-row flex-col gap-[1rem]'>
                    <Input
                        className='mb-[1rem]'
                        type='text'
                        placeholder='Search lists'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {!listExists && search.trim() !== '' &&
                        <Button size='sm' variant='default' onClick={() => handleCreateList(search)}>
                            Create
                        </Button>
                    }
                </div>
                <div className='pt-[1rem] space-y-[0.5rem]'>
                    {filteredLists.map((list) => (
                        <div key={list.id} className='flex items-center justify-between'>
                            <span className='capitalize'>{list.name}</span>
                            <Button className='cursor-pointer' size='sm' variant='destructive' onClick={() => handleDeleteList(list.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}