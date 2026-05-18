import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ConfirmerPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-neutral-700 mb-8">
          <Mail size={24} strokeWidth={1} className="text-neutral-400" />
        </div>
        <h1 className="font-serif font-light text-3xl italic text-neutral-100 mb-4">
          Vérifiez votre email
        </h1>
        <p className="text-[0.85rem] text-neutral-500 leading-relaxed mb-8">
          Un email de confirmation a été envoyé à votre adresse.
          Cliquez sur le lien dans cet email pour activer votre compte.
        </p>
        <p className="text-[0.72rem] text-neutral-600 mb-8">
          Le lien expire dans 24 heures.
        </p>
        <Link
          href="/connexion"
          className="text-[0.62rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors border-b border-neutral-700 hover:border-neutral-400 pb-0.5"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}
