'use client'
import { useActionState, useState, useRef } from 'react'
import { X, ImagePlus } from 'lucide-react'
import { UNIVERSES, UNIVERSE_LABELS, CATEGORIES, STATUS_LABELS } from '@/lib/definitions'
import type { Universe, Product, ProductFormState } from '@/lib/definitions'

type Props = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>
  product?: Product
}

export default function ProductForm({ action, product }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [universe, setUniverse] = useState<Universe>(product?.universe ?? 'taxidermie')
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? [])
  const [previews, setPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
  }

  function removeExisting(src: string) {
    setExistingImages((prev) => prev.filter((i) => i !== src))
  }

  function clearNewFiles() {
    if (fileRef.current) fileRef.current.value = ''
    setPreviews([])
  }

  const fieldClass =
    'w-full border border-neutral-200 px-4 py-2.5 text-[0.85rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors'
  const labelClass = 'block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5'
  const errorClass = 'mt-1 text-[0.64rem] text-red-500'

  return (
    <form action={formAction} className="space-y-8">
      {product && <input type="hidden" name="productId" value={product.id} />}

      {/* Existing images as hidden inputs */}
      {existingImages.map((src) => (
        <input key={src} type="hidden" name="existingImages" value={src} />
      ))}

      {state?.message && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[0.72rem] text-red-600">
          {state.message}
        </div>
      )}

      {/* Identité */}
      <div className="bg-white border border-neutral-200 p-6 space-y-5">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 pb-2 border-b border-neutral-100">
          Identité du produit
        </p>

        <div>
          <label htmlFor="name" className={labelClass}>Nom *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product?.name}
            placeholder="Ex : Tête de renard naturalisée"
            className={fieldClass}
          />
          {state?.errors?.name && <p className={errorClass}>{state.errors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description *</label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={product?.description}
            placeholder="Décrivez la pièce : matériaux, dimensions, technique, histoire..."
            className={`${fieldClass} resize-none`}
          />
          {state?.errors?.description && <p className={errorClass}>{state.errors.description[0]}</p>}
        </div>
      </div>

      {/* Classement */}
      <div className="bg-white border border-neutral-200 p-6 space-y-5">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 pb-2 border-b border-neutral-100">
          Classement
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="universe" className={labelClass}>Univers *</label>
            <select
              id="universe"
              name="universe"
              value={universe}
              onChange={(e) => setUniverse(e.target.value as Universe)}
              className={fieldClass}
            >
              {UNIVERSES.map((u) => (
                <option key={u} value={u}>{UNIVERSE_LABELS[u]}</option>
              ))}
            </select>
            {state?.errors?.universe && <p className={errorClass}>{state.errors.universe[0]}</p>}
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>Catégorie *</label>
            <select
              id="category"
              name="category"
              defaultValue={product?.category}
              className={fieldClass}
            >
              <option value="">— choisir —</option>
              {CATEGORIES[universe].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {state?.errors?.category && <p className={errorClass}>{state.errors.category[0]}</p>}
          </div>
        </div>
      </div>

      {/* Prix & stock */}
      <div className="bg-white border border-neutral-200 p-6 space-y-5">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 pb-2 border-b border-neutral-100">
          Prix & disponibilité
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="price" className={labelClass}>Prix (€) *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product ? (product.price / 100).toFixed(2) : ''}
              placeholder="0.00"
              className={fieldClass}
            />
            {state?.errors?.price && <p className={errorClass}>{state.errors.price[0]}</p>}
          </div>

          <div>
            <label htmlFor="stock" className={labelClass}>Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? 1}
              className={fieldClass}
            />
            {state?.errors?.stock && <p className={errorClass}>{state.errors.stock[0]}</p>}
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>Statut</label>
            <select
              id="status"
              name="status"
              defaultValue={product?.status ?? 'disponible'}
              className={fieldClass}
            >
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-neutral-200 p-6 space-y-5">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 pb-2 border-b border-neutral-100">
          Images
        </p>

        {/* Images existantes */}
        {existingImages.length > 0 && (
          <div>
            <p className={labelClass}>Images actuelles</p>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((src) => (
                <div key={src} className="relative group">
                  <img
                    src={src}
                    alt=""
                    className="w-24 h-24 object-cover border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(src)}
                    className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 border border-neutral-200 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Supprimer cette image"
                  >
                    <X size={12} strokeWidth={2} className="text-neutral-700" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nouvelles images */}
        <div>
          <label className={labelClass}>
            {existingImages.length > 0 ? 'Ajouter des images' : 'Ajouter des images'}
          </label>
          <label
            htmlFor="newImages"
            className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 p-8 cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
          >
            <ImagePlus size={22} strokeWidth={1.2} className="text-neutral-400 mb-2" />
            <span className="text-[0.68rem] tracking-[0.1em] text-neutral-400">
              Cliquer pour sélectionner (JPG, PNG, WebP)
            </span>
            <input
              id="newImages"
              name="newImages"
              type="file"
              ref={fileRef}
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFiles}
              className="sr-only"
            />
          </label>
        </div>

        {/* Prévisualisation nouvelles images */}
        {previews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className={labelClass}>Aperçu ({previews.length} nouvelle{previews.length > 1 ? 's' : ''})</p>
              <button
                type="button"
                onClick={clearNewFiles}
                className="text-[0.58rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-red-500 transition-colors"
              >
                Annuler
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {previews.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Aperçu ${i + 1}`}
                  className="w-24 h-24 object-cover border border-neutral-200"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="px-8 py-3 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {pending ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer le produit'}
        </button>
        <a
          href="/admin/produits"
          className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          Annuler
        </a>
      </div>
    </form>
  )
}
