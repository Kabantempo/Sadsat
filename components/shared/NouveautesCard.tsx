'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  id: string
  name: string
  image: string | null
  video: string | null
  price: number
  universeLabel: string
  badgeColor: string
  status: string
  isNew: boolean
}

export default function NouveautesCard({ id, name, image, video, price, universeLabel, badgeColor, status, isNew }: Props) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleMouseEnter() {
    setHovered(true)
    if (video && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => null)
    }
  }

  function handleMouseLeave() {
    setHovered(false)
    if (videoRef.current) videoRef.current.pause()
  }

  const showVideo = hovered && !!video

  return (
    <Link
      href={`/produits/${id}`}
      className="group relative bg-neutral-900 overflow-hidden block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image / Vidéo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800">
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-all duration-700 ${
              showVideo ? 'opacity-0 scale-100' : `opacity-100 ${hovered && !video ? 'scale-105' : 'scale-100'}`
            }`}
          />
        )}

        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {!image && !video && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-neutral-700 text-3xl">✦</span>
          </div>
        )}

        {/* Badge "Nouveau" */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[0.48rem] tracking-[0.2em] uppercase bg-neutral-100 text-neutral-900 px-2 py-1">
              Nouveau
            </span>
          </div>
        )}

        {status === 'vendu' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-[0.6rem] tracking-[0.18em] uppercase text-neutral-400 border border-neutral-600 px-3 py-1">
              Vendu
            </span>
          </div>
        )}

        {/* Overlay hover */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-end p-4 z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[0.58rem] tracking-[0.18em] uppercase text-white border border-white/50 px-3 py-1.5">
            Voir la pièce →
          </span>
        </div>
      </div>

      {/* Infos */}
      <div className="p-3.5">
        <span className={`text-[0.5rem] tracking-[0.14em] uppercase px-2 py-0.5 ${badgeColor} mb-2 inline-block`}>
          {universeLabel}
        </span>
        <p className={`text-[0.82rem] text-neutral-200 leading-snug mb-1 transition-colors ${hovered ? 'text-white' : ''}`}>
          {name}
        </p>
        <p className="font-serif text-[1rem] text-neutral-300">
          {(price / 100).toFixed(2)} €
        </p>
      </div>
    </Link>
  )
}
