import { verifyAdmin } from '@/lib/dal'
import { getNewsletterSubscribers } from '@/lib/newsletter'
import { isNewsletterEnabled } from '@/lib/settings'
import { toggleNewsletterAction, deleteSubscriberAction } from '@/app/actions/newsletter'
import { Mail, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

export default async function AdminNewsletterPage() {
  await verifyAdmin()
  const [subscribers, enabled] = await Promise.all([
    getNewsletterSubscribers(),
    isNewsletterEnabled(),
  ])

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Administration
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Newsletter
      </h1>

      {/* Toggle activation */}
      <div className="border border-neutral-200 bg-white mb-8">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[0.85rem] font-medium text-neutral-800 mb-1">
              Formulaire d'inscription
            </p>
            <p className="text-[0.72rem] text-neutral-500">
              {enabled
                ? "Le formulaire newsletter est affiché sur le site."
                : "Le formulaire newsletter est masqué sur le site."}
            </p>
          </div>
          <form action={toggleNewsletterAction}>
            <input type="hidden" name="enabled" value={enabled ? 'false' : 'true'} />
            <button
              type="submit"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[0.62rem] tracking-[0.14em] uppercase font-medium transition-colors ${
                enabled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
              }`}
            >
              {enabled ? (
                <><ToggleRight size={16} /> Activée</>
              ) : (
                <><ToggleLeft size={16} /> Désactivée</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Liste abonnés */}
      <div className="border border-neutral-200 bg-white">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Mail size={13} strokeWidth={1.5} className="text-neutral-500" />
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Abonnés ({subscribers.length})
          </p>
        </div>

        {subscribers.length === 0 ? (
          <p className="px-6 py-10 text-[0.82rem] text-neutral-400 italic text-center">
            Aucun abonné pour le moment.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {subscribers.map((s) => (
              <div key={s.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.85rem] text-neutral-800">{s.email}</p>
                  <p className="text-[0.65rem] text-neutral-400 mt-0.5">
                    Inscrit le {new Date(s.subscribedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <form action={deleteSubscriberAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    aria-label="Supprimer l'abonné"
                    className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {subscribers.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-100">
            <p className="text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400">
              {subscribers.length} abonné{subscribers.length > 1 ? 's' : ''} au total
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
