"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export type CarouselItem = {
  id: string | number;
  image?: string;
  title: string;
  subtitle?: string;
  price?: string;
  href?: string;
};

type Props = {
  items: CarouselItem[];
  theme?: "light" | "dark";
  aspectRatio?: "portrait" | "square";
};

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const VARS = {
  center: { x: "-50%",   rotateY:   0, scale: 1,    opacity: 1,   zIndex: 10 },
  left:   { x: "-130%",  rotateY:  40, scale: 0.75, opacity: 0.5, zIndex: 5  },
  right:  { x: "30%",    rotateY: -40, scale: 0.75, opacity: 0.5, zIndex: 5  },
  hidden: { x: "-50%",   rotateY:   0, scale: 0.5,  opacity: 0,   zIndex: 0  },
} as const;

type Pos = keyof typeof VARS;

function getPos(i: number, current: number, n: number): Pos {
  const off = ((i - current) % n + n) % n;
  if (off === 0)      return "center";
  if (off === 1)      return "right";
  if (off === n - 1)  return "left";
  return "hidden";
}

export default function ProductCarousel({
  items,
  theme = "light",
  aspectRatio = "portrait",
}: Props) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const n = items.length;
  const dark = theme === "dark";

  const go = (dir: -1 | 1) => setCurrent((c) => (c + dir + n) % n);

  return (
    <div>
      {/* Compteur */}
      <div className={`font-mono text-[0.58rem] tracking-[0.3em] uppercase text-center mb-8 ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
        {String(current + 1).padStart(2, "0")} — {String(n).padStart(2, "0")}
      </div>

      {/* Scène */}
      <div
        className="relative overflow-hidden h-[340px] md:h-[420px]"
        style={{ perspective: "1000px" }}
      >
        {items.map((item, i) => {
          const pos = getPos(i, current, n);
          const isLeft   = pos === "left";
          const isRight  = pos === "right";
          const isCenter = pos === "center";

          return (
            <motion.div
              key={item.id}
              className={`absolute top-0 left-1/2 w-[38%] md:w-[28%] cursor-pointer`}
              animate={VARS[pos]}
              transition={{ duration: 0.5, ease }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                if (isLeft)  go(-1);
                if (isRight) go(1);
              }}
            >
              {/* Image — cliquable via Link sur la carte centrale */}
              {isCenter && item.href ? (
                <Link href={item.href} className={`block relative overflow-hidden group ${aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"} ${dark ? "bg-neutral-800" : "bg-neutral-200"}`}>
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
                      <span className="text-4xl">✦</span>
                    </div>
                  )}
                </Link>
              ) : (
                <div className={`relative overflow-hidden ${aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"} ${dark ? "bg-neutral-800" : "bg-neutral-200"}`}>
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
                      <span className="text-4xl">✦</span>
                    </div>
                  )}
                </div>
              )}

              {/* Infos — seulement sur la carte centrale */}
              {isCenter && (
                <div className="text-center mt-5">
                  <p className={`font-serif italic text-xl mb-1 ${
                    item.href ? "hover:opacity-60 transition-opacity" : ""
                  } ${dark ? "text-neutral-100" : "text-neutral-900"}`}>
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className={`text-[0.62rem] tracking-[0.16em] uppercase mb-2 ${dark ? "text-neutral-500" : "text-neutral-500"}`}>
                      {item.subtitle}
                    </p>
                  )}
                  {item.price && (
                    <p className={`text-[0.82rem] mb-3 ${dark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {item.price}
                    </p>
                  )}
                  {item.href && (
                    <span className={`inline-block text-[0.58rem] tracking-[0.2em] uppercase pb-0.5 border-b transition-colors ${
                      dark
                        ? "border-neutral-600 hover:border-neutral-200 text-neutral-400 hover:text-neutral-100"
                        : "border-neutral-400 hover:border-neutral-900 text-neutral-500 hover:text-neutral-900"
                    }`}>
                      Voir la pièce →
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Points de navigation */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Pièce ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? `${dark ? "bg-neutral-300" : "bg-neutral-800"} w-5 h-[3px]`
                : `${dark ? "bg-neutral-600" : "bg-neutral-300"} w-[3px] h-[3px]`
            }`}
          />
        ))}
      </div>
    </div>
  );
}
