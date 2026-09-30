import { describe, it, expect, vi, beforeEach } from 'vitest'

const m = vi.hoisted(() => ({
  createUser: vi.fn(), getUserByEmail: vi.fn(), saveVerificationToken: vi.fn(),
  sendVerificationEmail: vi.fn(), sendWelcomeEmail: vi.fn(), sendNewsletterConfirmEmail: vi.fn(),
  isNewsletterEnabled: vi.fn(),
}))
vi.mock('next/navigation', () => ({ redirect: (u: string) => { throw new Error('REDIRECT:' + u) } }))
vi.mock('@/lib/db', () => ({
  createUser: m.createUser, getUserByEmail: m.getUserByEmail, saveVerificationToken: m.saveVerificationToken,
  getUserById: vi.fn(), adminExists: vi.fn(), updateUserPassword: vi.fn(), getUserByPasswordToken: vi.fn(),
  clearPasswordToken: vi.fn(), savePasswordToken: vi.fn(),
}))
vi.mock('@/lib/email', () => ({
  sendVerificationEmail: m.sendVerificationEmail, sendWelcomeEmail: m.sendWelcomeEmail,
  sendNewsletterConfirmEmail: m.sendNewsletterConfirmEmail, sendPasswordResetEmail: vi.fn(),
}))
vi.mock('@/lib/settings', () => ({ isNewsletterEnabled: m.isNewsletterEnabled }))
vi.mock('@/lib/rate-limit', () => ({ allow: vi.fn().mockResolvedValue(true), TOO_MANY: 'trop' }))
vi.mock('@/lib/dal', () => ({ verifySession: vi.fn() }))
vi.mock('@/lib/session', () => ({ createSession: vi.fn(), deleteSession: vi.fn() }))
vi.mock('@/lib/account', () => ({ deleteAccountData: vi.fn() }))

import { signup } from '@/app/actions/auth'

const form = (newsletter: string) => {
  const f = new FormData()
  f.set('name', 'Alice Martin'); f.set('email', 'alice@example.com'); f.set('password', 'motdepasse1'); f.set('newsletter', newsletter)
  return f
}
const run = async (newsletter: string) => { await expect(signup(undefined, form(newsletter))).rejects.toThrow('REDIRECT:/inscription/confirmer') }

beforeEach(() => {
  vi.clearAllMocks()
  m.getUserByEmail.mockResolvedValue(undefined)
  m.isNewsletterEnabled.mockResolvedValue(true)
  m.sendNewsletterConfirmEmail.mockResolvedValue(true)
})

describe('inscription : case « recevoir les nouveautés »', () => {
  it('envoie l\'email de confirmation (double opt-in) quand la case est cochée', async () => {
    await run('on')
    expect(m.sendNewsletterConfirmEmail).toHaveBeenCalledWith('alice@example.com')
  })
  it('n\'envoie rien quand la case n\'est pas cochée', async () => {
    await run('')
    expect(m.sendNewsletterConfirmEmail).not.toHaveBeenCalled()
  })
  it('n\'envoie rien si la newsletter est désactivée dans l\'admin', async () => {
    m.isNewsletterEnabled.mockResolvedValue(false)
    await run('on')
    expect(m.sendNewsletterConfirmEmail).not.toHaveBeenCalled()
  })
  it('l\'inscription réussit même si l\'email de newsletter échoue', async () => {
    m.sendNewsletterConfirmEmail.mockRejectedValue(new Error('smtp'))
    await run('on')
    expect(m.createUser).toHaveBeenCalledTimes(1)
  })
})
