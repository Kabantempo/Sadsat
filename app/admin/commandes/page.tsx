import { verifyAdmin } from '@/lib/dal'
import { getOrders } from '@/lib/orders'
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, Phone, Mail } from 'lucide-react'

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
        <div className="space-y-3">
          {orders.map((order) => {
            const s = STATUS[order.status] ?? STATUS.en_attente
            const StatusIcon = s.Icon
            return (
              <div key={order.id} className="bg-white border border-neutral-200 overflow-hidden">
                {/* En-tête commande */}
                <div className="px-6 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.88rem] font-medium text-neutral-800">{order.customerName}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[0.66rem] text-neutral-400">
                        <Mail size={9} strokeWidth={1.5} />
                        {order.customerEmail}
                      </span>
                      {order.customerPhone && (
                        <span className="flex items-center gap-1 text-[0.66rem] text-neutral-400">
                          <Phone size={9} strokeWidth={1.5} />
                          {order.customerPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1.5 text-[0.54rem] tracking-[0.14em] uppercase px-2.5 py-1 ${s.bg} ${s.fg}`}>
                      <StatusIcon size={11} strokeWidth={1.5} />
                      {s.label}
                    </span>
                    <div className="text-right">
                      <p className="text-[0.88rem] font-medium text-neutral-800">{(order.total / 100).toFixed(2)} €</p>
                      <p className="text-[0.62rem] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
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
                      <span>Livraison ({order.shippingMethod})</span>
                      <span className="tabular-nums">{(order.shippingCost / 100).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {order.boxtalRef && (
                  <div className="px-6 py-3 border-t border-neutral-100 bg-blue-50">
                    <p className="text-[0.66rem] text-blue-600">
                      Référence Boxtal : <span className="font-mono">{order.boxtalRef}</span>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
