"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { BRAND_PORTALS, type BrandPortal } from "@/lib/definitions";

// ── Scene 3 : carte de marque ─────────────────────────────────────────────────
function BrandCard({ brand, scrollYProgress, index }: {
  brand: BrandPortal;
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const start   = Math.min(0.78 + index * 0.04, 0.88);
  const end     = Math.min(start + 0.16, 1.0);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale   = useTransform(scrollYProgress, [start, end], [0.94, 1]);

  const inner = (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
      <span
        className="font-mono text-[0.48rem] tracking-[0.3em] uppercase mb-3"
        style={{ color: brand.accent, opacity: 0.55 }}
      >
        {brand.index}
      </span>
      <h3
        className={
          brand.font === "serif"
            ? "font-serif italic text-2xl md:text-3xl mb-2 leading-tight"
            : brand.font === "mono"
            ? "font-mono text-xl md:text-2xl mb-2 leading-tight"
            : "font-sans font-bold uppercase text-lg md:text-2xl mb-2 tracking-wider leading-tight"
        }
        style={{ color: brand.color }}
      >
        {brand.label}
      </h3>
      <p
        className="font-mono text-[0.52rem] tracking-[0.18em] uppercase leading-relaxed"
        style={{ color: brand.accent, opacity: 0.55 }}
      >
        {brand.subtitle}
      </p>
      {brand.cta && !brand.special && (
        <span
          className="font-mono text-[0.5rem] tracking-[0.22em] uppercase mt-5 pb-px border-b"
          style={{ color: brand.color, borderColor: `${brand.accent}55` }}
        >
          {brand.cta} →
        </span>
      )}
      {(!brand.cta || brand.special) && (
        <span
          className="font-mono text-[0.48rem] tracking-[0.2em] uppercase mt-5 opacity-30"
          style={{ color: brand.color }}
        >
          Bientôt
        </span>
      )}
    </div>
  );

  const cardClass = "relative rounded-xl overflow-hidden aspect-square";

  return (
    <motion.div style={{ opacity, scale }}>
      {brand.cta && !brand.special ? (
        <Link
          href={`/${brand.slug}`}
          className={`${cardClass} block pointer-events-auto hover:brightness-110 transition-all duration-300`}
          style={{ background: brand.bg }}
        >
          {inner}
        </Link>
      ) : (
        <div className={cardClass} style={{ background: brand.bg }}>
          {inner}
        </div>
      )}
    </motion.div>
  );
}

// ── Scene 3 with instagrams ────────────────────────────────────────────────────
function InstaLine({ creator, scrollYProgress, index }: {
  creator: { name: string; handle: string };
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const start = Math.min(0.78 + index * 0.06, 0.89);
  const end   = Math.min(start + 0.10, 1.0);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y       = useTransform(scrollYProgress, [start, end], ["18px", "0px"]);

  return (
    <motion.div style={{ opacity, y }} className="text-center">
      <a
        href={`https://instagram.com/${creator.handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-serif italic text-3xl md:text-5xl text-neutral-100 hover:text-neutral-400 transition-colors pointer-events-auto"
      >
        @{creator.handle}
      </a>
      <span className="font-mono text-[0.5rem] tracking-[0.22em] uppercase ml-4 hidden md:inline text-neutral-600">
        {creator.name}
      </span>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function ScrollStory({
  instagrams,
}: {
  instagrams?: Array<{ name: string; handle: string }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scène 1 — titre (dwell until ~35%)
  const s1TitleY       = useTransform(scrollYProgress, [0, 0.35], ["0%", "-18%"]);
  const s1TitleOpacity = useTransform(scrollYProgress, [0, 0.24, 0.33], [1, 1, 0]);
  const s1SubOpacity   = useTransform(scrollYProgress, [0, 0.20, 0.30], [1, 1, 0]);
  const s1SubY         = useTransform(scrollYProgress, [0, 0.35], ["0%", "-24%"]);

  // Scène 2 — révélation (démarre à 0.35, gris + texte arrivent ensemble)
  const s2Opacity   = useTransform(scrollYProgress, [0.35, 0.44, 0.72, 0.80], [0, 1, 1, 0]);
  const maskY       = useTransform(scrollYProgress, [0.35, 0.52], ["0%", "100%"]);
  const lineScale   = useTransform(scrollYProgress, [0.36, 0.50], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.40, 0.52], [0, 1]);
  const textX       = useTransform(scrollYProgress, [0.40, 0.53], ["50px", "0px"]);

  // Scène 3 — instagram / marques (démarre à 0.78)
  const s3Opacity = useTransform(scrollYProgress, [0.78, 0.86, 0.95, 1], [0, 1, 1, 0]);

  // Indicateur scroll
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  const showInstas = instagrams && instagrams.length > 0;

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-neutral-950">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── SCÈNE 1 — Grand titre ── */}
        <motion.div
          style={{ opacity: s1TitleOpacity }}
          className="absolute inset-0 z-10 bg-neutral-950 flex flex-col items-center justify-center pointer-events-none"
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
          className="absolute inset-0 z-20 bg-neutral-950 grid grid-cols-1 md:grid-cols-2 pointer-events-none"
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
            </div>
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
                bougies artisanales, mode Hackcycle —
                chaque marque garde sa voix, son univers, son identité.
                Ensemble, elles forment un collectif singulier.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── SCÈNE 3 — Grille univers (+ instagrams si dispo) ── */}
        <motion.div
          style={{ opacity: s3Opacity }}
          className="absolute inset-0 z-30 bg-neutral-950 flex flex-col items-center justify-center px-8 pointer-events-none"
        >
          <p className="font-mono text-[0.52rem] tracking-[0.36em] uppercase text-neutral-600 mb-8">
            {showInstas ? "Nous suivre" : "Nos univers"}
          </p>

          {showInstas ? (
            <div className="flex flex-col items-center gap-5 md:gap-6">
              {instagrams.map((creator, i) => (
                <InstaLine
                  key={creator.handle}
                  creator={creator}
                  scrollYProgress={scrollYProgress}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {BRAND_PORTALS.map((brand, i) => (
                <BrandCard
                  key={brand.slug}
                  brand={brand}
                  scrollYProgress={scrollYProgress}
                  index={i}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          style={{ opacity: arrowOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.54rem] tracking-[0.35em] uppercase text-neutral-600 animate-bounce"
        >
          ↓ scroll
        </motion.div>

        {/* Barre de progression */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 right-0 h-px bg-neutral-700 origin-left"
        />
      </div>
    </div>
  );
}
