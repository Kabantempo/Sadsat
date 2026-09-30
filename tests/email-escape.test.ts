import { describe, it, expect } from 'vitest'
import { esc } from '@/lib/email'

describe('esc (emails HTML)', () => {
  it('neutralise le HTML saisi par un client', () => {
    expect(esc('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;')
    expect(esc('"><script>')).toBe('&quot;&gt;&lt;script&gt;')
    expect(esc("l'été & co")).toBe('l&#39;été &amp; co')
  })
  it('gère les valeurs vides', () => {
    expect(esc(undefined)).toBe('')
    expect(esc(null)).toBe('')
  })
})
