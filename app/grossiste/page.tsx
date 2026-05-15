import { verifyGrossiste, getCurrentUser } from '@/lib/dal'
import { logout } from '@/app/actions/auth'
import ChangePasswordForm from '@/components/shared/ChangePasswordForm'

export default async function GrossistePage() {
  await verifyGrossiste()
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
          Espace grossiste
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-neutral-900 mb-12">
          Bonjour, {user?.name}
        </h1>

        <div className="grid gap-px bg-neutral-200">
          <div className="bg-white p-8">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">Email</p>
            <p className="text-[0.9rem] text-neutral-700">{user?.email}</p>
          </div>
          <div className="bg-white p-8">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">Compte</p>
            <p className="text-[0.9rem] text-neutral-700">Grossiste</p>
          </div>
          <ChangePasswordForm />
        </div>

        <form action={logout} className="mt-12">
          <button
            type="submit"
            className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  )
}
