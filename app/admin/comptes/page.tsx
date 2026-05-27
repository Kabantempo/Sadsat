import { verifyAdmin } from '@/lib/dal'
import { getUsers } from '@/lib/db'
import { UserPlus, ShieldCheck, Palette, ShoppingBag, Users, Store, Pencil } from 'lucide-react'
import DeleteUserButton from '@/components/admin/DeleteUserButton'
import { setUserUniverseAction, updateUserInfoAction } from '@/app/actions/admin'
import Link from 'next/link'

const UNIVERSE_LABELS: Record<string, string> = {
  taxidermie: 'Crystal Pets',
  bijoux: 'L0vers.cult',
  bougies: 'Spectrum N°3',
  habillement: 'Hackcycle',
}

function SectionHeader({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: React.ElementType
  label: string
  count: number
  color: string
}) {
  return (
    <div className={`px-6 py-4 border-b border-neutral-100 flex items-center gap-3 ${color}`}>
      <Icon size={14} strokeWidth={1.5} className="shrink-0" />
      <p className="text-[0.62rem] tracking-[0.18em] uppercase font-medium flex-1">{label}</p>
      <span className="text-[0.58rem] tracking-[0.14em] bg-white/60 px-2 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  )
}

function EmptyRow({ message }: { message: string }) {
  return (
    <p className="px-6 py-8 text-[0.78rem] text-neutral-400 italic text-center">{message}</p>
  )
}

const ROLE_OPTIONS = [
  { value: 'client',    label: 'Client' },
  { value: 'créateur',  label: 'Créateur' },
  { value: 'grossiste', label: 'Grossiste' },
  { value: 'admin',     label: 'Administrateur' },
]

function UserEditPanel({ u, isSelf }: { u: { id: string; name: string; role: string }; isSelf: boolean }) {
  if (isSelf) return null
  return (
    <details className="border-t border-neutral-100 bg-neutral-50">
      <summary className="px-6 py-2 flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-700 cursor-pointer list-none select-none">
        <Pencil size={10} /> Modifier
      </summary>
      <form action={updateUserInfoAction} className="px-6 py-4 flex flex-wrap items-end gap-3 border-t border-neutral-100">
        <input type="hidden" name="userId" value={u.id} />
        <div>
          <label className="block text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 mb-1">Nom complet</label>
          <input
            type="text"
            name="name"
            defaultValue={u.name}
            required
            className="border border-neutral-200 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-400 bg-white w-52"
          />
        </div>
        <div>
          <label className="block text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 mb-1">Rôle</label>
          <select
            name="role"
            defaultValue={u.role}
            className="border border-neutral-200 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-400 bg-white"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 bg-neutral-900 text-white text-[0.6rem] tracking-[0.14em] uppercase rounded hover:bg-neutral-700 transition-colors"
        >
          Enregistrer
        </button>
      </form>
    </details>
  )
}

export default async function AdminComptesPage() {
  const session = await verifyAdmin()
  const users = await getUsers()
  const admins    = users.filter((u) => u.role === 'admin')
  const createurs = users.filter((u) => u.role === 'créateur')
  const grossistes = users.filter((u) => u.role === 'grossiste')
  const clients   = users.filter((u) => u.role === 'client')

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">

      {/* En-tête */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
            Administration
          </p>
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
            Gestion des comptes
          </h1>
          <p className="text-[0.75rem] text-neutral-400 mt-1">
            {users.length} compte{users.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/admin/comptes/nouveau"
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-[0.6rem] tracking-[0.18em] uppercase hover:bg-neutral-700 transition-colors shrink-0"
        >
          <UserPlus size={12} strokeWidth={1.5} />
          Nouveau compte
        </Link>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Admins',    value: admins.length,    icon: ShieldCheck, bg: 'bg-neutral-900', fg: 'text-white' },
          { label: 'Créateurs', value: createurs.length, icon: Palette,     bg: 'bg-rose-50',    fg: 'text-rose-700' },
          { label: 'Grossistes',value: grossistes.length,icon: ShoppingBag, bg: 'bg-sky-50',     fg: 'text-sky-700' },
          { label: 'Clients',   value: clients.length,   icon: Users,       bg: 'bg-neutral-50', fg: 'text-neutral-700' },
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

      <div className="space-y-4">

        {/* ── Administrateurs ── */}
        <div className="border border-neutral-200 bg-white overflow-hidden">
          <SectionHeader icon={ShieldCheck} label="Administrateurs" count={admins.length} color="text-neutral-700 bg-neutral-50" />
          <div className="divide-y divide-neutral-100">
            {admins.length === 0 && <EmptyRow message="Aucun administrateur." />}
            {admins.map((u) => (
              <div key={u.id}>
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-[0.72rem] font-medium uppercase">{u.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.83rem] font-medium text-neutral-800 flex items-center gap-2">
                      {u.name}
                      {u.id === session.userId && (
                        <span className="text-[0.52rem] tracking-[0.14em] uppercase bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">vous</span>
                      )}
                    </p>
                    <p className="text-[0.68rem] text-neutral-400 truncate">{u.email}</p>
                  </div>
                  {u.id !== session.userId && <DeleteUserButton id={u.id} name={u.name} />}
                </div>
                <UserEditPanel u={u} isSelf={u.id === session.userId} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Créateurs ── */}
        <div className="border border-rose-100 bg-white overflow-hidden">
          <SectionHeader icon={Palette} label="Créateurs" count={createurs.length} color="text-rose-700 bg-rose-50" />
          <div className="divide-y divide-neutral-100">
            {createurs.length === 0 && <EmptyRow message="Aucun créateur." />}
            {createurs.map((u) => (
              <div key={u.id}>
                <div className="px-6 py-4 flex flex-wrap items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <span className="text-rose-700 text-[0.72rem] font-medium uppercase">{u.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.83rem] font-medium text-neutral-800">{u.name}</p>
                    <p className="text-[0.68rem] text-neutral-400 truncate">{u.email}</p>
                    {u.universe && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[0.56rem] tracking-[0.14em] uppercase bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
                        <Store size={9} strokeWidth={1.5} />
                        {UNIVERSE_LABELS[u.universe] ?? u.universe}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <form action={setUserUniverseAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select name="universe" defaultValue={u.universe ?? ''}
                        className="text-[0.65rem] border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-600 bg-white outline-none focus:border-neutral-400 transition-colors">
                        <option value="">— aucune marque —</option>
                        <option value="taxidermie">Crystal Pets</option>
                        <option value="bijoux">L0vers.cult</option>
                        <option value="bougies">Spectrum N°3</option>
                        <option value="habillement">Hackcycle</option>
                      </select>
                      <button type="submit" className="text-[0.6rem] tracking-[0.14em] uppercase px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition-colors rounded-lg">
                        Assigner
                      </button>
                    </form>
                    <DeleteUserButton id={u.id} name={u.name} />
                  </div>
                </div>
                <UserEditPanel u={u} isSelf={false} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Grossistes ── */}
        <div className="border border-sky-100 bg-white overflow-hidden">
          <SectionHeader icon={ShoppingBag} label="Grossistes" count={grossistes.length} color="text-sky-700 bg-sky-50" />
          <div className="divide-y divide-neutral-100">
            {grossistes.length === 0 && <EmptyRow message="Aucun grossiste." />}
            {grossistes.map((u) => (
              <div key={u.id}>
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                    <span className="text-sky-700 text-[0.72rem] font-medium uppercase">{u.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.83rem] font-medium text-neutral-800">{u.name}</p>
                    <p className="text-[0.68rem] text-neutral-400 truncate">{u.email}</p>
                  </div>
                  <DeleteUserButton id={u.id} name={u.name} />
                </div>
                <UserEditPanel u={u} isSelf={false} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Clients ── */}
        <div className="border border-neutral-200 bg-white overflow-hidden">
          <SectionHeader icon={Users} label="Clients" count={clients.length} color="text-neutral-600 bg-neutral-50" />
          <div className="divide-y divide-neutral-100">
            {clients.length === 0 && <EmptyRow message="Aucun client." />}
            {clients.map((u) => (
              <div key={u.id}>
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <span className="text-neutral-500 text-[0.72rem] font-medium uppercase">{u.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.83rem] font-medium text-neutral-800">{u.name}</p>
                    <p className="text-[0.68rem] text-neutral-400 truncate">{u.email}</p>
                  </div>
                  <DeleteUserButton id={u.id} name={u.name} />
                </div>
                <UserEditPanel u={u} isSelf={false} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
