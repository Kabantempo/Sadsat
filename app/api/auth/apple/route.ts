import { NextResponse } from 'next/server'

export function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID ?? '',
    redirect_uri: `${base}/api/auth/apple/callback`,
    response_type: 'code id_token',
    response_mode: 'form_post',
    scope: 'name email',
  })
  return NextResponse.redirect(
    `https://appleid.apple.com/auth/authorize?${params}`
  )
}
