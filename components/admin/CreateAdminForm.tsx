'use client'
import { useActionState } from 'react'
import { createAdminAction, type AdminFormState } from '@/app/actions/admin'
import { CheckCircle, Copy } from 'lucide-react'
import { useState } from 'react'

export default function CreateAdminForm() {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    createAdminAction,
    undefined
  )
  const [copied, setCopied] = useState(false)

  function copyLink() {
    if (!state?.setupLink) return
    navigator.clipboard.writeText(state.setupLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (state?.success) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 text-green-700">
          <CheckCircle size={15} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <p className="text-[0.72rem] leading-relaxed">
            Compte créé.{' '}
            {state.setupLink
              ? 'Aucun service mail configuré — envoyez ce lien manuellement :'
              : <>Un email a été envoyé à <strong>{state.recipientEmail}</strong> pour créer son mot de passe.</>}
          </p>
        </div>
        {state.setupLink && (
          <div className="bg-neutral-50 border border-neutral-200 px-3 py-2.5 flex items-center gap-2">
            <span className="flex-1 text-[0.62rem] text-neutral-600 break-all font-mono">{state.setupLink}</span>
            <button onClick={copyLink} className="shrink-0 text-neutral-400 hover:text-neutral-900 transition-colors">
              <Copy size={13} strokeWidth={1.5} />
            </button>
            {copied && <span className="text-[0.6rem] text-green-600">Copié</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      {state?.message && (
        <p className="text-[0.72rem] text-red-600 tracking-wide">{state.message}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
            Prénom
          </label>
          <input
            name="prenom"
            type="text"
            required
            className="w-full border border-neutral-200 px-3 py-2 text-[0.83rem] text-neutral-900 outline-none focus:border-neutral-900 transition-colors bg-white"
            placeholder="Marie"
          />
          {state?.errors?.prenom && (
            <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.prenom[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
            Nom
          </label>
          <input
            name="nom"
            type="text"
            required
            className="w-full border border-neutral-200 px-3 py-2 text-[0.83rem] text-neutral-900 outline-none focus:border-neutral-900 transition-colors bg-white"
            placeholder="Dupont"
          />
          {state?.errors?.nom && (
            <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.nom[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-neutral-200 px-3 py-2 text-[0.83rem] text-neutral-900 outline-none focus:border-neutral-900 transition-colors bg-white"
          placeholder="admin@exemple.com"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <p className="text-[0.62rem] text-neutral-400 leading-relaxed">
        Un email sera envoyé à l'utilisateur pour qu'il crée lui-même son mot de passe.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Création...' : 'Créer le compte admin'}
      </button>
    </form>
  )
}
