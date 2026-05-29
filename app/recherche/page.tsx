import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/products'
import { UNIVERSE_LABELS } from '@/lib/definitions'
import type { Universe } from '@/lib/definitions'

export const metadata = {
  title: 'Recherche — SADSAT',
  description: 'Recherchez parmi les créations artisanales SADSAT : taxidermie éthique, bijoux, bougies et mode upcycling.',
  robots: { index: false, follow: false },
}

const UNIVERSE_BADGE: Record<Universe, { bg: string; text: string }> = {
  taxidermie:       { bg: 'bg-stone-800',   text: 'text-stone-300' },
  bijoux:           { bg: 'bg-rose-900',    text: 'text-rose-300' },
  bougies:          { bg: 'bg-amber-900',   text: 'text-amber-300' },
  habillement:      { bg: 'bg-sky-900',     text: 'text-sky-300' },
  'pieces-uniques': { bg: 'bg-neutral-800', text: 'text-neutral-300' },
}

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const term = (q ?? '').trim()

  if (!term) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center px-8">
        <div className="w-full max-w-xl text-center">
          <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-600 mb-8">
            — Recherche —
          </p>
          <form action="/recherche" method="get">
            <div className="flex items-center border border-neutral-700 focus-within:border-neutral-400 transition-colors rounded-none">
              <input
                name="q"
                type="text"
                autoFocus
                placeholder="Rechercher une pièce..."
                className="flex-1 bg-transparent px-5 py-4 text-neutral-100 placeholder-neutral-600 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-5 py-4 text-neutral-500 hover:text-neutral-100 transition-colors text-[0.7rem] tracking-[0.18em] uppercase"
              >
                →
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const allProducts = await getProducts()
  const lower = term.toLowerCase()

  const results = allProducts.filter((p) => {
    if (p.status === 'masqué') return false
    return (
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.universe.toLowerCase().includes(lower) ||
      (UNIVERSE_LABELS[p.universe] ?? '').toLowerCase().includes(lower)
    )
  })

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* En-tête */}
        <div className="mb-12">
          <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-600 mb-4">
            — Recherche —
          </p>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-neutral-100 mb-3">
            &ldquo;{term}&rdquo;
          </h1>
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-neutral-600">
            {results.length === 0
              ? 'Aucun résultat'
              : `${results.length} résultat${results.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Barre de recherche inline */}
        <form action="/recherche" method="get" className="mb-16 max-w-md">
          <div className="flex items-center border border-neutral-800 focus-within:border-neutral-500 transition-colors">
            <input
              name="q"
              type="text"
              defaultValue={term}
              placeholder="Nouvelle recherche..."
              className="flex-1 bg-transparent px-4 py-3 text-neutral-200 placeholder-neutral-700 text-sm outline-none"
            />
            <button
              type="submit"
              className="px-4 py-3 text-neutral-600 hover:text-neutral-300 transition-colors text-[0.65rem] tracking-[0.18em] uppercase"
            >
              →
            </button>
          </div>
        </form>

        {/* Aucun résultat */}
        {results.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif italic text-xl text-neutral-500 mb-3">
              Aucun résultat pour &ldquo;{term}&rdquo;
            </p>
            <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-neutral-700">
              Essayez un autre terme ou explorez nos univers
            </p>
          </div>
        )}

        {/* Grille de résultats */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((product) => {
              const badge = UNIVERSE_BADGE[product.universe]
              return (
                <div key={product.id} className="group">
                  <Link href={`/produits/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-neutral-900">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-700 text-4xl">
                          ✦
                        </div>
                      )}
                      {product.status === 'vendu' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-[0.6rem] tracking-[0.22em] uppercase text-neutral-300 border border-neutral-500 px-4 py-1.5">
                            Vendu
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/produits/${product.id}`} className="flex-1 min-w-0">
                      <span
                        className={`inline-block text-[0.52rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm mb-2 ${badge.bg} ${badge.text}`}
                      >
                        {UNIVERSE_LABELS[product.universe]}
                      </span>
                      <h3 className="text-[0.9rem] leading-snug text-neutral-200 group-hover:text-neutral-100 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[0.82rem] tabular-nums shrink-0 pt-6 text-neutral-400">
                      {(product.price / 100).toFixed(2)} €
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
