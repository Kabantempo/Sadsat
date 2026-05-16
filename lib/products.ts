import 'server-only'
import type { Product, Dimensions } from './definitions'
import { prisma } from './prisma'

function rowToProduct(row: {
  id: string
  name: string
  description: string
  price: number
  universe: string
  category: string
  images: string
  stock: number
  status: string
  serialNumber: string | null
  dimensions: string | null
  materials: string | null
  video: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    universe: row.universe as Product['universe'],
    category: row.category,
    images: JSON.parse(row.images || '[]') as string[],
    stock: row.stock,
    status: row.status as Product['status'],
    serialNumber: row.serialNumber ?? undefined,
    dimensions: row.dimensions ? (JSON.parse(row.dimensions) as Dimensions) : undefined,
    materials: row.materials ?? undefined,
    video: row.video ?? undefined,
    createdBy: row.createdBy ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(rowToProduct)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { id } })
  return row ? rowToProduct(row) : undefined
}

export async function createProduct(product: Product): Promise<void> {
  await prisma.product.create({
    data: {
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

export async function updateProduct(id: string, data: Partial<Product>): Promise<boolean> {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.universe !== undefined && { universe: data.universe }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.images !== undefined && { images: JSON.stringify(data.images) }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.serialNumber !== undefined && { serialNumber: data.serialNumber ?? null }),
        ...(data.dimensions !== undefined && {
          dimensions: data.dimensions ? JSON.stringify(data.dimensions) : null,
        }),
        ...(data.materials !== undefined && { materials: data.materials ?? null }),
        ...(data.video !== undefined && { video: data.video ?? null }),
        updatedAt: new Date().toISOString(),
      },
    })
    return true
  } catch {
    return false
  }
}

export async function clearAllProducts(): Promise<void> {
  await prisma.product.deleteMany()
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
