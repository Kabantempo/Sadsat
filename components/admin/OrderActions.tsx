'use client'
import { useTransition } from 'react'
import { Truck, ExternalLink, Package } from 'lucide-react'
import { expedierCommandeAction, updateTrackingAction, updateStatusAction } from '@/app/actions/shipping'

const STATUS_OPTIONS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'payée',      label: 'Payée' },
  { value: 'expédiée',  label: 'Expédiée' },
  { value: 'livrée',    label: 'Livrée' },
  { value: 'annulée',   label: 'Annulée' },
]

type Props = {
  orderId: string
  currentStatus: string
  boxtalRef: string | null
  trackingUrl: string
  labelUrl: string
}

export default function OrderActions({ orderId, currentStatus, boxtalRef, trackingUrl, labelUrl }: Props) {
  const [pendingStatus, startStatus] = useTransition()
  const [pendingTracking, startTracking] = useTransition()
  const [pendingShip, startShip] = useTransition()

  return (
    <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex flex-wrap gap-3 items-end">

      {/* Changer statut */}
      <form
        action={(fd) => startStatus(() => updateStatusAction(fd))}
        className="flex items-center gap-2"
      >
        <input type="hidden" name="orderId" value={orderId} />
        <select
          name="status"
          defaultValue={currentStatus}
          className="text-[0.68rem] border border-neutral-200 bg-white px-2 py-1.5 text-neutral-700 outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pendingStatus}
          className="text-[0.6rem] tracking-[0.12em] uppercase px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors text-neutral-600 disabled:opacity-50"
        >
          {pendingStatus ? 'Mise à jour…' : 'Mettre à jour'}
        </button>
      </form>

      {/* Tracking manuel */}
      {!boxtalRef && (
        <form
          action={(fd) => startTracking(() => updateTrackingAction(fd))}
          className="flex items-center gap-2"
        >
          <input type="hidden" name="orderId" value={orderId} />
          <input
            type="text"
            name="tracking"
            placeholder="Numéro de suivi manuel"
            className="text-[0.68rem] border border-neutral-200 bg-white px-2 py-1.5 outline-none text-neutral-700 w-48"
          />
          <button
            type="submit"
            disabled={pendingTracking}
            className="text-[0.6rem] tracking-[0.12em] uppercase px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors text-neutral-600 disabled:opacity-50"
          >
            {pendingTracking ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </form>
      )}

      {/* Liens suivi + étiquette */}
      {boxtalRef && (
        <div className="flex gap-2">
          {trackingUrl && (
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.12em] uppercase text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 hover:bg-blue-50 transition-colors">
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
      )}

      {/* Expédier via Sendcloud */}
      {!boxtalRef && currentStatus !== 'annulée' && (
        <form
          action={(fd) => startShip(() => expedierCommandeAction(fd))}
          className="flex items-center gap-2 ml-auto"
        >
          <input type="hidden" name="orderId" value={orderId} />
          <input
            type="number"
            name="weight"
            defaultValue="0.5"
            min="0.1"
            max="30"
            step="0.1"
            className="text-[0.68rem] border border-neutral-200 bg-white px-2 py-1.5 outline-none text-neutral-700 w-20"
            title="Poids en kg"
          />
          <span className="text-[0.6rem] text-neutral-400">kg</span>
          <button
            type="submit"
            disabled={pendingShip}
            className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.12em] uppercase px-4 py-1.5 bg-neutral-900 text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <Truck size={11} strokeWidth={1.5} />
            {pendingShip ? 'Expédition…' : 'Expédier via Sendcloud'}
          </button>
        </form>
      )}
    </div>
  )
}
