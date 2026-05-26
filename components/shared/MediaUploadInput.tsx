'use client'
import { useRef, useState } from 'react'
import { ImageIcon, Video, X } from 'lucide-react'

const MAX_IMAGE_MB = 5
const MAX_VIDEO_MB = 50
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024
const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024

export default function MediaUploadInput({ name = 'media' }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video'; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setError(null)
    setPreview(null)

    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isImage && !isVideo) {
      setError('Format non supporté. Utilisez une image (JPG, PNG, WebP) ou une vidéo (MP4).')
      e.target.value = ''
      return
    }

    if (isImage && file.size > MAX_IMAGE_BYTES) {
      setError(`Image trop lourde (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum : ${MAX_IMAGE_MB} Mo.`)
      e.target.value = ''
      return
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setError(`Vidéo trop lourde (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum : ${MAX_VIDEO_MB} Mo.`)
      e.target.value = ''
      return
    }

    const url = URL.createObjectURL(file)
    setPreview({ url, type: isVideo ? 'video' : 'image', name: file.name })
  }

  function handleClear() {
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs text-neutral-500 mb-1">
        Fichier{' '}
        <span className="text-neutral-400">
          (photo max {MAX_IMAGE_MB} Mo · vidéo max {MAX_VIDEO_MB} Mo)
        </span>
      </label>

      {/* Zone de prévisualisation */}
      {preview && (
        <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
          {preview.type === 'video' ? (
            <video src={preview.url} className="w-full h-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black"
          >
            <X size={12} />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
            <p className="text-[0.55rem] text-white truncate">{preview.name}</p>
          </div>
        </div>
      )}

      {/* Input fichier */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 border border-dashed border-neutral-300 rounded-lg px-4 py-3 cursor-pointer hover:border-neutral-500 hover:bg-neutral-50 transition-colors"
      >
        {preview?.type === 'video' ? (
          <Video size={16} className="text-neutral-400 shrink-0" strokeWidth={1.5} />
        ) : (
          <ImageIcon size={16} className="text-neutral-400 shrink-0" strokeWidth={1.5} />
        )}
        <span className="text-sm text-neutral-500">
          {preview ? 'Changer le fichier' : 'Choisir une photo ou vidéo'}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
        required={!preview}
        onChange={handleChange}
        className="hidden"
      />

      {/* Message d'erreur */}
      {error && (
        <p className="text-[0.72rem] text-red-500 flex items-center gap-1.5">
          <X size={11} /> {error}
        </p>
      )}

      {/* Conseil */}
      {!error && !preview && (
        <p className="text-[0.65rem] text-neutral-400">
          Formats acceptés : JPG, PNG, WebP · Conseil : compresse tes photos sur{' '}
          <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-600">
            squoosh.app
          </a>{' '}
          avant d'uploader
        </p>
      )}
    </div>
  )
}
