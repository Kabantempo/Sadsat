'use server'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/dal'
import { createProduct, updateProduct, deleteProduct, getProductById } from '@/lib/products'
import type { ProductFormState, Universe, ProductStatus, Dimensions } from '@/lib/definitions'
import { UNIVERSES } from '@/lib/definitions'
import { uploadFile, deleteFile } from '@/lib/cloudinary'

async function saveFiles(files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    const url = await uploadFile(file, 'sadsat/products')
    urls.push(url)
  }
  return urls
}

async function saveVideo(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  return uploadFile(file, 'sadsat/products/videos')
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
  const materials = String(formData.get('materials') ?? '').trim() || undefined

  const parseDim = (key: string) => {
    const v = parseFloat(String(formData.get(key) ?? '').replace(',', '.'))
    return isNaN(v) || v <= 0 ? undefined : v
  }
  const dimensions: Dimensions = {
    hauteur: parseDim('dim_hauteur'),
    largeur: parseDim('dim_largeur'),
    profondeur: parseDim('dim_profondeur'),
    diametre: parseDim('dim_diametre'),
    longueur: parseDim('dim_longueur'),
    poids: parseDim('dim_poids'),
  }
  const hasDimensions = Object.values(dimensions).some((v) => v !== undefined)

  const errors: ProductFormState = { errors: {} }
  if (!name || name.length < 2) errors.errors!.name = ['Le nom est requis (min. 2 caractères).']
  if (!description) errors.errors!.description = ['La description est requise.']
  if (isNaN(price) || price < 0) errors.errors!.price = ['Prix invalide.']
  if (!UNIVERSES.includes(universe)) errors.errors!.universe = ["L'univers est requis."]
  if (!category) errors.errors!.category = ['La catégorie est requise.']
  if (isNaN(stock) || stock < 0) errors.errors!.stock = ['Stock invalide.']

  const hasErrors = Object.values(errors.errors!).some((v) => v && v.length > 0)
  if (hasErrors) return { valid: false, errors, data: null }

  return {
    valid: true, errors: null,
    data: {
      name, description, price, universe, category, stock, status, serialNumber, materials,
      ...(hasDimensions ? { dimensions } : {}),
    },
  }
}

export async function createProductAction(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdmin()
  const parsed = parseProduct(formData)
  if (!parsed.valid || !parsed.data) return parsed.errors ?? undefined

  try {
    const newFiles = formData.getAll('newImages') as File[]
    const imagePaths = await saveFiles(newFiles)
    const videoFile = formData.get('video') as File | null
    const videoPath = videoFile ? await saveVideo(videoFile) : null

    await createProduct({
      id: crypto.randomUUID(),
      ...parsed.data,
      images: imagePaths,
      ...(videoPath ? { video: videoPath } : {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[createProductAction]', err)
    return { message: 'Erreur lors de la création du produit. Vérifiez la connexion à la base de données.' }
  }
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

  try {
    const existingImages = formData.getAll('existingImages') as string[]
    const newFiles = formData.getAll('newImages') as File[]
    const newPaths = await saveFiles(newFiles)

    const videoFile = formData.get('video') as File | null
    const existingVideo = String(formData.get('existingVideo') ?? '') || undefined
    const newVideoPath = videoFile ? await saveVideo(videoFile) : null
    const videoPath = newVideoPath ?? existingVideo ?? null

    await updateProduct(id, {
      ...parsed.data,
      images: [...existingImages, ...newPaths],
      ...(videoPath !== null ? { video: videoPath } : { video: undefined }),
    })
  } catch (err) {
    console.error('[updateProductAction]', err)
    return { message: 'Erreur lors de la mise à jour. Vérifiez la connexion à la base de données.' }
  }
  redirect('/admin/produits')
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await verifyAdmin()
  const id = String(formData.get('productId') ?? '')
  const product = await getProductById(id)
  if (product) {
    for (const imgUrl of product.images) {
      await deleteFile(imgUrl).catch(() => null)
    }
    await deleteProduct(id)
  }
  redirect('/admin/produits')
}
