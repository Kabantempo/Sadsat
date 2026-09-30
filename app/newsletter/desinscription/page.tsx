import Link from 'next/link'
import { verifyToken } from '@/lib/tokens'
import { unsubscribeByEmail } from '@/lib/newsletter'

export const metadata = { title: 'Désinscription newsletter · SADSAT', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  const email = await verifyToken(token, 'nl-unsub')
  if (email) await unsubscribeByEmail(email)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-neutral-100 mb-4">{email ? 'Vous êtes désinscrit(e)' : 'Lien invalide'}</h1>
        <p className="text-[0.85rem] text-neutral-400 mb-8">
          {email
            ? 'Votre adresse a été retirée de notre liste. Vous ne recevrez plus la newsletter.'
            : 'Ce lien de désinscription n’est pas valable. Écrivez-nous via la page contact et nous retirerons votre adresse.'}
        </p>
        <Link href="/" className="text-[0.62rem] tracking-[0.2em] uppercase text-neutral-300 underline underline-offset-4">Retour au site</Link>
      </div>
    </div>
  )
}
