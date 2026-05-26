import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getProductById } from '@/lib/products'
import { getSetting } from '@/lib/settings'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'grossiste') {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
  }

  const { ids }: { ids: string[] } = await req.json()
  if (!ids?.length) return NextResponse.json({ products: [], discount: 30 })

  const discountRaw = await getSetting('grossiste_discount')
  const discount = discountRaw ? parseInt(discountRaw) : 30

  const products = await Promise.all(
    ids.map(async (id) => {
      const p = await getProductById(id)
      if (!p) return null
      return {
        id: p.id,
        name: p.name,
        publicPrice: p.price,
        b2bPrice: Math.round(p.price * (1 - discount / 100)),
        image: p.images[0] ?? null,
        available: p.status !== 'masqué' && p.status !== 'vendu',
      }
    })
  )

  return NextResponse.json({ products: products.filter(Boolean), discount })
}
