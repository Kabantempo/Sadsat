'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

type DisplayProps = { rating: number; size?: number; className?: string }

export function StarDisplay({ rating, size = 14, className = '' }: DisplayProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          strokeWidth={1.5}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
        />
      ))}
    </div>
  )
}

type InputProps = {
  name: string
  defaultValue?: number
}

export function StarInput({ name, defaultValue = 0 }: InputProps) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(defaultValue)

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={selected} />
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setSelected(s)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${s} étoile${s > 1 ? 's' : ''}`}
        >
          <Star
            size={24}
            strokeWidth={1.5}
            className={
              s <= (hovered || selected)
                ? 'fill-amber-400 text-amber-400'
                : 'text-neutral-300'
            }
          />
        </button>
      ))}
      {selected > 0 && (
        <span className="ml-2 text-[0.68rem] text-neutral-500">
          {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][selected]}
        </span>
      )}
    </div>
  )
}
