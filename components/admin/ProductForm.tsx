'use client'
import { useActionState, useState, useRef } from 'react'
import { X, ImagePlus, VideoIcon, Eye, Upload, Tag, Ruler, LayoutGrid, DollarSign, Images, Film, Package } from 'lucide-react'
import { UNIVERSES, UNIVERSE_LABELS, CATEGORIES, STATUS_LABELS } from '@/lib/definitions'
import type { Universe, Product, ProductFormState } from '@/lib/definitions'

type Props = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>
  product?: Product
  variant?: 'admin' | 'createur'
  cancelHref?: string
  showPreview?: boolean
}

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="px-6 py-3.5 border-b border-neutral-100 flex items-center gap-2.5 bg-neutral-50">
      <Icon size={13} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-500 font-medium">{label}</p>
    </div>
  )
}

const UNIVERSE_ACCENT: Record<string, string> = {
  taxidermie:  'text-stone-500',
  bijoux:      'text-rose-500',
  bougies:     'text-amber-500',
  habillement: 'text-sky-500',
}

export default function ProductForm({ action, product, variant = 'admin', cancelHref, showPreview = false }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [universe, setUniverse] = useState<Universe>(product?.universe ?? 'taxidermie')
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? [])
  const [previews, setPreviews] = useState<string[]>([])
  const [existingVideo, setExistingVideo] = useState<string | null>(product?.video ?? null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  // Preview state
  const [previewName, setPreviewName] = useState(product?.name ?? '')
  const [previewPrice, setPreviewPrice] = useState(product ? product.price : 0)
  const [previewDesc, setPreviewDesc] = useState(product?.description ?? '')
  const [previewStatus, setPreviewStatus] = useState<'disponible' | 'vendu' | 'masqué'>(
    (product?.status as 'disponible' | 'vendu' | 'masqué') ?? 'disponible'
  )

  const resolvedCancelHref = cancelHref ?? (variant === 'createur' ? '/createur/produits' : '/admin/produits')
  const previewImg = previews[0] ?? existingImages[0] ?? null

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
  }

  function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setVideoPreview(URL.createObjectURL(file))
  }

  function removeExisting(src: string) {
    setExistingImages((prev) => prev.filter((i) => i !== src))
  }

  function clearNewFiles() {
    if (fileRef.current) fileRef.current.value = ''
    setPreviews([])
  }

  function removeVideo() {
    setExistingVideo(null)
    setVideoPreview(null)
    if (videoRef.current) videoRef.current.value = ''
  }

  const fieldClass =
    'w-full border border-neutral-200 px-4 py-2.5 text-[0.85rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors'
  const labelClass = 'block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5'
  const errorClass = 'mt-1 text-[0.64rem] text-red-500'

  const formContent = (
    <div className="space-y-4">
      {product && <input type="hidden" name="productId" value={product.id} />}
      {existingImages.map((src) => (
        <input key={src} type="hidden" name="existingImages" value={src} />
      ))}

      {state?.message && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[0.72rem] text-red-600">
          {state.message}
        </div>
      )}

      {/* ── Identité ── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <SectionHeader icon={Tag} label="Identité du produit" />
        <div className="p-6 space-y-5">
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
              onChange={(e) => setPreviewName(e.target.value)}
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
              onChange={(e) => setPreviewDesc(e.target.value)}
            />
            {state?.errors?.description && <p className={errorClass}>{state.errors.description[0]}</p>}
          </div>

          <div>
            <label htmlFor="serialNumber" className={labelClass}>Numéro de série</label>
            <input
              id="serialNumber"
              name="serialNumber"
              type="text"
              defaultValue={product?.serialNumber ?? ''}
              placeholder="Ex : SADSAT-2024-001"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* ── Dimensions & matériaux ── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <SectionHeader icon={Ruler} label="Dimensions & matériaux" />
        <div className="p-6 space-y-5">
          <p className="text-[0.64rem] text-neutral-400">Tous les champs sont facultatifs. Dimensions en cm, poids en g.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'dim_hauteur',    label: 'Hauteur (cm)',    step: '0.1', key: 'hauteur' },
              { id: 'dim_largeur',    label: 'Largeur (cm)',    step: '0.1', key: 'largeur' },
              { id: 'dim_profondeur', label: 'Profondeur (cm)', step: '0.1', key: 'profondeur' },
              { id: 'dim_diametre',   label: 'Diamètre (cm)',   step: '0.1', key: 'diametre' },
              { id: 'dim_longueur',   label: 'Longueur (cm)',   step: '0.1', key: 'longueur' },
              { id: 'dim_poids',      label: 'Poids (g)',       step: '1',   key: 'poids' },
            ].map(({ id, label, step, key }) => (
              <div key={id}>
                <label htmlFor={id} className={labelClass}>{label}</label>
                <input
                  id={id}
                  name={id}
                  type="number"
                  step={step}
                  min="0"
                  defaultValue={(product?.dimensions as Record<string, number | undefined>)?.[key] ?? ''}
                  placeholder="—"
                  className={fieldClass}
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="materials" className={labelClass}>Matériaux / composition</label>
            <input
              id="materials"
              name="materials"
              type="text"
              defaultValue={product?.materials ?? ''}
              placeholder="Ex : Cuivre, résine époxy, plumes naturelles..."
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* ── Classement ── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <SectionHeader icon={LayoutGrid} label="Classement" />
        <div className="p-6">
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
      </div>

      {/* ── Prix & disponibilité ── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <SectionHeader icon={DollarSign} label="Prix & disponibilité" />
        <div className="p-6">
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
                onChange={(e) => setPreviewPrice(Math.round(parseFloat(e.target.value || '0') * 100))}
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
                onChange={(e) => setPreviewStatus(e.target.value as 'disponible' | 'vendu' | 'masqué')}
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Images ── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <SectionHeader icon={Images} label="Images" />
        <div className="p-6 space-y-5">
          {existingImages.length > 0 && (
            <div>
              <p className={labelClass}>Images actuelles</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((src) => (
                  <div key={src} className="relative group">
                    <img src={src} alt="" className="w-24 h-24 object-cover border border-neutral-200" />
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

          <div>
            <label className={labelClass}>Ajouter des images</label>
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
                  <img key={i} src={url} alt={`Aperçu ${i + 1}`} className="w-24 h-24 object-cover border border-neutral-200" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Vidéo ── */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <SectionHeader icon={Film} label="Vidéo de présentation" />
        <div className="p-6 space-y-5">
          <p className="text-[0.62rem] text-neutral-400 leading-relaxed">
            Courte vidéo jouée en boucle sur la fiche produit. <strong>3 à 5 secondes recommandées.</strong> Formats : MP4, WebM, MOV.
          </p>

          {existingVideo && !videoPreview && (
            <div>
              <p className={labelClass}>Vidéo actuelle</p>
              <div className="relative inline-block group">
                <video src={existingVideo} autoPlay muted loop playsInline className="w-40 h-28 object-cover border border-neutral-200" />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 border border-neutral-200 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Supprimer la vidéo"
                >
                  <X size={12} strokeWidth={2} className="text-neutral-700" />
                </button>
              </div>
              <input type="hidden" name="existingVideo" value={existingVideo} />
            </div>
          )}

          <div>
            <label
              htmlFor="video"
              className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 p-8 cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
            >
              <VideoIcon size={22} strokeWidth={1.2} className="text-neutral-400 mb-2" />
              <span className="text-[0.68rem] tracking-[0.1em] text-neutral-400">
                {existingVideo && !videoPreview ? 'Remplacer la vidéo' : 'Sélectionner une vidéo'}
              </span>
              <input
                id="video"
                name="video"
                type="file"
                ref={videoRef}
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideo}
                className="sr-only"
              />
            </label>
          </div>

          {videoPreview && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={labelClass}>Aperçu</p>
                <button
                  type="button"
                  onClick={removeVideo}
                  className="text-[0.58rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-red-500 transition-colors"
                >
                  Supprimer
                </button>
              </div>
              <video src={videoPreview} autoPlay muted loop playsInline className="w-40 h-28 object-cover border border-neutral-200" />
            </div>
          )}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="pt-2">
        {variant === 'createur' ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              name="_intent"
              value="preview"
              disabled={pending}
              className="flex items-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-700 text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:border-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
            >
              <Eye size={13} strokeWidth={1.5} />
              {pending ? '...' : 'Prévisualiser'}
            </button>
            <button
              type="submit"
              name="_intent"
              value="publish"
              disabled={pending}
              className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <Upload size={13} strokeWidth={1.5} />
              {pending ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Publier'}
            </button>
            <a href={resolvedCancelHref} className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors">
              Annuler
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <Upload size={13} strokeWidth={1.5} />
              {pending ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer le produit'}
            </button>
            <a href={resolvedCancelHref} className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors">
              Annuler
            </a>
          </div>
        )}
      </div>
    </div>
  )

  const previewPanel = (
    <div className="xl:sticky xl:top-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Eye size={13} strokeWidth={1.5} className="text-neutral-400" />
        <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">Visualisation</p>
      </div>

      {/* ── Carte produit ── */}
      <div className="border border-neutral-200 overflow-hidden bg-white">
        <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50">
          <p className="text-[0.56rem] tracking-[0.16em] uppercase text-neutral-400">Carte produit</p>
        </div>
        {/* Image */}
        <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden">
          {previewImg ? (
            <img src={previewImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <Package size={28} strokeWidth={1} className="text-neutral-700" />
              <span className="text-[0.56rem] tracking-[0.14em] uppercase text-neutral-700">Aucune image</span>
            </div>
          )}
          {previewStatus === 'vendu' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[0.56rem] tracking-[0.3em] uppercase text-neutral-300 border border-neutral-600 px-3 py-1.5 bg-black/60">
                Vendu
              </span>
            </div>
          )}
        </div>
        {/* Info carte */}
        <div className="p-4">
          <p className={`font-serif text-neutral-900 leading-tight mb-0.5 ${previewName ? '' : 'text-neutral-300 italic text-sm'}`}>
            {previewName || 'Nom du produit'}
          </p>
          <p className={`text-[0.6rem] tracking-[0.1em] ${UNIVERSE_ACCENT[universe]}`}>
            {UNIVERSE_LABELS[universe]}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[0.88rem] text-neutral-800">
              {previewPrice > 0 ? `${(previewPrice / 100).toFixed(2)} €` : <span className="text-neutral-300">—</span>}
            </span>
            <span className={`text-[0.5rem] tracking-[0.18em] uppercase px-2 py-0.5 ${
              previewStatus === 'disponible' ? 'bg-green-100 text-green-700'
              : previewStatus === 'vendu'    ? 'bg-neutral-100 text-neutral-500'
              : 'bg-neutral-50 text-neutral-300'
            }`}>
              {previewStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ── Aperçu fiche ── */}
      <div className="border border-neutral-800 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-neutral-800 bg-neutral-900">
          <p className="text-[0.56rem] tracking-[0.16em] uppercase text-neutral-500">Fiche produit</p>
        </div>
        <div className="bg-neutral-950 p-5">
          <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase text-neutral-600 mb-3">
            {UNIVERSE_LABELS[universe]} / <span className="text-neutral-500">{previewName || '...'}</span>
          </p>
          <h2 className={`font-serif text-2xl leading-tight mb-3 ${previewName ? 'text-neutral-100' : 'text-neutral-700 italic text-lg'}`}>
            {previewName || 'Nom du produit'}
          </h2>
          <p className="text-[0.7rem] text-neutral-500 leading-relaxed line-clamp-4 mb-4">
            {previewDesc || <span className="italic">La description apparaîtra ici...</span>}
          </p>
          <div className="border-t border-neutral-800 pt-4 flex items-end justify-between gap-2">
            <span className={`font-serif text-2xl ${previewPrice > 0 ? 'text-neutral-100' : 'text-neutral-700'}`}>
              {previewPrice > 0 ? `${(previewPrice / 100).toFixed(2)} €` : '—'}
            </span>
            <span className={`text-[0.5rem] tracking-[0.2em] uppercase px-2.5 py-1 ${
              previewStatus === 'disponible' ? 'bg-green-950 text-green-400 border border-green-900'
              : previewStatus === 'vendu'    ? 'bg-neutral-800 text-neutral-500 border border-neutral-700'
              : 'bg-neutral-900 text-neutral-700 border border-neutral-800'
            }`}>
              {previewStatus}
            </span>
          </div>
          {previewImg && (
            <div className="mt-4 aspect-[3/2] overflow-hidden">
              <img src={previewImg} alt="" className="w-full h-full object-cover opacity-60" />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <form action={formAction}>
      {showPreview ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
          <div>{formContent}</div>
          {previewPanel}
        </div>
      ) : (
        formContent
      )}
    </form>
  )
}
