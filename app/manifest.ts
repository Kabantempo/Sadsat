import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SADSAT',
    short_name: 'SADSAT',
    description: 'Taxidermie éthique, bougies artisanales et mode upcycling. Édition limitée, fait main en France.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    lang: 'fr',
  }
}
