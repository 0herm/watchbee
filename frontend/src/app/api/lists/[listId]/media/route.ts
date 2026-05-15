import { addMedia } from '@/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ listId: string }> }) {
    const { listId } = await params
    const { tmdbId, type } = await req.json()
    return NextResponse.json(await addMedia(Number(tmdbId), type, Number(listId)))
}
