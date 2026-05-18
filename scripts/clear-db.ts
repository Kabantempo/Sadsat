import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const p = await prisma.product.deleteMany()
  const u = await prisma.user.deleteMany()
  console.log(`✓ ${p.count} produits supprimés`)
  console.log(`✓ ${u.count} utilisateurs supprimés`)
  await prisma.$disconnect()
}
main().catch(console.error)
