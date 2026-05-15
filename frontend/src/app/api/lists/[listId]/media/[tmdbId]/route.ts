import { checkMediaInList, removeMedia } from '@/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ listId: string; tmdbId: string }> }) {
    const { listId, tmdbId } = await params
    return NextResponse.json(await checkMediaInList(Number(tmdbId), Number(listId)))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ listId: string; tmdbId: string }> }) {
    const { listId, tmdbId } = await params
    return NextResponse.json(await removeMedia(Number(tmdbId), Number(listId)))
}
