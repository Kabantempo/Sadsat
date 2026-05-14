import Link from 'next/link'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
