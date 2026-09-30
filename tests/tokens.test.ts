import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => { process.env.SESSION_SECRET = 'x'.repeat(40) })

describe('jetons newsletter', () => {
  it('un jeton de confirmation ne sert pas à se désinscrire (et inversement)', async () => {
    const { signToken, verifyToken } = await import('@/lib/tokens')
    const confirm = await signToken('nl-confirm', 'a@b.fr', '1h')
    expect(await verifyToken(confirm, 'nl-confirm')).toBe('a@b.fr')
    expect(await verifyToken(confirm, 'nl-unsub')).toBeNull()
  })
  it('rejette un jeton falsifié ou absent', async () => {
    const { signToken, verifyToken } = await import('@/lib/tokens')
    const t = await signToken('nl-unsub', 'a@b.fr', '1h')
    expect(await verifyToken(t.slice(0, -2) + 'xx', 'nl-unsub')).toBeNull()
    expect(await verifyToken(undefined, 'nl-unsub')).toBeNull()
  })
  it('rejette un jeton expiré', async () => {
    const { signToken, verifyToken } = await import('@/lib/tokens')
    const t = await signToken('nl-unsub', 'a@b.fr', '1s')
    await new Promise((r) => setTimeout(r, 2100))
    expect(await verifyToken(t, 'nl-unsub')).toBeNull()
  })
})
