import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/passkey/register', '/passkey/login']

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/sw.js') ||
        pathname.startsWith('/icons') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    const sessionToken = request.cookies.get('session')?.value

    if (!sessionToken) {
        const url = request.nextUrl.clone()
        url.pathname = '/passkey/login'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
