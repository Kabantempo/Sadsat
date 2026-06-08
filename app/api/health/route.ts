import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const checks: Record<string, string> = {
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'MISSING',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'MISSING',
    SESSION_SECRET: process.env.SESSION_SECRET ? 'set' : 'MISSING',
  }

  let dbStatus = 'ok'
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (e) {
    dbStatus = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({ env: checks, db: dbStatus })
}
