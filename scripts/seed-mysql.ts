import { PrismaClient } from '@prisma/client'
import { SEED_USERS, SEED_PRODUCTS } from '../lib/seed'

const prisma = new PrismaClient()

async function seed() {
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email.toLowerCase(),
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
        bio: user.bio ?? null,
        avatar: user.avatar ?? null,
        createdAt: user.createdAt,
        setPasswordToken: user.setPasswordToken ?? null,
        setPasswordTokenExpiry: user.setPasswordTokenExpiry ?? null,
      },
    })
  }
  console.log(`✓ ${SEED_USERS.length} utilisateurs seedés`)

  for (const product of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        universe: product.universe,
        category: product.category,
        images: JSON.stringify(product.images),
        stock: product.stock,
        status: product.status,
        serialNumber: product.serialNumber ?? null,
        dimensions: product.dimensions ? JSON.stringify(product.dimensions) : null,
        materials: product.materials ?? null,
        video: product.video ?? null,
        createdBy: product.createdBy ?? null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    })
  }
  console.log(`✓ ${SEED_PRODUCTS.length} produits seedés`)

  await prisma.$disconnect()
  console.log('Terminé !')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
