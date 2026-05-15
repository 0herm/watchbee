import { getAllLists } from '@/utils/api'
import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json(await getAllLists())
}
