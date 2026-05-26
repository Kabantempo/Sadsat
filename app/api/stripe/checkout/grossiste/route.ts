import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'
import { getSession } from '@/lib/session'
import { getSetting } from '@/lib/settings'

const MIN_B2B_CENTS = 50000 // 500 €

type CartItem = { productId: string; quantity: number }

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'grossiste') {
      return NextResponse.json({ error: 'Accès réservé aux grossistes.' }, { status: 403 })
    }

    const { items }: { items: CartItem[] } = await req.json()
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
    }

    const discountRaw = await getSetting('grossiste_discount')
    const discountPct = discountRaw ? parseInt(discountRaw) : 30

    const lineItems = []
    let subtotal = 0

    for (const { productId, quantity } of items) {
      const product = await getProductById(productId)
      if (!product || product.status === 'masqué' || product.status === 'vendu') continue

      const b2bPrice = Math.round(product.price * (1 - discountPct / 100))
      subtotal += b2bPrice * quantity

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${product.name} (B2B −${discountPct} %)`,
            ...(product.images[0]?.startsWith('https://') ? { images: [product.images[0]] } : {}),
          },
          unit_amount: b2bPrice,
        },
        quantity,
      })
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'Aucun article disponible.' }, { status: 400 })
    }

    if (subtotal < MIN_B2B_CENTS) {
      return NextResponse.json({
        error: `Commande minimale de 500 € HT requise (total actuel : ${(subtotal / 100).toFixed(2)} €).`,
        belowMinimum: true,
      }, { status: 400 })
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
      phone_number_collection: { enabled: true },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/grossiste/commande`,
      locale: 'fr',
      metadata: { grossiste: 'true', userId: session.userId },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (err) {
    console.error('[stripe/checkout/grossiste]', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement.' }, { status: 500 })
  }
}
