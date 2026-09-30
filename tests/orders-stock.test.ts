import { describe, it, expect, vi, beforeEach } from 'vitest'

const tx = {
  order: { findUnique: vi.fn(), create: vi.fn() },
  product: { updateMany: vi.fn() },
}
vi.mock('@/lib/prisma', () => ({
  prisma: { $transaction: (fn: (t: typeof tx) => Promise<void>) => fn(tx) },
}))

import { createOrderWithStock } from '@/lib/orders'

const base = {
  id: 'o1', customerName: 'A', customerEmail: 'a@b.fr', customerPhone: null,
  shippingAddress: 'x', shippingMethod: 'standard', shippingCost: 0, subtotal: 100, total: 100,
  status: 'payée', stripeSessionId: 'cs_1', boxtalRef: null, notes: null,
  createdAt: 'now', updatedAt: 'now',
}
const item = (productId: string, quantity = 1) => ({ productId, name: 'Pièce', price: 100, quantity })

beforeEach(() => {
  vi.clearAllMocks()
  tx.order.findUnique.mockResolvedValue(null)
  tx.product.updateMany.mockResolvedValue({ count: 1 })
})

describe('createOrderWithStock', () => {
  it('crée la commande et décrémente le stock', async () => {
    const created = await createOrderWithStock({ ...base, items: [item('p1', 2)] })
    expect(created).toBe(true)
    expect(tx.order.create).toHaveBeenCalledTimes(1)
    expect(tx.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'p1', stock: { gte: 2 } },
      data: expect.objectContaining({ stock: { decrement: 2 } }),
    }))
  })

  it('marque le produit « vendu » quand le stock tombe à 0', async () => {
    await createOrderWithStock({ ...base, items: [item('p1')] })
    expect(tx.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'p1', stock: 0, status: 'disponible' },
      data: expect.objectContaining({ status: 'vendu' }),
    }))
  })

  it('ignore un événement Stripe déjà traité : ni commande, ni stock', async () => {
    tx.order.findUnique.mockResolvedValue({ id: 'existante' })
    const created = await createOrderWithStock({ ...base, items: [item('p1')] })
    expect(created).toBe(false)
    expect(tx.order.create).not.toHaveBeenCalled()
    expect(tx.product.updateMany).not.toHaveBeenCalled()
  })

  it('garde la commande payée si le stock est insuffisant : stock ramené à 0 et erreur journalisée', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    tx.product.updateMany.mockResolvedValueOnce({ count: 0 })
    const created = await createOrderWithStock({ ...base, items: [item('p1')] })
    expect(created).toBe(true)
    expect(log).toHaveBeenCalled()
    expect(tx.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'p1' }, data: expect.objectContaining({ stock: 0 }),
    }))
    log.mockRestore()
  })

  it('ne touche pas au stock pour une ligne sans identifiant produit', async () => {
    await createOrderWithStock({ ...base, items: [item('')] })
    expect(tx.order.create).toHaveBeenCalledTimes(1)
    expect(tx.product.updateMany).not.toHaveBeenCalled()
  })

  it('remonte une erreur de base pour que le webhook réponde 500 et que Stripe réessaie', async () => {
    tx.order.create.mockRejectedValueOnce(new Error('db down'))
    await expect(createOrderWithStock({ ...base, items: [item('p1')] })).rejects.toThrow('db down')
  })
})
