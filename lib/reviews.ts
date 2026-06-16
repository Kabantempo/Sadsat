import { prisma } from './prisma'

export type Review = {
  id: string
  productId: string
  productName: string
  authorName: string
  authorEmail: string
  rating: number
  comment: string
  status: string
  createdAt: string
  updatedAt: string
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  try {
    return await prisma.review.findMany({
      where: { productId, status: 'approuvé' },
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export async function getReviewsByEmail(email: string): Promise<Review[]> {
  try {
    return await prisma.review.findMany({
      where: { authorEmail: email.toLowerCase() },
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export async function getReviewedProductIds(email: string): Promise<string[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { authorEmail: email.toLowerCase() },
      select: { productId: true },
    })
    return reviews.map((r) => r.productId)
  } catch { return [] }
}

export async function hasAlreadyReviewed(productId: string, email: string): Promise<boolean> {
  try {
    const r = await prisma.review.findUnique({
      where: { productId_authorEmail: { productId, authorEmail: email.toLowerCase() } },
    })
    return !!r
  } catch { return false }
}

export async function createReview(data: {
  id: string
  productId: string
  productName: string
  authorName: string
  authorEmail: string
  rating: number
  comment: string
}): Promise<Review> {
  return prisma.review.create({
    data: {
      ...data,
      authorEmail: data.authorEmail.toLowerCase(),
      status: 'approuvé',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  })
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    return await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function updateReviewStatus(id: string, status: string): Promise<void> {
  await prisma.review.update({ where: { id }, data: { status, updatedAt: new Date().toISOString() } })
}

export async function deleteReview(id: string): Promise<void> {
  await prisma.review.delete({ where: { id } })
}

export function avgRating(reviews: Review[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export async function getAvgRatings(): Promise<Record<string, { avg: number; count: number }>> {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'approuvé' },
      select: { productId: true, rating: true },
    })
    const map: Record<string, { sum: number; count: number }> = {}
    for (const r of reviews) {
      if (!map[r.productId]) map[r.productId] = { sum: 0, count: 0 }
      map[r.productId].sum += r.rating
      map[r.productId].count += 1
    }
    return Object.fromEntries(
      Object.entries(map).map(([id, { sum, count }]) => [
        id,
        { avg: Math.round((sum / count) * 10) / 10, count },
      ])
    )
  } catch { return {} }
}
