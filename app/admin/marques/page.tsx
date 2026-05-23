import { verifyAdmin } from '@/lib/dal'
import { getBrandCategories, getBrandSlides } from '@/lib/brand'
import Link from 'next/link'
import { Images, Tag, ArrowRight, Store } from 'lucide-react'

const BRANDS = [
  {
    universe: 'taxidermie',
    name: 'Crystal Pets',
    tagline: 'Taxidermie éthique',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    header: 'bg-stone-100',
    fg: 'text-stone-700',
    accent: 'bg-stone-800',
  },
  {
    universe: 'bijoux',
    name: 'L0vers.cult',
    tagline: 'Bijoux en mailles métalliques',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    header: 'bg-rose-100',
    fg: 'text-rose-700',
    accent: 'bg-rose-800',
  },
  {
    universe: 'bougies',
    name: 'Spectrum N°3',
    tagline: 'Bougies artisanales',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    header: 'bg-amber-100',
    fg: 'text-amber-700',
    accent: 'bg-amber-800',
  },
  {
    universe: 'habillement',
    name: 'Hackcycle',
    tagline: 'Prêt-à-porter alternatif',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    header: 'bg-sky-100',
    fg: 'text-sky-700',
    accent: 'bg-sky-800',
  },
]

export default async function AdminMarquesPage() {
  await verifyAdmin()
  const data = await Promise.all(
    BRANDS.map(async (b) => ({
      ...b,
      categories: (await getBrandCategories(b.universe)).length,
      slides: (await getBrandSlides(b.universe)).length,
    }))
  )

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">Marques</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((b) => (
          <div key={b.universe} className={`${b.border} border overflow-hidden`}>
            {/* En-tête marque */}
            <div className={`${b.header} px-6 py-5 flex items-center gap-4`}>
              <div className={`w-10 h-10 ${b.accent} flex items-center justify-center shrink-0`}>
                <Store size={16} strokeWidth={1.5} className="text-white/80" />
              </div>
              <div>
                <p className={`font-medium ${b.fg} text-[0.92rem]`}>{b.name}</p>
                <p className={`text-[0.62rem] tracking-[0.08em] ${b.fg} opacity-60 mt-0.5`}>{b.tagline}</p>
              </div>
            </div>

            {/* Actions */}
            <div className={`${b.bg} px-6 py-5 grid grid-cols-2 gap-2`}>
              <Link
                href={`/admin/marques/${b.universe}/carousel`}
                className="flex items-center gap-2.5 px-4 py-3.5 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors group"
              >
                <Images size={14} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] text-neutral-700">Carrousel</p>
                  <p className="text-[0.58rem] text-neutral-400 mt-0.5">
                    {b.slides} image{b.slides !== 1 ? 's' : ''}
                  </p>
                </div>
                <ArrowRight size={11} strokeWidth={1.5} className="text-neutral-300 group-hover:text-neutral-600 transition-colors shrink-0" />
              </Link>
              <Link
                href={`/admin/marques/${b.universe}/categories`}
                className="flex items-center gap-2.5 px-4 py-3.5 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors group"
              >
                <Tag size={14} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] text-neutral-700">Catégories</p>
                  <p className="text-[0.58rem] text-neutral-400 mt-0.5">
                    {b.categories} catégorie{b.categories !== 1 ? 's' : ''}
                  </p>
                </div>
                <ArrowRight size={11} strokeWidth={1.5} className="text-neutral-300 group-hover:text-neutral-600 transition-colors shrink-0" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
