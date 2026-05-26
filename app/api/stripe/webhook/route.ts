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

    const customerName  = session.customer_details?.name ?? 'Client'
    const customerEmail = session.customer_details?.email ?? ''
    const customerPhone = session.customer_details?.phone ?? null

    // shipping_details existe dans l'API Stripe mais les types TS v22 sont en décalage
    type ShippingDetails = {
      address?: { line1?: string | null; line2?: string | null; postal_code?: string | null; city?: string | null; country?: string | null } | null
    } | null
    const shipping = ((session as unknown) as Record<string, unknown>)['shipping_details'] as ShippingDetails
      ?? ((session as unknown) as Record<string, unknown>)['shipping'] as ShippingDetails

    const addr = shipping?.address
    const shippingAddress = addr
      ? [addr.line1, addr.line2, `${addr.postal_code ?? ''} ${addr.city ?? ''}`.trim(), addr.country]
          .filter(Boolean)
          .join(', ')
      : (session.customer_details?.address
          ? [
              session.customer_details.address.line1,
              session.customer_details.address.line2,
              `${session.customer_details.address.postal_code ?? ''} ${session.customer_details.address.city ?? ''}`.trim(),
              session.customer_details.address.country,
            ].filter(Boolean).join(', ')
          : '')

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
