'use client'
import { useActionState } from 'react'
import { resendVerificationAction } from '@/app/actions/auth'

export default function ResendVerificationForm() {
  const [state, action, pending] = useActionState(resendVerificationAction, undefined)

  if (state?.success) {
    return (
      <p className="text-[0.85rem] text-green-500">
        Si cet email existe, un nouveau lien vient d&apos;être envoyé. Vérifiez votre boîte mail.
      </p>
    )
  }

  return (
    <div className="mt-2">
      <p className="text-[0.75rem] text-neutral-500 mb-4">
        Entrez votre email pour recevoir un nouveau lien de vérification.
      </p>
      <form action={action} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="votre@email.com"
          className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm px-4 py-3 focus:outline-none focus:border-neutral-400 placeholder:text-neutral-600"
        />
        {state?.message && (
          <p className="text-[0.75rem] text-red-400">{state.message}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="text-[0.62rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors border-b border-neutral-700 hover:border-neutral-400 pb-0.5 self-center disabled:opacity-50"
        >
          {pending ? 'Envoi...' : 'Renvoyer le lien →'}
        </button>
      </form>
    </div>
  )
}
