'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

export default function ConnexionPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.22em] uppercase text-neutral-900 hover:opacity-60 transition-opacity"
          >
            SADSAT
          </Link>
          <p className="mt-4 text-[0.7rem] tracking-[0.2em] uppercase text-neutral-400">
            Connexion
          </p>
        </div>

        {/* Boutons OAuth */}
        <div className="space-y-3 mb-8">
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 w-full border border-neutral-200 px-5 py-3 text-[0.72rem] tracking-[0.08em] text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
          >
            {/* Google icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </a>

          <a
            href="/api/auth/apple"
            className="flex items-center justify-center gap-3 w-full bg-black text-white px-5 py-3 text-[0.72rem] tracking-[0.08em] hover:bg-neutral-800 transition-colors"
          >
            {/* Apple icon */}
            <svg width="15" height="18" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-164-39.3c-76 0-103.7 40.8-165.9 40.8s-105.7-57.2-155.5-127.4C46 405.8 15.5 280.5 15.5 221.8c0-165.2 108.2-252.7 214.3-252.7 71.9 0 131.5 47.8 176.6 47.8 43.2 0 110.8-49.8 192.8-49.8 31 0 108.2 2.6 168.1 77.3zm-170.3-107.5c-27.8-31-68.7-59-132.2-59-23.8 0-52.3 8.1-79.5 24.4-26.3 15.8-53.7 42.3-73.7 90.5 10.4 1.3 20.8 2.6 31.2 2.6 59 0 123.1-23.3 163.1-58.5 16.4-14.3 29.4-30.6 91.1-0z"/>
            </svg>
            Continuer avec Apple
          </a>
        </div>

        {/* Séparateur */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400">ou</span>
          <div className="flex-1 h-px bg-neutral-200" />
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
              className="w-full border-b border-neutral-300 py-2 text-[0.88rem] text-neutral-900 bg-transparent outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
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
              className="w-full border-b border-neutral-300 py-2 text-[0.88rem] text-neutral-900 bg-transparent outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <p className="mt-1 text-[0.65rem] text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit" disabled={pending}
            className="w-full mt-8 py-3.5 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {pending ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-8 text-center text-[0.65rem] tracking-[0.12em] text-neutral-400">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-neutral-700 hover:text-neutral-900 underline underline-offset-2 transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
