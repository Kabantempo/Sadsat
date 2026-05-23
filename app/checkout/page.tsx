'use client'
import { useState } from 'react'
import { useCart } from '@/components/shared/CartProvider'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!items.length) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-neutral-600">
          Votre panier est vide
        </p>
        <Link
          href="/"
          className="text-[0.65rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  async function handleCheckout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Erreur inattendue')
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-16 px-6">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-300 transition-colors mb-12 text-[0.6rem] tracking-[0.22em] uppercase"
        >
          <ArrowLeft size={12} />
          Continuer mes achats
        </Link>

        <h1 className="font-serif font-light text-3xl italic text-neutral-100 mb-2">
          Récapitulatif
        </h1>
        <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-12">
          {items.length} article{items.length > 1 ? 's' : ''}
        </p>

        {/* Articles */}
        <div className="divide-y divide-neutral-900 mb-8">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-5">
              <div className="relative w-16 h-20 shrink-0 bg-neutral-900 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xl">✦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif italic text-[0.9rem] text-neutral-200 truncate">{item.name}</p>
                <p className="font-mono text-[0.55rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">
                  {item.category} · Qté {item.quantity}
                </p>
              </div>
              <p className="font-serif text-neutral-300 shrink-0 text-lg">
                {((item.price * item.quantity) / 100).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-neutral-800 pt-6 mb-10">
          <div className="flex justify-between items-baseline pt-3">
            <span className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-neutral-400">Total</span>
            <span className="font-serif text-2xl text-neutral-100">{(total / 100).toFixed(2)} €</span>
          </div>
          <p className="text-[0.58rem] text-neutral-700 mt-2 text-right">Livraison calculée à l'étape suivante</p>
        </div>

        {/* Erreur */}
        {error && (
          <p className="mb-4 text-[0.72rem] text-red-400 text-center">{error}</p>
        )}

        {/* Bouton paiement */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-14 bg-neutral-100 text-neutral-900 text-[0.62rem] tracking-[0.24em] uppercase font-medium hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
              Redirection…
            </>
          ) : (
            <>
              <Lock size={12} strokeWidth={2} />
              Payer en sécurité
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[0.56rem] text-neutral-700 tracking-wider flex items-center justify-center gap-1.5">
          <Lock size={9} strokeWidth={1.5} />
          Paiement sécurisé par Stripe · Carte, Apple Pay, Google Pay
        </p>
      </div>
    </div>
  )
}
