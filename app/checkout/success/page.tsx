'use client'
import { useEffect } from 'react'
import { useCart } from '@/components/shared/CartProvider'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const { clear } = useCart()

  useEffect(() => {
    clear()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-10 text-center px-6">
      <CheckCircle size={48} className="text-neutral-500" strokeWidth={1} />

      <div className="space-y-3">
        <h1 className="font-serif font-light text-4xl italic text-neutral-100">
          Commande confirmée
        </h1>
        <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase text-neutral-600">
          Merci pour votre confiance
        </p>
        <p className="text-[0.82rem] text-neutral-500 max-w-sm mx-auto leading-relaxed mt-4">
          Un email de confirmation vous a été envoyé. Nous préparons votre commande avec soin et vous tiendrons informé de l'expédition.
        </p>
      </div>

      <Link
        href="/"
        className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors border border-neutral-800 hover:border-neutral-600 px-10 py-4"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
