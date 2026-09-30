import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrderWithStock } from '@/lib/orders'
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail, sendAbandonedCartEmail } from '@/lib/email'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

type Address = { line1?: string | null; line2?: string | null; postal_code?: string | null; city?: string | null; country?: string | null } | null | undefined

function formatAddress(addr: Address): string {
  if (!addr) return ''
  return [addr.line1, addr.line2, `${addr.postal_code ?? ''} ${addr.city ?? ''}`.trim(), addr.country].filter(Boolean).join(', ')
}

function productIdOf(li: Stripe.LineItem): string {
  const product = li.price?.product
  if (product && typeof product !== 'string' && !('deleted' in product && product.deleted)) {
    return (product as Stripe.Product).metadata?.productId ?? ''
  }
  return ''
}

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

    // Toute erreur ici renvoie 500 : Stripe rejoue l'événement (la création est idempotente).
    try {
      const expanded = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price.product'],
      })
      const lineItems = expanded.line_items?.data ?? []

      const customerName  = session.customer_details?.name ?? 'Client'
      const customerEmail = session.customer_details?.email ?? ''
      const customerPhone = session.customer_details?.phone ?? null

      // shipping_details existe dans l'API Stripe mais les types TS v22 sont en décalage
      type ShippingDetails = { address?: Address } | null
      const raw = session as unknown as Record<string, unknown>
      const shipping = (raw['shipping_details'] ?? raw['shipping']) as ShippingDetails
      const shippingAddress = formatAddress(shipping?.address) || formatAddress(session.customer_details?.address)

      const subtotal = session.amount_subtotal ?? 0
      const total = session.amount_total ?? 0
      // Frais de port réellement facturés (et non total - sous-total, faussé par les codes promo).
      const shippingCost = session.total_details?.amount_shipping ?? 0

      const items = lineItems.map((li) => ({
        productId: productIdOf(li),
        name: li.description ?? 'Produit',
        price: li.price?.unit_amount ?? 0,
        quantity: li.quantity ?? 1,
      }))

      const orderId = crypto.randomUUID()
      const now = new Date().toISOString()

      const created = await createOrderWithStock({
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

      if (!created) {
        // Événement déjà traité : pas de doublon, pas de second email.
        return NextResponse.json({ received: true, duplicate: true })
      }

      const emailItems = items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }))
      const results = await Promise.allSettled([
        sendOrderConfirmationEmail({ to: customerEmail, customerName, orderId, items: emailItems, subtotal, shippingCost, total, shippingAddress }),
        sendNewOrderAdminEmail({ orderId, customerName, customerEmail, items: emailItems, total, shippingAddress }),
      ])
      results.forEach((r) => { if (r.status === 'rejected') console.error('[webhook] Email commande non envoyé:', r.reason) })
    } catch (err) {
      console.error('[webhook] Erreur création commande:', err)
      return NextResponse.json({ error: 'Erreur traitement commande' }, { status: 500 })
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email ?? session.customer_email
    // Relance uniquement si le client a coché la case « recevoir nos offres » (consentement).
    const consented = session.consent?.promotions === 'opt_in'
    if (email && consented) {
      try {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })
        const items = lines.data.map((li) => ({ name: li.description ?? 'Produit', price: li.amount_total }))
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sadsat.com'
        if (items.length > 0) await sendAbandonedCartEmail(email, items, `${base}/checkout`)
      } catch (err) {
        console.error('[webhook] Erreur panier abandonné:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
