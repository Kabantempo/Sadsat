import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { getProducts } from '@/lib/products'
import { deleteProductAction } from '@/app/actions/products'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { Plus, Pencil } from 'lucide-react'
import { UNIVERSE_LABELS } from '@/lib/definitions'

export default async function ProduitsPage() {
  await verifyAdmin()
  const products = await getProducts()

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-1">Administration</p>
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
            Produits
            <span className="ml-3 text-neutral-300 text-xl">({products.length})</span>
          </h1>
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
        <div className="border border-dashed border-neutral-300 p-16 text-center">
          <p className="text-[0.8rem] text-neutral-400 mb-4">Aucun produit pour l'instant.</p>
          <Link
            href="/admin/produits/nouveau"
            className="text-[0.62rem] tracking-[0.16em] uppercase text-neutral-900 underline underline-offset-4"
          >
            Créer le premier produit
          </Link>
        </div>
      ) : (
        <div className="border border-neutral-200 bg-white overflow-x-auto">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[56px_1fr_120px_80px_90px_80px] gap-4 px-5 py-3 border-b border-neutral-100 text-[0.56rem] tracking-[0.16em] uppercase text-neutral-400">
            <span>Photo</span>
            <span>Produit</span>
            <span>Univers</span>
            <span>Prix</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:grid md:grid-cols-[56px_1fr_120px_80px_90px_80px] gap-3 md:gap-4 px-5 py-4 items-start md:items-center"
              >
                {/* Photo */}
                <div className="w-12 h-12 bg-neutral-100 overflow-hidden shrink-0">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-300 text-[0.5rem]">—</span>
                    </div>
                  )}
                </div>

                {/* Nom + catégorie */}
                <div>
                  <p className="text-[0.85rem] text-neutral-800 font-medium leading-tight">{p.name}</p>
                  <p className="text-[0.68rem] text-neutral-400 mt-0.5">{p.category}</p>
                </div>

                {/* Univers */}
                <span className="text-[0.62rem] tracking-[0.1em] text-neutral-500">
                  {UNIVERSE_LABELS[p.universe]}
                </span>

                {/* Prix */}
                <span className="text-[0.82rem] text-neutral-700 tabular-nums">
                  {(p.price / 100).toFixed(2)} €
                </span>

                {/* Statut */}
                <span className={`text-[0.54rem] tracking-[0.14em] uppercase px-2 py-0.5 border w-fit ${
                  p.status === 'disponible' ? 'border-green-600 text-green-600'
                  : p.status === 'vendu' ? 'border-neutral-400 text-neutral-400'
                  : 'border-neutral-200 text-neutral-300'
                }`}>
                  {p.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-4">
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
