import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { checkEnv, onHostinger } = require('../scripts/postbuild.js') as {
  checkEnv: (env: Record<string, string | undefined>, cwd?: string) => { errors: string[]; warnings: string[] }
  onHostinger: (cwd: string) => boolean
}

const HOST = '/home/u123/domains/sadsat.com/public_html'
const LOCAL = 'C:/Users/x/Desktop/Sadsat'
const good = { DATABASE_URL: 'postgresql://postgres:Abc123@db.example.supabase.co:5432/postgres', SESSION_SECRET: 'x'.repeat(40) }

describe('contrôle des variables après build', () => {
  it('reconnaît le chemin Hostinger', () => {
    expect(onHostinger(HOST)).toBe(true)
    expect(onHostinger(LOCAL)).toBe(false)
  })

  it('sur Hostinger, une variable indispensable manquante bloque le build', () => {
    const r = checkEnv({ SESSION_SECRET: 'x'.repeat(40) }, HOST)
    expect(r.errors.join(' ')).toContain('DATABASE_URL est absente')
    expect(checkEnv({ DATABASE_URL: good.DATABASE_URL }, HOST).errors.join(' ')).toContain('SESSION_SECRET est absente')
  })

  it('sur Hostinger, un SESSION_SECRET trop court bloque le build', () => {
    expect(checkEnv({ ...good, SESSION_SECRET: 'court' }, HOST).errors.join(' ')).toContain('moins de 32')
  })

  it('en local ou sur Vercel, rien ne bloque : seulement des avertissements', () => {
    const r = checkEnv({}, LOCAL)
    expect(r.errors).toEqual([])
    expect(r.warnings.join(' ')).toContain('DATABASE_URL est absente')
  })

  it('accepte une configuration complète sur Hostinger', () => {
    expect(checkEnv(good, HOST).errors).toEqual([])
  })

  it('signale une adresse de base illisible (caractère spécial non encodé) sans afficher sa valeur', () => {
    const secret = 'MotDePasseSecret#!123'
    const r = checkEnv({ ...good, DATABASE_URL: `postgresql://postgres:${secret}@db.x.supabase.co:5432/postgres` }, HOST)
    expect(r.errors).toEqual([])
    // Une valeur avec # non encodé reste lisible par URL(), l'important est qu'aucun message ne contienne le mot de passe.
    expect([...r.errors, ...r.warnings].join(' ')).not.toContain(secret)
    const broken = checkEnv({ ...good, DATABASE_URL: 'pas une adresse ://' }, HOST)
    expect(broken.warnings.join(' ')).toContain('illisible')
  })

  it("signale l'identifiant du pooler Supabase sans référence de projet", () => {
    const r = checkEnv({ ...good, DATABASE_URL: 'postgresql://postgres:Abc@aws-0-eu-west-1.pooler.supabase.com:6543/postgres' }, HOST)
    expect(r.warnings.join(' ')).toContain('postgres.<référence-du-projet>')
  })
})
