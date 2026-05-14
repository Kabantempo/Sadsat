'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Material = {
  id: string
  label: string
  color: string
  title: string
  description: string
  properties: string[]
}

const MATERIALS: Material[] = [
  {
    id: 'argent',
    label: 'Argent sterling',
    color: '#c0c0c0',
    title: 'Argent sterling 925',
    description:
      "L'argent sterling est composé à 92,5 % d'argent pur, allié pour une résistance accrue. Il développe une patine naturelle avec le temps — une signature vivante de la pièce. Idéal pour les peaux sensibles, il est hypoallergénique dans sa version non traitée.",
    properties: ['Hypoallergénique', 'Patine naturelle', 'Haute résistance', 'Recyclable'],
  },
  {
    id: 'laiton',
    label: 'Laiton',
    color: '#b5a642',
    title: 'Laiton brut',
    description:
      "Alliage de cuivre et de zinc, le laiton offre une chaleur dorée qui s'intensifie avec le temps. Sa malléabilité permet des mailles très fines et des textures complexes. Non traité, il se patine progressivement — chaque pièce devient unique.",
    properties: ['Chaleur dorée', 'Très malléable', 'Patine évolutive', 'Abordable'],
  },
  {
    id: 'cuivre',
    label: 'Cuivre oxydé',
    color: '#4a7c59',
    title: 'Cuivre oxydé',
    description:
      "Oxydé à la main avec des solutions naturelles, le cuivre prend des teintes allant du brun profond au vert-de-gris. Aucune pièce n'est identique à la suivante. Le cuivre a des propriétés antibactériennes naturelles et développe une patine que l'on appelle le vert-de-gris.",
    properties: ['Teintes uniques', 'Propriétés antimicrobiennes', 'Oxydation artisanale', 'Caractère brut'],
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function MaterialTabs() {
  const [active, setActive] = useState(0)
  const mat = MATERIALS[active]

  return (
    <div>
      {/* Onglets */}
      <div className="flex gap-0 border-b border-neutral-800 mb-8">
        {MATERIALS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setActive(i)}
            className={`relative px-5 py-3 text-[0.6rem] tracking-[0.18em] uppercase transition-colors duration-200 ${
              active === i ? 'text-neutral-100' : 'text-neutral-600 hover:text-neutral-400'
            }`}
          >
            {m.label}
            {active === i && (
              <motion.div
                layoutId="mat-underline"
                className="absolute bottom-0 inset-x-0 h-px bg-[#8b0000]"
                transition={{ duration: 0.25, ease }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mat.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease }}
          className="grid md:grid-cols-[1fr_auto] gap-8 items-start"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                style={{ backgroundColor: mat.color }}
              />
              <h3 className="text-[0.72rem] tracking-[0.2em] uppercase text-neutral-300">{mat.title}</h3>
            </div>
            <p className="text-[0.84rem] leading-[1.8] text-neutral-400 mb-5">{mat.description}</p>
            <div className="flex flex-wrap gap-2">
              {mat.properties.map((p) => (
                <span
                  key={p}
                  className="text-[0.58rem] tracking-[0.14em] uppercase border border-neutral-800 px-3 py-1 text-neutral-500"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Swatch agrandi */}
          <div
            className="w-24 h-24 rounded-full border border-white/5 shrink-0 hidden md:block"
            style={{
              backgroundColor: mat.color,
              boxShadow: `0 0 40px ${mat.color}33`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
