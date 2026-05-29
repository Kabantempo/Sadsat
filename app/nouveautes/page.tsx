export const revalidate = 30

import type { Metadata } from 'next'
import { getProducts } from '@/lib/products'
import { UNIVERSE_LABELS } from '@/lib/definitions'
import NouveautesCard from '@/components/shared/NouveautesCard'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata: Metadata = {
  title: 'Nouveautés — SADSAT',
  description: 'Découvrez les dernières créations SADSAT : taxidermie éthique, bijoux en maille métallique, bougies artisanales et mode upcycling. Pièces uniques faites main, ajoutées régulièrement.',
  keywords: ['nouveautés artisanat', 'nouvelles créations SADSAT', 'pièces uniques récentes', 'taxidermie bijoux bougies nouveautés', 'artisanat français édition limitée'],
  alternates: { canonical: `${BASE_URL}/nouveautes` },
  openGraph: {
    title: 'Nouveautés — SADSAT',
    description: 'Les dernières créations SADSAT : taxidermie éthique, bijoux, bougies artisanales et mode upcycling. Nouvelles pièces ajoutées régulièrement.',
    url: `${BASE_URL}/nouveautes`,
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SADSAT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nouveautés — SADSAT',
    description: 'Les dernières créations SADSAT : pièces uniques faites main, ajoutées régulièrement.',
  },
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
            {products.map((p, idx) => (
              <NouveautesCard
                key={p.id}
                id={p.id}
                name={p.name}
                image={p.images[0] ?? null}
                video={p.video ?? null}
                price={p.price}
                universeLabel={UNIVERSE_LABELS[p.universe as keyof typeof UNIVERSE_LABELS] ?? p.universe}
                badgeColor={UNIVERSE_COLOR[p.universe] ?? 'bg-neutral-800 text-neutral-400'}
                status={p.status}
                isNew={idx < 4}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
