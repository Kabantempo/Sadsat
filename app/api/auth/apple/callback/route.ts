import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet, SignJWT, importPKCS8 } from 'jose'
import { getUserByEmail, createUser } from '@/lib/db'
import { createSession } from '@/lib/session'

const APPLE_JWKS = createRemoteJWKSet(
  new URL('https://appleid.apple.com/auth/keys')
)

async function buildAppleClientSecret(): Promise<string> {
  const rawKey = (process.env.APPLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
  const privateKey = await importPKCS8(rawKey, 'ES256')
  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: process.env.APPLE_KEY_ID ?? '' })
    .setIssuer(process.env.APPLE_TEAM_ID ?? '')
    .setIssuedAt()
    .setExpirationTime('5m')
    .setAudience('https://appleid.apple.com')
    .setSubject(process.env.APPLE_CLIENT_ID ?? '')
    .sign(privateKey)
}

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  try {
    const form = await req.formData()
    const code = form.get('code') as string | null
    const idToken = form.get('id_token') as string | null
    const userJson = form.get('user') as string | null // seulement au 1er login

    if (!code || !idToken) throw new Error('missing_params')

    // Vérifie l'id_token Apple
    const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
      issuer: 'https://appleid.apple.com',
      audience: process.env.APPLE_CLIENT_ID ?? '',
    })

    const email = payload.email as string | undefined
    if (!email) throw new Error('no_email')

    // Nom renvoyé uniquement au premier login
    let name = email.split('@')[0]
    if (userJson) {
      try {
        const parsed = JSON.parse(userJson)
        if (parsed.name?.firstName) {
          name = [parsed.name.firstName, parsed.name.lastName].filter(Boolean).join(' ')
        }
      } catch {}
    }

    // Échange le code (validation côté serveur)
    const clientSecret = await buildAppleClientSecret()
    await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.APPLE_CLIENT_ID ?? '',
        client_secret: clientSecret,
        redirect_uri: `${base}/api/auth/apple/callback`,
        grant_type: 'authorization_code',
      }),
    })

    // Trouve ou crée l'utilisateur
    let user = await getUserByEmail(email)
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        passwordHash: '',
        name,
        role: 'client',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      }
      await createUser(user)
    }

    await createSession(user.id, user.role, user.name)
    const dest = user.role === 'admin' ? '/admin' : '/compte'
    return NextResponse.redirect(new URL(dest, base))
  } catch {
    return NextResponse.redirect(new URL('/connexion?erreur=apple', base))
  }
}
