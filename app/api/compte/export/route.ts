import { NextResponse } from 'next/server'
import { getVerifiedSession } from '@/lib/dal'
import { exportUserData } from '@/lib/account'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getVerifiedSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const data = await exportUserData(session.userId)
  if (!data) return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 })
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mes-donnees-sadsat.json"',
      'Cache-Control': 'no-store',
    },
  })
}
