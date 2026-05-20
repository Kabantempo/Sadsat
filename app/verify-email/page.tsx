import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { getUserByVerificationToken, verifyUserEmail } from '@/lib/db'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <Result success={false} message="Lien de confirmation invalide." />
  }

  let user
  try {
    user = await getUserByVerificationToken(token)
  } catch {
    return <Result success={false} message="Erreur serveur. Réessayez dans quelques instants." />
  }

  if (!user || !user.verificationTokenExpiry) {
    return <Result success={false} message="Ce lien est invalide ou a déjà été utilisé." />
  }

  if (new Date(user.verificationTokenExpiry) < new Date()) {
    return <Result success={false} message="Ce lien a expiré. Créez un nouveau compte." />
  }

  try {
    await verifyUserEmail(user.id)
  } catch {
    return <Result success={false} message="Erreur serveur. Réessayez dans quelques instants." />
  }

  return <Result success={true} message="Votre email est confirmé. Vous pouvez maintenant vous connecter." />
}

function Result({ success, message }: { success: boolean; message: string }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-neutral-700 mb-8">
          {success
            ? <CheckCircle size={24} strokeWidth={1} className="text-green-500" />
            : <XCircle size={24} strokeWidth={1} className="text-red-500" />
          }
        </div>
        <h1 className="font-serif font-light text-3xl italic text-neutral-100 mb-4">
          {success ? 'Email confirmé' : 'Lien invalide'}
        </h1>
        <p className="text-[0.85rem] text-neutral-500 leading-relaxed mb-8">
          {message}
        </p>
        <Link
          href="/connexion"
          className="text-[0.62rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors border-b border-neutral-700 hover:border-neutral-400 pb-0.5"
        >
          {success ? 'Se connecter →' : 'Retour à la connexion'}
        </Link>
      </div>
    </div>
  )
}
