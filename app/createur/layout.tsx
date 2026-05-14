import Link from 'next/link'
import { LayoutDashboard, Package, UserCircle, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function CreateurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-neutral-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[0.58rem] tracking-[0.24em] uppercase text-neutral-400 font-medium">
            Espace Créateur
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/createur"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <LayoutDashboard size={12} strokeWidth={1.5} />
              Tableau de bord
            </Link>
            <Link
              href="/createur/produits"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <Package size={12} strokeWidth={1.5} />
              Mes produits
            </Link>
            <Link
              href="/createur/profil"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <UserCircle size={12} strokeWidth={1.5} />
              Mon profil
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
