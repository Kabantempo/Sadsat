import Link from 'next/link'
import type { Product } from '@/lib/definitions'

type Props = {
  products: Product[]
  theme?: 'light' | 'dark'
  emptyMessage?: string
}

export default function ProductGrid({ products, theme = 'light', emptyMessage }: Props) {
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
      {products.map((product) => (
        <div key={product.id} className="group">
          {/* Image */}
          <div className={`relative aspect-[3/4] overflow-hidden mb-5 ${light ? 'bg-neutral-100' : 'bg-neutral-900'}`}>
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-[0.58rem] tracking-[0.2em] uppercase ${light ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Photo à venir
                </span>
              </div>
            )}
            {product.status === 'vendu' && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                <span className="text-[0.6rem] tracking-[0.22em] uppercase text-neutral-600 bg-white/80 px-4 py-1.5">
                  Vendu
                </span>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-[0.6rem] tracking-[0.18em] uppercase mb-1 ${light ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {product.category}
              </p>
              <h3 className={`text-[0.9rem] leading-snug ${light ? 'text-neutral-800' : 'text-neutral-200'}`}>
                {product.name}
              </h3>
            </div>
            <p className={`text-[0.82rem] tabular-nums shrink-0 pt-4 ${light ? 'text-neutral-600' : 'text-neutral-400'}`}>
              {(product.price / 100).toFixed(2)} €
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
