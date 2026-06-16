import { verifySession, getCurrentUser } from '@/lib/dal'
import { logout } from '@/app/actions/auth'
import { getOrders } from '@/lib/orders'
import { getReviewedProductIds } from '@/lib/reviews'
import ChangePasswordForm from '@/components/shared/ChangePasswordForm'
import Link from 'next/link'
import { Package, ChevronRight, Star } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  en_attente: 'En attente',
  payée:      'Payée',
  expédiée:   'Expédiée',
  livrée:     'Livrée',
  annulée:    'Annulée',
}

const STATUS_COLOR: Record<string, string> = {
  en_attente: 'bg-amber-50 text-amber-700',
  payée:      'bg-sky-50 text-sky-700',
  expédiée:   'bg-blue-50 text-blue-700',
  livrée:     'bg-emerald-50 text-emerald-700',
  annulée:    'bg-red-50 text-red-500',
}

export default async function ComptePage() {
  await verifySession()
  const user = await getCurrentUser()

  const [allOrders, reviewedIds] = await Promise.all([
    getOrders(),
    getReviewedProductIds(user?.email ?? ''),
  ])
  const orders = allOrders.filter(
    (o) => o.customerEmail.toLowerCase() === user?.email?.toLowerCase()
  )

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
          Mon espace
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-neutral-900 mb-12">
          Bonjour, {user?.name}
        </h1>

        <div className="grid gap-px bg-neutral-200">
          {/* Email */}
          <div className="bg-white p-8">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">Email</p>
            <p className="text-[0.9rem] text-neutral-700">{user?.email}</p>
          </div>

          {/* Type de compte */}
          <div className="bg-white p-8">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">Compte</p>
            <p className="text-[0.9rem] text-neutral-700">Client</p>
          </div>

          {/* Historique commandes */}
          <div className="bg-white p-8">
            <div className="flex items-center gap-2 mb-6">
              <Package size={14} strokeWidth={1.5} className="text-neutral-400" />
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400">
                Mes commandes
              </p>
            </div>

            {orders.length === 0 ? (
              <p className="text-[0.82rem] text-neutral-400 italic">
                Aucune commande pour le moment.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {orders.map((order) => {
                  const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                  const statusLabel = STATUS_LABEL[order.status] ?? order.status
                  const statusColor = STATUS_COLOR[order.status] ?? 'bg-neutral-100 text-neutral-500'

                  return (
                    <div key={order.id} className="py-5 first:pt-0 last:pb-0">
                      {/* Ligne principale */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="text-[0.58rem] tracking-[0.16em] uppercase text-neutral-400 mb-0.5">
                            {date}
                          </p>
                          <p className="font-mono text-[0.65rem] text-neutral-500">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-[0.52rem] tracking-[0.14em] uppercase px-2.5 py-1 ${statusColor}`}
                          >
                            {statusLabel}
                          </span>
                          <p className="font-serif text-lg text-neutral-800">
                            {(order.total / 100).toFixed(2)} €
                          </p>
                        </div>
                      </div>

                      {/* Articles */}
                      <div className="space-y-1.5">
                        {order.items.map((item) => {
                          const alreadyReviewed = reviewedIds.includes(item.productId)
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-[0.76rem] text-neutral-500"
                            >
                              <span className="flex items-center gap-1.5">
                                <ChevronRight size={10} strokeWidth={1.5} className="text-neutral-300" />
                                {item.name}
                                {item.quantity > 1 && (
                                  <span className="text-neutral-400">× {item.quantity}</span>
                                )}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="tabular-nums">
                                  {((item.price * item.quantity) / 100).toFixed(2)} €
                                </span>
                                {alreadyReviewed ? (
                                  <span className="flex items-center gap-1 text-[0.58rem] tracking-[0.1em] uppercase text-amber-500">
                                    <Star size={10} strokeWidth={1.5} className="fill-amber-400" />
                                    Noté
                                  </span>
                                ) : (
                                  <Link
                                    href={`/produits/${item.productId}#avis`}
                                    className="flex items-center gap-1 text-[0.58rem] tracking-[0.1em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors"
                                  >
                                    <Star size={10} strokeWidth={1.5} />
                                    Avis
                                  </Link>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Livraison */}
                      {order.boxtalRef && (
                        <p className="mt-2 text-[0.62rem] tracking-[0.12em] text-neutral-400">
                          Suivi :{' '}
                          <a
                            href={`https://parcelsapp.com/fr/tracking/${order.boxtalRef}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-neutral-700 transition-colors"
                          >
                            {order.boxtalRef}
                          </a>
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Changement mot de passe */}
          <ChangePasswordForm />
        </div>

        <form action={logout} className="mt-12">
          <button
            type="submit"
            className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  )
}
