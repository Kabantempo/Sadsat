import { redirect } from 'next/navigation'
import { getUserByPasswordToken } from '@/lib/db'
import SetPasswordForm from '@/components/shared/SetPasswordForm'

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  if (!token) redirect('/connexion')

  const user = await getUserByPasswordToken(token)

  if (!user || !user.setPasswordTokenExpiry || new Date(user.setPasswordTokenExpiry) < new Date()) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600 mb-4">SADSAT</p>
          <h1 className="font-serif text-2xl font-light text-neutral-300 mb-3">Lien invalide</h1>
          <p className="text-[0.8rem] text-neutral-500 mb-6">
            Ce lien est expiré ou a déjà été utilisé.<br />
            Contactez votre administrateur pour en obtenir un nouveau.
          </p>
          <a
            href="/connexion"
            className="text-[0.62rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors border-b border-neutral-700 hover:border-neutral-400 pb-0.5"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    )
  }

  return <SetPasswordForm token={token} name={user.name} />
}
