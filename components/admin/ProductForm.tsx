'use client'
import { useActionState, useState, useRef, useTransition } from 'react'
import { quickAddCategoryAction } from '@/app/actions/brand'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ImagePlus, VideoIcon, Upload, Tag, Ruler, LayoutGrid,
  DollarSign, Images, Film, Package, Eye, ChevronRight,
  Heart, ShoppingBag, Check, Sparkles, Plus, Trash2
} from 'lucide-react'
import { UNIVERSES, UNIVERSE_LABELS, CATEGORIES, STATUS_LABELS } from '@/lib/definitions'
import type { Universe, Product, ProductFormState } from '@/lib/definitions'

type Props = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>
  product?: Product
  variant?: 'admin' | 'createur'
  cancelHref?: string
  showPreview?: boolean
  categoriesByUniverse?: Record<string, string[]>
}

const UNIVERSE_COLOR: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  taxidermie:       { bg: 'bg-stone-50',   text: 'text-stone-600',   ring: 'ring-stone-200',   dot: 'bg-stone-400'   },
  bijoux:           { bg: 'bg-rose-50',    text: 'text-rose-600',    ring: 'ring-rose-200',    dot: 'bg-rose-400'    },
  bougies:          { bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-200',   dot: 'bg-amber-400'   },
  habillement:      { bg: 'bg-sky-50',     text: 'text-sky-600',     ring: 'ring-sky-200',     dot: 'bg-sky-400'     },
  'pieces-uniques': { bg: 'bg-neutral-50', text: 'text-neutral-600', ring: 'ring-neutral-200', dot: 'bg-neutral-400' },
}

/* ─── Champs de saisie ─── */
const inputCls =
  'w-full rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-[0.88rem] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:bg-white focus:border-neutral-400 focus:ring-4 focus:ring-neutral-900/5'

const labelCls = 'block text-[0.62rem] tracking-[0.14em] uppercase text-neutral-500 font-semibold mb-2'

/* ─── Carte section ─── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] border border-neutral-100 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ step, icon: Icon, title, done }: {
  step: number; icon: React.ElementType; title: string; done?: boolean
}) {
  return (
    <div className="px-7 py-5 border-b border-neutral-100 flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.58rem] font-bold transition-colors ${
        done ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
      }`}>
        {done ? <Check size={13} strokeWidth={2.5} /> : String(step).padStart(2, '0')}
      </div>
      <div className="flex items-center gap-2 flex-1">
        <Icon size={14} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
        <p className="text-[0.72rem] tracking-[0.12em] uppercase text-neutral-600 font-semibold">{title}</p>
      </div>
    </div>
  )
}

/* ─── Modal prévisualisation ─── */
function PreviewModal({ open, onClose, name, price, description, status, universe, imgs }: {
  open: boolean; onClose: () => void
  name: string; price: number; description: string
  status: string; universe: Universe; imgs: string[]
}) {
  const img = imgs[0] ?? null
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] overflow-y-auto"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          {/* Barre */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur">
            <div className="flex items-center gap-2.5">
              <Eye size={13} strokeWidth={1.5} className="text-neutral-500" />
              <span className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-500">
                Prévisualisation fiche produit
              </span>
            </div>
            <button onClick={onClose} className="flex items-center gap-2 text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-800">
              <X size={12} /> Fermer
            </button>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-16 text-neutral-200" onClick={(e) => e.stopPropagation()}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-12 font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-700">
              <span>Accueil</span><ChevronRight size={10} />
              <span>{UNIVERSE_LABELS[universe]}</span><ChevronRight size={10} />
              <span className="text-neutral-500">{name || 'Sans titre'}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Image */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm">
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <Package size={40} strokeWidth={0.8} className="text-neutral-700" />
                        <span className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-neutral-700">Aucune image</span>
                      </div>
                  }
                  {status === 'vendu' && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[0.58rem] tracking-[0.2em] uppercase bg-black/80 text-neutral-400 px-3 py-1.5 border border-neutral-700">Vendu</span>
                    </div>
                  )}
                </div>
                {imgs.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {imgs.slice(1, 5).map((i, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden bg-neutral-900">
                        <img src={i} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Infos */}
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-500">{UNIVERSE_LABELS[universe]}</span>
                </div>
                <div className="flex items-start gap-3 mb-6">
                  <h1 className={`font-serif font-light text-5xl italic leading-tight flex-1 ${name ? 'text-neutral-100' : 'text-neutral-700'}`}>
                    {name || 'Nom du produit'}
                  </h1>
                  <button className="mt-2 text-neutral-700"><Heart size={20} strokeWidth={1.5} /></button>
                </div>
                <div className="mb-8">
                  <p className={`font-serif text-3xl ${price > 0 ? 'text-neutral-100' : 'text-neutral-700'}`}>
                    {price > 0 ? <>{(price / 100).toFixed(2)} <span className="text-lg text-neutral-500">€</span></> : '—'}
                  </p>
                  <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-600 mt-1">Pièce unique</p>
                </div>
                <div className="h-px bg-neutral-800 mb-8" />
                <div className="mb-8">
                  <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-500 mb-3">Description</p>
                  <p className={`text-[0.9rem] leading-relaxed whitespace-pre-line ${description ? 'text-neutral-400' : 'text-neutral-700 italic'}`}>
                    {description || 'La description apparaîtra ici…'}
                  </p>
                </div>
                <div className="space-y-px mb-8 text-neutral-700">
                  {['Dimensions & matériaux', 'Informations de livraison', 'Créateur'].map((l) => (
                    <div key={l} className="border border-neutral-800 px-4 py-3 flex items-center justify-between text-[0.65rem] tracking-[0.1em] uppercase">
                      <span>{l}</span><ChevronRight size={11} className="opacity-40" />
                    </div>
                  ))}
                </div>
                <button disabled className={`w-full h-14 flex items-center justify-center gap-3 text-[0.62rem] tracking-[0.24em] uppercase font-medium ${
                  status === 'vendu' ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-100 text-neutral-900'
                }`}>
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  {status === 'vendu' ? 'Pièce vendue' : 'Ajouter au panier'}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Composant principal ─── */
export default function ProductForm({ action, product, variant = 'admin', cancelHref, showPreview = false, categoriesByUniverse }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [universe, setUniverse] = useState<Universe>(product?.universe ?? 'taxidermie')
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? [])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [existingVideo, setExistingVideo] = useState<string | null>(product?.video ?? null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [localCats, setLocalCats] = useState<Record<string, string[]>>(categoriesByUniverse ?? {})
  const [addingCat, setAddingCat] = useState(false)
  const [newCatInput, setNewCatInput] = useState('')
  const [newCatError, setNewCatError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.category ?? '')
  const [catPending, startCatTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)
  const newCatRef = useRef<HTMLInputElement>(null)

  const [pName,   setPName]   = useState(product?.name ?? '')
  const [pPrice,  setPPrice]  = useState(product ? product.price : 0)
  const [pDesc,   setPDesc]   = useState(product?.description ?? '')
  const [pStatus, setPStatus] = useState<'disponible'|'vendu'|'masqué'>((product?.status as any) ?? 'disponible')

  const allImgs = [...newPreviews, ...existingImages]
  const previewImg = allImgs[0] ?? null
  const uColor = UNIVERSE_COLOR[universe] ?? UNIVERSE_COLOR['pieces-uniques']
  const resolvedCancel = cancelHref ?? (variant === 'createur' ? '/createur/produits' : '/admin/produits')

  function handleAddCategory() {
    if (!newCatInput.trim()) return
    startCatTransition(async () => {
      const result = await quickAddCategoryAction(universe, newCatInput.trim())
      if ('error' in result) {
        setNewCatError(result.error)
      } else {
        setLocalCats(prev => ({
          ...prev,
          [universe]: [...(prev[universe] ?? []), result.label],
        }))
        setSelectedCategory(result.label)
        setAddingCat(false)
        setNewCatInput('')
        setNewCatError('')
      }
    })
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPreviews(Array.from(e.target.files ?? []).map(f => URL.createObjectURL(f)))
  }
  async function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setVideoPreview(URL.createObjectURL(f))
    setVideoUrl(null)
    setVideoError(false)
    setVideoUploading(true)
    try {
      const res = await fetch('/api/cloudinary-signature')
      if (!res.ok) throw new Error()
      const { timestamp, signature, apiKey, cloudName, folder } = await res.json()
      const fd = new FormData()
      fd.append('file', f)
      fd.append('timestamp', String(timestamp))
      fd.append('signature', signature)
      fd.append('api_key', apiKey)
      fd.append('folder', folder)
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, { method: 'POST', body: fd })
      const data = await uploadRes.json()
      if (!uploadRes.ok || data.error) throw new Error(data.error?.message)
      setVideoUrl(data.secure_url)
      if (videoRef.current) videoRef.current.value = ''
    } catch {
      setVideoError(true)
      setVideoPreview(null)
      if (videoRef.current) videoRef.current.value = ''
    } finally {
      setVideoUploading(false)
    }
  }
  function removeVideo() {
    setExistingVideo(null); setVideoPreview(null); setVideoUrl(null); setVideoError(false)
    if (videoRef.current) videoRef.current.value = ''
  }

  /* ── PANNEAU PREVIEW ── */
  const sidePreview = (
    <div className="xl:sticky xl:top-6 space-y-4">
      {/* Bouton plein écran */}
      <motion.button
        type="button" onClick={() => setModalOpen(true)}
        whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20 group"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={13} strokeWidth={1.5} className="text-neutral-400 group-hover:text-amber-400 transition-colors" />
          <span className="text-[0.6rem] tracking-[0.18em] uppercase">Prévisualiser la fiche</span>
        </div>
        <ChevronRight size={13} className="text-neutral-500 group-hover:text-white transition-colors" />
      </motion.button>

      {/* Carte miniature */}
      <motion.div
        onClick={() => setModalOpen(true)}
        whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
        className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer transition-shadow"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {previewImg ? (
              <motion.img key={previewImg} src={previewImg} alt=""
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }} className="w-full h-full object-cover" />
            ) : (
              <motion.div key="ph" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
                  <ImagePlus size={22} strokeWidth={1.2} className="text-neutral-400" />
                </div>
                <span className="text-[0.58rem] tracking-[0.16em] uppercase text-neutral-400">Ajouter une image</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge statut */}
          <AnimatePresence>
            {pStatus !== 'disponible' && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="absolute top-3 left-3">
                <span className="text-[0.52rem] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full bg-black/70 text-neutral-300 backdrop-blur-sm">
                  {pStatus}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
            <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.16em] uppercase text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <Eye size={11} /> Voir la fiche
            </span>
          </div>
        </div>

        {/* Infos carte */}
        <div className="p-5">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.52rem] tracking-[0.14em] uppercase mb-3 ${uColor.bg} ${uColor.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${uColor.dot}`} />
            {UNIVERSE_LABELS[universe]}
          </div>
          <p className={`font-serif text-[1.05rem] leading-snug mb-2 ${pName ? 'text-neutral-900' : 'text-neutral-300 italic'}`}>
            {pName || 'Nom du produit'}
          </p>
          <p className={`font-semibold text-[0.95rem] ${pPrice > 0 ? 'text-neutral-800' : 'text-neutral-300'}`}>
            {pPrice > 0 ? `${(pPrice / 100).toFixed(2)} €` : '—'}
          </p>
        </div>
      </motion.div>

      {/* Aperçu description */}
      <AnimatePresence>
        {pDesc && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5">
            <p className="text-[0.58rem] tracking-[0.14em] uppercase text-neutral-400 mb-2 font-semibold">Description</p>
            <p className="text-[0.75rem] text-neutral-500 leading-relaxed line-clamp-5">{pDesc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  /* ── CONTENU FORMULAIRE ── */
  const formContent = (
    <div className="space-y-5">
      {product && <input type="hidden" name="productId" value={product.id} />}
      {existingImages.map(s => <input key={s} type="hidden" name="existingImages" value={s} />)}
      {videoUrl && <input type="hidden" name="videoUrl" value={videoUrl} />}

      <AnimatePresence>
        {state?.message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-[0.72rem] text-red-600">
            <X size={14} className="shrink-0" /> {state.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 01 — Identité */}
      {[
        { step: 1, icon: Tag, title: 'Identité du produit', done: !!(pName && pDesc) },
      ].map(({ step, icon, title, done }) => (
        <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.03 }}>
          <Card>
            <CardHeader step={step} icon={icon} title={title} done={done} />
            <div className="p-7 space-y-6">
              <div>
                <label htmlFor="name" className={labelCls}>Nom <span className="text-red-400 normal-case text-[0.8em]">*</span></label>
                <input id="name" name="name" type="text" required defaultValue={product?.name}
                  placeholder="Ex : Tête de renard naturalisée"
                  className={inputCls} onChange={e => setPName(e.target.value)} />
                {state?.errors?.name && <p className="mt-2 text-[0.64rem] text-red-500">{state.errors.name[0]}</p>}
              </div>
              <div>
                <label htmlFor="description" className={labelCls}>Description <span className="text-red-400 normal-case text-[0.8em]">*</span></label>
                <textarea id="description" name="description" required rows={5} defaultValue={product?.description}
                  placeholder="Décrivez la pièce : matériaux, histoire, technique, dimensions…"
                  className={`${inputCls} resize-none`} onChange={e => setPDesc(e.target.value)} />
                {state?.errors?.description && <p className="mt-2 text-[0.64rem] text-red-500">{state.errors.description[0]}</p>}
              </div>
              <div>
                <label htmlFor="serialNumber" className={labelCls}>Numéro de série</label>
                <input id="serialNumber" name="serialNumber" type="text" defaultValue={product?.serialNumber ?? ''}
                  placeholder="SADSAT-2024-001" className={inputCls} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* 02 — Classement */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
        <Card>
          <CardHeader step={2} icon={LayoutGrid} title="Classement" done />
          <div className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="universe" className={labelCls}>Univers <span className="text-red-400 normal-case text-[0.8em]">*</span></label>
                <select id="universe" name="universe" value={universe} onChange={e => setUniverse(e.target.value as Universe)} className={inputCls}>
                  {UNIVERSES.map(u => <option key={u} value={u}>{UNIVERSE_LABELS[u]}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className={labelCls}>Catégorie <span className="text-red-400 normal-case text-[0.8em]">*</span></label>
                <div className="flex gap-2">
                  <select
                    id="category" name="category"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className={`${inputCls} flex-1`}
                  >
                    <option value="">— choisir —</option>
                    {(localCats[universe] ?? CATEGORIES[universe] ?? []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => { setAddingCat(true); setNewCatError(''); setTimeout(() => newCatRef.current?.focus(), 50) }}
                    title="Ajouter une catégorie"
                    className="w-10 shrink-0 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors"
                  >
                    <Plus size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {addingCat && (
                  <div className="mt-2 flex gap-2 items-center">
                    <input
                      ref={newCatRef}
                      type="text"
                      value={newCatInput}
                      onChange={e => { setNewCatInput(e.target.value); setNewCatError('') }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory() } if (e.key === 'Escape') { setAddingCat(false); setNewCatInput('') } }}
                      placeholder="Nom de la catégorie…"
                      className={`${inputCls} flex-1 py-2`}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={catPending}
                      className="shrink-0 px-3 py-2 rounded-xl bg-neutral-900 text-white text-[0.62rem] tracking-[0.12em] uppercase disabled:opacity-50"
                    >
                      {catPending ? '…' : 'Ajouter'}
                    </button>
                    <button type="button" onClick={() => { setAddingCat(false); setNewCatInput(''); setNewCatError('') }} className="shrink-0 text-neutral-400 hover:text-neutral-700">
                      <X size={14} />
                    </button>
                  </div>
                )}
                {newCatError && <p className="mt-1 text-[0.64rem] text-red-500">{newCatError}</p>}
                {state?.errors?.category && <p className="mt-2 text-[0.64rem] text-red-500">{state.errors.category[0]}</p>}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 03 — Prix & dispo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.13 }}>
        <Card>
          <CardHeader step={3} icon={DollarSign} title="Prix & disponibilité" done={pPrice > 0} />
          <div className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="price" className={labelCls}>Prix (€) <span className="text-red-400 normal-case text-[0.8em]">*</span></label>
                <div className="relative">
                  <input id="price" name="price" type="number" step="0.01" min="0" required
                    defaultValue={product ? (product.price / 100).toFixed(2) : ''} placeholder="0.00"
                    className={`${inputCls} pr-9`}
                    onChange={e => setPPrice(Math.round(parseFloat(e.target.value || '0') * 100))} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none">€</span>
                </div>
                {state?.errors?.price && <p className="mt-2 text-[0.64rem] text-red-500">{state.errors.price[0]}</p>}
              </div>
              <div>
                <label htmlFor="stock" className={labelCls}>Stock</label>
                <input id="stock" name="stock" type="number" min="0" defaultValue={product?.stock ?? 1} className={inputCls} />
              </div>
              <div>
                <label htmlFor="status" className={labelCls}>Statut</label>
                <select id="status" name="status" defaultValue={product?.status ?? 'disponible'} className={inputCls}
                  onChange={e => setPStatus(e.target.value as any)}>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 04 — Dimensions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}>
        <Card>
          <CardHeader step={4} icon={Ruler} title="Dimensions & matériaux" />
          <div className="p-7 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: 'dim_hauteur',    label: 'Hauteur cm',    key: 'hauteur',    step: '0.1' },
                { id: 'dim_largeur',    label: 'Largeur cm',    key: 'largeur',    step: '0.1' },
                { id: 'dim_profondeur', label: 'Profondeur cm', key: 'profondeur', step: '0.1' },
                { id: 'dim_diametre',   label: 'Diamètre cm',   key: 'diametre',   step: '0.1' },
                { id: 'dim_longueur',   label: 'Longueur cm',   key: 'longueur',   step: '0.1' },
                { id: 'dim_poids',      label: 'Poids g',       key: 'poids',      step: '1'   },
              ].map(({ id, label: l, key, step }) => (
                <div key={id}>
                  <label htmlFor={id} className={labelCls}>{l}</label>
                  <input id={id} name={id} type="number" step={step} min="0"
                    defaultValue={(product?.dimensions as any)?.[key] ?? ''} placeholder="—" className={inputCls} />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="materials" className={labelCls}>Matériaux / composition</label>
              <input id="materials" name="materials" type="text" defaultValue={product?.materials ?? ''}
                placeholder="Ex : Cuivre, résine époxy, plumes naturelles…" className={inputCls} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 05 — Images */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}>
        <Card>
          <CardHeader step={5} icon={Images} title="Photos" done={allImgs.length > 0} />
          <div className="p-7 space-y-6">

            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {existingImages.map(src => (
                  <motion.div key={src} layout className="relative group">
                    <img src={src} alt="" className="w-24 h-24 object-cover rounded-xl border border-neutral-100" />
                    <button type="button" onClick={() => setExistingImages(p => p.filter(i => i !== src))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                      <X size={11} strokeWidth={2} className="text-neutral-600" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Nouvelles images */}
            {newPreviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={labelCls}>{newPreviews.length} nouvelle{newPreviews.length > 1 ? 's' : ''}</span>
                  <button type="button" onClick={() => { if (fileRef.current) fileRef.current.value = ''; setNewPreviews([]) }}
                    className="text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1">
                    <Trash2 size={10} /> Annuler
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {newPreviews.map((url, i) => (
                    <motion.img key={i} src={url} alt="" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className="w-24 h-24 object-cover rounded-xl border border-neutral-100" />
                  ))}
                </div>
              </div>
            )}

            {/* Zone upload */}
            <label htmlFor="newImages"
              className="group flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white cursor-pointer transition-all">
              <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }}
                className="w-14 h-14 rounded-2xl bg-white shadow-md shadow-neutral-200 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Plus size={20} strokeWidth={1.5} className="text-neutral-400 group-hover:text-neutral-700 transition-colors" />
              </motion.div>
              <div className="text-center">
                <p className="text-[0.72rem] text-neutral-600 font-medium">Ajouter des photos</p>
                <p className="text-[0.62rem] text-neutral-400 mt-0.5">JPG, PNG, WebP · plusieurs fichiers acceptés</p>
              </div>
              <input id="newImages" name="newImages" type="file" ref={fileRef} multiple
                accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFiles} className="sr-only" />
            </label>
          </div>
        </Card>
      </motion.div>

      {/* 06 — Vidéo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}>
        <Card>
          <CardHeader step={6} icon={Film} title="Vidéo de présentation" done={!!(existingVideo || videoPreview)} />
          <div className="p-7 space-y-5">
            <p className="text-[0.68rem] text-neutral-400 leading-relaxed">
              Courte vidéo jouée en boucle sur la fiche. <span className="font-semibold text-neutral-600">3 à 5 secondes recommandées.</span>
            </p>

            {(existingVideo && !videoPreview) && (
              <div className="relative inline-block group">
                <video src={existingVideo} autoPlay muted loop playsInline className="w-40 h-28 object-cover rounded-xl" />
                <button type="button" onClick={removeVideo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                  <X size={11} strokeWidth={2} className="text-neutral-600" />
                </button>
                <input type="hidden" name="existingVideo" value={existingVideo} />
              </div>
            )}

            {videoPreview && (
              <div className="space-y-3">
                <div className="relative inline-block group">
                  <video src={videoPreview} autoPlay muted loop playsInline className="w-40 h-28 object-cover rounded-xl" />
                  {!videoUploading && (
                    <button type="button" onClick={removeVideo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                      <X size={11} strokeWidth={2} className="text-neutral-600" />
                    </button>
                  )}
                </div>
                {videoUploading && (
                  <div className="flex items-center gap-2 text-[0.68rem] text-neutral-500">
                    <span className="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                    Upload en cours vers Cloudinary…
                  </div>
                )}
                {videoUrl && !videoUploading && (
                  <p className="text-[0.68rem] text-green-600 flex items-center gap-1.5">
                    <Check size={11} /> Vidéo prête
                  </p>
                )}
              </div>
            )}
            {videoError && (
              <p className="text-[0.68rem] text-red-500">Erreur lors de l'upload. Réessayez.</p>
            )}

            <label htmlFor="video"
              className="group flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white cursor-pointer transition-all">
              <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }}
                className="w-14 h-14 rounded-2xl bg-white shadow-md shadow-neutral-200 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <VideoIcon size={20} strokeWidth={1.2} className="text-neutral-400 group-hover:text-neutral-700 transition-colors" />
              </motion.div>
              <div className="text-center">
                <p className="text-[0.72rem] text-neutral-600 font-medium">
                  {existingVideo && !videoPreview ? 'Remplacer la vidéo' : 'Ajouter une vidéo'}
                </p>
                <p className="text-[0.62rem] text-neutral-400 mt-0.5">MP4, WebM, MOV</p>
              </div>
              <input id="video" name="video" type="file" ref={videoRef}
                accept="video/mp4,video/webm,video/quicktime" onChange={handleVideo} className="sr-only" />
            </label>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="flex flex-wrap items-center gap-4 pt-2 pb-8">
        <motion.button
          type="submit" disabled={pending || videoUploading}
          whileHover={!pending ? { y: -1, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } : {}}
          whileTap={!pending && !videoUploading ? { scale: 0.98 } : {}}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-neutral-900 text-white text-[0.62rem] tracking-[0.2em] uppercase font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 shadow-lg shadow-neutral-900/20"
        >
          {videoUploading ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Vidéo en cours d'upload…</>
          ) : pending ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement…</>
          ) : (
            <><Upload size={14} strokeWidth={1.5} />{product ? 'Mettre à jour' : 'Créer le produit'}</>
          )}
        </motion.button>
        <a href={resolvedCancel} className="text-[0.62rem] tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors">
          Annuler
        </a>
      </motion.div>
    </div>
  )

  return (
    <>
      <PreviewModal open={modalOpen} onClose={() => setModalOpen(false)}
        name={pName} price={pPrice} description={pDesc} status={pStatus} universe={universe} imgs={allImgs} />
      <form action={formAction}>
        {showPreview ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8 items-start">
            <div>{formContent}</div>
            {sidePreview}
          </div>
        ) : formContent}
      </form>
    </>
  )
}
