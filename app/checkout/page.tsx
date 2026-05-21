'use client'
import { useCart } from '@/components/shared/CartProvider'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total } = useCart()

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

  const subject = encodeURIComponent('Commande SADSAT')
  const body = encodeURIComponent(
    items.map(i => `- ${i.name} x${i.quantity} — ${((i.price * i.quantity) / 100).toFixed(2)} €`).join('\n') +
    `\n\nTotal : ${(total / 100).toFixed(2)} €`
  )
  const mailto = `mailto:contact@sadsat.com?subject=${subject}&body=${body}`

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

        <div className="divide-y divide-neutral-900 mb-8">
          {items.map(item => (
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

        <div className="border-t border-neutral-800 pt-6 mb-10 space-y-3">
          <div className="flex justify-between items-baseline pt-3">
            <span className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-neutral-400">Total</span>
            <span className="font-serif text-2xl text-neutral-100">{(total / 100).toFixed(2)} €</span>
          </div>
        </div>

        <div className="border border-neutral-800 bg-neutral-900/40 p-6 mb-6 text-center space-y-4">
          <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-500">
            Paiement en ligne bientôt disponible
          </p>
          <p className="text-[0.78rem] text-neutral-400 leading-relaxed">
            Pour finaliser votre commande, envoyez-nous votre sélection par email et nous vous recontactons.
          </p>
          <a
            href={mailto}
            className="inline-flex items-center gap-2 py-3.5 px-8 bg-neutral-100 text-neutral-900 text-[0.62rem] tracking-[0.24em] uppercase font-medium hover:bg-white transition-colors"
          >
            <Mail size={13} strokeWidth={2} />
            Envoyer ma commande
          </a>
        </div>

        <p className="text-center text-[0.58rem] text-neutral-700 tracking-wider">
          contact@sadsat.com
        </p>
      </div>
    </div>
  )
}
