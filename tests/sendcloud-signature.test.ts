import { describe, it, expect } from 'vitest'
import { createHmac } from 'crypto'
import { validSignature } from '@/lib/sendcloud-signature'

const secret = 'secret-de-test'
const body = '{"parcel":{"tracking_number":"123"}}'
const sign = (raw: string, key = secret) => createHmac('sha256', key).update(raw).digest('hex')

describe('signature du webhook Sendcloud', () => {
  it('accepte une signature correcte', () => {
    expect(validSignature(body, sign(body), secret)).toBe(true)
  })
  it('refuse un corps modifié', () => {
    expect(validSignature(body + ' ', sign(body), secret)).toBe(false)
  })
  it('refuse une signature faite avec un autre secret', () => {
    expect(validSignature(body, sign(body, 'autre'), secret)).toBe(false)
  })
  it('refuse une signature absente, vide ou de mauvaise longueur', () => {
    expect(validSignature(body, null, secret)).toBe(false)
    expect(validSignature(body, '', secret)).toBe(false)
    expect(validSignature(body, 'abc', secret)).toBe(false)
  })
  it('refuse tout si aucun secret n\'est configuré', () => {
    expect(validSignature(body, sign(body, ''), '')).toBe(false)
    expect(validSignature(body, sign(body), undefined as unknown as string)).toBe(false)
  })
})
