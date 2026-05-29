'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

type Props = {
  image: string | null
  video: string | null
  name: string
  sold: boolean
  light: boolean
}

export default function ProductCardMedia({ image, video, name, sold, light }: Props) {
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
    <div
      className={`relative aspect-[3/4] overflow-hidden mb-5 rounded-xl ${light ? 'bg-neutral-100' : 'bg-neutral-900'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {image && (
        <Image
          src={image}
          alt={name}
          fill
          className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[0.58rem] tracking-[0.2em] uppercase ${light ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Photo à venir
          </span>
        </div>
      )}

      {sold && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
          <span className="text-[0.6rem] tracking-[0.22em] uppercase text-neutral-600 bg-white/80 px-4 py-1.5">
            Vendu
          </span>
        </div>
      )}
    </div>
  )
}
