'use server'
import { mkdir, writeFile, unlink } from 'fs/promises'
import path from 'path'
import { redirect } from 'next/navigation'
import { verifyCreateur } from '@/lib/dal'
import { updateUser } from '@/lib/db'
import { createProduct, updateProduct, deleteProduct, getProductById } from '@/lib/products'
import type { ProductFormState, Universe, ProductStatus, Dimensions } from '@/lib/definitions'
import { UNIVERSES } from '@/lib/definitions'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products')
const AVATAR_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars')

export type ProfileFormState = { message?: string; success?: boolean } | undefined

export async function updateProfileAction(
  _state: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await verifyCreateur()

  const name = String(formData.get('name') ?? '').trim()
  const pseudo = String(formData.get('pseudo') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  const instagramRaw = String(formData.get('instagram') ?? '').trim().replace(/^@/, '')
  const availability = String(formData.get('availability') ?? '').trim()
  const avatarFile = formData.get('avatar') as File | null

  if (!name || name.length < 2) {
    return { message: 'Le nom doit faire au moins 2 caractères.' }
  }

  let avatarPath: string | undefined
  if (avatarFile && avatarFile.size > 0) {
    await mkdir(AVATAR_DIR, { recursive: true })
    const ext = avatarFile.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${session.userId}.${ext}`
    const buffer = Buffer.from(await avatarFile.arrayBuffer())
    await writeFile(path.join(AVATAR_DIR, filename), buffer)
    avatarPath = `/uploads/avatars/${filename}`
  }

  await updateUser(session.userId, {
    name,
    pseudo: pseudo || undefined,
    bio: bio || undefined,
    instagram: instagramRaw || undefined,
    availability: availability || undefined,
    ...(avatarPath ? { avatar: avatarPath } : {}),
  })

  return { success: true, message: 'Profil mis à jour.' }
}

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

async function saveVideoFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  await mkdir(UPLOAD_DIR, { recursive: true })
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
  const filename = `${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, filename), buffer)
  return `/uploads/products/${filename}`
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

export async function createCreateurProductAction(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await verifyCreateur()
  const intent = String(formData.get('_intent') ?? 'publish')
  const parsed = parseProduct(formData)
  if (!parsed.valid || !parsed.data) return parsed.errors ?? undefined

  const newFiles = formData.getAll('newImages') as File[]
  const imagePaths = await saveFiles(newFiles)
  const videoFile = formData.get('video') as File | null
  const videoPath = await saveVideoFile(videoFile)

  const productId = crypto.randomUUID()
  const status = intent === 'preview' ? 'masqué' : parsed.data.status

  await createProduct({
    id: productId,
    ...parsed.data,
    status,
    images: imagePaths,
    ...(videoPath ? { video: videoPath } : {}),
    createdBy: session.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  if (intent === 'preview') redirect(`/produits/${productId}?preview=1`)
  redirect('/createur/produits')
}

export async function updateCreateurProductAction(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await verifyCreateur()
  const intent = String(formData.get('_intent') ?? 'publish')
  const id = String(formData.get('productId') ?? '')
  if (!id) return { message: 'Produit introuvable.' }

  const product = await getProductById(id)
  if (!product) return { message: 'Produit introuvable.' }

  if (product.createdBy && product.createdBy !== session.userId && session.role !== 'admin') {
    return { message: 'Vous ne pouvez pas modifier ce produit.' }
  }

  const parsed = parseProduct(formData)
  if (!parsed.valid || !parsed.data) return parsed.errors ?? undefined

  const existingImages = formData.getAll('existingImages') as string[]
  const newFiles = formData.getAll('newImages') as File[]
  const newPaths = await saveFiles(newFiles)

  const videoFile = formData.get('video') as File | null
  const existingVideo = String(formData.get('existingVideo') ?? '')
  const newVideoPath = await saveVideoFile(videoFile)
  const finalVideo = newVideoPath ?? (existingVideo || undefined)

  await updateProduct(id, {
    ...parsed.data,
    images: [...existingImages, ...newPaths],
    video: finalVideo,
  })

  if (intent === 'preview') redirect(`/produits/${id}?preview=1`)
  redirect('/createur/produits')
}

export async function publishProductAction(formData: FormData): Promise<void> {
  const session = await verifyCreateur()
  const id = String(formData.get('productId') ?? '')
  const product = await getProductById(id)
  if (!product) return
  if (product.createdBy && product.createdBy !== session.userId && session.role !== 'admin') {
    throw new Error('Non autorisé.')
  }
  await updateProduct(id, { status: 'disponible' })
  redirect(`/produits/${id}`)
}

export async function deleteCreateurProductAction(formData: FormData): Promise<void> {
  const session = await verifyCreateur()
  const id = String(formData.get('productId') ?? '')
  const product = await getProductById(id)
  if (product) {
    if (product.createdBy && product.createdBy !== session.userId && session.role !== 'admin') {
      throw new Error('Non autorisé.')
    }
    for (const imgPath of product.images) {
      const fullPath = path.join(process.cwd(), 'public', imgPath)
      unlink(fullPath).catch(() => null)
    }
    await deleteProduct(id)
  }
  redirect('/createur/produits')
}
