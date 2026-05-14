'use client'
import { useActionState } from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { setPasswordAction, type SetPasswordState } from '@/app/actions/auth'

export default function SetPasswordForm({ token, name }: { token: string; name: string }) {
  const [state, action, pending] = useActionState<SetPasswordState, FormData>(
    setPasswordAction,
    undefined
  )
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600 mb-3">
          SADSAT
        </p>
        <h1 className="font-serif text-3xl font-light italic text-neutral-100 mb-2">
          Bienvenue, {name}
        </h1>
        <p className="text-[0.78rem] text-neutral-500 mb-10 leading-relaxed">
          Choisissez votre mot de passe pour accéder à votre espace.
        </p>

        <form action={action} className="space-y-5">
          <input type="hidden" name="token" value={token} />

          {state?.message && (
            <p className="text-[0.72rem] text-red-400 tracking-wide">{state.message}</p>
          )}

          <div>
            <label className="block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-500 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPwd ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 pr-10 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
                placeholder="8 caractères minimum"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
              >
                {showPwd ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-500 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 pr-10 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
                placeholder="Répétez le mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
              >
                {showConfirm ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-neutral-100 text-neutral-900 text-[0.62rem] tracking-[0.24em] uppercase font-medium hover:bg-white transition-colors disabled:opacity-50 mt-2"
          >
            {pending ? 'Enregistrement...' : 'Créer mon mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
