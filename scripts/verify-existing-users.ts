import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const r = await prisma.user.updateMany({ data: { emailVerified: true } })
  console.log(`✓ ${r.count} utilisateurs marqués comme vérifiés`)
  await prisma.$disconnect()
}
main().catch(console.error)
