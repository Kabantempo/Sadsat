'use server'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getOrders } from '@/lib/orders'
import {
  createReview,
  hasAlreadyReviewed,
  deleteReview,
  updateReviewStatus,
} from '@/lib/reviews'
import { verifyAdmin } from '@/lib/dal'

export type ReviewActionState =
  | { error?: string; success?: boolean }
  | undefined

export async function submitReviewAction(
  _state: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const session = await getSession()
  if (!session) return { error: 'Vous devez être connecté pour laisser un avis.' }

  const productId   = String(formData.get('productId') ?? '').trim()
  const productName = String(formData.get('productName') ?? '').trim()
  const ratingStr   = String(formData.get('rating') ?? '0')
  const comment     = String(formData.get('comment') ?? '').trim()
  const rating      = parseInt(ratingStr)

  if (!productId || !comment) return { error: 'Veuillez remplir tous les champs.' }
  if (rating < 1 || rating > 5) return { error: 'Veuillez choisir une note.' }
  if (comment.length < 10) return { error: 'L\'avis doit faire au moins 10 caractères.' }
  if (comment.length > 1000) return { error: 'L\'avis ne peut pas dépasser 1000 caractères.' }

  // Vérification d'achat
  const orders = await getOrders()
  const hasBought = orders.some(
    (o) =>
      o.customerEmail.toLowerCase() === session.email?.toLowerCase() &&
      o.items.some((i) => i.productId === productId)
  )
  if (!hasBought) return { error: 'Vous devez avoir acheté ce produit pour laisser un avis.' }

  const alreadyReviewed = await hasAlreadyReviewed(productId, session.email ?? '')
  if (alreadyReviewed) return { error: 'Vous avez déjà laissé un avis pour ce produit.' }

  await createReview({
    id: crypto.randomUUID(),
    productId,
    productName,
    authorName: session.name ?? 'Client',
    authorEmail: session.email ?? '',
    rating,
    comment,
  })

  return { success: true }
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await verifyAdmin()
  const id = String(formData.get('id') ?? '')
  await deleteReview(id)
  redirect('/admin/avis')
}

export async function toggleReviewStatusAction(formData: FormData): Promise<void> {
  await verifyAdmin()
  const id     = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  const next   = status === 'approuvé' ? 'masqué' : 'approuvé'
  await updateReviewStatus(id, next)
  redirect('/admin/avis')
}
