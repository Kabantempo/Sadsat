import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const state = randomBytes(24).toString('hex')
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID ?? '',
    redirect_uri: `${base}/api/auth/apple/callback`,
    response_type: 'code id_token',
    response_mode: 'form_post',
    scope: 'name email',
    state,
  })
  const res = NextResponse.redirect(
    `https://appleid.apple.com/auth/authorize?${params}`
  )
  // Apple répond en POST cross-site (form_post) : le cookie doit être SameSite=None pour être renvoyé.
  res.cookies.set('oauth_state', state, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 })
  return res
}
