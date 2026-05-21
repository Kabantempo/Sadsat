import { getSession } from '@/lib/session'
import { getUserById } from '@/lib/db'
import { getBrandCategories } from '@/lib/brand'
import {
  addBrandCategoryAction, deleteBrandCategoryAction,
  reorderBrandCategoryAction, seedDefaultCategoriesAction, updateBrandCategoryAction,
} from '@/app/actions/brand'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Trash2, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function CategoriesPage() {
  const session = await getSession()
  if (!session?.userId) redirect('/connexion')
  const user = await getUserById(session.userId)
  if (!user?.universe) redirect('/createur/marque')

  const universe = user.universe
  const categories = await getBrandCategories(universe)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/createur/marque" className="flex items-center gap-2 text-neutral-400 hover:text-neutral-700 text-xs mb-8">
        <ArrowLeft size={12} /> Ma marque
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-neutral-800">Catégories <span className="text-neutral-400 text-base">({categories.length})</span></h1>
        {categories.length === 0 && (
          <form action={seedDefaultCategoriesAction}>
            <input type="hidden" name="universe" value={universe} />
            <button type="submit" className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-neutral-400 transition-colors">
              <Sparkles size={13} strokeWidth={1.5} />
              Importer les catégories par défaut
            </button>
          </form>
        )}
      </div>

      {/* Liste */}
      <div className="space-y-3 mb-10">
        {categories.map((cat, i) => (
          <details key={cat.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden group">
            <summary className="flex items-center gap-4 p-4 cursor-pointer list-none">
              {cat.primaryImageId ? (
                <div className="relative w-12 h-14 shrink-0 bg-neutral-100 rounded overflow-hidden">
                  <Image src={`/api/images/${cat.primaryImageId}`} alt={cat.label} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-14 shrink-0 bg-neutral-100 rounded flex items-center justify-center text-neutral-400 text-lg">✦</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800">{cat.label}</p>
                {cat.latin && <p className="text-xs text-neutral-400 italic">{cat.latin}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <form action={reorderBrandCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="direction" value="up" />
                  <input type="hidden" name="universe" value={universe} />
                  <button type="submit" disabled={i === 0} onClick={e => e.stopPropagation()} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                    <ChevronUp size={14} />
                  </button>
                </form>
                <form action={reorderBrandCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="direction" value="down" />
                  <input type="hidden" name="universe" value={universe} />
                  <button type="submit" disabled={i === categories.length - 1} onClick={e => e.stopPropagation()} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                    <ChevronDown size={14} />
                  </button>
                </form>
                <form action={deleteBrandCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" onClick={e => e.stopPropagation()} className="p-1 rounded text-neutral-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </summary>

            {/* Formulaire d'édition (dans le details) */}
            <div className="border-t border-neutral-100 p-4 bg-neutral-50">
              <form action={updateBrandCategoryAction} className="space-y-3">
                <input type="hidden" name="id" value={cat.id} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Nom</label>
                    <input type="text" name="label" defaultValue={cat.label} required
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Nom latin</label>
                    <input type="text" name="latin" defaultValue={cat.latin ?? ''}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Description</label>
                  <input type="text" name="description" defaultValue={cat.description ?? ''}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Photo principale</label>
                    <input type="file" name="primaryImage" accept="image/*"
                      className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-white file:text-neutral-700 hover:file:bg-neutral-100" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Photo au survol</label>
                    <input type="file" name="hoverImage" accept="image/*"
                      className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-white file:text-neutral-700 hover:file:bg-neutral-100" />
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

      {/* Ajouter une catégorie */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="font-medium text-neutral-700 mb-5 flex items-center gap-2">
          <Plus size={16} strokeWidth={1.5} /> Nouvelle catégorie
        </h2>
        <form action={addBrandCategoryAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Nom <span className="text-red-400">*</span></label>
              <input type="text" name="label" required placeholder="Ex. Oiseaux"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Slug URL <span className="text-red-400">*</span></label>
              <input type="text" name="slug" required placeholder="Ex. oiseaux"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Nom latin</label>
              <input type="text" name="latin" placeholder="Ex. Aves"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Description</label>
              <input type="text" name="description" placeholder="Courte description"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Photo principale</label>
              <input type="file" name="primaryImage" accept="image/*"
                className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Photo au survol</label>
              <input type="file" name="hoverImage" accept="image/*"
                className="block w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded file:text-xs file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100" />
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
