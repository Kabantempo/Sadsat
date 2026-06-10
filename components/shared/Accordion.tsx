'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export type AccordionItem = { question: string; answer: string }

const ease = [0.22, 1, 0.36, 1] as const

export default function Accordion({
  items,
  theme = 'light',
}: {
  items: AccordionItem[]
  theme?: 'light' | 'dark'
}) {
  const [open, setOpen] = useState<number | null>(null)
  const light = theme === 'light'

  return (
    <div className={`border-t ${light ? 'border-neutral-200 dark:border-neutral-800' : 'border-neutral-800'}`}>
      {items.map((item, i) => (
        <div key={i} className={`border-b ${light ? 'border-neutral-200 dark:border-neutral-800' : 'border-neutral-800'}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-5 flex items-start justify-between gap-6 group"
          >
            <span
              className={`text-[0.84rem] leading-snug tracking-[0.02em] transition-opacity duration-200 ${
                light
                  ? 'text-neutral-800 dark:text-neutral-200 group-hover:opacity-60'
                  : 'text-neutral-200 group-hover:opacity-60'
              }`}
            >
              {item.question}
            </span>
            <span className={`shrink-0 mt-0.5 transition-opacity ${light ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-600'}`}>
              {open === i ? (
                <Minus size={14} strokeWidth={1.5} />
              ) : (
                <Plus size={14} strokeWidth={1.5} />
              )}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <p
                  className={`pb-6 text-[0.82rem] leading-[1.75] ${
                    light ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-400'
                  }`}
                >
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
