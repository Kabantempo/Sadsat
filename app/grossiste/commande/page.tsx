'use client'
import { useState, useEffect } from 'react'
import { useB2BCart } from '@/lib/b2b-cart'
import Link from 'next/link'
import { ArrowLeft, Lock, Minus, Plus, Trash2, Tag } from 'lucide-react'

type ProductInfo = {
  id: string
  name: string
  publicPrice: number
  b2bPrice: number
  image?: string
  available: boolean
}

export default function GrossisteCommandePage() {
  const { items, setQty, remove, clear } = useB2BCart()
  const [products, setProducts] = useState<ProductInfo[]>([])
  const [discount, setDiscount] = useState(30)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les infos produits depuis l'API
  useEffect(() => {
    if (items.length === 0) { setLoading(false); return }
    fetch('/api/grossiste/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: items.map((i) => i.id) }),
    })
      .then((r) => r.json())
      .then((data) => { setProducts(data.products ?? []); setDiscount(data.discount ?? 30) })
      .finally(() => setLoading(false))
  }, [items.length])

  const totalCents = items.reduce((sum, item) => {
    const p = products.find((p) => p.id === item.id)
    return sum + (p?.b2bPrice ?? 0) * item.quantity
  }, 0)

  const MIN_CENTS = 50000

  async function handleCheckout() {
    setCheckoutLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout/grossiste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.id, quantity: i.quantity })) }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Erreur inattendue')
      clear()
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setCheckoutLoading(false)
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-neutral-400">
          Votre panier B2B est vide
        </p>
        <Link href="/grossiste/catalogue" className="text-[0.65rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-800 transition-colors">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-6 bg-neutral-50">
      <div className="max-w-2xl mx-auto">
        <Link href="/grossiste/catalogue" className="flex items-center gap-2 text-neutral-400 hover:text-neutral-700 transition-colors mb-12 text-[0.6rem] tracking-[0.22em] uppercase">
          <ArrowLeft size={12} /> Retour au catalogue
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900">Ma commande B2B</h1>
          <span className="flex items-center gap-1 text-[0.56rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-sky-100 text-sky-700">
            <Tag size={10} /> −{discount} %
          </span>
        </div>
        <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-400 mb-10">
          {items.length} référence{items.length > 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="h-20 bg-neutral-200 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 mb-8 border-t border-neutral-200">
            {items.map((item) => {
              const p = products.find((p) => p.id === item.id)
              const lineTotal = p ? (p.b2bPrice * item.quantity) / 100 : 0
              return (
                <div key={item.id} className="flex items-center gap-4 py-5">
                  <div className="w-16 h-16 shrink-0 bg-neutral-200 overflow-hidden">
                    {p?.image && <img src={p.image} alt={p?.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] text-neutral-800 truncate">{p?.name ?? item.id}</p>
                    {p && (
                      <p className="text-[0.62rem] text-neutral-400 mt-0.5">
                        <span className="line-through">{(p.publicPrice / 100).toFixed(2)} €</span>
                        <span className="ml-2 text-sky-700 font-medium">{(p.b2bPrice / 100).toFixed(2)} € B2B</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-neutral-200 bg-white">
                    <button onClick={() => setQty(item.id, item.quantity - 1)} className="px-2.5 py-2 text-neutral-500 hover:bg-neutral-100 transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="px-3 font-mono text-[0.75rem] tabular-nums text-neutral-800">{item.quantity}</span>
                    <button onClick={() => setQty(item.id, item.quantity + 1)} className="px-2.5 py-2 text-neutral-500 hover:bg-neutral-100 transition-colors">
                      <Plus size={11} />
                    </button>
                  </div>
                  <p className="text-[0.88rem] text-neutral-800 tabular-nums w-20 text-right">{lineTotal.toFixed(2)} €</p>
                  <button onClick={() => remove(item.id)} className="text-neutral-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Total + minimum */}
        <div className="border-t border-neutral-300 pt-6 mb-8">
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-neutral-400">Total B2B HT</span>
            <span className="font-serif text-2xl text-neutral-900">{(totalCents / 100).toFixed(2)} €</span>
          </div>
          {totalCents < MIN_CENTS && (
            <p className="text-[0.68rem] text-amber-600 mt-2 text-right">
              Minimum de commande : 500,00 € HT · Il manque {((MIN_CENTS - totalCents) / 100).toFixed(2)} €
            </p>
          )}
        </div>

        {error && <p className="mb-4 text-[0.72rem] text-red-500 text-center">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading || totalCents < MIN_CENTS || loading}
          className="w-full h-14 bg-neutral-900 text-white text-[0.62rem] tracking-[0.24em] uppercase hover:bg-neutral-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-3"
        >
          {checkoutLoading ? (
            <>
              <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              Redirection…
            </>
          ) : (
            <>
              <Lock size={12} strokeWidth={2} />
              Passer la commande
            </>
          )}
        </button>
        <p className="mt-3 text-center text-[0.56rem] text-neutral-400 tracking-wider">
          Paiement sécurisé par Stripe · Prix HT, TVA non applicable (art. 293 B du CGI)
        </p>
      </div>
    </div>
  )
}
