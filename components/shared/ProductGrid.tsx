import Link from 'next/link'
import type { Product } from '@/lib/definitions'
import FavoriteButton from './FavoriteButton'
import ProductCardMedia from './ProductCardMedia'

type RatingMap = Record<string, { avg: number; count: number }>

type Props = {
  products: Product[]
  theme?: 'light' | 'dark'
  emptyMessage?: string
  ratings?: RatingMap
}

function StarRating({ avg, count, light }: { avg: number; count: number; light: boolean }) {
  const full = Math.round(avg)
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-amber-400 text-[0.62rem] leading-none">
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span className={`text-[0.55rem] tabular-nums ${light ? 'text-neutral-400' : 'text-neutral-600'}`}>
        {avg.toFixed(1)} ({count})
      </span>
    </div>
  )
}

export default function ProductGrid({ products, theme = 'light', emptyMessage, ratings }: Props) {
  const light = theme === 'light'

  if (products.length === 0) {
    return (
      <div className={`py-24 text-center ${light ? 'text-neutral-400' : 'text-neutral-600'}`}>
        <p className="text-[0.78rem] tracking-[0.12em]">
          {emptyMessage ?? 'Aucune pièce disponible pour le moment.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const rating = ratings?.[product.id]
        return (
          <div key={product.id} className="group">
            {/* Image / Vidéo */}
            <Link href={`/produits/${product.id}`} className="block relative">
              <ProductCardMedia
                image={product.images[0] ?? null}
                video={product.video ?? null}
                name={product.name}
                sold={product.status === 'vendu'}
                light={light}
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <FavoriteButton
                  productId={product.id}
                  className={`p-1.5 rounded-full ${light ? 'bg-white/80' : 'bg-black/60'}`}
                  size={14}
                />
              </div>
            </Link>

            {/* Infos */}
            <div className="flex items-start justify-between gap-3 mt-3">
              <Link href={`/produits/${product.id}`} className="flex-1 min-w-0">
                <p className={`text-[0.6rem] tracking-[0.18em] uppercase mb-1 ${light ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {product.category}
                </p>
                <h3 className={`text-[0.9rem] leading-snug hover:underline ${light ? 'text-neutral-800' : 'text-neutral-200'}`}>
                  {product.name}
                </h3>
                {rating && <StarRating avg={rating.avg} count={rating.count} light={light} />}
              </Link>
              <p className={`text-[0.82rem] tabular-nums shrink-0 pt-4 ${light ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {(product.price / 100).toFixed(2)} €
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
