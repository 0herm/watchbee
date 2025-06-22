'use server'

import webpush from 'web-push'
import { getUser, updateUser } from '@/utils/api'

webpush.setVapidDetails(
    `mailto:${process.env.EMAIL}`, 
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export async function subscribeUser(sub: PushSubscription) {
    try {
        const user = await getUser()
        if (!user) {
            throw new Error('User not found')
        }

        const updatedUser = await updateUser({ subscription: JSON.stringify(sub) })
        return updatedUser ? { success: true } : { success: false, error: 'Failed to save subscription' }
    } catch (error) {
        console.error('Error saving subscription:', error)
        return { success: false, error: 'Failed to save subscription' }
    }
}

export async function unsubscribeUser() {
    try {
        const user = await getUser()
        if (!user) {
            throw new Error('User not found')
        }

        const updatedUser = await updateUser({ subscription: null })
        return updatedUser ? { success: true } : { success: false, error: 'Failed to remove subscription' }
    } catch (error) {
        console.error('Error removing subscription:', error)
        return { success: false, error: 'Failed to remove subscription' }
    }
}

export async function sendNotification(message: string) {
    let subscription: webpush.PushSubscription

    try {
        const user = await getUser()
        if (!user || !user.subscription) {
            throw new Error('No subscription available')
        }

        subscription = JSON.parse(user.subscription) as webpush.PushSubscription
    } catch (error) {
        console.error('Error retrieving subscription:', error)
        return { success: false, error: 'Failed to retrieve subscription' }
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'Test Notification',
                body: message,
                icon: '/icon.png'
            })
        )
        return { success: true }
    } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: 'Failed to send notification' }
    }
}