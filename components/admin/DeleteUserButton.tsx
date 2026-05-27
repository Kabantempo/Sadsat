'use client'
import { useTransition } from 'react'
import { deleteUserAction } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Supprimer le compte de « ${name} » ? Cette action est irréversible.`)) return
    const fd = new FormData()
    fd.set('userId', id)
    startTransition(async () => { await deleteUserAction(fd) })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-40"
      title="Supprimer"
    >
      {pending
        ? <span className="w-3 h-3 border border-red-300 border-t-red-500 rounded-full animate-spin block" />
        : <Trash2 size={13} strokeWidth={1.5} />
      }
    </button>
  )
}
