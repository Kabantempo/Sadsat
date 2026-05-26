import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type B2BCartItem = { id: string; quantity: number }

type B2BCartStore = {
  items: B2BCartItem[]
  add: (id: string) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  total: (prices: Record<string, number>, discount: number) => number
}

export const useB2BCart = create<B2BCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (id) => set((s) => {
        const existing = s.items.find((i) => i.id === id)
        if (existing) return { items: s.items.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i) }
        return { items: [...s.items, { id, quantity: 1 }] }
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) => set((s) => {
        if (qty <= 0) return { items: s.items.filter((i) => i.id !== id) }
        return { items: s.items.map((i) => i.id === id ? { ...i, quantity: qty } : i) }
      }),
      clear: () => set({ items: [] }),
      total: (prices, discount) => get().items.reduce((sum, i) => {
        const price = prices[i.id] ?? 0
        return sum + price * i.quantity * (1 - discount / 100)
      }, 0),
    }),
    { name: 'sadsat-b2b-cart' }
  )
)
