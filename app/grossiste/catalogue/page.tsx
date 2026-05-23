import { verifyGrossiste } from '@/lib/dal'
import { getProducts } from '@/lib/products'
import { getSetting } from '@/lib/settings'
import { Package, Tag } from 'lucide-react'
import type { Universe } from '@/lib/definitions'

const UNIVERSE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  taxidermie:      { bg: 'bg-stone-100',  text: 'text-stone-600',  label: 'Crystal Pets' },
  bijoux:          { bg: 'bg-rose-100',   text: 'text-rose-600',   label: 'L0vers.cult' },
  bougies:         { bg: 'bg-amber-100',  text: 'text-amber-600',  label: 'Spectrum N°3' },
  habillement:     { bg: 'bg-sky-100',    text: 'text-sky-600',    label: 'Hackcycle' },
  'pieces-uniques':{ bg: 'bg-neutral-100',text: 'text-neutral-600',label: 'Pièces uniques' },
}

const UNIVERSE_LABELS: Record<string, string> = {
  taxidermie:      'Crystal Pets',
  bijoux:          'L0vers.cult',
  bougies:         'Spectrum N°3',
  habillement:     'Hackcycle',
  'pieces-uniques':'Pièces uniques',
}

export default async function GrossisteCataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ univers?: string }>
}) {
  await verifyGrossiste()

  const params = await searchParams
  const filterUniverse = params.univers ?? ''

  const allProducts = await getProducts()
  const discountRaw = await getSetting('grossiste_discount')
  const discount = discountRaw ? parseInt(discountRaw) : 30

  const visible = allProducts.filter((p) => p.status !== 'masqué')
  const filtered = filterUniverse
    ? visible.filter((p) => p.universe === filterUniverse)
    : visible

  const universes = [...new Set(visible.map((p) => p.universe))]

  return (
    <div className="px-4 md:px-6 py-12 max-w-6xl mx-auto">

      {/* En-tête */}
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Espace grossiste
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900">Catalogue B2B</h1>
          <p className="text-[0.72rem] text-neutral-400 mt-1">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} · Remise {discount} % appliquée
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 border border-sky-200">
          <Tag size={11} strokeWidth={1.5} className="text-sky-600" />
          <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sky-700">
            Prix grossiste : −{discount} %
          </span>
        </div>
      </div>

      {/* Filtres par univers */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/grossiste/catalogue"
          className={`text-[0.6rem] tracking-[0.14em] uppercase px-3 py-1.5 border transition-colors ${
            !filterUniverse
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
          }`}
        >
          Tous
        </a>
        {universes.map((u) => {
          const badge = UNIVERSE_BADGE[u]
          const isActive = filterUniverse === u
          return (
            <a
              key={u}
              href={`/grossiste/catalogue?univers=${u}`}
              className={`text-[0.6rem] tracking-[0.14em] uppercase px-3 py-1.5 border transition-colors ${
                isActive
                  ? `${badge?.bg ?? 'bg-neutral-100'} ${badge?.text ?? 'text-neutral-600'} border-current`
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
              }`}
            >
              {UNIVERSE_LABELS[u] ?? u}
            </a>
          )
        })}
      </div>

      {/* Grille produits */}
      {filtered.length === 0 ? (
        <p className="text-[0.82rem] text-neutral-400 italic py-12 text-center">
          Aucun produit disponible dans cet univers.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p) => {
            const badge = UNIVERSE_BADGE[p.universe]
            const publicPrice = p.price / 100
            const grossistePrice = publicPrice * (1 - discount / 100)
            const isSold = p.status === 'vendu'

            return (
              <div
                key={p.id}
                className="bg-white border border-neutral-200 overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                  {p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={24} strokeWidth={1} className="text-neutral-300" />
                    </div>
                  )}
                  {isSold && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-[0.6rem] tracking-[0.18em] uppercase text-neutral-500 bg-white border border-neutral-300 px-3 py-1">
                        Vendu
                      </span>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="px-3.5 py-3 flex flex-col gap-2 flex-1">
                  {/* Badge univers */}
                  <span
                    className={`self-start text-[0.5rem] tracking-[0.14em] uppercase px-2 py-0.5 ${
                      badge?.bg ?? 'bg-neutral-100'
                    } ${badge?.text ?? 'text-neutral-500'}`}
                  >
                    {badge?.label ?? p.universe}
                  </span>

                  {/* Nom */}
                  <p className="text-[0.8rem] text-neutral-800 leading-snug flex-1">
                    {p.name}
                  </p>

                  {/* Prix */}
                  <div className="flex flex-col gap-0.5 mt-auto">
                    <span className="text-[0.62rem] text-neutral-400 line-through tabular-nums">
                      {publicPrice.toFixed(2)} €
                    </span>
                    <span className="text-[0.88rem] font-medium text-sky-700 tabular-nums">
                      {grossistePrice.toFixed(2)} € B2B
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
