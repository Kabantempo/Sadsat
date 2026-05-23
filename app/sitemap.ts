import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.fr'

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${BASE_URL}/taxidermie`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/bijoux`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/bougies`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/habillement`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/pieces-uniques`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/createurs`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/a-propos`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.status !== 'masqué')
    .map((p) => ({
      url: `${BASE_URL}/produits/${p.id}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...STATIC_PAGES, ...productEntries]
}
