import Link from 'next/link'
import { verifyCreateur } from '@/lib/dal'
import { getProducts } from '@/lib/products'
import { getUserById } from '@/lib/db'
import { Package, Plus } from 'lucide-react'

export default async function CreateurPage() {
  const session = await verifyCreateur()
  const user = await getUserById(session.userId)
  const allProducts = await getProducts()
  const myProducts = allProducts.filter((p) => p.createdBy === session.userId)
  const dispo = myProducts.filter((p) => p.status === 'disponible')
  const vendus = myProducts.filter((p) => p.status === 'vendu')

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Espace Créateur
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-2">
        Bonjour, {user?.name ?? 'Créateur'}
      </h1>
      <p className="text-[0.78rem] text-neutral-400 mb-10">{user?.email}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-neutral-200 mb-10">
        {[
          { label: 'Mes produits', value: myProducts.length },
          { label: 'Disponibles',  value: dispo.length },
          { label: 'Vendus',       value: vendus.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-6 text-center">
            <p className="font-serif text-3xl text-neutral-900">{value}</p>
            <p className="mt-1 text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Produits récents */}
      <div className="border border-neutral-200 bg-white">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500 flex items-center gap-2">
            <Package size={12} strokeWidth={1.5} />
            Mes produits récents
          </p>
          <Link
            href="/createur/produits/nouveau"
            className="flex items-center gap-1.5 text-[0.58rem] tracking-[0.16em] uppercase bg-neutral-900 text-white px-3 py-1.5 hover:bg-neutral-700 transition-colors"
          >
            <Plus size={10} strokeWidth={2} />
            Nouveau
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {myProducts.length === 0 && (
            <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">
              Aucun produit — <Link href="/createur/produits/nouveau" className="underline">créer le premier</Link>
            </p>
          )}
          {myProducts.slice(0, 5).map((p) => (
            <div key={p.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {p.images[0] && (
                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover bg-neutral-100" />
                )}
                <div>
                  <p className="text-[0.83rem] text-neutral-800">{p.name}</p>
                  <p className="text-[0.68rem] text-neutral-400">{p.universe} · {p.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[0.78rem] text-neutral-700">
                  {(p.price / 100).toFixed(2)} €
                </span>
                <span className={`text-[0.56rem] tracking-[0.14em] uppercase px-2 py-0.5 border ${
                  p.status === 'disponible' ? 'border-green-600 text-green-600'
                  : p.status === 'vendu' ? 'border-neutral-400 text-neutral-400'
                  : 'border-neutral-200 text-neutral-300'
                }`}>
                  {p.status}
                </span>
                <Link
                  href={`/createur/produits/${p.id}/modifier`}
                  className="text-[0.58rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
        {myProducts.length > 5 && (
          <div className="px-6 py-3 border-t border-neutral-100">
            <Link href="/createur/produits" className="text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors">
              Voir tous ({myProducts.length}) →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
