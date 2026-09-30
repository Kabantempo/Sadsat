/**
 * Applique les durées de conservation annoncées dans la politique de confidentialité.
 *
 *   npx tsx --env-file=.env.local scripts/purge-retention.ts          # simulation (ne supprime rien)
 *   npx tsx --env-file=.env.local scripts/purge-retention.ts --apply  # suppression réelle
 *
 * À planifier une fois par mois (tâche cron Hostinger).
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const apply = process.argv.includes('--apply')

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 3600 * 1000).toISOString()

async function main() {
  // 1. Comptes dont l'email n'a jamais été confirmé depuis plus de 30 jours
  const unverified = await prisma.user.findMany({
    where: { emailVerified: false, passwordHash: { not: '' }, createdAt: { lt: daysAgo(30) }, role: 'client' },
    select: { id: true, email: true },
  })

  // 2. Commandes de plus de 10 ans (obligation comptable échue)
  const oldOrders = await prisma.order.findMany({
    where: { createdAt: { lt: daysAgo(3650) } },
    select: { id: true },
  })

  console.log(`${apply ? 'SUPPRESSION' : 'SIMULATION'} — comptes non vérifiés > 30 j : ${unverified.length} ; commandes > 10 ans : ${oldOrders.length}`)
  if (!apply) return

  if (unverified.length) await prisma.user.deleteMany({ where: { id: { in: unverified.map((u) => u.id) } } })
  if (oldOrders.length) await prisma.order.deleteMany({ where: { id: { in: oldOrders.map((o) => o.id) } } })
  console.log('Terminé.')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
