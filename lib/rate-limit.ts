import 'server-only'
import { headers } from 'next/headers'
import { hit } from './rate-limit-core'

export { hit }

export async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}

/** Renvoie true si la requête est autorisée. `scope` isole les compteurs (login, contact…). */
export async function allow(scope: string, max: number, windowMs: number, extra = ''): Promise<boolean> {
  const ip = await clientIp()
  return hit(`${scope}:${ip}:${extra}`, max, windowMs).ok
}

export const TOO_MANY = 'Trop de tentatives. Réessayez dans quelques minutes.'
