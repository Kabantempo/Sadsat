'use client'
import { useActionState, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { login } from '@/app/actions/auth'

function FloatField({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  onBlur,
  error,
  rightSlot,
}: {
  id: string
  name: string
  label: string
  type?: string
  autoComplete?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string | null
  rightSlot?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0

  return (
    <div>
      <div className="relative pb-1.5">
        <label
          htmlFor={id}
          className={`absolute left-0 pointer-events-none font-sans transition-all duration-200 ease-out ${
            floated
              ? 'top-0 text-[0.58rem] tracking-[0.16em] uppercase text-neutral-400'
              : 'top-[18px] text-[0.9rem] text-neutral-400'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          className={`w-full border-b bg-transparent pt-6 pb-2 pr-${rightSlot ? '10' : '0'} text-[0.9rem] text-neutral-900 font-sans outline-none transition-colors ${
            error ? 'border-red-400' : focused ? 'border-neutral-900' : 'border-neutral-300'
          }`}
        />
        {rightSlot && (
          <div className="absolute right-0 top-1/2 translate-y-1">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[0.62rem] text-red-500 font-sans">{error}</p>
      )}
    </div>
  )
}

export default function ConnexionPage() {
  const [state, action, pending] = useActionState(login, undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError =
    emailTouched && email.length > 0 && !/^[^@]+@[^@]+\.[^@]+$/.test(email)
      ? 'Adresse email invalide.'
      : state?.errors?.email?.[0] ?? null

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Colonne gauche — visuel */}
      <div className="hidden md:flex w-[45%] flex-col justify-between p-14 bg-gradient-to-br from-neutral-900 to-black relative overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent 0 40px, rgba(255,255,255,0.15) 40px 41px)',
          }}
        />
        <Link
          href="/"
          className="relative z-10 font-serif text-2xl tracking-[0.3em] uppercase text-white hover:opacity-50 transition-opacity"
        >
          SADSAT
        </Link>
        <div className="relative z-10">
          <p className="font-serif italic text-[2.2rem] leading-snug text-white mb-4">
            "Bienvenue dans l'atelier."
          </p>
          <p className="text-[0.8rem] text-neutral-400 tracking-wide leading-relaxed">
            Retrouvez vos pièces, vos commandes, vos désirs.
          </p>
        </div>
      </div>

      {/* Colonne droite — formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 bg-[#FAFAF7] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-[400px] py-16"
        >
          {/* Mobile — logo */}
          <Link
            href="/"
            className="md:hidden block font-serif text-xl tracking-[0.25em] uppercase text-neutral-900 mb-12"
          >
            SADSAT
          </Link>

          <p className="font-mono text-[0.56rem] tracking-widest uppercase text-neutral-400 mb-8">
            01 — CONNEXION
          </p>
          <h1 className="font-serif text-5xl text-neutral-900 mb-2 leading-none">
            Bon retour.
          </h1>
          <p className="text-[0.82rem] text-neutral-500 mb-10 font-sans">
            Connectez-vous à votre espace.
          </p>

          <form action={action} className="space-y-6" noValidate>
            <FloatField
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              onBlur={() => setEmailTouched(true)}
              error={emailError}
            />

            <div>
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <FloatField
                    id="password"
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={setPassword}
                    error={state?.errors?.password?.[0] ?? null}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors"
                        aria-label={showPassword ? 'Masquer' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                      </button>
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-[0.58rem] text-neutral-400 hover:text-neutral-700 transition-colors font-sans"
                >
                  Mot de passe oublié&nbsp;?
                </Link>
              </div>
            </div>

            {state?.message && (
              <p className="text-[0.7rem] text-red-600 font-sans">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-12 bg-neutral-900 text-white text-[0.6rem] tracking-widest uppercase font-sans hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2.5 mt-4"
            >
              {pending ? (
                <>
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[0.56rem] tracking-[0.18em] uppercase text-neutral-400 font-sans">ou</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Boutons sociaux */}
          <div className="space-y-3">
            <a
              href="/api/auth/google"
              className="w-full h-12 flex items-center justify-center gap-3 border border-neutral-200 text-neutral-700 text-[0.6rem] tracking-wider uppercase font-sans hover:bg-neutral-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </a>
            <a
              href="/api/auth/apple"
              className="w-full h-12 flex items-center justify-center gap-3 border border-neutral-200 text-neutral-700 text-[0.6rem] tracking-wider uppercase font-sans hover:bg-neutral-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.18.72 2.94.75.76.02 2.2-.89 3.7-.76 2.21.17 3.5 1.26 4.31 3.13-3.59 2.07-3.15 6.36.05 8.76zm-3.92-17.2c.32 1.41-.47 2.81-1.3 3.67-.86.89-2.18 1.58-3.34 1.49-.24-1.35.46-2.76 1.29-3.61.89-.91 2.28-1.58 3.35-1.55z"/>
              </svg>
              Continuer avec Apple
            </a>
          </div>

          <p className="mt-10 text-center text-[0.65rem] tracking-[0.12em] text-neutral-400 font-sans">
            Pas encore membre ?{' '}
            <Link href="/inscription" className="text-neutral-700 hover:text-neutral-900 underline underline-offset-2 transition-colors">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
