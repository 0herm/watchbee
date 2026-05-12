import { hasCredentials } from '@/utils/auth'
import { redirect } from 'next/navigation'
import RegisterClient from './client'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
    const credentialsExist = await hasCredentials()
    if (credentialsExist) {
        redirect('/passkey/login')
    }
    return <RegisterClient />
}
