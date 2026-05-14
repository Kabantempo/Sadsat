'use server'
import { mkdir, writeFile, unlink } from 'fs/promises'
import path from 'path'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/dal'
import { createProduct, updateProduct, deleteProduct, getProductById } from '@/lib/products'
import type { ProductFormState, Universe, ProductStatus } from '@/lib/definitions'
import { UNIVERSES } from '@/lib/definitions'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products')

async function saveFiles(files: File[]): Promise<string[]> {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const paths: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(UPLOAD_DIR, filename), buffer)
    paths.push(`/uploads/products/${filename}`)
  }
  return paths
}

function parseProduct(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const priceRaw = String(formData.get('price') ?? '0').replace(',', '.')
  const price = Math.round(parseFloat(priceRaw) * 100)
  const universe = String(formData.get('universe') ?? '') as Universe
  const category = String(formData.get('category') ?? '').trim()
  const stock = parseInt(String(formData.get('stock') ?? '1'), 10)
  const status = String(formData.get('status') ?? 'disponible') as ProductStatus
  const serialNumber = String(formData.get('serialNumber') ?? '').trim() || undefined

  const errors: ProductFormState = { errors: {} }
  if (!name || name.length < 2) errors.errors!.name = ['Le nom est requis (min. 2 caractères).']
  if (!description) errors.errors!.description = ['La description est requise.']
  if (isNaN(price) || price < 0) errors.errors!.price = ['Prix invalide.']
  if (!UNIVERSES.includes(universe)) errors.errors!.universe = ["L'univers est requis."]
  if (!category) errors.errors!.category = ['La catégorie est requise.']
  if (isNaN(stock) || stock < 0) errors.errors!.stock = ['Stock invalide.']

  const hasErrors = Object.values(errors.errors!).some((v) => v && v.length > 0)
  if (hasErrors) return { valid: false, errors, data: null }

  return { valid: true, errors: null, data: { name, description, price, universe, category, stock, status, serialNumber } }
}

export async function createProductAction(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdmin()
  const parsed = parseProduct(formData)
  if (!parsed.valid || !parsed.data) return parsed.errors ?? undefined

  const newFiles = formData.getAll('newImages') as File[]
  const imagePaths = await saveFiles(newFiles)

  createProduct({
    id: crypto.randomUUID(),
    ...parsed.data,
    images: imagePaths,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  redirect('/admin/produits')
}

export async function updateProductAction(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdmin()
  const id = String(formData.get('productId') ?? '')
  if (!id) return { message: 'Produit introuvable.' }

  const parsed = parseProduct(formData)
  if (!parsed.valid || !parsed.data) return parsed.errors ?? undefined

  const existingImages = formData.getAll('existingImages') as string[]
  const newFiles = formData.getAll('newImages') as File[]
  const newPaths = await saveFiles(newFiles)

  updateProduct(id, {
    ...parsed.data,
    images: [...existingImages, ...newPaths],
  })
  redirect('/admin/produits')
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await verifyAdmin()
  const id = String(formData.get('productId') ?? '')
  const product = getProductById(id)
  if (product) {
    for (const imgPath of product.images) {
      const fullPath = path.join(process.cwd(), 'public', imgPath)
      unlink(fullPath).catch(() => null)
    }
    deleteProduct(id)
  }
  redirect('/admin/produits')
}
