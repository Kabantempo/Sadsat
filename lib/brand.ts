import 'server-only'
import { prisma } from './prisma'

export type BrandCategory = {
  id: string
  universe: string
  label: string
  slug: string
  latin: string | null
  description: string | null
  primaryImageId: string | null
  hoverImageId: string | null
  order: number
}

export type BrandSlide = {
  id: string
  universe: string
  type: string
  mediaId: string | null
  title: string | null
  subtitle: string | null
  order: number
  createdAt: string
}

export const DEFAULT_CATEGORIES: Record<string, Omit<BrandCategory, 'id' | 'universe' | 'primaryImageId' | 'hoverImageId'>[]> = {
  taxidermie: [
    { label: 'Oiseaux',    slug: 'oiseaux',    latin: 'Aves',      description: 'Passereaux, rapaces et espèces exotiques',  order: 0 },
    { label: 'Mammifères', slug: 'mammiferes', latin: 'Mammalia',  description: 'Du petit rongeur au grand gibier',          order: 1 },
    { label: 'Insectes',   slug: 'insectes',   latin: 'Insecta',   description: 'Entomologie artistique & vitrines',         order: 2 },
    { label: 'Crânes',     slug: 'cranes',     latin: 'Crania',    description: 'Crânes préparés, blanchis et montés',       order: 3 },
    { label: 'Reptiles',   slug: 'reptiles',   latin: 'Reptilia',  description: 'Serpents, lézards, tortues',                order: 4 },
  ],
  bijoux: [
    { label: 'Bagues',           slug: 'bagues',   latin: null, description: null, order: 0 },
    { label: 'Colliers',         slug: 'colliers', latin: null, description: null, order: 1 },
    { label: 'Bracelets',        slug: 'bracelets',latin: null, description: null, order: 2 },
    { label: "Boucles d'oreilles", slug: 'boucles',latin: null, description: null, order: 3 },
  ],
}

export async function getBrandCategories(universe: string): Promise<BrandCategory[]> {
  try {
    return await prisma.brandCategory.findMany({ where: { universe }, orderBy: { order: 'asc' } })
  } catch { return [] }
}

export async function getAllCategoriesByUniverse(): Promise<Record<string, string[]>> {
  try {
    const cats = await prisma.brandCategory.findMany({ orderBy: { order: 'asc' } })
    const result: Record<string, string[]> = {}
    for (const cat of cats) {
      if (!result[cat.universe]) result[cat.universe] = []
      result[cat.universe].push(cat.label)
    }
    return result
  } catch { return {} }
}

export async function getBrandCategoryBySlug(universe: string, slug: string): Promise<BrandCategory | null> {
  try {
    return await prisma.brandCategory.findUnique({ where: { universe_slug: { universe, slug } } })
  } catch { return null }
}

export async function getBrandSlides(universe: string): Promise<BrandSlide[]> {
  try {
    return await prisma.brandSlide.findMany({ where: { universe }, orderBy: { order: 'asc' } })
  } catch { return [] }
}

export async function createBrandCategory(data: Omit<BrandCategory, 'id'>): Promise<void> {
  await prisma.brandCategory.create({ data: { ...data, id: crypto.randomUUID() } })
}

export async function updateBrandCategory(id: string, data: Partial<Omit<BrandCategory, 'id' | 'universe'>>): Promise<void> {
  await prisma.brandCategory.update({ where: { id }, data })
}

export async function deleteBrandCategory(id: string): Promise<void> {
  await prisma.brandCategory.delete({ where: { id } })
}

export async function seedDefaultCategories(universe: string): Promise<void> {
  const existing = await getBrandCategories(universe)
  if (existing.length > 0) return
  const defaults = DEFAULT_CATEGORIES[universe] ?? []
  for (const cat of defaults) {
    await prisma.brandCategory.create({
      data: { id: crypto.randomUUID(), universe, ...cat, primaryImageId: null, hoverImageId: null },
    })
  }
}

export async function createBrandSlide(data: Omit<BrandSlide, 'id'>): Promise<void> {
  await prisma.brandSlide.create({ data: { ...data, id: crypto.randomUUID() } })
}

export async function deleteBrandSlide(id: string): Promise<void> {
  await prisma.brandSlide.delete({ where: { id } })
}

export async function updateBrandSlide(id: string, data: { title: string | null; subtitle: string | null }): Promise<void> {
  await prisma.brandSlide.update({ where: { id }, data })
}

export async function reorderBrandSlide(id: string, direction: 'up' | 'down', universe: string): Promise<void> {
  const slides = await getBrandSlides(universe)
  const idx = slides.findIndex(s => s.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= slides.length) return
  await prisma.brandSlide.update({ where: { id: slides[idx].id }, data: { order: slides[swapIdx].order } })
  await prisma.brandSlide.update({ where: { id: slides[swapIdx].id }, data: { order: slides[idx].order } })
}

export async function reorderBrandCategory(id: string, direction: 'up' | 'down', universe: string): Promise<void> {
  const cats = await getBrandCategories(universe)
  const idx = cats.findIndex(c => c.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= cats.length) return
  await prisma.brandCategory.update({ where: { id: cats[idx].id }, data: { order: cats[swapIdx].order } })
  await prisma.brandCategory.update({ where: { id: cats[swapIdx].id }, data: { order: cats[idx].order } })
}
