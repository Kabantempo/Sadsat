import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/db'
import { createSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/connexion?erreur=google', base))
  }

  try {
    // Échange le code contre un token d'accès
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: `${base}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) throw new Error('no_token')

    // Récupère les infos utilisateur Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const gUser = await userRes.json()
    if (!gUser.email) throw new Error('no_email')

    // Trouve ou crée l'utilisateur dans notre base
    let user = await getUserByEmail(gUser.email)
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email: gUser.email,
        passwordHash: '',
        name: gUser.name ?? gUser.email.split('@')[0],
        role: 'client',
        createdAt: new Date().toISOString(),
      }
      await createUser(user)
    }

    await createSession(user.id, user.role, user.name)
    const dest = user.role === 'admin' ? '/admin' : '/compte'
    return NextResponse.redirect(new URL(dest, base))
  } catch {
    return NextResponse.redirect(new URL('/connexion?erreur=google', base))
  }
}
