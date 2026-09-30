'use server'
import { isSubscribed } from '@/lib/newsletter'
import { sendNewsletterConfirmEmail } from '@/lib/email'
import { allow } from '@/lib/rate-limit'
import { isNewsletterEnabled, setSetting } from '@/lib/settings'
import { verifyAdmin } from '@/lib/dal'
import { deleteSubscriber } from '@/lib/newsletter'
import { revalidatePath } from 'next/cache'

export type NewsletterState = { status: 'ok' | 'disabled' | 'error' | 'invalid' | 'consent' | 'rate' } | undefined

export async function newsletterSubscribeAction(_: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return { status: 'invalid' }
  if (formData.get('consent') !== 'on') return { status: 'consent' }
  if (!(await allow('newsletter', 5, 60 * 60 * 1000))) return { status: 'rate' }
  const enabled = await isNewsletterEnabled()
  if (!enabled) return { status: 'disabled' }
  // Double opt-in : rien n'est enregistré avant le clic sur le lien reçu par email.
  // Réponse identique que l'adresse soit déjà inscrite ou non (pas de fuite d'information).
  if (!(await isSubscribed(email))) {
    const sent = await sendNewsletterConfirmEmail(email)
    if (!sent) return { status: 'error' }
  }
  return { status: 'ok' }
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
