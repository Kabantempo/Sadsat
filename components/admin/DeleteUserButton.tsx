'use client'
import { deleteUserAction } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeleteUserButton({ id, name }: { id: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`Supprimer le compte de ${name} ?`)) return
    await deleteUserAction(id)
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
      title="Supprimer"
    >
      <Trash2 size={13} strokeWidth={1.5} />
    </button>
  )
}
