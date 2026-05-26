'use server'
import { verifyAdmin } from '@/lib/dal'
import { getOrderById, updateOrderBoxtal } from '@/lib/orders'
import { createParcel } from '@/lib/sendcloud'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

function parseAddress(raw: string) {
  // Format stocké : "12 rue de la Paix, 75001 Paris, FR"
  const parts = raw.split(',').map((s) => s.trim())
  const address = parts[0] ?? ''
  const cityPart = parts[1] ?? ''
  const country = parts[2] ?? 'FR'
  const postalMatch = cityPart.match(/^(\d{4,5})\s+(.+)$/)
  const postal_code = postalMatch?.[1] ?? ''
  const city = postalMatch?.[2] ?? cityPart
  return { address, city, postal_code, country }
}

export async function expedierCommandeAction(formData: FormData) {
  await verifyAdmin()

  const orderId = String(formData.get('orderId') ?? '')
  const weight = parseFloat(String(formData.get('weight') ?? '1'))

  const order = await getOrderById(orderId)
  if (!order) throw new Error('Commande introuvable')

  const { address, city, postal_code, country } = parseAddress(order.shippingAddress)

  const parcel = await createParcel({
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    address,
    city,
    postal_code,
    country,
    order_number: order.id,
    weight,
  })

  // Sauvegarde numéro de suivi + statut + lien étiquette
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'expédiée',
      boxtalRef: parcel.tracking_number,
      notes: `tracking:${parcel.tracking_url}|label:${parcel.label?.normal_printer?.[0] ?? ''}`,
      updatedAt: new Date().toISOString(),
    },
  })

  revalidatePath('/admin/commandes')
}

export async function updateTrackingAction(formData: FormData) {
  await verifyAdmin()
  const orderId = String(formData.get('orderId') ?? '')
  const tracking = String(formData.get('tracking') ?? '').trim()
  if (!tracking) return
  await updateOrderBoxtal(orderId, tracking)
  revalidatePath('/admin/commandes')
}

export async function updateStatusAction(formData: FormData) {
  await verifyAdmin()
  const orderId = String(formData.get('orderId') ?? '')
  const status = String(formData.get('status') ?? '')
  const valid = ['en_attente', 'payée', 'expédiée', 'livrée', 'annulée']
  if (!valid.includes(status)) return
  await prisma.order.update({
    where: { id: orderId },
    data: { status, updatedAt: new Date().toISOString() },
  })
  revalidatePath('/admin/commandes')
}
