'use client'
import { useActionState, useRef, useState } from 'react'
import { updateProfileAction, type ProfileFormState } from '@/app/actions/createur'
import { ImagePlus, X } from 'lucide-react'
import ChangePasswordForm from '@/components/shared/ChangePasswordForm'

export default function ProfilCreateurPage() {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    undefined
  )
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = ''
    setPreview(null)
  }

  const fieldClass =
    'w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-600'
  const labelClass = 'block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5'

  return (
    <div className="px-6 py-12 max-w-xl mx-auto">
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Espace Créateur
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-100 mb-10">
        Mon profil
      </h1>

      {state?.success && (
        <div className="mb-6 bg-green-950 border border-green-800 px-4 py-3 text-[0.72rem] text-green-400">
          {state.message}
        </div>
      )}
      {state?.message && !state.success && (
        <div className="mb-6 bg-red-950 border border-red-800 px-4 py-3 text-[0.72rem] text-red-400">
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-7">

        {/* Photo de profil */}
        <div>
          <p className={labelClass}>Photo de profil</p>
          <div className="flex items-center gap-5">
            {preview ? (
              <div className="relative w-20 h-20 shrink-0">
                <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute -top-1.5 -right-1.5 bg-neutral-800 border border-neutral-700 rounded-full p-0.5 hover:bg-red-900 transition-colors"
                >
                  <X size={11} strokeWidth={2} className="text-neutral-300" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <ImagePlus size={20} strokeWidth={1.2} className="text-neutral-600" />
              </div>
            )}
            <label
              htmlFor="avatar"
              className="cursor-pointer text-[0.62rem] tracking-[0.16em] uppercase border border-neutral-700 px-4 py-2 text-neutral-400 hover:text-neutral-100 hover:border-neutral-400 transition-colors"
            >
              {preview ? 'Changer' : 'Choisir une photo'}
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              ref={fileRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
              className="sr-only"
            />
          </div>
        </div>

        {/* Nom */}
        <div>
          <label htmlFor="name" className={labelClass}>Nom *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Votre nom ou pseudonyme"
            className={fieldClass}
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className={labelClass}>Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            placeholder="Parlez de votre démarche, vos inspirations, votre univers..."
            className={`${fieldClass} resize-none`}
          />
          <p className="mt-1 text-[0.6rem] text-neutral-600">
            Visible sur votre page publique et dans le carousel de l'accueil.
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 bg-neutral-100 text-neutral-900 text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-white transition-colors disabled:opacity-50"
        >
          {pending ? 'Enregistrement...' : 'Mettre à jour mon profil'}
        </button>
      </form>

      <div className="mt-10">
        <ChangePasswordForm />
      </div>
    </div>
  )
}
