'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200 px-8">
      <div className="text-center max-w-md">
        <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 opacity-50">— ERREUR —</div>
        <h2 className="font-serif font-light text-3xl mb-4">Une erreur est survenue</h2>
        <p className="text-neutral-400 text-sm mb-8">
          {error.message || 'Erreur inattendue'}
          {error.digest && (
            <span className="block mt-2 font-mono text-xs opacity-50">Digest: {error.digest}</span>
          )}
        </p>
        <button
          onClick={reset}
          className="text-xs tracking-[0.3em] uppercase pb-1 border-b border-neutral-600 hover:border-neutral-200 transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
