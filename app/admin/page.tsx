import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { getUsers } from '@/lib/db'
import { getProducts } from '@/lib/products'
import { Package, Plus } from 'lucide-react'

export default async function AdminPage() {
  const session = await verifyAdmin()
  const users = getUsers()
  const products = getProducts()
  const clients = users.filter((u) => u.role === 'client')
  const admins = users.filter((u) => u.role === 'admin')
  const dispo = products.filter((p) => p.status === 'disponible')

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Administration
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Tableau de bord
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 mb-10">
        {[
          { label: 'Produits', value: products.length },
          { label: 'Disponibles', value: dispo.length },
          { label: 'Clients', value: clients.length },
          { label: 'Admins', value: admins.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-6 text-center">
            <p className="font-serif text-3xl text-neutral-900">{value}</p>
            <p className="mt-1 text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Accès rapide produits */}
      <div className="border border-neutral-200 bg-white mb-10">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500 flex items-center gap-2">
            <Package size={12} strokeWidth={1.5} />
            Produits récents
          </p>
          <Link
            href="/admin/produits/nouveau"
            className="flex items-center gap-1.5 text-[0.58rem] tracking-[0.16em] uppercase bg-neutral-900 text-white px-3 py-1.5 hover:bg-neutral-700 transition-colors"
          >
            <Plus size={10} strokeWidth={2} />
            Nouveau
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {products.length === 0 && (
            <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">
              Aucun produit — <Link href="/admin/produits/nouveau" className="underline">créer le premier</Link>
            </p>
          )}
          {products.slice(0, 5).map((p) => (
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
                  href={`/admin/produits/${p.id}/modifier`}
                  className="text-[0.58rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
        {products.length > 5 && (
          <div className="px-6 py-3 border-t border-neutral-100">
            <Link href="/admin/produits" className="text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors">
              Voir tous ({products.length}) →
            </Link>
          </div>
        )}
      </div>

      {/* Comptes */}
      <div className="border border-neutral-200 bg-white">
        <div className="px-6 py-4 border-b border-neutral-100">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Comptes utilisateurs
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {users.length === 0 && (
            <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">Aucun compte.</p>
          )}
          {users.map((u) => (
            <div key={u.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.83rem] text-neutral-800">{u.name}</p>
                <p className="text-[0.68rem] text-neutral-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[0.56rem] tracking-[0.16em] uppercase px-2 py-0.5 border ${
                  u.role === 'admin' ? 'border-neutral-900 text-neutral-900'
                  : u.role === 'créateur' ? 'border-neutral-500 text-neutral-500'
                  : 'border-neutral-200 text-neutral-400'
                }`}>
                  {u.role === 'admin' ? 'Admin' : u.role === 'créateur' ? 'Créateur' : 'Client'}
                </span>
                {u.id === session.userId && (
                  <span className="text-[0.6rem] text-neutral-300">(vous)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
