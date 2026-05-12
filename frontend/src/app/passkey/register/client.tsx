'use client'

import { useState } from 'react'
import { getRegistrationOptions, verifyRegistration } from '@/utils/auth'
import { toBuffer, toBase64url } from '@/utils/passkey'
import { Clapperboard, Fingerprint } from 'lucide-react'
import { Button } from '@/ui/button'
import Link from 'next/link'

export default function RegisterClient() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleRegister() {
        setLoading(true)
        setError(null)
        try {
            const options = await getRegistrationOptions()
            const cred = await navigator.credentials.create({
                publicKey: {
                    ...options,
                    challenge: toBuffer(options.challenge),
                    user: { ...options.user, id: toBuffer(options.user.id) },
                    excludeCredentials: (options.excludeCredentials ?? []).map((c: { id: string }) => ({
                        ...c, id: toBuffer(c.id),
                    })) as PublicKeyCredentialDescriptor[],
                },
            }) as PublicKeyCredential
            const resp = cred.response as AuthenticatorAttestationResponse
            const response = {
                id: cred.id,
                rawId: toBase64url(cred.rawId),
                response: {
                    attestationObject: toBase64url(resp.attestationObject),
                    clientDataJSON: toBase64url(resp.clientDataJSON),
                },
                type: cred.type as 'public-key',
                clientExtensionResults: cred.getClientExtensionResults(),
            }
            const result = await verifyRegistration(response)
            if (result.success) {
                window.location.href = '/'
            } else {
                setError(result.error ?? 'Registration failed')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center justify-center gap-8 py-16 max-w-sm mx-auto text-center'>
            <div className='flex items-center gap-2'>
                <Clapperboard className='h-5 w-5 text-brand' />
                <span className='text-sm font-bold tracking-tight'>WatchBee</span>
            </div>

            <div className='flex flex-col items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-muted'>
                    <Fingerprint className='h-8 w-8 text-brand' />
                </div>
                <div className='flex flex-col gap-1.5'>
                    <h1 className='text-2xl font-bold'>Welcome to WatchBee</h1>
                    <p className='text-sm text-muted-foreground'>
                        Create a passkey to get started. Your passkey is stored securely on this device.
                    </p>
                </div>
            </div>
            {error && (
                <p className='text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2 w-full'>{error}</p>
            )}
            <Button
                className='w-full h-12 text-base rounded-xl gap-2'
                onClick={handleRegister}
                disabled={loading}
            >
                <Fingerprint className='h-5 w-5' />
                {loading ? 'Creating passkey…' : 'Create Passkey'}
            </Button>
            <Link href='/passkey/login' className='text-xs text-muted-foreground hover:text-foreground transition-colors'>
                Sign in with an existing passkey
            </Link>
        </div>
    )
}
