import 'server-only'
import { prisma } from './prisma'
import { randomUUID } from 'crypto'

export async function subscribeNewsletter(email: string): Promise<'ok' | 'already' | 'error'> {
  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
    if (existing) return 'already'
    await prisma.newsletterSubscriber.create({
      data: { id: randomUUID(), email, subscribedAt: new Date().toISOString() },
    })
    return 'ok'
  } catch {
    return 'error'
  }
}

export async function getNewsletterSubscribers() {
  return prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } })
}

export async function deleteSubscriber(id: string) {
  await prisma.newsletterSubscriber.delete({ where: { id } })
}

export async function unsubscribeByEmail(email: string): Promise<void> {
  await prisma.newsletterSubscriber.deleteMany({ where: { email } })
}

export async function isSubscribed(email: string): Promise<boolean> {
  return !!(await prisma.newsletterSubscriber.findUnique({ where: { email } }))
}
