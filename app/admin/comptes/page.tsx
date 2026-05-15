import { verifyAdmin } from '@/lib/dal'
import { getUsers } from '@/lib/db'
import { UserPlus, Palette, ShoppingBag } from 'lucide-react'
import CreateAdminForm from '@/components/admin/CreateAdminForm'
import CreateCreateurForm from '@/components/admin/CreateCreateurForm'
import CreateGrossisteForm from '@/components/admin/CreateGrossisteForm'
import DeleteUserButton from '@/components/admin/DeleteUserButton'

export default async function AdminComptesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>
}) {
  const session = await verifyAdmin()
  const params = await searchParams
  const users = getUsers()
  const admins = users.filter((u) => u.role === 'admin')
  const createurs = users.filter((u) => u.role === 'créateur')
  const grossistes = users.filter((u) => u.role === 'grossiste')
  const clients = users.filter((u) => u.role === 'client')

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Administration
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Gestion des comptes
      </h1>

      {/* Formulaires de création */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">

        {/* Créer admin */}
        <div className="border border-neutral-200 bg-white">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <UserPlus size={13} strokeWidth={1.5} className="text-neutral-500" />
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
              Nouveau compte admin
            </p>
          </div>
          <div className="px-6 py-6">
            {params.ok === 'admin' && (
              <p className="mb-4 text-[0.72rem] text-green-600 tracking-wide">Compte admin créé.</p>
            )}
            <CreateAdminForm />
          </div>
        </div>

        {/* Créer créateur */}
        <div className="border border-neutral-200 bg-white">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <Palette size={13} strokeWidth={1.5} className="text-neutral-500" />
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
              Nouveau compte créateur
            </p>
          </div>
          <div className="px-6 py-6">
            {params.ok === 'créateur' && (
              <p className="mb-4 text-[0.72rem] text-green-600 tracking-wide">Compte créateur créé.</p>
            )}
            <CreateCreateurForm />
          </div>
        </div>

        {/* Créer grossiste */}
        <div className="border border-neutral-200 bg-white">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <ShoppingBag size={13} strokeWidth={1.5} className="text-neutral-500" />
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
              Nouveau compte grossiste
            </p>
          </div>
          <div className="px-6 py-6">
            {params.ok === 'grossiste' && (
              <p className="mb-4 text-[0.72rem] text-green-600 tracking-wide">Compte grossiste créé.</p>
            )}
            <CreateGrossisteForm />
          </div>
        </div>
      </div>

      {/* Admins */}
      <div className="border border-neutral-200 bg-white mb-4">
        <div className="px-6 py-4 border-b border-neutral-100">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Administrateurs ({admins.length})
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {admins.map((u) => (
            <div key={u.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.83rem] text-neutral-800">{u.name}</p>
                <p className="text-[0.68rem] text-neutral-400">{u.email}</p>
              </div>
              {u.id === session.userId ? (
                <span className="text-[0.6rem] text-neutral-300 italic">vous</span>
              ) : (
                <DeleteUserButton id={u.id} name={u.name} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Créateurs */}
      <div className="border border-neutral-200 bg-white mb-4">
        <div className="px-6 py-4 border-b border-neutral-100">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Créateurs ({createurs.length})
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {createurs.length === 0 && (
            <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">Aucun créateur.</p>
          )}
          {createurs.map((u) => (
            <div key={u.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.83rem] text-neutral-800">{u.name}</p>
                <p className="text-[0.68rem] text-neutral-400">{u.email}</p>
              </div>
              <DeleteUserButton id={u.id} name={u.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Grossistes */}
      <div className="border border-neutral-200 bg-white mb-4">
        <div className="px-6 py-4 border-b border-neutral-100">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Grossistes ({grossistes.length})
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {grossistes.length === 0 && (
            <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">Aucun grossiste.</p>
          )}
          {grossistes.map((u) => (
            <div key={u.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.83rem] text-neutral-800">{u.name}</p>
                <p className="text-[0.68rem] text-neutral-400">{u.email}</p>
              </div>
              <DeleteUserButton id={u.id} name={u.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div className="border border-neutral-200 bg-white">
        <div className="px-6 py-4 border-b border-neutral-100">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Clients ({clients.length})
          </p>
        </div>
        <div className="divide-y divide-neutral-100">
          {clients.length === 0 && (
            <p className="px-6 py-8 text-[0.82rem] text-neutral-400 italic">Aucun client.</p>
          )}
          {clients.map((u) => (
            <div key={u.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.83rem] text-neutral-800">{u.name}</p>
                <p className="text-[0.68rem] text-neutral-400">{u.email}</p>
              </div>
              <DeleteUserButton id={u.id} name={u.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
