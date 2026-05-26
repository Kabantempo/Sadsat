"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export type CreateurCard = {
  id: string;
  name: string;
  pseudo?: string;
  bio?: string;
  avatar?: string;
  universes: string[];
  instagram?: string;
};

type Props = { createurs: CreateurCard[] };

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function CreateurCarousel({ createurs }: Props) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const n = createurs.length;
  const touchStartX = useRef(0);

  if (n === 0) return null;

  const go = (dir: -1 | 1) => setCurrent((c) => (c + dir + n) % n);

  function getPos(i: number) {
    const off = ((i - current) % n + n) % n;
    if (off === 0) return "center";
    if (off === 1) return "right";
    if (off === n - 1) return "left";
    return "hidden";
  }

  const VARS = {
    center: { x: "-50%",   rotateY:   0, scale: 1,    opacity: 1,    zIndex: 10 },
    left:   { x: "-130%",  rotateY:  40, scale: 0.75, opacity: 0.5,  zIndex: 5  },
    right:  { x: "30%",    rotateY: -40, scale: 0.75, opacity: 0.5,  zIndex: 5  },
    hidden: { x: "-50%",   rotateY:   0, scale: 0.5,  opacity: 0,    zIndex: 0  },
  } as const;

  return (
    <div className="mt-20">
      <p className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-neutral-500 text-center mb-12">
        Nos créateurs
      </p>

      {/* Compteur */}
      <div className="font-mono text-[0.58rem] tracking-[0.3em] uppercase text-neutral-500 text-center mb-8">
        {String(current + 1).padStart(2, "0")} — {String(n).padStart(2, "0")}
      </div>

      {/* Scène */}
      <div
        className="relative overflow-x-hidden h-[520px] md:h-[600px]"
        style={{ perspective: "1000px" }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const dx = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1)
        }}
      >
        {createurs.map((c, i) => {
          const pos = getPos(i);
          return (
            <motion.div
              key={c.id}
              className={`absolute top-0 left-1/2 w-[38%] md:w-[28%] cursor-pointer`}
              animate={VARS[pos]}
              transition={{ duration: 0.5, ease }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                if (pos === "left")   go(-1);
                else if (pos === "right")  go(1);
                else if (pos === "center") router.push(`/createurs/${c.id}`);
              }}
            >
              {/* Photo / Avatar */}
              <div className={`relative aspect-[3/4] overflow-hidden bg-neutral-800 rounded-xl ${pos === "center" ? "group" : ""}`}>
                {c.avatar ? (
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    fill
                    className={`object-cover ${pos === "center" ? "group-hover:scale-105 transition-transform duration-500" : ""}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-serif text-neutral-500">
                      {(c.pseudo ?? c.name).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Infos — seulement sur la carte centrale */}
              {pos === "center" && (
                <div className="text-center mt-5">
                  <p className="font-serif italic text-xl text-neutral-100 hover:opacity-60 transition-opacity mb-1">
                    {c.pseudo ?? c.name}
                  </p>
                  {c.bio && (
                    <p className="text-[0.68rem] text-neutral-500 leading-relaxed max-w-[200px] mx-auto mb-3 line-clamp-2">
                      {c.bio}
                    </p>
                  )}
                  {c.universes.length > 0 && (
                    <p className="text-[0.58rem] tracking-[0.18em] uppercase text-neutral-600 mb-3">
                      {c.universes.join(" · ")}
                    </p>
                  )}
                  {c.instagram && (
                    <a
                      href={`https://instagram.com/${c.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block text-[0.62rem] text-neutral-500 hover:text-pink-400 transition-colors mb-3"
                    >
                      @{c.instagram}
                    </a>
                  )}
                  <span className="inline-block text-[0.58rem] tracking-[0.2em] uppercase pb-0.5 border-b border-neutral-600 hover:border-neutral-200 transition-colors text-neutral-400 hover:text-neutral-100">
                    Voir ses créations →
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Points */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {createurs.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Créateur ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "bg-neutral-300 w-5 h-[3px]" : "bg-neutral-600 w-[3px] h-[3px]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
