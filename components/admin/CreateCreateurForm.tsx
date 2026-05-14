'use client'
import { useActionState } from 'react'
import { createCreateurAccountAction, type AdminFormState } from '@/app/actions/admin'

export default function CreateCreateurForm() {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    createCreateurAccountAction,
    undefined
  )

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
          placeholder="createur@exemple.com"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
          Mot de passe
        </label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-neutral-200 px-3 py-2 text-[0.83rem] text-neutral-900 outline-none focus:border-neutral-900 transition-colors bg-white"
          placeholder="••••••••"
        />
        {state?.errors?.password && (
          <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 bg-neutral-700 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-600 transition-colors disabled:opacity-50"
      >
        {pending ? 'Création...' : 'Créer le compte créateur'}
      </button>
    </form>
  )
}
