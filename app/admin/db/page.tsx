import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function toggleVerified(id: string, current: boolean) {
  'use server'
  await prisma.user.update({
    where: { id },
    data: {
      emailVerified: !current,
      verificationToken: !current ? null : undefined,
      verificationTokenExpiry: !current ? null : undefined,
    },
  })
  revalidatePath('/admin/db')
}

export default async function DbPage() {
  const [users, products] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-[0.6rem] tracking-[0.24em] uppercase text-neutral-500">Base de données</h1>

      {/* Users */}
      <section>
        <h2 className="text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-4">
          Utilisateurs — {users.length}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.72rem] border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                {['id', 'name', 'email', 'role', 'email vérifié', 'créé le'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[0.58rem] tracking-[0.12em] uppercase text-neutral-400 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-2 px-3 font-mono text-neutral-400 text-[0.65rem]">{u.id.slice(0, 8)}…</td>
                  <td className="py-2 px-3 text-neutral-700">{u.name}</td>
                  <td className="py-2 px-3 text-neutral-600">{u.email}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded text-[0.58rem] tracking-wide uppercase bg-neutral-100 text-neutral-600">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <form action={toggleVerified.bind(null, u.id, u.emailVerified)}>
                      <button
                        type="submit"
                        className={`px-2 py-0.5 rounded text-[0.58rem] tracking-wide uppercase cursor-pointer hover:opacity-70 transition-opacity ${u.emailVerified ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
                      >
                        {u.emailVerified ? '✓ vérifié' : '✗ non vérifié'}
                      </button>
                    </form>
                  </td>
                  <td className="py-2 px-3 text-neutral-400 font-mono text-[0.65rem]">{u.createdAt.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-4">
          Produits — {products.length}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.72rem] border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                {['id', 'name', 'universe', 'category', 'price', 'stock', 'status', 'createdAt'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[0.58rem] tracking-[0.12em] uppercase text-neutral-400 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-2 px-3 font-mono text-neutral-400 text-[0.65rem]">{p.id.slice(0, 8)}…</td>
                  <td className="py-2 px-3 text-neutral-700">{p.name}</td>
                  <td className="py-2 px-3 text-neutral-500">{p.universe}</td>
                  <td className="py-2 px-3 text-neutral-500">{p.category}</td>
                  <td className="py-2 px-3 text-neutral-700">{(p.price / 100).toFixed(2)} €</td>
                  <td className="py-2 px-3 text-neutral-600">{p.stock}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[0.58rem] tracking-wide uppercase ${p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-neutral-400 font-mono text-[0.65rem]">{p.createdAt.slice(0, 10)}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 px-3 text-center text-neutral-400 text-[0.68rem]">Aucun produit</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
