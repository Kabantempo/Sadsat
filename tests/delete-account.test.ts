import { describe, it, expect, vi, beforeEach } from 'vitest'

const prisma = {
  user: { findUnique: vi.fn(), delete: vi.fn((a) => ({ op: 'user.delete', a })) },
  review: { updateMany: vi.fn((a) => ({ op: 'review.updateMany', a })) },
  newsletterSubscriber: { deleteMany: vi.fn((a) => ({ op: 'news.deleteMany', a })) },
  $transaction: vi.fn(async () => []),
}
vi.mock('@/lib/prisma', () => ({ prisma }))

beforeEach(() => vi.clearAllMocks())

describe('deleteAccountData (suppression par l\'admin ou le client)', () => {
  it('renvoie false si le compte n\'existe pas, sans rien supprimer', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    const { deleteAccountData } = await import('@/lib/account')
    expect(await deleteAccountData('x')).toBe(false)
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })
  it('anonymise les avis, supprime la newsletter et le compte dans une transaction', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.fr' })
    const { deleteAccountData } = await import('@/lib/account')
    expect(await deleteAccountData('u1')).toBe(true)
    expect(prisma.review.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ authorName: 'Client supprimé' }) }))
    expect(prisma.newsletterSubscriber.deleteMany).toHaveBeenCalledWith({ where: { email: 'a@b.fr' } })
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } })
    expect(prisma.$transaction).toHaveBeenCalledTimes(1)
  })
})
