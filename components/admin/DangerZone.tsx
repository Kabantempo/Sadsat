'use client'
import { useState } from 'react'
import { clearUsersAction, clearProductsAction, clearAllDataAction } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

type Action = 'users' | 'products' | 'all'

const ACTIONS = {
  users: {
    label: 'Supprimer tous les comptes',
    description: 'Supprime tous les comptes sauf le vôtre (admin).',
    action: clearUsersAction,
  },
  products: {
    label: 'Supprimer tous les produits',
    description: 'Vide entièrement le catalogue produits.',
    action: clearProductsAction,
  },
  all: {
    label: 'Tout réinitialiser',
    description: 'Supprime tous les comptes (sauf le vôtre) ET tous les produits.',
    action: clearAllDataAction,
  },
}

export default function DangerZone() {
  const [confirm, setConfirm] = useState<Action | null>(null)
  const [pending, setPending] = useState(false)

  async function handleConfirm() {
    if (!confirm) return
    setPending(true)
    await ACTIONS[confirm].action()
  }

  return (
    <div className="border border-red-200 bg-white">
      <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2">
        <Trash2 size={13} strokeWidth={1.5} className="text-red-400" />
        <p className="text-[0.62rem] tracking-[0.18em] uppercase text-red-400">
          Zone dangereuse
        </p>
      </div>

      <div className="px-6 py-6 space-y-3">
        {confirm ? (
          <div className="space-y-4">
            <p className="text-[0.78rem] text-neutral-700">
              <span className="font-medium">Confirmer :</span> {ACTIONS[confirm].description}
              <br />
              <span className="text-red-500">Cette action est irréversible.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={pending}
                className="px-5 py-2.5 bg-red-600 text-white text-[0.62rem] tracking-[0.18em] uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {pending ? 'Suppression...' : 'Confirmer'}
              </button>
              <button
                onClick={() => setConfirm(null)}
                disabled={pending}
                className="px-5 py-2.5 border border-neutral-200 text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500 hover:border-neutral-400 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          (Object.entries(ACTIONS) as [Action, typeof ACTIONS[Action]][]).map(([key, { label, description }]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-[0.78rem] text-neutral-700">{label}</p>
                <p className="text-[0.65rem] text-neutral-400">{description}</p>
              </div>
              <button
                onClick={() => setConfirm(key)}
                className="shrink-0 px-4 py-2 border border-red-200 text-[0.6rem] tracking-[0.16em] uppercase text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors"
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
