import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('Sadsat123', 12)
  const now = new Date().toISOString()

  const accounts = [
    { id: randomUUID(), email: 'createur@test.sadsat.com',  name: 'Créateur Test',  role: 'créateur',  passwordHash: password },
    { id: randomUUID(), email: 'grossiste@test.sadsat.com', name: 'Grossiste Test', role: 'grossiste', passwordHash: password },
    { id: randomUUID(), email: 'client@test.sadsat.com',    name: 'Client Test',    role: 'client',    passwordHash: password },
  ]

  for (const account of accounts) {
    await prisma.user.upsert({
      where: { email: account.email },
      update: { passwordHash: account.passwordHash },
      create: { ...account, createdAt: now },
    })
    console.log(`✓ ${account.role} — ${account.email}`)
  }

  console.log('\nMot de passe pour tous : Sadsat123')
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
