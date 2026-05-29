'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

type Props = {
  images: string[]
  name: string
  sold?: boolean
  video?: string | null
}

export default function ProductGallery({ images, name, sold, video }: Props) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })

  const total = images.length
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total])

  useEffect(() => {
    if (!lightbox) { setZoomed(false); return }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  function toggleZoom() {
    setZoomed((z) => !z)
    setZoomPos({ x: 50, y: 50 })
  }

  const showThumbs = total > 1
  const activeImg = images[active] ?? null

  return (
    <>
      {/* ── Galerie principale ── */}
      <div className="space-y-3">
        {/* Image principale cliquable */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-neutral-900 cursor-zoom-in group"
          onClick={() => activeImg && setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              {video && active === 0 ? (
                <video src={video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              ) : activeImg ? (
                <Image src={activeImg} alt={name} fill className="object-cover" priority={active === 0} />
              ) : null}
            </motion.div>
          </AnimatePresence>

          {sold && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[0.58rem] tracking-[0.2em] uppercase bg-black/80 text-neutral-400 px-3 py-1.5 border border-neutral-700">
                Vendu
              </span>
            </div>
          )}

          {/* Indicateur zoom */}
          {activeImg && (
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ZoomIn size={11} strokeWidth={1.5} className="text-neutral-300" />
                <span className="font-mono text-[0.52rem] tracking-[0.18em] uppercase text-neutral-300">Zoom</span>
              </div>
            </div>
          )}

          {/* Flèches nav si plusieurs images */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {/* Vignettes */}
        {showThumbs && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative aspect-square overflow-hidden bg-neutral-900 transition-all duration-200 ${
                  active === i
                    ? 'ring-2 ring-neutral-200 ring-offset-2 ring-offset-neutral-950'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] bg-black/95 flex flex-col"
            onClick={() => { if (!zoomed) setLightbox(false) }}
          >
            {/* Barre lightbox */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-neutral-600">
                {active + 1} / {total}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleZoom}
                  className="flex items-center gap-1.5 text-[0.55rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  {zoomed ? <ZoomOut size={12} /> : <ZoomIn size={12} />}
                  {zoomed ? 'Dézoomer' : 'Zoomer'}
                </button>
                <button
                  onClick={() => setLightbox(false)}
                  className="flex items-center gap-1.5 text-[0.55rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <X size={12} /> Fermer
                </button>
              </div>
            </div>

            {/* Image zoomable */}
            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={(e) => { e.stopPropagation(); toggleZoom() }}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  {zoomed ? (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${activeImg})`,
                        backgroundSize: '250%',
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  ) : (
                    <Image
                      src={activeImg}
                      alt={name}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Flèches navigation lightbox */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Vignettes lightbox */}
            {showThumbs && (
              <div
                className="flex gap-2 justify-center px-6 py-4 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActive(i); setZoomed(false) }}
                    className={`relative w-12 h-12 overflow-hidden bg-neutral-800 shrink-0 transition-all duration-200 ${
                      active === i
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
