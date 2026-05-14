'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default function InscriptionPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.22em] uppercase text-neutral-900 hover:opacity-60 transition-opacity"
          >
            SADSAT
          </Link>
          <p className="mt-4 text-[0.7rem] tracking-[0.2em] uppercase text-neutral-400">
            Créer un compte
          </p>
        </div>

        <form action={action} className="space-y-6">
          {state?.message && (
            <p className="text-center text-[0.72rem] text-red-600 tracking-wide">
              {state.message}
            </p>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 mb-2"
            >
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full border-b border-neutral-300 py-2 text-[0.88rem] text-neutral-900 bg-transparent outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
              placeholder="Prénom Nom"
            />
            {state?.errors?.name && (
              <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border-b border-neutral-300 py-2 text-[0.88rem] text-neutral-900 bg-transparent outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
              placeholder="votre@email.com"
            />
            {state?.errors?.email && (
              <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full border-b border-neutral-300 py-2 text-[0.88rem] text-neutral-900 bg-transparent outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <ul className="mt-1 space-y-0.5">
                {state.errors.password.map((err) => (
                  <li key={err} className="text-[0.65rem] text-red-500">
                    — {err}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full mt-8 py-3.5 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {pending ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-8 text-center text-[0.65rem] tracking-[0.12em] text-neutral-400">
          Déjà un compte ?{' '}
          <Link href="/connexion" className="text-neutral-700 hover:text-neutral-900 underline underline-offset-2 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
