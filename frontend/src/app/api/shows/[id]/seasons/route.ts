import { getShowTotalSeasons } from '@/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const total = await getShowTotalSeasons(Number(id))
    return NextResponse.json({ data: total, error: null })
}
