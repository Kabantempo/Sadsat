import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getVerifiedSession as getSession } from '@/lib/dal'

export const dynamic = 'force-dynamic'

export async function GET() {
  let dbOk = true
  let dbError = ''
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (e) {
    dbOk = false
    dbError = e instanceof Error ? e.message : String(e)
  }

  // Public : état minimal pour un monitoring externe. Le détail est réservé à l'admin.
  const session = await getSession()
  if (session?.role !== 'admin') {
    return NextResponse.json({ ok: dbOk }, { status: dbOk ? 200 : 503 })
  }

  return NextResponse.json({
    ok: dbOk,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'MISSING',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'MISSING',
      SESSION_SECRET: process.env.SESSION_SECRET ? 'set' : 'MISSING',
    },
    db: dbOk ? 'ok' : dbError,
  }, { status: dbOk ? 200 : 503 })
}
