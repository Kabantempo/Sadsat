import Link from 'next/link'
import { LayoutDashboard, Package, Users, LogOut, Database, ShoppingBag, Store, Mail, Settings } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { verifyAdmin } from '@/lib/dal'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyAdmin()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Barre admin */}
      <div className="bg-neutral-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="text-[0.58rem] tracking-[0.24em] uppercase text-neutral-400 font-medium whitespace-nowrap hover:text-white transition-colors"
          >
            Admin SADSAT
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <LayoutDashboard size={12} strokeWidth={1.5} />
              Tableau de bord
            </Link>
            <Link
              href="/admin/produits"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Package size={12} strokeWidth={1.5} />
              Produits
            </Link>
            <Link
              href="/admin/comptes"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Users size={12} strokeWidth={1.5} />
              Comptes
            </Link>
            <Link
              href="/admin/commandes"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              Commandes
            </Link>
            <Link
              href="/admin/marques"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Store size={12} strokeWidth={1.5} />
              Marques
            </Link>
            <Link
              href="/admin/newsletter"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Mail size={12} strokeWidth={1.5} />
              Newsletter
            </Link>
            <Link
              href="/admin/db"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Database size={12} strokeWidth={1.5} />
              DB
            </Link>
            <Link
              href="/admin/parametres"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Settings size={12} strokeWidth={1.5} />
              Paramètres
            </Link>
          </nav>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-white transition-colors whitespace-nowrap"
          >
            <LogOut size={12} strokeWidth={1.5} />
            Déconnexion
          </button>
        </form>
      </div>
      <div>{children}</div>
    </div>
  )
}
