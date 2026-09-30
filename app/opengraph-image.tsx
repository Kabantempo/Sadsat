import { ImageResponse } from 'next/og'

// Image de partage (réseaux sociaux, messageries), générée à la volée.
// Pour utiliser une vraie photo : remplacer ce fichier par app/opengraph-image.jpg (1200×630).
export const alt = 'SADSAT — Créations artisanales en édition limitée'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f5f5f5',
        }}
      >
        <div style={{ fontSize: 132, letterSpacing: 28, fontWeight: 300 }}>SADSAT</div>
        <div style={{ marginTop: 36, fontSize: 30, letterSpacing: 8, color: '#a3a3a3' }}>
          TAXIDERMIE · BOUGIES · MODE
        </div>
        <div style={{ marginTop: 18, fontSize: 24, letterSpacing: 4, color: '#737373' }}>
          Édition limitée · fait main en France
        </div>
      </div>
    ),
    size
  )
}
