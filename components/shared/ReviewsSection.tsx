import { getSession } from '@/lib/session'
import { getOrders } from '@/lib/orders'
import { getReviewsByProduct, hasAlreadyReviewed, avgRating, type Review } from '@/lib/reviews'
import { StarDisplay } from './StarRating'
import ReviewForm from './ReviewForm'
import { MessageSquare } from 'lucide-react'

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  return (
    <div className="py-6 border-b border-neutral-800 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
            <span className="text-neutral-400 text-[0.72rem] font-medium uppercase">
              {review.authorName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-[0.8rem] font-medium text-neutral-200">{review.authorName}</p>
            <p className="text-[0.62rem] text-neutral-600">{date}</p>
          </div>
        </div>
        <StarDisplay rating={review.rating} size={13} />
      </div>
      <p className="text-[0.85rem] text-neutral-400 leading-relaxed pl-11">
        {review.comment}
      </p>
    </div>
  )
}

type Props = {
  productId: string
  productName: string
}

export default async function ReviewsSection({ productId, productName }: Props) {
  const [reviews, session] = await Promise.all([
    getReviewsByProduct(productId),
    getSession(),
  ])

  const avg = avgRating(reviews)
  const canReview = await (async () => {
    if (!session?.email) return false
    const [orders, alreadyReviewed] = await Promise.all([
      getOrders(),
      hasAlreadyReviewed(productId, session.email),
    ])
    if (alreadyReviewed) return false
    return orders.some(
      (o) =>
        o.customerEmail.toLowerCase() === session.email!.toLowerCase() &&
        o.items.some((i) => i.productId === productId)
    )
  })()

  return (
    <section id="avis" className="mt-24 pt-16 border-t border-neutral-800">
      {/* En-tête */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} strokeWidth={1.5} className="text-neutral-500" />
            <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-500">
              Avis clients
            </p>
          </div>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-3">
              <StarDisplay rating={Math.round(avg)} size={18} />
              <p className="font-serif text-2xl text-neutral-100">
                {avg.toFixed(1)}
              </p>
              <p className="text-[0.72rem] text-neutral-600">
                ({reviews.length} avis)
              </p>
            </div>
          ) : (
            <p className="font-serif italic text-xl text-neutral-600">Aucun avis pour l'instant</p>
          )}
        </div>
      </div>

      {/* Distribution des notes */}
      {reviews.length > 0 && (
        <div className="space-y-1.5 mb-10 max-w-xs">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const pct = reviews.length ? (count / reviews.length) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="font-mono text-[0.6rem] text-neutral-500 w-4 shrink-0">{star}</span>
                <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-mono text-[0.6rem] text-neutral-600 w-4 shrink-0">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Liste des avis */}
      {reviews.length > 0 && (
        <div className="mb-12">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}

      {/* Formulaire */}
      {canReview && (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-500 mb-5">
            Partagez votre expérience
          </p>
          <ReviewForm
            productId={productId}
            productName={productName}
            authorName={session!.name ?? 'Client'}
          />
        </div>
      )}

      {!session && reviews.length === 0 && (
        <p className="text-[0.78rem] text-neutral-600 italic">
          Connectez-vous et commandez ce produit pour laisser un avis.
        </p>
      )}
    </section>
  )
}
