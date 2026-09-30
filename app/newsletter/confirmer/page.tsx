import Link from 'next/link'
import { verifyToken } from '@/lib/tokens'
import { subscribeNewsletter } from '@/lib/newsletter'

export const metadata = { title: 'Confirmation newsletter · SADSAT', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function ConfirmNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  const email = await verifyToken(token, 'nl-confirm')
  const result = email ? await subscribeNewsletter(email) : 'invalid'
  const ok = result === 'ok' || result === 'already'

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-neutral-100 mb-4">{ok ? 'Inscription confirmée' : 'Lien invalide ou expiré'}</h1>
        <p className="text-[0.85rem] text-neutral-400 mb-8">
          {ok
            ? 'Merci ! Vous recevrez les actualités de SADSAT. Chaque email contient un lien pour vous désinscrire.'
            : 'Ce lien de confirmation n’est plus valable. Vous pouvez vous réinscrire depuis le bas de page du site.'}
        </p>
        <Link href="/" className="text-[0.62rem] tracking-[0.2em] uppercase text-neutral-300 underline underline-offset-4">Retour au site</Link>
      </div>
    </div>
  )
}
