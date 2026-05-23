import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrder } from '@/lib/orders'
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from '@/lib/email'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] Signature invalide:', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Récupérer les articles de la session
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    })
    const lineItems = expanded.line_items?.data ?? []

    const customerName = session.customer_details?.name ?? 'Client'
    const customerEmail = session.customer_details?.email ?? ''
    const customerPhone = session.customer_details?.phone ?? null
    const shipping = session.shipping
    const shippingAddress = shipping
      ? [
          shipping.address?.line1,
          shipping.address?.line2,
          `${shipping.address?.postal_code} ${shipping.address?.city}`,
          shipping.address?.country,
        ]
          .filter(Boolean)
          .join(', ')
      : ''

    const subtotal = (session.amount_subtotal ?? 0)
    const total = session.amount_total ?? 0
    const shippingCost = total - subtotal

    const items = lineItems.map((li) => ({
      productId: '',
      name: li.description ?? 'Produit',
      price: li.price?.unit_amount ?? 0,
      quantity: li.quantity ?? 1,
    }))

    const orderId = crypto.randomUUID()
    const now = new Date().toISOString()

    try {
      await createOrder({
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingMethod: 'standard',
        shippingCost,
        subtotal,
        total,
        status: 'payée',
        stripeSessionId: session.id,
        boxtalRef: null,
        notes: null,
        createdAt: now,
        updatedAt: now,
        items,
      })

      // Emails de confirmation
      await Promise.all([
        sendOrderConfirmationEmail({
          to: customerEmail,
          customerName,
          orderId,
          items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
          subtotal,
          shippingCost,
          total,
          shippingAddress,
        }),
        sendNewOrderAdminEmail({
          orderId,
          customerName,
          customerEmail,
          items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
          total,
          shippingAddress,
        }),
      ])
    } catch (err) {
      console.error('[webhook] Erreur création commande:', err)
      // On retourne 200 à Stripe pour éviter les retries — l'erreur est loggée
    }
  }

  return NextResponse.json({ received: true })
}
