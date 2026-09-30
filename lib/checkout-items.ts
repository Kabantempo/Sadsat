export type CartItem = { productId: string; quantity: number }

export const MAX_LINES = 20
export const MAX_QTY = 10

/** Valide et fusionne le panier envoyé par le navigateur. Renvoie null si quelque chose est incohérent. */
export function parseItems(raw: unknown): CartItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LINES) return null
  const merged = new Map<string, number>()
  for (const it of raw) {
    const productId = typeof it?.productId === 'string' ? it.productId : ''
    const quantity = Number(it?.quantity)
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) return null
    merged.set(productId, (merged.get(productId) ?? 0) + quantity)
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }))
}
