import { verifyAdmin } from '@/lib/dal'
import { getAllReviews } from '@/lib/reviews'
import { deleteReviewAction, toggleReviewStatusAction } from '@/app/actions/reviews'
import { MessageSquare, Star, Trash2, Eye, EyeOff } from 'lucide-react'

const STATUS_STYLE: Record<string, string> = {
  approuvé: 'bg-emerald-50 text-emerald-700',
  masqué:   'bg-neutral-100 text-neutral-400',
}

export default async function AdminAvisPage() {
  await verifyAdmin()
  const reviews = await getAllReviews()

  const approved = reviews.filter((r) => r.status === 'approuvé').length
  const hidden   = reviews.filter((r) => r.status === 'masqué').length

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">

      {/* En-tête */}
      <div className="mb-10">
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
        <h1 className="font-serif text-3xl tracking-wide text-neutral-900">Avis clients</h1>
        <p className="text-[0.75rem] text-neutral-400 mt-1">{reviews.length} avis au total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Total',    value: reviews.length, color: 'text-neutral-700' },
          { label: 'Publiés',  value: approved,       color: 'text-emerald-600' },
          { label: 'Masqués',  value: hidden,         color: 'text-neutral-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="border border-neutral-200 bg-white px-5 py-4">
            <p className={`font-serif text-2xl leading-none ${color}`}>{value}</p>
            <p className="text-[0.56rem] tracking-[0.18em] uppercase mt-1 text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Liste */}
      {reviews.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-12 text-center">
          <MessageSquare size={28} strokeWidth={1} className="text-neutral-300 mx-auto mb-3" />
          <p className="text-[0.78rem] text-neutral-400">Aucun avis pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="border border-neutral-200 bg-white overflow-hidden">
              <div className="px-6 py-4 flex flex-wrap items-start gap-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <span className="text-neutral-500 text-[0.72rem] font-medium uppercase">
                    {r.authorName.charAt(0)}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="text-[0.83rem] font-medium text-neutral-800">{r.authorName}</p>
                    <span className="text-[0.62rem] text-neutral-400">{r.authorEmail}</span>
                    <span className={`text-[0.52rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status] ?? 'bg-neutral-100 text-neutral-400'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-neutral-500 mb-2">
                    {r.productName} ·{' '}
                    {new Date(r.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                  {/* Étoiles */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        strokeWidth={1.5}
                        className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}
                      />
                    ))}
                  </div>
                  <p className="text-[0.82rem] text-neutral-600 leading-relaxed">{r.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <form action={toggleReviewStatusAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value={r.status} />
                    <button
                      type="submit"
                      title={r.status === 'approuvé' ? 'Masquer' : 'Publier'}
                      className="p-1.5 text-neutral-300 hover:text-neutral-700 transition-colors"
                    >
                      {r.status === 'approuvé'
                        ? <EyeOff size={14} strokeWidth={1.5} />
                        : <Eye size={14} strokeWidth={1.5} />
                      }
                    </button>
                  </form>
                  <form action={deleteReviewAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      title="Supprimer"
                      className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
