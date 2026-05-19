"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { BRAND_PORTALS, type BrandPortal } from "@/lib/definitions";

function BrandLine({ brand, scrollYProgress, index }: {
  brand: BrandPortal;
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const start = 0.72 + index * 0.05;
  const end   = start + 0.10;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y       = useTransform(scrollYProgress, [start, end], ["18px", "0px"]);

  return (
    <motion.div style={{ opacity, y }} className="text-center">
      <span className="font-serif italic text-3xl md:text-5xl" style={{ color: brand.color }}>
        {brand.label}
      </span>
      <span
        className="font-mono text-[0.5rem] tracking-[0.22em] uppercase ml-4 hidden md:inline"
        style={{ color: brand.accent, opacity: 0.65 }}
      >
        {brand.subtitle}
      </span>
    </motion.div>
  );
}

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scène 1 — titre
  const s1TitleY       = useTransform(scrollYProgress, [0, 0.28], ["0%", "-18%"]);
  const s1TitleOpacity = useTransform(scrollYProgress, [0, 0.20, 0.28], [1, 1, 0]);
  const s1SubOpacity   = useTransform(scrollYProgress, [0, 0.16, 0.26], [1, 1, 0]);
  const s1SubY         = useTransform(scrollYProgress, [0, 0.28], ["0%", "-24%"]);

  // Scène 2 — révélation
  const s2Opacity   = useTransform(scrollYProgress, [0.22, 0.34, 0.64, 0.74], [0, 1, 1, 0]);
  const maskY       = useTransform(scrollYProgress, [0.28, 0.58], ["100%", "0%"]);
  const textX       = useTransform(scrollYProgress, [0.42, 0.60], ["50px", "0px"]);
  const textOpacity = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);
  const lineScale   = useTransform(scrollYProgress, [0.40, 0.56], [0, 1]);

  // Scène 3 — marques
  const s3Opacity = useTransform(scrollYProgress, [0.68, 0.78, 0.95, 1], [0, 1, 1, 0]);

  // Indicateur scroll + barre progression
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-neutral-950">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── SCÈNE 1 — Grand titre ── */}
        <motion.div
          style={{ opacity: s1TitleOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.p
            style={{ y: s1SubY, opacity: s1SubOpacity }}
            className="font-mono text-[0.58rem] tracking-[0.4em] uppercase text-neutral-600 mb-8"
          >
            SADSAT — Collectif
          </motion.p>
          <motion.h2
            style={{ y: s1TitleY }}
            className="font-serif font-light text-[13vw] md:text-[9vw] leading-none text-neutral-100 text-center px-6"
          >
            Un collectif.
          </motion.h2>
          <motion.p
            style={{ y: s1TitleY, opacity: s1SubOpacity }}
            className="font-serif italic text-neutral-500 text-lg md:text-2xl mt-6"
          >
            Plusieurs univers, une vision partagée.
          </motion.p>
        </motion.div>

        {/* ── SCÈNE 2 — Révélation image + texte ── */}
        <motion.div
          style={{ opacity: s2Opacity }}
          className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 pointer-events-none"
        >
          {/* Gauche : visuel révélé de haut en bas */}
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950">
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 40px, rgba(255,255,255,0.04) 40px, rgba(255,255,255,0.04) 41px), repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(255,255,255,0.04) 40px, rgba(255,255,255,0.04) 41px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[22vw] text-neutral-800 select-none leading-none pointer-events-none">
                  S
                </span>
              </div>
            </div>
            {/* Masque qui glisse vers le bas = révèle l'image depuis le haut */}
            <motion.div
              style={{ y: maskY }}
              className="absolute inset-0 bg-neutral-950"
            />
          </div>

          {/* Droite : texte qui glisse de la droite */}
          <div className="relative h-full flex flex-col justify-center px-10 md:px-16">
            <motion.div style={{ x: textX, opacity: textOpacity }}>
              <motion.div
                style={{ scaleX: lineScale }}
                className="w-10 h-px bg-neutral-600 mb-8 origin-left"
              />
              <p className="font-mono text-[0.56rem] tracking-[0.28em] uppercase text-neutral-500 mb-5">
                Notre histoire
              </p>
              <p className="font-serif italic text-2xl md:text-3xl text-neutral-100 leading-relaxed mb-6">
                SADSAT est né d'un dialogue<br />
                entre créateurs indépendants.
              </p>
              <p className="text-[0.84rem] leading-relaxed text-neutral-400 max-w-sm">
                Taxidermie éthique, bijoux en maille métallique,
                bougies artisanales, habillement upcyclé —
                chaque marque garde sa voix, son univers, son identité.
                Ensemble, elles forment un collectif singulier.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── SCÈNE 3 — Marques en cascade ── */}
        <motion.div
          style={{ opacity: s3Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 md:gap-7 px-8 pointer-events-none"
        >
          <p className="font-mono text-[0.56rem] tracking-[0.32em] uppercase text-neutral-600 mb-2">
            Les univers
          </p>
          {BRAND_PORTALS.map((brand, i) => (
            <BrandLine
              key={brand.slug}
              brand={brand}
              scrollYProgress={scrollYProgress}
              index={i}
            />
          ))}
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          style={{ opacity: arrowOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.54rem] tracking-[0.35em] uppercase text-neutral-600 animate-bounce"
        >
          ↓ scroll
        </motion.div>

        {/* Barre de progression en bas */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 right-0 h-px bg-neutral-700 origin-left"
        />
      </div>
    </div>
  );
}
