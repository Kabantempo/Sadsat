import { describe, it, expect, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const env = { ...process.env }
afterEach(() => { process.env = { ...env } })

async function run(url: string, headers: Record<string, string>, nodeEnv: string) {
  process.env = { ...env, NODE_ENV: nodeEnv, SESSION_SECRET: 'z'.repeat(40) } as NodeJS.ProcessEnv
  const { default: proxy } = await import('@/proxy')
  return proxy(new NextRequest(url, { headers }))
}

describe('proxy : HTTPS forcé', () => {
  it('redirige http vers https en production', async () => {
    const res = await run('http://sadsat.com/taxidermie?x=1', { 'x-forwarded-proto': 'http' }, 'production')
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe('https://sadsat.com/taxidermie?x=1')
  })
  it('laisse passer https', async () => {
    const res = await run('https://sadsat.com/taxidermie', { 'x-forwarded-proto': 'https' }, 'production')
    expect(res.status).toBe(200)
  })
  it('ne redirige pas en développement', async () => {
    const res = await run('http://localhost:3000/', { 'x-forwarded-proto': 'http' }, 'development')
    expect(res.status).toBe(200)
  })
})
