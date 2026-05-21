import { verifyAdmin } from '@/lib/dal'
import { getBrandCategories, createBrandCategory, updateBrandCategory, deleteBrandCategory, reorderBrandCategory, seedDefaultCategories } from '@/lib/brand'
import { uploadFile } from '@/lib/cloudinary'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Trash2, Sparkles } from 'lucide-react'
import { notFound } from 'next/navigation'

const BRAND_NAMES: Record<string, string> = {
  taxidermie: 'Crystal Pets',
  bijoux: 'L0vers.cult',
  bougies: 'Spectrum N°3',
  habillement: 'Hackcycle',
}

const VALID_UNIVERSES = ['taxidermie', 'bijoux', 'bougies', 'habillement']

type Props = { params: Promise<{ universe: string }> }

export default async function AdminCategoriesPage({ params }: Props) {
  await verifyAdmin()
  const { universe } = await params
  if (!VALID_UNIVERSES.includes(universe)) notFound()

  const categories = await getBrandCategories(universe)
  const brandName = BRAND_NAMES[universe] ?? universe

  async function addCategory(formData: FormData) {
    'use server'
    await verifyAdmin()
    const label = String(formData.get('label') ?? '').trim()
    const slug = String(formData.get('slug') ?? '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const latin = String(formData.get('latin') ?? '').trim() || null
    const description = String(formData.get('description') ?? '').trim() || null
    if (!label || !slug) return
    const primaryFile = formData.get('primaryImage') as File | null
    const hoverFile = formData.get('hoverImage') as File | null
    let primaryImageId: string | null = null
    let hoverImageId: string | null = null
    if (primaryFile && primaryFile.size > 0) {
      const url = await uploadFile(primaryFile)
      const m = url.match(/\/api\/images\/([^/?#]+)/)
      primaryImageId = m ? m[1] : null
    }
    if (hoverFile && hoverFile.size > 0) {
      const url = await uploadFile(hoverFile)
      const m = url.match(/\/api\/images\/([^/?#]+)/)
      hoverImageId = m ? m[1] : null
    }
    await createBrandCategory({ universe, label, slug, latin, description, primaryImageId, hoverImageId, order: 999 })
    redirect(`/admin/marques/${universe}/categories`)
  }

  async function editCategory(formData: FormData) {
    'use server'
    await verifyAdmin()
    const id = String(formData.get('id') ?? '')
    const label = String(formData.get('label') ?? '').trim()
    const latin = String(formData.get('latin') ?? '').trim() || null
    const description = String(formData.get('description') ?? '').trim() || null
    const primaryFile = formData.get('primaryImage') as File | null
    const hoverFile = formData.get('hoverImage') as File | null
    const update: Record<string, unknown> = { label, latin, description }
    if (primaryFile && primaryFile.size > 0) {
      const url = await uploadFile(primaryFile)
      const m = url.match(/\/api\/images\/([^/?#]+)/)
      update.primaryImageId = m ? m[1] : null
    }
    if (hoverFile && hoverFile.size > 0) {
      const url = await uploadFile(hoverFile)
      const m = url.match(/\/api\/images\/([^/?#]+)/)
      update.hoverImageId = m ? m[1] : null
    }
    await updateBrandCategory(id, update as Parameters<typeof updateBrandCategory>[1])
    redirect(`/admin/marques/${universe}/categories`)
  }

  async function deleteCategory(formData: FormData) {
    'use server'
    await verifyAdmin()
    const id = String(formData.get('id') ?? '')
    await deleteBrandCategory(id)
    redirect(`/admin/marques/${universe}/categories`)
  }

  async function reorderCategory(formData: FormData) {
    'use server'
    await verifyAdmin()
    const id = String(formData.get('id') ?? '')
    const direction = String(formData.get('direction') ?? '') as 'up' | 'down'
    await reorderBrandCategory(id, direction, universe)
    redirect(`/admin/marques/${universe}/categories`)
  }

  async function seedCategories(formData: FormData) {
    'use server'
    await verifyAdmin()
    await seedDefaultCategories(universe)
    redirect(`/admin/marques/${universe}/categories`)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/marques" className="flex items-center gap-2 text-neutral-400 hover:text-neutral-700 text-xs mb-8">
        <ArrowLeft size={12} /> Marques
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-neutral-800">Catégories — {brandName}</h1>
          <p className="text-neutral-400 text-xs mt-1">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        {categories.length === 0 && (
          <form action={seedCategories}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-neutral-400 transition-colors">
              <Sparkles size={13} strokeWidth={1.5} />
              Importer les catégories par défaut
            </button>
          </form>
        )}
      </div>

      <div className="space-y-3 mb-10">
        {categories.map((cat, i) => (
          <details key={cat.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <summary className="flex items-center gap-4 p-4 cursor-pointer list-none">
              {cat.primaryImageId ? (
                <div className="relative w-12 h-14 shrink-0 bg-neutral-100 rounded overflow-hidden">
                  <Image src={`/api/images/${cat.primaryImageId}`} alt={cat.label} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-12 h-14 shrink-0 bg-neutral-100 rounded flex items-center justify-center text-neutral-400 text-lg">✦</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800">{cat.label}</p>
                {cat.latin && <p className="text-xs text-neutral-400 italic">{cat.latin}</p>}
                <p className="text-xs text-neutral-400">/{universe}/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <form action={reorderCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" disabled={i === 0} onClick={e => e.stopPropagation()} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                    <ChevronUp size={14} />
                  </button>
                </form>
                <form action={reorderCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" disabled={i === categories.length - 1} onClick={e => e.stopPropagation()} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                    <ChevronDown size={14} />
                  </button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" onClick={e => e.stopPropagation()} className="p-1 rounded text-neutral-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </summary>
            <div className="border-t border-neutral-100 p-4 bg-neutral-50">
              <form action={editCategory} className="space-y-3">
                <input type="hidden" name="id" value={cat.id} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Nom</label>
                    <input type="text" name="label" defaultValue={cat.label} required className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Nom latin</label>
                    <input type="text" name="latin" defaultValue={cat.latin ?? ''} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Description</label>
                  <input type="text" name="description" defaultValue={cat.description ?? ''} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Photo principale</label>
                    <input type="file" name="primaryImage" accept="image/*" className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-white file:text-neutral-700 hover:file:bg-neutral-100" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Photo au survol</label>
                    <input type="file" name="hoverImage" accept="image/*" className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-white file:text-neutral-700 hover:file:bg-neutral-100" />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-neutral-800 text-white text-xs rounded-lg hover:bg-neutral-600 transition-colors">
                  Enregistrer
                </button>
              </form>
            </div>
          </details>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="font-medium text-neutral-700 mb-5 flex items-center gap-2">
          <Plus size={16} strokeWidth={1.5} /> Nouvelle catégorie
        </h2>
        <form action={addCategory} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Nom <span className="text-red-400">*</span></label>
              <input type="text" name="label" required placeholder="Ex. Oiseaux" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Slug URL <span className="text-red-400">*</span></label>
              <input type="text" name="slug" required placeholder="Ex. oiseaux" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Nom latin</label>
              <input type="text" name="latin" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Description</label>
              <input type="text" name="description" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Photo principale</label>
              <input type="file" name="primaryImage" accept="image/*" className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Photo au survol</label>
              <input type="file" name="hoverImage" accept="image/*" className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-neutral-900 text-white text-xs tracking-[0.14em] uppercase rounded-lg hover:bg-neutral-700 transition-colors">
            Créer la catégorie
          </button>
        </form>
      </div>
    </div>
  )
}
