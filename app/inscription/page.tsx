'use client'
import { useActionState, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { signup } from '@/app/actions/auth'

function passwordStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (pwd.length === 0) return 0
  if (pwd.length < 8) return 1
  const hasLetter = /[a-zA-Z]/.test(pwd)
  const hasDigit = /[0-9]/.test(pwd)
  if (hasLetter && hasDigit) return 3
  return 2
}

const STRENGTH_LABEL = ['', 'Faible', 'Moyen', 'Fort'] as const
const STRENGTH_COLOR = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'] as const

export default function InscriptionPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [cgv, setCgv] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  const [firstNameTouched, setFirstNameTouched] = useState(false)
  const [lastNameTouched, setLastNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const strength = passwordStrength(password)

  const emailInvalid = emailTouched && email.length > 0 && !/^[^@]+@[^@]+\.[^@]+$/.test(email)
  const firstNameInvalid = firstNameTouched && firstName.trim().length < 2
  const lastNameInvalid = lastNameTouched && lastName.trim().length < 2
  const passwordWeak = passwordTouched && password.length > 0 && password.length < 8

  const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim()

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Colonne gauche */}
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
            "Rejoignez l'atelier."
          </p>
          <p className="text-[0.8rem] text-neutral-400 tracking-wide leading-relaxed">
            Pièces uniques, accès anticipé, ventes privées.
          </p>
        </div>
      </div>

      {/* Colonne droite */}
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
            02 — INSCRIPTION
          </p>
          <h1 className="font-serif text-5xl text-neutral-900 mb-2 leading-none">
            Créez votre compte.
          </h1>
          <p className="text-[0.82rem] text-neutral-500 mb-10 font-sans">
            Rejoignez le collectif SADSAT.
          </p>

          {/* Hidden combined name field for the server action */}
          <form action={action} className="space-y-7" noValidate>
            <input type="hidden" name="name" value={combinedName} />

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prenom"
                  className="block text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 mb-2 font-sans"
                >
                  Prénom
                </label>
                <input
                  id="prenom"
                  type="text"
                  autoComplete="given-name"
                  required
                  aria-label="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => setFirstNameTouched(true)}
                  className="w-full border-b border-neutral-300 bg-transparent py-3 text-[0.9rem] text-neutral-900 font-sans outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
                  placeholder="Marie"
                />
                {firstNameInvalid && (
                  <p className="mt-1.5 text-[0.62rem] text-red-500 font-sans">
                    2 caractères minimum.
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="nom"
                  className="block text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 mb-2 font-sans"
                >
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  autoComplete="family-name"
                  required
                  aria-label="Nom de famille"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => setLastNameTouched(true)}
                  className="w-full border-b border-neutral-300 bg-transparent py-3 text-[0.9rem] text-neutral-900 font-sans outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
                  placeholder="Dupont"
                />
                {lastNameInvalid && (
                  <p className="mt-1.5 text-[0.62rem] text-red-500 font-sans">
                    Requis.
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 mb-2 font-sans"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-label="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-[0.9rem] text-neutral-900 font-sans outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
                placeholder="votre@email.com"
              />
              {(emailInvalid || state?.errors?.email) && (
                <p className="mt-1.5 text-[0.65rem] text-red-500 font-sans">
                  {emailInvalid ? 'Adresse email invalide.' : state?.errors?.email?.[0]}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 mb-2 font-sans"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  aria-label="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  className="w-full border-b border-neutral-300 bg-transparent py-3 pr-10 text-[0.9rem] text-neutral-900 font-sans outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* Indicateur de force */}
              {password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-0.5 w-8 rounded-full transition-colors duration-300 ${
                          strength >= level ? STRENGTH_COLOR[strength] : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[0.58rem] text-neutral-400 font-sans">
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}

              {(passwordWeak || state?.errors?.password) && (
                <ul className="mt-1.5 space-y-0.5">
                  {passwordWeak && (
                    <li className="text-[0.62rem] text-red-500 font-sans">
                      — 8 caractères minimum.
                    </li>
                  )}
                  {state?.errors?.password?.map((err) => (
                    <li key={err} className="text-[0.62rem] text-red-500 font-sans">
                      — {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Erreur globale */}
            {state?.message && (
              <p className="text-[0.7rem] text-red-600 font-sans">{state.message}</p>
            )}

            {/* Checkboxes */}
            <div className="space-y-4 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  role="checkbox"
                  aria-checked={cgv}
                  tabIndex={0}
                  onClick={() => setCgv((v) => !v)}
                  onKeyDown={(e) => e.key === ' ' && setCgv((v) => !v)}
                  className={`mt-0.5 w-4 h-4 flex-shrink-0 border transition-colors ${
                    cgv ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300'
                  } flex items-center justify-center`}
                >
                  {cgv && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[0.7rem] text-neutral-500 leading-relaxed font-sans">
                  J'accepte les{' '}
                  <Link href="/cgv" className="underline underline-offset-2 hover:text-neutral-800 transition-colors">
                    CGV
                  </Link>{' '}
                  et la{' '}
                  <Link href="/confidentialite" className="underline underline-offset-2 hover:text-neutral-800 transition-colors">
                    politique de confidentialité
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  role="checkbox"
                  aria-checked={newsletter}
                  tabIndex={0}
                  onClick={() => setNewsletter((v) => !v)}
                  onKeyDown={(e) => e.key === ' ' && setNewsletter((v) => !v)}
                  className={`mt-0.5 w-4 h-4 flex-shrink-0 border transition-colors ${
                    newsletter ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300'
                  } flex items-center justify-center`}
                >
                  {newsletter && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[0.7rem] text-neutral-500 leading-relaxed font-sans">
                  Je souhaite recevoir les nouveautés par email <span className="text-neutral-400">(optionnel)</span>
                </span>
              </label>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={pending || !cgv}
              className="w-full h-12 bg-neutral-900 text-white text-[0.6rem] tracking-widest uppercase font-sans hover:bg-neutral-800 transition-colors disabled:opacity-40 flex items-center justify-center gap-2.5"
            >
              {pending ? (
                <>
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Création…
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Lien connexion */}
          <p className="mt-10 text-center text-[0.65rem] tracking-[0.12em] text-neutral-400 font-sans">
            Déjà membre ?{' '}
            <Link
              href="/connexion"
              className="text-neutral-700 hover:text-neutral-900 underline underline-offset-2 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
