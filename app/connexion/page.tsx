'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

export default function ConnexionPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.22em] uppercase text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity"
          >
            SADSAT
          </Link>
          <p className="mt-4 text-[0.7rem] tracking-[0.2em] uppercase text-neutral-400">
            Connexion
          </p>
        </div>

        {/* Formulaire email / mot de passe */}
        <form action={action} className="space-y-6">
          {state?.message && (
            <p className="text-center text-[0.72rem] text-red-600 tracking-wide">
              {state.message}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 mb-2">
              Email
            </label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              className="w-full border-b border-neutral-300 dark:border-neutral-700 py-2 text-[0.88rem] text-neutral-900 dark:text-neutral-100 bg-transparent outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              placeholder="votre@email.com"
            />
            {state?.errors?.email && (
              <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 mb-2">
              Mot de passe
            </label>
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              className="w-full border-b border-neutral-300 dark:border-neutral-700 py-2 text-[0.88rem] text-neutral-900 dark:text-neutral-100 bg-transparent outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit" disabled={pending}
            className="w-full mt-8 py-3.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
          >
            {pending ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-8 text-center text-[0.65rem] tracking-[0.12em] text-neutral-400">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline underline-offset-2 transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
