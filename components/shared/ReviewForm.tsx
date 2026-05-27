'use client'
import { useActionState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitReviewAction, type ReviewActionState } from '@/app/actions/reviews'
import { StarInput } from './StarRating'
import { CheckCircle, Send } from 'lucide-react'

type Props = {
  productId: string
  productName: string
  authorName: string
}

export default function ReviewForm({ productId, productName, authorName }: Props) {
  const [state, action, pending] = useActionState<ReviewActionState, FormData>(
    submitReviewAction,
    undefined
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state?.success])

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 py-5 px-6 bg-emerald-50 border border-emerald-100 rounded-xl"
      >
        <CheckCircle size={18} strokeWidth={1.5} className="text-emerald-500 shrink-0" />
        <p className="text-[0.82rem] text-emerald-700">
          Merci pour votre avis ! Il est maintenant visible sur la fiche produit.
        </p>
      </motion.div>
    )
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productName" value={productName} />

      <div>
        <label className="block text-[0.6rem] tracking-[0.14em] uppercase text-neutral-500 mb-3">
          Votre note
        </label>
        <StarInput name="rating" />
      </div>

      <div>
        <label className="block text-[0.6rem] tracking-[0.14em] uppercase text-neutral-500 mb-2">
          Votre avis
        </label>
        <textarea
          name="comment"
          required
          minLength={10}
          maxLength={1000}
          placeholder={`Partagez votre expérience avec "${productName}"…`}
          className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-[0.88rem] text-neutral-900 placeholder-neutral-400 outline-none resize-none transition-all focus:bg-white focus:border-neutral-400 focus:ring-4 focus:ring-neutral-900/5 h-28"
        />
      </div>

      <AnimatePresence>
        {state?.error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[0.78rem] text-red-500 bg-red-50 px-4 py-2 rounded-lg"
          >
            {state.error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[0.62rem] tracking-[0.16em] uppercase rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        <Send size={12} strokeWidth={1.5} />
        {pending ? 'Envoi…' : 'Publier mon avis'}
      </button>
    </form>
  )
}
