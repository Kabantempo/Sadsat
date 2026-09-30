import { describe, it, expect, vi, beforeEach } from 'vitest'

const { sendContactEmail } = vi.hoisted(() => ({ sendContactEmail: vi.fn() }))
vi.mock('@/lib/email', () => ({ sendContactEmail }))
vi.mock('@/lib/rate-limit', () => ({ allow: vi.fn().mockResolvedValue(true), TOO_MANY: 'trop' }))

import { sendContactAction } from '@/app/actions/contact'

const form = (extra: Record<string, string> = {}) => {
  const f = new FormData()
  f.set('name', 'Alice'); f.set('email', 'alice@example.com'); f.set('subject', 'Bonjour'); f.set('message', 'Un message assez long.')
  for (const [k, v] of Object.entries(extra)) f.set(k, v)
  return f
}

beforeEach(() => { sendContactEmail.mockReset(); sendContactEmail.mockResolvedValue(true) })

describe('formulaire de contact : piège à robots', () => {
  it('envoie le message quand le champ piège est vide', async () => {
    const res = await sendContactAction(undefined, form())
    expect(res?.success).toBe(true)
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })
  it('répond « envoyé » mais n\'envoie rien quand un robot remplit le champ piège', async () => {
    const res = await sendContactAction(undefined, form({ website: 'http://spam.example' }))
    expect(res?.success).toBe(true)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })
  it('refuse toujours un message invalide', async () => {
    const res = await sendContactAction(undefined, form({ message: 'court' }))
    expect(res?.success).toBeUndefined()
    expect(sendContactEmail).not.toHaveBeenCalled()
  })
})
