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
  return prisma.review.findMany({
    where: { productId, status: 'approuvé' },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getReviewsByEmail(email: string): Promise<Review[]> {
  return prisma.review.findMany({
    where: { authorEmail: email.toLowerCase() },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getReviewedProductIds(email: string): Promise<string[]> {
  const reviews = await prisma.review.findMany({
    where: { authorEmail: email.toLowerCase() },
    select: { productId: true },
  })
  return reviews.map((r) => r.productId)
}

export async function hasAlreadyReviewed(productId: string, email: string): Promise<boolean> {
  const r = await prisma.review.findUnique({
    where: { productId_authorEmail: { productId, authorEmail: email.toLowerCase() } },
  })
  return !!r
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
  return prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
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
