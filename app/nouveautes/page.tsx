export const revalidate = 30

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProducts } from '@/lib/products'
import { UNIVERSE_LABELS } from '@/lib/definitions'

export const metadata: Metadata = {
  title: 'Nouveautés — SADSAT',
  description: 'Les dernières créations SADSAT — taxidermie, bijoux, bougies.',
}

const UNIVERSE_COLOR: Record<string, string> = {
  taxidermie:       'bg-stone-100 text-stone-600',
  bijoux:           'bg-rose-100 text-rose-600',
  bougies:          'bg-amber-100 text-amber-600',
  habillement:      'bg-sky-100 text-sky-600',
  'pieces-uniques': 'bg-neutral-100 text-neutral-500',
}

export default async function NouveautesPage() {
  const products = (await getProducts())
    .filter((p) => p.status !== 'masqué')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-8">

        {/* En-tête */}
        <div className="mb-16">
          <p className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-neutral-600 mb-4">
            SADSAT — Catalogue
          </p>
          <h1 className="font-serif font-light text-5xl md:text-6xl italic text-neutral-100 leading-none mb-4">
            Nouveautés
          </h1>
          <p className="text-[0.82rem] text-neutral-500">
            {products.length} création{products.length > 1 ? 's' : ''} — du plus récent au plus ancien
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-32 text-center border border-neutral-800">
            <p className="font-serif italic text-2xl text-neutral-600 mb-3">
              Aucune création disponible.
            </p>
            <p className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-neutral-700">
              Revenez bientôt
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((p, idx) => {
              const universeLabel = UNIVERSE_LABELS[p.universe as keyof typeof UNIVERSE_LABELS] ?? p.universe
              const badgeColor = UNIVERSE_COLOR[p.universe] ?? 'bg-neutral-800 text-neutral-400'
              const isNew = idx < 4

              return (
                <Link
                  key={p.id}
                  href={`/produits/${p.id}`}
                  className="group relative bg-neutral-900 overflow-hidden block"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-neutral-700 text-3xl">✦</span>
                      </div>
                    )}

                    {/* Badge "Nouveau" sur les 4 premiers */}
                    {isNew && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[0.48rem] tracking-[0.2em] uppercase bg-neutral-100 text-neutral-900 px-2 py-1">
                          Nouveau
                        </span>
                      </div>
                    )}

                    {p.status === 'vendu' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 border border-neutral-600 px-3 py-1">
                          Vendu
                        </span>
                      </div>
                    )}

                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-[0.58rem] tracking-[0.18em] uppercase text-white border border-white/50 px-3 py-1.5">
                        Voir la pièce →
                      </span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="p-3.5">
                    <span className={`text-[0.5rem] tracking-[0.14em] uppercase px-2 py-0.5 ${badgeColor} mb-2 inline-block`}>
                      {universeLabel}
                    </span>
                    <p className="text-[0.82rem] text-neutral-200 leading-snug mb-1 group-hover:text-white transition-colors">
                      {p.name}
                    </p>
                    <p className="font-serif text-[1rem] text-neutral-300">
                      {(p.price / 100).toFixed(2)} €
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
