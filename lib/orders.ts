import 'server-only'
import { prisma } from './prisma'

export type OrderStatus = 'en_attente' | 'payée' | 'expédiée' | 'livrée' | 'annulée'

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: string
  shippingMethod: string
  shippingCost: number
  subtotal: number
  total: number
  status: string
  stripeSessionId: string | null
  boxtalRef: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export async function getOrders(): Promise<Order[]> {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  return prisma.order.findMany({
    where: { customerEmail: { equals: email, mode: 'insensitive' } },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrderById(id: string): Promise<Order | null> {
  return prisma.order.findUnique({ where: { id }, include: { items: true } })
}

export async function createOrder(data: Omit<Order, 'items'> & {
  items: { productId: string; name: string; price: number; quantity: number }[]
}): Promise<void> {
  await prisma.order.create({
    data: {
      id: data.id,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone ?? null,
      shippingAddress: data.shippingAddress,
      shippingMethod: data.shippingMethod,
      shippingCost: data.shippingCost,
      subtotal: data.subtotal,
      total: data.total,
      status: data.status,
      stripeSessionId: data.stripeSessionId ?? null,
      boxtalRef: data.boxtalRef ?? null,
      notes: data.notes ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      items: {
        create: data.items.map(item => ({
          id: crypto.randomUUID(),
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await prisma.order.update({
    where: { id },
    data: { status, updatedAt: new Date().toISOString() },
  })
}

export async function updateOrderBoxtal(id: string, boxtalRef: string): Promise<void> {
  await prisma.order.update({
    where: { id },
    data: { boxtalRef, status: 'expédiée', updatedAt: new Date().toISOString() },
  })
}

class DuplicateOrder extends Error {}

/**
 * Crée la commande et décrémente le stock dans une seule transaction.
 * Renvoie false si la session Stripe a déjà été traitée (événement rejoué) : rien n'est modifié dans ce cas.
 */
export async function createOrderWithStock(data: Parameters<typeof createOrder>[0]): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      if (data.stripeSessionId) {
        const existing = await tx.order.findUnique({ where: { stripeSessionId: data.stripeSessionId } })
        if (existing) throw new DuplicateOrder()
      }
      await tx.order.create({
        data: {
          id: data.id,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone ?? null,
          shippingAddress: data.shippingAddress,
          shippingMethod: data.shippingMethod,
          shippingCost: data.shippingCost,
          subtotal: data.subtotal,
          total: data.total,
          status: data.status,
          stripeSessionId: data.stripeSessionId ?? null,
          boxtalRef: data.boxtalRef ?? null,
          notes: data.notes ?? null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          items: {
            create: data.items.map(item => ({
              id: crypto.randomUUID(),
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      })
      const now = new Date().toISOString()
      for (const item of data.items) {
        if (!item.productId) continue
        // Le paiement est déjà encaissé : on ne bloque pas la commande si le stock est insuffisant.
        // On ramène le stock à 0 et on le signale dans les logs pour un remboursement manuel.
        const res = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity }, updatedAt: now },
        })
        if (res.count === 0) {
          console.error('[orders] stock insuffisant après paiement', { productId: item.productId, quantity: item.quantity, orderId: data.id })
          await tx.product.updateMany({ where: { id: item.productId }, data: { stock: 0, updatedAt: now } })
        }
        await tx.product.updateMany({
          where: { id: item.productId, stock: 0, status: 'disponible' },
          data: { status: 'vendu', updatedAt: now },
        })
      }
    })
    return true
  } catch (e) {
    if (e instanceof DuplicateOrder) return false
    throw e
  }
}
