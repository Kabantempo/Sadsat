'use client'
import { useB2BCart } from '@/lib/b2b-cart'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function B2BCartBar({ discount }: { discount: number }) {
  const { items } = useB2BCart()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  if (count === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Link
        href="/grossiste/commande"
        className="flex items-center gap-3 px-6 py-3.5 bg-neutral-900 text-white shadow-xl hover:bg-neutral-700 transition-colors"
      >
        <ShoppingBag size={15} strokeWidth={1.5} />
        <span className="text-[0.62rem] tracking-[0.16em] uppercase">
          {count} article{count > 1 ? 's' : ''} · Voir ma commande B2B
        </span>
        <span className="ml-1 bg-sky-500 text-white text-[0.52rem] tracking-wider uppercase px-2 py-0.5">
          −{discount} %
        </span>
      </Link>
    </div>
  )
}
