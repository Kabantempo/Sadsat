import { verifyAdmin } from '@/lib/dal'
import { getBrandSlides, createBrandSlide, deleteBrandSlide, reorderBrandSlide, updateBrandSlide } from '@/lib/brand'
import { uploadFile } from '@/lib/cloudinary'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Trash2, Pencil } from 'lucide-react'
import { notFound } from 'next/navigation'
import MediaUploadInput from '@/components/shared/MediaUploadInput'

const BRAND_NAMES: Record<string, string> = {
  taxidermie: 'Crystal Pets',
  bijoux: 'L0vers.cult',
  bougies: 'Spectrum N°3',
  habillement: 'Hackcycle',
}

const VALID_UNIVERSES = ['taxidermie', 'bijoux', 'bougies', 'habillement']

type Props = { params: Promise<{ universe: string }> }

export default async function AdminCarouselPage({ params }: Props) {
  await verifyAdmin()
  const { universe } = await params
  if (!VALID_UNIVERSES.includes(universe)) notFound()

  const slides = await getBrandSlides(universe)
  const brandName = BRAND_NAMES[universe] ?? universe

  async function addSlide(formData: FormData) {
    'use server'
    await verifyAdmin()
    const file = formData.get('media') as File | null
    const title = String(formData.get('title') ?? '').trim() || null
    const subtitle = String(formData.get('subtitle') ?? '').trim() || null
    let mediaId: string | null = null
    if (file && file.size > 0) {
      const url = await uploadFile(file)
      const match = url.match(/\/api\/images\/([^/?#]+)/)
      mediaId = match ? match[1] : null
    }
    const type = file?.type?.startsWith('video/') ? 'video' : 'image'
    await createBrandSlide({ universe, type, mediaId, title, subtitle, order: 999, createdAt: new Date().toISOString() })
    redirect(`/admin/marques/${universe}/carousel`)
  }

  async function deleteSlide(formData: FormData) {
    'use server'
    await verifyAdmin()
    const id = String(formData.get('id') ?? '')
    await deleteBrandSlide(id)
    redirect(`/admin/marques/${universe}/carousel`)
  }

  async function reorderSlide(formData: FormData) {
    'use server'
    await verifyAdmin()
    const id = String(formData.get('id') ?? '')
    const direction = String(formData.get('direction') ?? '') as 'up' | 'down'
    await reorderBrandSlide(id, direction, universe)
    redirect(`/admin/marques/${universe}/carousel`)
  }

  async function editSlide(formData: FormData) {
    'use server'
    await verifyAdmin()
    const id = String(formData.get('id') ?? '')
    const title = String(formData.get('title') ?? '').trim() || null
    const subtitle = String(formData.get('subtitle') ?? '').trim() || null
    await updateBrandSlide(id, { title, subtitle })
    redirect(`/admin/marques/${universe}/carousel`)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/marques" className="flex items-center gap-2 text-neutral-400 hover:text-neutral-700 text-xs mb-8">
        <ArrowLeft size={12} /> Marques
      </Link>
      <h1 className="text-2xl font-light text-neutral-800 mb-1">
        Carrousel — {brandName}
      </h1>
      <p className="text-neutral-400 text-xs mb-8">{slides.length} slide{slides.length > 1 ? 's' : ''}</p>

      {slides.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {slides.map((slide, i) => (
            <div key={slide.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              {slide.mediaId && (
                <div className="relative aspect-[3/4] bg-neutral-100">
                  {slide.type === 'video' ? (
                    <video src={`/api/images/${slide.mediaId}`} className="w-full h-full object-cover" muted />
                  ) : (
                    <Image src={`/api/images/${slide.mediaId}`} alt={slide.title ?? 'slide'} fill className="object-cover" unoptimized />
                  )}
                </div>
              )}
              <div className="p-3">
                {slide.title && <p className="text-sm font-medium text-neutral-700 truncate">{slide.title}</p>}
                {slide.subtitle && <p className="text-xs text-neutral-400 truncate">{slide.subtitle}</p>}
                {!slide.title && !slide.subtitle && (
                  <p className="text-xs text-neutral-300 italic">Aucun texte</p>
                )}
                <div className="flex items-center gap-1 mt-3">
                  <form action={reorderSlide}>
                    <input type="hidden" name="id" value={slide.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" disabled={i === 0} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                      <ChevronUp size={14} />
                    </button>
                  </form>
                  <form action={reorderSlide}>
                    <input type="hidden" name="id" value={slide.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button type="submit" disabled={i === slides.length - 1} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                      <ChevronDown size={14} />
                    </button>
                  </form>
                  <form action={deleteSlide} className="ml-auto">
                    <input type="hidden" name="id" value={slide.id} />
                    <button type="submit" className="p-1 rounded text-neutral-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>

                {/* Panneau édition titre/sous-titre */}
                <details className="mt-3 group">
                  <summary className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer list-none select-none">
                    <Pencil size={11} />
                    Modifier le texte
                  </summary>
                  <form action={editSlide} className="mt-3 space-y-2">
                    <input type="hidden" name="id" value={slide.id} />
                    <div>
                      <label className="block text-[0.68rem] text-neutral-400 mb-1">Titre</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={slide.title ?? ''}
                        placeholder="Ex. Collection automne"
                        className="w-full border border-neutral-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] text-neutral-400 mb-1">Sous-titre</label>
                      <input
                        type="text"
                        name="subtitle"
                        defaultValue={slide.subtitle ?? ''}
                        placeholder="Ex. Pièce unique"
                        className="w-full border border-neutral-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-neutral-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-neutral-900 text-white text-[0.65rem] tracking-[0.1em] uppercase rounded hover:bg-neutral-700 transition-colors"
                    >
                      Sauvegarder
                    </button>
                  </form>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="font-medium text-neutral-700 mb-5 flex items-center gap-2">
          <Plus size={16} strokeWidth={1.5} /> Ajouter une photo ou vidéo
        </h2>
        <form action={addSlide} className="space-y-4">
          <MediaUploadInput name="media" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Titre <span className="text-neutral-400">(optionnel)</span></label>
              <input type="text" name="title" placeholder="Ex. Collection automne"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Sous-titre <span className="text-neutral-400">(optionnel)</span></label>
              <input type="text" name="subtitle"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.14em] uppercase rounded-lg hover:bg-neutral-700 transition-colors">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  )
}
