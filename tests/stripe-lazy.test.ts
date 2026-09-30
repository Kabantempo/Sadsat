import { describe, it, expect, afterEach, vi } from 'vitest'

const env = { ...process.env }
afterEach(() => { process.env = { ...env }; vi.resetModules() })

describe('client Stripe paresseux', () => {
  it('se charge sans clé (build Vercel / CI)', async () => {
    delete process.env.STRIPE_SECRET_KEY
    await expect(import('@/lib/stripe')).resolves.toBeDefined()
  })
  it('échoue clairement seulement à l\'utilisation sans clé', async () => {
    delete process.env.STRIPE_SECRET_KEY
    const { stripe } = await import('@/lib/stripe')
    expect(() => stripe.checkout).toThrow(/STRIPE_SECRET_KEY/)
  })
  it('donne accès à l\'API avec une clé', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
    const { stripe } = await import('@/lib/stripe')
    expect(typeof stripe.checkout.sessions.create).toBe('function')
    expect(typeof stripe.webhooks.constructEvent).toBe('function')
  })
})
