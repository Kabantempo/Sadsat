"use client";

import { useState } from "react";
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
  center: { x: "0%",   rotateY:   0, scale: 1,    opacity: 1,    zIndex: 10 },
  left:   { x: "-88%", rotateY:  48, scale: 0.72, opacity: 0.45, zIndex: 5  },
  right:  { x: "88%",  rotateY: -48, scale: 0.72, opacity: 0.45, zIndex: 5  },
  hidden: { x: "0%",   rotateY:   0, scale: 0.5,  opacity: 0,    zIndex: 0  },
} as const;

type Pos = keyof typeof VARS;

function getPos(i: number, current: number, n: number): Pos {
  const off = ((i - current) % n + n) % n;
  if (off === 0)     return "center";
  if (off === 1)     return "right";
  if (off === n - 1) return "left";
  return "hidden";
}

export default function ProductCarousel({
  items,
  theme = "light",
  aspectRatio = "portrait",
}: Props) {
  const [current, setCurrent] = useState(0);
  const n = items.length;
  const dark = theme === "dark";

  const go = (dir: -1 | 1) => setCurrent((c) => (c + dir + n) % n);

  return (
    <div>
      {/* Compteur */}
      <div className={`font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-8 ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
        {String(current + 1).padStart(2, "0")} — {String(n).padStart(2, "0")}
      </div>

      {/* Scène */}
      <div
        className="relative overflow-hidden h-[360px] md:h-[460px] lg:h-[520px]"
        style={{ perspective: "1100px" }}
      >
        {items.map((item, i) => {
          const pos = getPos(i, current, n);
          const isLeft   = pos === "left";
          const isRight  = pos === "right";
          const isCenter = pos === "center";

          return (
            <motion.div
              key={item.id}
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[38%] ${
                isLeft || isRight ? "cursor-pointer" : ""
              }`}
              animate={VARS[pos]}
              transition={{ duration: 0.55, ease }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                if (isLeft)  go(-1);
                if (isRight) go(1);
              }}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden ${
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                } ${
                  dark
                    ? "bg-neutral-900 border border-neutral-800"
                    : "bg-neutral-200"
                }`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${dark ? "text-neutral-800" : "text-neutral-300"}`}>
                    <span className="text-4xl">{dark ? "[ ]" : "✦"}</span>
                  </div>
                )}
              </div>

              {/* Texte — seulement sur la carte centrale */}
              {isCenter && (
                <div className="text-center mt-5">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`block mb-1 hover:opacity-60 transition-opacity ${
                        dark
                          ? "font-sans uppercase text-sm tracking-wider text-neutral-200"
                          : "font-serif italic text-xl text-neutral-900"
                      }`}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <div className={`mb-1 ${dark ? "font-sans uppercase text-sm tracking-wider text-neutral-200" : "font-serif italic text-xl text-neutral-900"}`}>
                      {item.title}
                    </div>
                  )}
                  {item.subtitle && (
                    <div className={`text-[0.65rem] tracking-widest uppercase opacity-50 ${dark ? "font-mono text-[#8b0000]" : ""}`}>
                      {item.subtitle}
                    </div>
                  )}
                  {item.price && (
                    <div className={`text-sm mt-1 ${dark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {item.price}
                    </div>
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
