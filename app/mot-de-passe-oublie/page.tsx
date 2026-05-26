'use client'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { forgotPasswordAction } from '@/app/actions/auth'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, undefined)

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Colonne gauche — visuel */}
      <div className="hidden md:flex w-[45%] flex-col justify-between p-14 bg-gradient-to-br from-neutral-900 to-black relative overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 40px, rgba(255,255,255,0.15) 40px 41px)' }}
        />
        <Link href="/" className="relative z-10 font-serif text-2xl tracking-[0.3em] uppercase text-white hover:opacity-50 transition-opacity">
          SADSAT
        </Link>
        <div className="relative z-10">
          <p className="font-serif italic text-[2.2rem] leading-snug text-white mb-4">
            "Pas de panique."
          </p>
          <p className="text-[0.8rem] text-neutral-400 tracking-wide leading-relaxed">
            Un email vous sera envoyé avec un lien pour réinitialiser votre mot de passe.
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
          <Link href="/connexion" className="md:hidden block font-serif text-xl tracking-[0.25em] uppercase text-neutral-900 mb-12">
            SADSAT
          </Link>

          <Link href="/connexion" className="flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors mb-10">
            <ArrowLeft size={11} /> Retour à la connexion
          </Link>

          <p className="font-mono text-[0.56rem] tracking-widest uppercase text-neutral-400 mb-8">
            Mot de passe oublié
          </p>

          {state?.success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-center w-12 h-12 bg-neutral-900 mb-6">
                <Mail size={20} strokeWidth={1.5} className="text-white" />
              </div>
              <h1 className="font-serif text-4xl text-neutral-900 mb-3 leading-tight">
                Email envoyé.
              </h1>
              <p className="text-[0.82rem] text-neutral-500 leading-relaxed mb-8 font-sans">
                Si un compte existe pour cette adresse, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <p className="text-[0.72rem] text-neutral-400 font-sans">
                Vérifiez aussi vos spams.
              </p>
            </motion.div>
          ) : (
            <>
              <h1 className="font-serif text-5xl text-neutral-900 mb-2 leading-none">
                Réinitialiser.
              </h1>
              <p className="text-[0.82rem] text-neutral-500 mb-10 font-sans">
                Saisissez votre email. Vous recevrez un lien valable 1 heure.
              </p>

              <form action={action} className="space-y-6" noValidate>
                <div className="relative pb-1.5">
                  <label htmlFor="email" className="block text-[0.58rem] tracking-[0.16em] uppercase text-neutral-400 mb-2 font-sans">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full border-b border-neutral-300 bg-transparent pb-2 text-[0.9rem] text-neutral-900 font-sans outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                {state?.message && (
                  <p className="text-[0.7rem] text-red-600 font-sans">{state.message}</p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full h-12 bg-neutral-900 text-white text-[0.6rem] tracking-widest uppercase font-sans hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  {pending ? (
                    <>
                      <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
