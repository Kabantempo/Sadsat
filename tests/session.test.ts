import { describe, it, expect, afterEach, vi } from 'vitest'

const original = { ...process.env }
afterEach(() => { process.env = { ...original }; vi.resetModules() })

describe('clé de session', () => {
  it('refuse de signer en production sans SESSION_SECRET', async () => {
    process.env = { ...original, NODE_ENV: 'production' } as NodeJS.ProcessEnv
    delete process.env.SESSION_SECRET
    delete process.env.NEXT_PHASE
    const { encrypt } = await import('@/lib/session')
    await expect(encrypt({ userId: 'u', role: 'admin', expiresAt: new Date() })).rejects.toThrow(/SESSION_SECRET/)
  })

  it('refuse une clé trop courte en production', async () => {
    process.env = { ...original, NODE_ENV: 'production', SESSION_SECRET: 'court' } as NodeJS.ProcessEnv
    const { encrypt } = await import('@/lib/session')
    await expect(encrypt({ userId: 'u', role: 'admin', expiresAt: new Date() })).rejects.toThrow()
  })

  it('signe et relit un jeton avec une clé valide, et rejette un jeton forgé avec une autre clé', async () => {
    process.env = { ...original, NODE_ENV: 'production', SESSION_SECRET: 'a'.repeat(40) } as NodeJS.ProcessEnv
    const { encrypt, decrypt } = await import('@/lib/session')
    const token = await encrypt({ userId: 'u1', role: 'client', expiresAt: new Date() })
    expect((await decrypt(token))?.userId).toBe('u1')

    vi.resetModules()
    process.env.SESSION_SECRET = 'b'.repeat(40)
    const other = await import('@/lib/session')
    expect(await other.decrypt(token)).toBeNull()
  })
})
