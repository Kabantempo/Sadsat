import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { getUserById } from './db'
import type { SessionPayload } from './definitions'
import type { SafeUser } from './definitions'

// Le JWT dure 7 jours : on relit l'utilisateur en base pour que la suppression d'un compte
// ou un changement de rôle prenne effet tout de suite.
export const getVerifiedSession = cache(async (): Promise<SessionPayload | null> => {
  const session = await getSession()
  if (!session?.userId) return null
  const user = await getUserById(session.userId)
  if (!user) return null
  return { ...session, role: user.role, name: user.name, email: user.email }
})

export const verifySession = cache(async () => {
  const session = await getVerifiedSession()
  if (!session) redirect('/connexion')
  return session
})

export const verifyAdmin = cache(async () => {
  const session = await getVerifiedSession()
  if (!session) redirect('/connexion')
  if (session.role !== 'admin') redirect('/')
  return session
})

export const verifyCreateur = cache(async () => {
  const session = await getVerifiedSession()
  if (!session) redirect('/connexion')
  if (session.role !== 'créateur' && session.role !== 'admin') redirect('/')
  return session
})

export const verifyGrossiste = cache(async () => {
  const session = await getVerifiedSession()
  if (!session) redirect('/connexion')
  if (session.role !== 'grossiste' && session.role !== 'admin') redirect('/')
  return session
})

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  try {
    const session = await getSession()
    if (!session?.userId) return null
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
    const user = await Promise.race([getUserById(session.userId), timeout])
    if (!user) return null
    const { passwordHash: _, ...safeUser } = user
    return safeUser
  } catch {
    return null
  }
})
