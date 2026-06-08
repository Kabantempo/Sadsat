import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'
import { getUsers } from '@/lib/db'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.fr'

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
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
    url: `${BASE_URL}/nouveautes`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/createurs`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/recherche`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/a-propos`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/cgv`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: `${BASE_URL}/mentions-legales`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: `${BASE_URL}/confidentialite`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, users] = await Promise.all([getProducts(), getUsers()])

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.status !== 'masqué')
    .map((p) => ({
      url: `${BASE_URL}/produits/${p.id}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: p.status === 'vendu' ? ('monthly' as const) : ('weekly' as const),
      priority: p.status === 'vendu' ? 0.4 : 0.7,
    }))

  const createurEntries: MetadataRoute.Sitemap = users
    .filter((u) => u.role === 'créateur')
    .map((u) => ({
      url: `${BASE_URL}/createurs/${u.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }))

  return [...STATIC_PAGES, ...productEntries, ...createurEntries]
}
