import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { getProducts } from '@/lib/products'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { Plus, Pencil, Package } from 'lucide-react'
import { UNIVERSE_LABELS } from '@/lib/definitions'

const UNIVERSE_COLORS: Record<string, string> = {
  taxidermie:  'bg-stone-100 text-stone-600',
  bijoux:      'bg-rose-100 text-rose-600',
  bougies:     'bg-amber-100 text-amber-600',
  habillement: 'bg-sky-100 text-sky-600',
}

export default async function ProduitsPage() {
  await verifyAdmin()
  const products = await getProducts()
  const dispo = products.filter((p) => p.status === 'disponible').length
  const vendu = products.filter((p) => p.status === 'vendu').length

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-1">Administration</p>
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900">Produits</h1>
          {products.length > 0 && (
            <p className="text-[0.72rem] text-neutral-400 mt-1">
              {products.length} produit{products.length > 1 ? 's' : ''} · {dispo} disponible{dispo > 1 ? 's' : ''} · {vendu} vendu{vendu > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[0.6rem] tracking-[0.2em] uppercase hover:bg-neutral-700 transition-colors shrink-0"
        >
          <Plus size={12} strokeWidth={2} />
          Nouveau
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-neutral-300 py-20 text-center">
          <Package size={36} strokeWidth={1} className="mx-auto mb-4 text-neutral-300" />
          <p className="text-[0.8rem] text-neutral-400 mb-4">Aucun produit pour l'instant.</p>
          <Link
            href="/admin/produits/nouveau"
            className="text-[0.62rem] tracking-[0.16em] uppercase text-neutral-900 underline underline-offset-4"
          >
            Créer le premier produit
          </Link>
        </div>
      ) : (
        <div className="border border-neutral-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[48px_1fr_130px_90px_100px_72px] gap-4 px-5 py-3 border-b border-neutral-100 bg-neutral-50 text-[0.54rem] tracking-[0.18em] uppercase text-neutral-400">
            <span>Photo</span>
            <span>Produit</span>
            <span>Marque</span>
            <span>Prix</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:grid md:grid-cols-[48px_1fr_130px_90px_100px_72px] gap-3 md:gap-4 px-5 py-4 items-start md:items-center hover:bg-neutral-50 transition-colors"
              >
                {/* Photo */}
                <div className="w-10 h-10 bg-neutral-100 overflow-hidden shrink-0">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={14} strokeWidth={1} className="text-neutral-300" />
                    </div>
                  )}
                </div>

                {/* Nom + catégorie */}
                <div>
                  <p className="text-[0.85rem] text-neutral-800 font-medium leading-tight">{p.name}</p>
                  <p className="text-[0.66rem] text-neutral-400 mt-0.5">{p.category}</p>
                </div>

                {/* Univers */}
                <span className={`text-[0.54rem] tracking-[0.1em] uppercase px-2.5 py-1 w-fit ${UNIVERSE_COLORS[p.universe] ?? 'bg-neutral-100 text-neutral-500'}`}>
                  {UNIVERSE_LABELS[p.universe]}
                </span>

                {/* Prix */}
                <span className="text-[0.82rem] text-neutral-700 tabular-nums">
                  {(p.price / 100).toFixed(2)} €
                </span>

                {/* Statut */}
                <span className={`text-[0.54rem] tracking-[0.14em] uppercase px-2.5 py-1 w-fit ${
                  p.status === 'disponible' ? 'bg-green-100 text-green-700'
                  : p.status === 'vendu'    ? 'bg-neutral-100 text-neutral-500'
                  : 'bg-neutral-50 text-neutral-300'
                }`}>
                  {p.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/produits/${p.id}/modifier`}
                    className="text-neutral-400 hover:text-neutral-900 transition-colors"
                    aria-label="Modifier"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
