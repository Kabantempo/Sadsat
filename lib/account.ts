import 'server-only'
import { prisma } from './prisma'

/** Toutes les données personnelles rattachées à un compte (droit d'accès et portabilité, art. 15 et 20 RGPD). */
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  const email = user.email
  const [orders, reviews, newsletter] = await Promise.all([
    prisma.order.findMany({ where: { customerEmail: { equals: email, mode: 'insensitive' } }, include: { items: true }, orderBy: { createdAt: 'desc' } }),
    prisma.review.findMany({ where: { authorEmail: { equals: email, mode: 'insensitive' } } }),
    prisma.newsletterSubscriber.findUnique({ where: { email } }),
  ])
  return {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      bio: user.bio,
      instagram: user.instagram,
      pseudo: user.pseudo,
      favorites: user.favorites,
    },
    orders,
    reviews,
    newsletter: newsletter ? { subscribedAt: newsletter.subscribedAt } : null,
  }
}

/**
 * Suppression du compte (art. 17 RGPD).
 * - le compte, les jetons et les favoris sont supprimés ;
 * - l'abonnement newsletter est supprimé ;
 * - les avis publiés sont anonymisés ;
 * - les commandes sont conservées (obligation comptable de 10 ans, art. L123-22 du Code de commerce) ;
 *   elles sont purgées par scripts/purge-retention.ts à l'échéance.
 */
export async function deleteAccountData(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false
  const email = user.email
  await prisma.$transaction([
    prisma.review.updateMany({
      where: { authorEmail: { equals: email, mode: 'insensitive' } },
      data: { authorName: 'Client supprimé', authorEmail: `supprime-${userId}@anonyme.invalid` },
    }),
    prisma.newsletterSubscriber.deleteMany({ where: { email } }),
    prisma.user.delete({ where: { id: userId } }),
  ])
  return true
}
