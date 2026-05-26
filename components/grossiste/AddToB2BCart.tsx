'use client'
import { useB2BCart } from '@/lib/b2b-cart'
import { Minus, Plus, ShoppingBag } from 'lucide-react'

export default function AddToB2BCart({ productId, sold }: { productId: string; sold: boolean }) {
  const { items, add, setQty, remove } = useB2BCart()
  const item = items.find((i) => i.id === productId)
  const qty = item?.quantity ?? 0

  if (sold) return null

  if (qty === 0) {
    return (
      <button
        onClick={() => add(productId)}
        className="w-full mt-2 py-2 text-[0.6rem] tracking-[0.14em] uppercase border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors flex items-center justify-center gap-1.5 text-neutral-700"
      >
        <ShoppingBag size={11} strokeWidth={1.5} />
        Ajouter
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between mt-2 border border-sky-200 bg-sky-50">
      <button
        onClick={() => qty === 1 ? remove(productId) : setQty(productId, qty - 1)}
        className="px-3 py-2 text-sky-700 hover:bg-sky-100 transition-colors"
      >
        <Minus size={12} />
      </button>
      <span className="font-mono text-[0.75rem] text-sky-800 tabular-nums">{qty}</span>
      <button
        onClick={() => add(productId)}
        className="px-3 py-2 text-sky-700 hover:bg-sky-100 transition-colors"
      >
        <Plus size={12} />
      </button>
    </div>
  )
}
