'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Slight delay to let the animation start before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    } else {
      setValue('')
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const term = value.trim()
    if (!term) return
    setIsOpen(false)
    router.push(`/recherche?q=${encodeURIComponent(term)}`)
  }

  return (
    <>
      {/* Trigger button — same appearance as the original motion.button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.15 }}
        aria-label="Rechercher"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
      >
        <Search size={15} strokeWidth={1.5} />
      </motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-4"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-neutral-950 border border-neutral-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center">
                  <Search
                    size={15}
                    strokeWidth={1.5}
                    className="ml-5 text-neutral-500 shrink-0"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Rechercher une pièce..."
                    className="flex-1 bg-transparent px-4 py-5 text-neutral-100 placeholder-neutral-600 text-sm outline-none"
                  />
                  {value && (
                    <button
                      type="button"
                      aria-label="Effacer"
                      onClick={() => setValue('')}
                      className="p-2 mr-1 text-neutral-600 hover:text-neutral-300 transition-colors"
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-5 text-neutral-500 hover:text-neutral-100 transition-colors border-l border-neutral-800 text-[0.65rem] tracking-[0.2em] uppercase"
                  >
                    Chercher
                  </button>
                </div>
              </form>

              <p className="mt-3 text-center font-mono text-[0.58rem] tracking-[0.2em] uppercase text-neutral-700">
                Appuyez sur Échap pour fermer
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
