'use server'
import { getUserById, updateUser } from '@/lib/db'
import { getSession } from '@/lib/session'

function parseFavorites(raw: string | undefined | null): string[] {
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export async function getFavoritesAction(): Promise<string[]> {
  const session = await getSession()
  if (!session?.userId) return []
  const user = await getUserById(session.userId)
  return parseFavorites(user?.favorites)
}

export async function toggleFavoriteAction(productId: string): Promise<string[]> {
  const session = await getSession()
  if (!session?.userId) return []
  const user = await getUserById(session.userId)
  const current = parseFavorites(user?.favorites)
  const next = current.includes(productId)
    ? current.filter(id => id !== productId)
    : [...current, productId]
  await updateUser(session.userId, { favorites: JSON.stringify(next) })
  return next
}
