'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="fr">
      <body style={{ background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', maxWidth: 600, padding: '2rem' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.5, marginBottom: '1.5rem' }}>— ERREUR SERVEUR —</p>
          <h2 style={{ fontWeight: 300, fontSize: '1.5rem', marginBottom: '1rem' }}>Une erreur est survenue</h2>
          <pre style={{ background: '#1a1a1a', padding: '1rem', borderRadius: 4, textAlign: 'left', fontSize: '0.75rem', overflowX: 'auto', marginBottom: '1rem' }}>
            {error.message || 'Erreur inconnue'}
          </pre>
          {error.digest && (
            <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '1.5rem' }}>Digest: {error.digest}</p>
          )}
          <button onClick={reset} style={{ background: 'none', border: '1px solid #444', color: '#e5e5e5', padding: '0.5rem 1.5rem', cursor: 'pointer', letterSpacing: '0.2em', fontSize: '0.75rem' }}>
            RÉESSAYER
          </button>
        </div>
      </body>
    </html>
  )
}
