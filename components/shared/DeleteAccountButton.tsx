"use client"
import { useState, useTransition } from "react"
import { deleteAccountAction } from "@/app/actions/auth"

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-[0.62rem] tracking-[0.18em] uppercase text-red-400 hover:text-red-600 transition-colors underline underline-offset-4"
      >
        Supprimer mon compte
      </button>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <p className="text-[0.62rem] tracking-[0.12em] text-neutral-500">
        Confirmer la suppression ?
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => deleteAccountAction())}
        className="text-[0.62rem] tracking-[0.18em] uppercase text-red-500 hover:text-red-700 transition-colors underline underline-offset-4 disabled:opacity-50"
      >
        {isPending ? "Suppression…" : "Oui, supprimer"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        Annuler
      </button>
    </div>
  )
}
