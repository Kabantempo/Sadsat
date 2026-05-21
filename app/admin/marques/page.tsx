import { getBrandCategories, getBrandSlides } from '@/lib/brand'
import Link from 'next/link'
import { Images, Tag, ArrowRight } from 'lucide-react'

const BRANDS = [
  { universe: 'taxidermie', name: 'Crystal Pets',  color: 'bg-stone-100'   },
  { universe: 'bijoux',     name: 'L0vers.cult',   color: 'bg-rose-50'     },
  { universe: 'bougies',    name: 'Spectrum N°3',  color: 'bg-amber-50'    },
  { universe: 'habillement',name: 'Hackcycle',     color: 'bg-neutral-100' },
]

export default async function AdminMarquesPage() {
  const data = await Promise.all(
    BRANDS.map(async (b) => ({
      ...b,
      categories: (await getBrandCategories(b.universe)).length,
      slides: (await getBrandSlides(b.universe)).length,
    }))
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-light text-neutral-800 mb-8">Gestion des marques</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((b) => (
          <div key={b.universe} className={`${b.color} border border-neutral-200 rounded-xl p-5`}>
            <h2 className="font-medium text-neutral-800 mb-1">{b.name}</h2>
            <p className="text-xs text-neutral-500 mb-4 capitalize">{b.universe}</p>
            <div className="flex gap-3">
              <Link
                href={`/admin/marques/${b.universe}/carousel`}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-neutral-400 transition-colors"
              >
                <Images size={13} strokeWidth={1.5} />
                Carrousel <span className="text-neutral-400">({b.slides})</span>
              </Link>
              <Link
                href={`/admin/marques/${b.universe}/categories`}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-neutral-400 transition-colors"
              >
                <Tag size={13} strokeWidth={1.5} />
                Catégories <span className="text-neutral-400">({b.categories})</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
