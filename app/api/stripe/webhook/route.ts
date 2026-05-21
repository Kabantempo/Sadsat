import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'
import { createOrder } from '@/lib/orders'
import { getProductById, updateProduct } from '@/lib/products'
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return new NextResponse('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] signature error', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      const itemsMeta = JSON.parse(session.metadata?.items || '[]') as { id: string; qty: number }[]
      const shipping = (session as unknown as { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; postal_code?: string; city?: string; country?: string } } }).shipping_details
      const customer = session.customer_details
      const shippingCost = (session as unknown as { shipping_cost?: { amount_total?: number } }).shipping_cost?.amount_total ?? 0
      const shippingMethod = 'Colissimo'

      const orderItems: { productId: string; name: string; price: number; quantity: number }[] = []
      let subtotal = 0

      for (const { id, qty } of itemsMeta) {
        const product = await getProductById(id)
        if (!product) continue
        orderItems.push({ productId: id, name: product.name, price: product.price, quantity: qty })
        subtotal += product.price * qty
        const newStock = Math.max(0, product.stock - qty)
        await updateProduct(id, {
          stock: newStock,
          ...(newStock <= 0 ? { status: 'vendu' } : {}),
        })
      }

      const addr = shipping?.address
      const shippingAddress = [addr?.line1, addr?.line2, addr?.postal_code, addr?.city, addr?.country]
        .filter(Boolean).join(', ')

      const orderId = crypto.randomUUID()
      await createOrder({
        id: orderId,
        customerName: shipping?.name || customer?.name || 'Inconnu',
        customerEmail: customer?.email || '',
        customerPhone: customer?.phone ?? null,
        shippingAddress,
        shippingMethod,
        shippingCost,
        subtotal,
        total: subtotal + shippingCost,
        status: 'payée',
        stripeSessionId: session.id,
        boxtalRef: null,
        notes: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: orderItems,
      })

      if (customer?.email) {
        await sendOrderConfirmationEmail({
          to: customer.email,
          customerName: shipping?.name || customer.name || '',
          orderId,
          items: orderItems,
          subtotal,
          shippingCost,
          total: subtotal + shippingCost,
          shippingAddress,
        })
      }

      await sendNewOrderAdminEmail({
        orderId,
        customerName: shipping?.name || customer?.name || 'Inconnu',
        customerEmail: customer?.email || '',
        items: orderItems,
        total: subtotal + shippingCost,
        shippingAddress,
      })
    } catch (err) {
      console.error('[webhook] processing error', err)
      return new NextResponse('Processing error', { status: 500 })
    }
  }

  return new NextResponse('OK', { status: 200 })
}
