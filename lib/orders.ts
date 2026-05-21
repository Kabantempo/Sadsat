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
