import Link from 'next/link'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { verifyGrossiste, getCurrentUser } from '@/lib/dal'

export default async function GrossisteLayout({ children }: { children: React.ReactNode }) {
  await verifyGrossiste()
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Barre B2B */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/grossiste"
            className="text-[0.58rem] tracking-[0.24em] uppercase text-neutral-800 font-semibold whitespace-nowrap hover:text-neutral-500 transition-colors"
          >
            SADSAT B2B
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/grossiste"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap"
            >
              <LayoutDashboard size={12} strokeWidth={1.5} />
              Dashboard
            </Link>
            <Link
              href="/grossiste/catalogue"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap"
            >
              <Package size={12} strokeWidth={1.5} />
              Catalogue
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400 whitespace-nowrap">
              {user.name}
            </span>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap"
            >
              <LogOut size={12} strokeWidth={1.5} />
              Déconnexion
            </button>
          </form>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
