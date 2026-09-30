import { ImageResponse } from 'next/og'
import { LOGO_ASPECT, LOGO_PATH, LOGO_VIEWBOX } from '@/lib/brand-logo'

// Image de partage (réseaux sociaux, messageries), générée à la volée avec le logo.
// Pour utiliser une vraie photo : remplacer ce fichier par app/opengraph-image.jpg (1200×630).
export const alt = 'SADSAT — Créations artisanales en édition limitée'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  const logoHeight = 250
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
        <svg width={Math.round(logoHeight * LOGO_ASPECT)} height={logoHeight} viewBox={LOGO_VIEWBOX}>
          <path d={LOGO_PATH} fill="#ffffff" fillRule="evenodd" />
        </svg>
        <div style={{ marginTop: 34, fontSize: 84, letterSpacing: 26, fontWeight: 300 }}>SADSAT</div>
        <div style={{ marginTop: 22, fontSize: 26, letterSpacing: 7, color: '#a3a3a3' }}>
          TAXIDERMIE · BOUGIES · MODE
        </div>
      </div>
    ),
    size
  )
}
