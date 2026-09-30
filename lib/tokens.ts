import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { getKey } from './session'

export type TokenPurpose = 'nl-confirm' | 'nl-unsub'

/** Jeton signé sans stockage en base (confirmation newsletter, désinscription). */
export async function signToken(purpose: TokenPurpose, email: string, expiresIn: string): Promise<string> {
  return new SignJWT({ purpose, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getKey())
}

export async function verifyToken(token: string | undefined, purpose: TokenPurpose): Promise<string | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] })
    if (payload.purpose !== purpose || typeof payload.email !== 'string') return null
    return payload.email
  } catch {
    return null
  }
}
