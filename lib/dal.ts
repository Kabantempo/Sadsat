import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { getUserById } from './db'
import type { SafeUser } from './definitions'

export const verifySession = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/connexion')
  return session
})

export const verifyAdmin = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/connexion')
  if (session.role !== 'admin') redirect('/')
  return session
})

export const verifyCreateur = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/connexion')
  if (session.role !== 'créateur' && session.role !== 'admin') redirect('/')
  return session
})

export const verifyGrossiste = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/connexion')
  if (session.role !== 'grossiste' && session.role !== 'admin') redirect('/')
  return session
})

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  try {
    const session = await getSession()
    if (!session?.userId) return null
    const user = await getUserById(session.userId)
    if (!user) return null
    const { passwordHash: _, ...safeUser } = user
    return safeUser
  } catch {
    return null
  }
})
