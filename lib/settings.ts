import 'server-only'
import { prisma } from './prisma'

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  return row?.value ?? null
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
}

export async function isNewsletterEnabled(): Promise<boolean> {
  const val = await getSetting('newsletter_enabled')
  return val === 'true'
}
