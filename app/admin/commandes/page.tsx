import { getOrders } from '@/lib/orders'
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; color: string; Icon: typeof Clock }> = {
  en_attente: { label: 'En attente', color: 'text-yellow-500', Icon: Clock },
  payée: { label: 'Payée', color: 'text-green-500', Icon: CheckCircle },
  expédiée: { label: 'Expédiée', color: 'text-blue-400', Icon: Truck },
  livrée: { label: 'Livrée', color: 'text-neutral-400', Icon: Package },
  annulée: { label: 'Annulée', color: 'text-red-500', Icon: XCircle },
}

export default async function AdminCommandesPage() {
  const orders = await getOrders()

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-light text-neutral-800 mb-8">
        Commandes <span className="text-neutral-400 text-base">({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-neutral-400">
          <Package size={40} strokeWidth={1} className="mx-auto mb-4" />
          <p className="text-sm">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const s = STATUS_LABEL[order.status] ?? STATUS_LABEL.en_attente
            const StatusIcon = s.Icon
            return (
              <div key={order.id} className="bg-white border border-neutral-200 p-5 rounded-lg">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">{order.customerName}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{order.customerEmail}</p>
                    {order.customerPhone && (
                      <p className="text-neutral-400 text-xs">{order.customerPhone}</p>
                    )}
                    <p className="text-neutral-400 text-xs mt-1">{order.shippingAddress}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-neutral-800">{(order.total / 100).toFixed(2)} €</p>
                    <div className={`flex items-center gap-1 justify-end mt-1 ${s.color}`}>
                      <StatusIcon size={12} strokeWidth={1.5} />
                      <span className="text-xs">{s.label}</span>
                    </div>
                    <p className="text-neutral-400 text-[0.65rem] mt-1">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Articles */}
                <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs text-neutral-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{((item.price * item.quantity) / 100).toFixed(2)} €</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-neutral-400 pt-1">
                    <span>Livraison ({order.shippingMethod})</span>
                    <span>{(order.shippingCost / 100).toFixed(2)} €</span>
                  </div>
                </div>

                {order.boxtalRef && (
                  <p className="mt-3 text-xs text-blue-600">
                    Référence Boxtal : <span className="font-mono">{order.boxtalRef}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
