import { hasCredentials } from '@/utils/auth'
import { redirect } from 'next/navigation'
import LoginClient from './client'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
    const credentialsExist = await hasCredentials()
    if (!credentialsExist) {
        redirect('/passkey/register')
    }
    return <LoginClient />
}
