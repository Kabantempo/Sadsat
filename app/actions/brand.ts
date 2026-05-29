'use server'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserById } from '@/lib/db'
import {
  createBrandSlide, deleteBrandSlide, reorderBrandSlide,
  createBrandCategory, updateBrandCategory, deleteBrandCategory,
  reorderBrandCategory, seedDefaultCategories,
} from '@/lib/brand'
import { uploadFile, deleteFile } from '@/lib/cloudinary'

async function getCreatorUniverse(): Promise<string> {
  const session = await getSession()
  if (!session?.userId) throw new Error('Non autorisé')
  const user = await getUserById(session.userId)
  if (!user || (user.role !== 'créateur' && user.role !== 'admin')) throw new Error('Non autorisé')
  if (!user.universe) throw new Error('Aucun univers assigné — demandez à l\'admin.')
  return user.universe
}

export async function addBrandSlideAction(formData: FormData): Promise<void> {
  const universe = await getCreatorUniverse()
  const file = formData.get('media') as File | null
  const title = String(formData.get('title') ?? '').trim() || null
  const subtitle = String(formData.get('subtitle') ?? '').trim() || null

  let mediaId: string | null = null
  if (file && file.size > 0) {
    const url = await uploadFile(file)
    const match = url.match(/\/api\/images\/([^/?#]+)/)
    mediaId = match ? match[1] : null
  }

  const type = file?.type?.startsWith('video/') ? 'video' : 'image'
  await createBrandSlide({ universe, type, mediaId, title, subtitle, order: 999, createdAt: new Date().toISOString() })
  redirect('/createur/marque/carousel')
}

export async function deleteBrandSlideAction(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  await deleteBrandSlide(id)
  redirect('/createur/marque/carousel')
}

export async function reorderBrandSlideAction(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const direction = String(formData.get('direction') ?? '') as 'up' | 'down'
  const universe = String(formData.get('universe') ?? '')
  await reorderBrandSlide(id, direction, universe)
  redirect('/createur/marque/carousel')
}

export async function addBrandCategoryAction(formData: FormData): Promise<void> {
  const universe = await getCreatorUniverse()
  const label = String(formData.get('label') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const latin = String(formData.get('latin') ?? '').trim() || null
  const description = String(formData.get('description') ?? '').trim() || null

  if (!label || !slug) throw new Error('Nom et slug requis.')

  const primaryFile = formData.get('primaryImage') as File | null
  const hoverFile = formData.get('hoverImage') as File | null

  let primaryImageId: string | null = null
  let hoverImageId: string | null = null

  if (primaryFile && primaryFile.size > 0) {
    const url = await uploadFile(primaryFile)
    const m = url.match(/\/api\/images\/([^/?#]+)/)
    primaryImageId = m ? m[1] : null
  }
  if (hoverFile && hoverFile.size > 0) {
    const url = await uploadFile(hoverFile)
    const m = url.match(/\/api\/images\/([^/?#]+)/)
    hoverImageId = m ? m[1] : null
  }

  await createBrandCategory({ universe, label, slug, latin, description, primaryImageId, hoverImageId, order: 999 })
  redirect('/createur/marque/categories')
}

export async function quickAddCategoryAction(
  universe: string,
  label: string
): Promise<{ label: string } | { error: string }> {
  const session = await getSession()
  if (!session?.userId || (session.role !== 'admin' && session.role !== 'créateur')) {
    return { error: 'Non autorisé' }
  }
  const trimmed = label.trim()
  if (!trimmed || trimmed.length < 2) return { error: 'Nom trop court.' }
  const slug = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  try {
    await createBrandCategory({ universe, label: trimmed, slug, latin: null, description: null, primaryImageId: null, hoverImageId: null, order: 999 })
    return { label: trimmed }
  } catch {
    return { error: 'Catégorie déjà existante ou erreur serveur.' }
  }
}

export async function updateBrandCategoryAction(formData: FormData): Promise<void> {
  await getCreatorUniverse()
  const id = String(formData.get('id') ?? '')
  const label = String(formData.get('label') ?? '').trim()
  const latin = String(formData.get('latin') ?? '').trim() || null
  const description = String(formData.get('description') ?? '').trim() || null

  const primaryFile = formData.get('primaryImage') as File | null
  const hoverFile = formData.get('hoverImage') as File | null

  const update: Record<string, unknown> = { label, latin, description }

  if (primaryFile && primaryFile.size > 0) {
    const url = await uploadFile(primaryFile)
    const m = url.match(/\/api\/images\/([^/?#]+)/)
    update.primaryImageId = m ? m[1] : null
  }
  if (hoverFile && hoverFile.size > 0) {
    const url = await uploadFile(hoverFile)
    const m = url.match(/\/api\/images\/([^/?#]+)/)
    update.hoverImageId = m ? m[1] : null
  }

  await updateBrandCategory(id, update as Parameters<typeof updateBrandCategory>[1])
  redirect('/createur/marque/categories')
}

export async function deleteBrandCategoryAction(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  await deleteBrandCategory(id)
  redirect('/createur/marque/categories')
}

export async function reorderBrandCategoryAction(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const direction = String(formData.get('direction') ?? '') as 'up' | 'down'
  const universe = String(formData.get('universe') ?? '')
  await reorderBrandCategory(id, direction, universe)
  redirect('/createur/marque/categories')
}

export async function seedDefaultCategoriesAction(formData: FormData) {
  const universe = String(formData.get('universe') ?? '')
  await seedDefaultCategories(universe)
  redirect('/createur/marque/categories')
}
