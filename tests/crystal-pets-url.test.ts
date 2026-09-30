import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'
import { universePath, universeFromPath, UNIVERSES } from '@/lib/definitions'

const require = createRequire(import.meta.url)
const nextConfig = require('../next.config.js') as { redirects: () => Promise<{ source: string; destination: string; permanent: boolean }[]> }

describe('adresse de Crystal Pets', () => {
  it("l'univers taxidermie s'affiche sur /crystal-pets", () => {
    expect(universePath('taxidermie')).toBe('/crystal-pets')
  })
  it('les autres univers gardent leur adresse', () => {
    expect(universePath('bougies')).toBe('/bougies')
    expect(universePath('habillement')).toBe('/habillement')
    expect(universePath('pieces-uniques')).toBe('/pieces-uniques')
  })
  it('chaque univers a une adresse commençant par /', () => {
    for (const u of UNIVERSES) expect(universePath(u)).toMatch(/^\/[a-z-]+$/)
  })
  it("le menu retrouve l'identifiant de l'univers depuis son adresse (couleurs au survol)", () => {
    expect(universeFromPath('/crystal-pets')).toBe('taxidermie')
    expect(universeFromPath('/bougies')).toBe('bougies')
    expect(universeFromPath('/habillement')).toBe('habillement')
    for (const u of UNIVERSES) expect(universeFromPath(universePath(u))).toBe(u)
  })
  it('un identifiant inconnu retombe sur /identifiant', () => {
    expect(universePath('autre')).toBe('/autre')
  })
  it("les anciennes adresses /taxidermie sont redirigées en permanence, sous-pages comprises", async () => {
    const r = await nextConfig.redirects()
    expect(r).toContainEqual({ source: '/taxidermie', destination: '/crystal-pets', permanent: true })
    expect(r).toContainEqual({ source: '/taxidermie/:path*', destination: '/crystal-pets/:path*', permanent: true })
  })
})
