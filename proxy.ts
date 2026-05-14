import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const adminRoutes = ['/admin']
const clientRoutes = ['/compte']
const authRoutes = ['/connexion', '/inscription']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  if (adminRoutes.some((r) => path.startsWith(r)) && path !== '/admin/setup') {
    if (!session?.userId || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/connexion', req.nextUrl))
    }
  }

  if (clientRoutes.some((r) => path.startsWith(r))) {
    if (!session?.userId) {
      return NextResponse.redirect(new URL('/connexion', req.nextUrl))
    }
  }

  if (authRoutes.includes(path) && session?.userId) {
    const dest =
      session.role === 'admin' ? '/admin' :
      session.role === 'créateur' ? '/createur' :
      '/compte'
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  const createurRoutes = ['/createur']
  if (createurRoutes.some((r) => path.startsWith(r))) {
    if (!session?.userId || (session.role !== 'créateur' && session.role !== 'admin')) {
      return NextResponse.redirect(new URL('/connexion', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
