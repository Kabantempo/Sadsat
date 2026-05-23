'use client'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NewArrivalsButton() {
  return (
    <motion.div
      className="fixed bottom-8 left-8 z-40"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href="/nouveautes"
        aria-label="Voir les nouveautés"
        className="flex items-center gap-3 bg-neutral-900 text-white px-5 py-3.5 shadow-lg hover:bg-black transition-colors duration-200 select-none"
      >
        <Sparkles size={13} strokeWidth={1.5} />
        <span className="font-mono text-[0.58rem] tracking-[0.22em] uppercase">
          Nouveautés
        </span>
      </Link>
    </motion.div>
  )
}
