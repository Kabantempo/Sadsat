import { describe, it, expect, beforeEach } from 'vitest'
import { hit, resetBuckets } from '@/lib/rate-limit-core'

describe('rate limiter', () => {
  beforeEach(() => resetBuckets())

  it('autorise jusqu\'au maximum puis bloque', () => {
    for (let i = 0; i < 3; i++) expect(hit('k', 3, 1000, 0).ok).toBe(true)
    const res = hit('k', 3, 1000, 0)
    expect(res.ok).toBe(false)
    expect(res.retryAfterSec).toBe(1)
  })

  it('repart de zéro après la fenêtre', () => {
    for (let i = 0; i < 4; i++) hit('k', 3, 1000, 0)
    expect(hit('k', 3, 1000, 1001).ok).toBe(true)
  })

  it('isole les clés', () => {
    for (let i = 0; i < 4; i++) hit('a', 3, 1000, 0)
    expect(hit('b', 3, 1000, 0).ok).toBe(true)
  })
})
