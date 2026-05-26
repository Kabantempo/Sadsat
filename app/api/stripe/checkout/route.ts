import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'

type CartItem = { productId: string; quantity: number }

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Vérifier les prix côté serveur — ne jamais faire confiance au client
    const lineItems = []
    const notFound: string[] = []

    for (const { productId, quantity } of items) {
      const product = await getProductById(productId)
      if (!product || product.status === 'masqué') {
        notFound.push(productId)
        continue
      }
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            ...(product.images[0]?.startsWith('https://') ? { images: [product.images[0]] } : {}),
          },
          unit_amount: product.price,
        },
        quantity,
      })
    }

    if (notFound.length > 0) {
      return NextResponse.json(
        { error: 'Certains articles de votre panier ne sont plus disponibles. Veuillez vider votre panier et recommencer.', notFound },
        { status: 400 }
      )
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'Aucun article valide dans le panier.' }, { status: 400 })
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
      phone_number_collection: { enabled: true },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout`,
      locale: 'fr',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
