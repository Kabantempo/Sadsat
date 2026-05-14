'use client'
import { Trash2 } from 'lucide-react'
import { deleteProductAction } from '@/app/actions/products'

type Props = {
  id: string
  name: string
  variant?: 'icon' | 'full'
}

export default function DeleteProductButton({ id, name, variant = 'icon' }: Props) {
  async function handleDelete(formData: FormData) {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return
    await deleteProductAction(formData)
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="productId" value={id} />
      {variant === 'full' ? (
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-[0.6rem] tracking-[0.16em] uppercase hover:bg-red-50 hover:border-red-400 transition-colors"
        >
          <Trash2 size={12} strokeWidth={1.5} />
          Supprimer ce produit
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Supprimer ce produit"
          className="text-neutral-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} strokeWidth={1.5} />
        </button>
      )}
    </form>
  )
}
