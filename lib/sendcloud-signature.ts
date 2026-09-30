import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Sendcloud signe le corps brut en HMAC-SHA256 (en-tête Sendcloud-Signature) avec la clé secrète de l'intégration.
 * Refuse tout message si le secret n'est pas configuré.
 */
export function validSignature(raw: string, signature: string | null, secret = process.env.SENDCLOUD_WEBHOOK_SECRET ?? process.env.SENDCLOUD_SECRET_KEY): boolean {
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}
