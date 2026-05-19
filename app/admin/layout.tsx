import Link from 'next/link'
import { LayoutDashboard, Package, Users, LogOut, Database } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { verifyAdmin } from '@/lib/dal'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyAdmin()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Barre admin */}
      <div className="bg-neutral-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[0.58rem] tracking-[0.24em] uppercase text-neutral-400 font-medium">
            Admin SADSAT
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <LayoutDashboard size={12} strokeWidth={1.5} />
              Tableau de bord
            </Link>
            <Link
              href="/admin/produits"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <Package size={12} strokeWidth={1.5} />
              Produits
            </Link>
            <Link
              href="/admin/comptes"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <Users size={12} strokeWidth={1.5} />
              Comptes
            </Link>
            <Link
              href="/admin/db"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <Database size={12} strokeWidth={1.5} />
              DB
            </Link>
          </nav>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-white transition-colors"
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
