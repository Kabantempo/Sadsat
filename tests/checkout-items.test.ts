import { describe, it, expect } from 'vitest'
import { parseItems, MAX_LINES, MAX_QTY } from '@/lib/checkout-items'

describe('parseItems (panier envoyé par le navigateur)', () => {
  it('accepte un panier valide et fusionne les doublons', () => {
    expect(parseItems([{ productId: 'a', quantity: 1 }, { productId: 'a', quantity: 2 }, { productId: 'b', quantity: 1 }]))
      .toEqual([{ productId: 'a', quantity: 3 }, { productId: 'b', quantity: 1 }])
  })

  it.each([
    ['vide', []],
    ['non tableau', { productId: 'a', quantity: 1 }],
    ['quantité négative', [{ productId: 'a', quantity: -1 }]],
    ['quantité zéro', [{ productId: 'a', quantity: 0 }]],
    ['quantité décimale', [{ productId: 'a', quantity: 1.5 }]],
    ['quantité énorme', [{ productId: 'a', quantity: MAX_QTY + 1 }]],
    ['quantité texte', [{ productId: 'a', quantity: 'abc' }]],
    ['identifiant absent', [{ quantity: 1 }]],
    ['identifiant non texte', [{ productId: 42, quantity: 1 }]],
    ['trop de lignes', Array.from({ length: MAX_LINES + 1 }, (_, i) => ({ productId: `p${i}`, quantity: 1 }))],
  ])('refuse : %s', (_name, input) => {
    expect(parseItems(input)).toBeNull()
  })
})
