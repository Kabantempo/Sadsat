import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { getUsers } from '@/lib/db'
import { getProducts } from '@/lib/products'
import { Package, Plus, Users, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'

const UNIVERSE_COLORS: Record<string, { fg: string; label: string }> = {
  taxidermie:  { fg: 'text-stone-600',  label: 'Crystal Pets' },
  bijoux:      { fg: 'text-rose-600',   label: 'L0vers.cult' },
  bougies:     { fg: 'text-amber-600',  label: 'Spectrum N°3' },
  habillement: { fg: 'text-sky-600',    label: 'Hackcycle' },
}

export default async function AdminPage() {
  const session = await verifyAdmin()
  const users = await getUsers()
  const products = await getProducts()
  const clients = users.filter((u) => u.role === 'client')
  const createurs = users.filter((u) => u.role === 'créateur')
  const admins = users.filter((u) => u.role === 'admin')
  const dispo = products.filter((p) => p.status === 'disponible')
  const vendu = products.filter((p) => p.status === 'vendu')

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Produits',    value: products.length, icon: Package,    bg: 'bg-neutral-900', fg: 'text-white' },
          { label: 'Disponibles', value: dispo.length,    icon: TrendingUp, bg: 'bg-green-50',    fg: 'text-green-700' },
          { label: 'Vendus',      value: vendu.length,    icon: ShieldCheck,bg: 'bg-neutral-50',  fg: 'text-neutral-500' },
          { label: 'Clients',     value: clients.length,  icon: Users,      bg: 'bg-sky-50',      fg: 'text-sky-700' },
        ].map(({ label, value, icon: Icon, bg, fg }) => (
          <div key={label} className={`${bg} border border-neutral-200 px-5 py-4 flex items-center gap-3`}>
            <Icon size={18} strokeWidth={1.5} className={`${fg} opacity-60 shrink-0`} />
            <div>
              <p className={`font-serif text-2xl leading-none ${fg}`}>{value}</p>
              <p className={`text-[0.56rem] tracking-[0.18em] uppercase mt-1 ${fg} opacity-60`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Produits récents */}
        <div className="lg:col-span-2 border border-neutral-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={13} strokeWidth={1.5} className="text-neutral-400" />
              <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">Produits récents</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/produits"
                className="flex items-center gap-1 text-[0.56rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                Tous <ArrowRight size={9} strokeWidth={1.5} />
              </Link>
              <Link
                href="/admin/produits/nouveau"
                className="flex items-center gap-1.5 text-[0.58rem] tracking-[0.16em] uppercase bg-neutral-900 text-white px-3 py-1.5 hover:bg-neutral-700 transition-colors"
              >
                <Plus size={10} strokeWidth={2} />
                Nouveau
              </Link>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {products.length === 0 && (
              <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">
                Aucun produit — <Link href="/admin/produits/nouveau" className="underline">créer le premier</Link>
              </p>
            )}
            {products.slice(0, 5).map((p) => {
              const uc = UNIVERSE_COLORS[p.universe]
              return (
                <div key={p.id} className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 overflow-hidden bg-neutral-100">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} strokeWidth={1} className="text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[0.83rem] text-neutral-800 leading-tight">{p.name}</p>
                      <span className={`text-[0.58rem] tracking-[0.08em] ${uc?.fg ?? 'text-neutral-400'}`}>
                        {uc?.label ?? p.universe}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[0.78rem] text-neutral-700 tabular-nums">{(p.price / 100).toFixed(2)} €</span>
                    <span className={`text-[0.52rem] tracking-[0.14em] uppercase px-2 py-0.5 ${
                      p.status === 'disponible' ? 'bg-green-100 text-green-700'
                      : p.status === 'vendu'    ? 'bg-neutral-100 text-neutral-500'
                      : 'bg-neutral-50 text-neutral-300'
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
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Accès rapide */}
          <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100">
              <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">Accès rapide</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {[
                { label: 'Nouveau produit',   href: '/admin/produits/nouveau' },
                { label: 'Gérer les comptes',  href: '/admin/comptes' },
                { label: 'Voir les commandes', href: '/admin/commandes' },
                { label: 'Gérer les marques',  href: '/admin/marques' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors group"
                >
                  <span className="text-[0.72rem] text-neutral-700">{label}</span>
                  <ArrowRight size={11} strokeWidth={1.5} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Équipe */}
          <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">Équipe</p>
              <Link
                href="/admin/comptes"
                className="flex items-center gap-1 text-[0.56rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                Gérer <ArrowRight size={9} strokeWidth={1.5} />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {[...admins, ...createurs].map((u) => (
                <div key={u.id} className="px-5 py-2.5 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    u.role === 'admin' ? 'bg-neutral-900' : 'bg-rose-100'
                  }`}>
                    <span className={`text-[0.62rem] font-medium uppercase ${
                      u.role === 'admin' ? 'text-white' : 'text-rose-600'
                    }`}>{u.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.75rem] text-neutral-800 truncate flex items-center gap-1.5">
                      {u.name}
                      {u.id === session.userId && (
                        <span className="text-[0.5rem] tracking-[0.1em] uppercase text-neutral-400">(vous)</span>
                      )}
                    </p>
                  </div>
                  <span className={`text-[0.5rem] tracking-[0.12em] uppercase px-1.5 py-0.5 ${
                    u.role === 'admin' ? 'bg-neutral-900 text-white' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'Créateur'}
                  </span>
                </div>
              ))}
              {admins.length + createurs.length === 0 && (
                <p className="px-5 py-4 text-[0.72rem] text-neutral-400 italic">Aucun membre.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
