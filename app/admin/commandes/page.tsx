import { verifyAdmin } from '@/lib/dal'
import { getOrders } from '@/lib/orders'
import { expedierCommandeAction, updateTrackingAction, updateStatusAction } from '@/app/actions/shipping'
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

const STATUS: Record<string, { label: string; bg: string; fg: string; Icon: typeof Clock }> = {
  en_attente: { label: 'En attente', bg: 'bg-yellow-100', fg: 'text-yellow-700', Icon: Clock },
  payée:      { label: 'Payée',      bg: 'bg-green-100',  fg: 'text-green-700',  Icon: CheckCircle },
  expédiée:   { label: 'Expédiée',   bg: 'bg-blue-100',   fg: 'text-blue-700',   Icon: Truck },
  livrée:     { label: 'Livrée',     bg: 'bg-neutral-100',fg: 'text-neutral-500',Icon: Package },
  annulée:    { label: 'Annulée',    bg: 'bg-red-100',    fg: 'text-red-600',    Icon: XCircle },
}

export default async function AdminCommandesPage() {
  await verifyAdmin()
  const orders = await getOrders()

  const counts = Object.fromEntries(
    Object.keys(STATUS).map((k) => [k, orders.filter((o) => o.status === k).length])
  )

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Commandes
        {orders.length > 0 && (
          <span className="ml-3 font-sans text-xl font-normal text-neutral-300">({orders.length})</span>
        )}
      </h1>

      {/* Résumé statuts */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
          {Object.entries(STATUS).map(([key, { label, bg, fg, Icon }]) => (
            <div key={key} className={`${bg} px-4 py-3 flex items-center gap-2.5`}>
              <Icon size={14} strokeWidth={1.5} className={`${fg} shrink-0`} />
              <div>
                <p className={`font-serif text-xl leading-none ${fg}`}>{counts[key] ?? 0}</p>
                <p className={`text-[0.54rem] tracking-[0.14em] uppercase mt-0.5 ${fg} opacity-70`}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="border border-dashed border-neutral-200 py-24 text-center">
          <Package size={36} strokeWidth={1} className="mx-auto mb-4 text-neutral-300" />
          <p className="text-[0.82rem] text-neutral-400 italic">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = STATUS[order.status] ?? STATUS.en_attente
            const StatusIcon = s.Icon

            // Extraire lien tracking et étiquette depuis notes
            const trackingUrl = order.notes?.match(/tracking:([^|]+)/)?.[1] ?? ''
            const labelUrl    = order.notes?.match(/label:([^|]+)/)?.[1] ?? ''

            return (
              <div key={order.id} className="bg-white border border-neutral-200 overflow-hidden">

                {/* En-tête */}
                <div className="px-6 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.88rem] font-medium text-neutral-800">{order.customerName}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[0.66rem] text-neutral-400">
                        <Mail size={9} strokeWidth={1.5} />{order.customerEmail}
                      </span>
                      {order.customerPhone && (
                        <span className="flex items-center gap-1 text-[0.66rem] text-neutral-400">
                          <Phone size={9} strokeWidth={1.5} />{order.customerPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1.5 text-[0.54rem] tracking-[0.14em] uppercase px-2.5 py-1 ${s.bg} ${s.fg}`}>
                      <StatusIcon size={11} strokeWidth={1.5} />{s.label}
                    </span>
                    <div className="text-right">
                      <p className="text-[0.88rem] font-medium text-neutral-800">{(order.total / 100).toFixed(2)} €</p>
                      <p className="text-[0.62rem] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Adresse + articles */}
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={12} strokeWidth={1.5} className="text-neutral-300 mt-0.5 shrink-0" />
                    <p className="text-[0.72rem] text-neutral-500 leading-relaxed">{order.shippingAddress}</p>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-[0.72rem] text-neutral-600">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="tabular-nums text-neutral-500">
                          {((item.price * item.quantity) / 100).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-[0.68rem] text-neutral-400 pt-1 border-t border-neutral-100">
                      <span>Livraison</span>
                      <span className="tabular-nums">{(order.shippingCost / 100).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Suivi existant */}
                {order.boxtalRef && (
                  <div className="px-6 py-3 border-t border-neutral-100 bg-blue-50 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.6rem] tracking-[0.12em] uppercase text-blue-500 mb-0.5">Numéro de suivi</p>
                      <p className="font-mono text-[0.78rem] text-blue-700">{order.boxtalRef}</p>
                    </div>
                    <div className="flex gap-2">
                      {trackingUrl && (
                        <a href={trackingUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.12em] uppercase text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 hover:bg-blue-100 transition-colors">
                          <ExternalLink size={10} /> Suivre
                        </a>
                      )}
                      {labelUrl && (
                        <a href={labelUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 hover:bg-neutral-50 transition-colors">
                          <Package size={10} /> Étiquette PDF
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex flex-wrap gap-3 items-end">

                  {/* Changer statut */}
                  <form action={updateStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <select name="status" defaultValue={order.status}
                      className="text-[0.68rem] border border-neutral-200 bg-white px-2 py-1.5 text-neutral-700 outline-none">
                      {Object.entries(STATUS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <button type="submit"
                      className="text-[0.6rem] tracking-[0.12em] uppercase px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors text-neutral-600">
                      Mettre à jour
                    </button>
                  </form>

                  {/* Tracking manuel */}
                  {!order.boxtalRef && (
                    <form action={updateTrackingAction} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="text" name="tracking" placeholder="Numéro de suivi manuel"
                        className="text-[0.68rem] border border-neutral-200 bg-white px-2 py-1.5 outline-none text-neutral-700 w-48" />
                      <button type="submit"
                        className="text-[0.6rem] tracking-[0.12em] uppercase px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors text-neutral-600">
                        Sauvegarder
                      </button>
                    </form>
                  )}

                  {/* Expédier via Sendcloud */}
                  {!order.boxtalRef && order.status !== 'annulée' && (
                    <form action={expedierCommandeAction} className="flex items-center gap-2 ml-auto">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="number" name="weight" defaultValue="0.5" min="0.1" max="30" step="0.1"
                        className="text-[0.68rem] border border-neutral-200 bg-white px-2 py-1.5 outline-none text-neutral-700 w-20"
                        title="Poids en kg" />
                      <span className="text-[0.6rem] text-neutral-400">kg</span>
                      <button type="submit"
                        className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.12em] uppercase px-4 py-1.5 bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">
                        <Truck size={11} strokeWidth={1.5} />
                        Expédier via Sendcloud
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
