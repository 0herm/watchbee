'use server'

import { updateUser } from '@/utils/api'

export async function subscribeUser(sub: PushSubscription) {
    const { data, error } = await updateUser(1, { subscription: JSON.stringify(sub) })
    if (error) return { success: false, error }
    return data ? { success: true } : { success: false, error: 'Failed to save subscription' }
}

export async function unsubscribeUser() {
    const { data, error } = await updateUser(1, { subscription: null })
    if (error) return { success: false, error }
    return data ? { success: true } : { success: false, error: 'Failed to remove subscription' }
}
