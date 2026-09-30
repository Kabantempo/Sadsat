import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'
import { getVerifiedSession } from '@/lib/dal'
import { hit } from '@/lib/rate-limit-core'
import { parseItems } from '@/lib/checkout-items'

// Frais de port : à renseigner dans les variables d'environnement (centimes).
// Exemple : SHIPPING_FLAT_CENTS=690 et FREE_SHIPPING_THRESHOLD_CENTS=15000. 0 = livraison offerte.
const SHIPPING_FLAT = Number(process.env.SHIPPING_FLAT_CENTS ?? 0)
const FREE_FROM = Number(process.env.FREE_SHIPPING_THRESHOLD_CENTS ?? 0)

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!hit(`checkout:${ip}`, 20, 10 * 60 * 1000).ok) {
      return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    const items = parseItems(body?.items)
    if (!items) return NextResponse.json({ error: 'Panier invalide' }, { status: 400 })

    // Prix, statut et stock vérifiés côté serveur : on ne fait jamais confiance au client.
    const lineItems: {
      price_data: { currency: string; product_data: { name: string; images?: string[]; metadata: { productId: string } }; unit_amount: number }
      quantity: number
    }[] = []
    const unavailable: string[] = []
    let subtotal = 0

    for (const { productId, quantity } of items) {
      const product = await getProductById(productId)
      if (!product || product.status !== 'disponible' || product.stock < quantity) {
        unavailable.push(productId)
        continue
      }
      subtotal += product.price * quantity
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            metadata: { productId: product.id },
            ...(product.images[0]?.startsWith('https://') ? { images: [product.images[0]] } : {}),
          },
          unit_amount: product.price,
        },
        quantity,
      })
    }

    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: 'Certains articles ne sont plus disponibles en quantité suffisante. Veuillez mettre à jour votre panier.', notFound: unavailable },
        { status: 400 }
      )
    }

    const shippingAmount = SHIPPING_FLAT > 0 && !(FREE_FROM > 0 && subtotal >= FREE_FROM) ? SHIPPING_FLAT : 0

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const userSession = await getVerifiedSession()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
      phone_number_collection: { enabled: true },
      ...(shippingAmount > 0
        ? {
            shipping_options: [{
              shipping_rate_data: {
                type: 'fixed_amount' as const,
                fixed_amount: { amount: shippingAmount, currency: 'eur' },
                display_name: 'Livraison',
              },
            }],
          }
        : {}),
      // Case « recevoir nos offres » : sert de consentement pour les relances de panier abandonné.
      consent_collection: { promotions: 'auto' },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout`,
      locale: 'fr',
      allow_promotion_codes: true,
      ...(userSession?.email ? { customer_email: userSession.email } : {}),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
