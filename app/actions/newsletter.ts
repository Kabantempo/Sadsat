'use server'
import { subscribeNewsletter } from '@/lib/newsletter'
import { isNewsletterEnabled, setSetting } from '@/lib/settings'
import { verifyAdmin } from '@/lib/dal'
import { deleteSubscriber } from '@/lib/newsletter'
import { revalidatePath } from 'next/cache'

export type NewsletterState = { status: 'ok' | 'already' | 'disabled' | 'error' | 'invalid' } | undefined

export async function newsletterSubscribeAction(_: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return { status: 'invalid' }
  const enabled = await isNewsletterEnabled()
  if (!enabled) return { status: 'disabled' }
  const result = await subscribeNewsletter(email)
  return { status: result }
}

export async function toggleNewsletterAction(formData: FormData) {
  await verifyAdmin()
  const enabled = formData.get('enabled') === 'true'
  await setSetting('newsletter_enabled', enabled ? 'true' : 'false')
  revalidatePath('/admin/newsletter')
  revalidatePath('/', 'layout')
}

export async function deleteSubscriberAction(formData: FormData) {
  await verifyAdmin()
  const id = String(formData.get('id') ?? '')
  if (id) await deleteSubscriber(id)
  revalidatePath('/admin/newsletter')
}
