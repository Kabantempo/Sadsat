"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import MatrixRain from "@/components/shared/MatrixRain";
import { BRAND_PORTALS } from "@/lib/definitions";
import { TaxidermieAnim, BijouxAnim, HackcycleAnim } from "@/components/shared/BrandAnimations";
import { Waves } from "@/components/ui/wave-background";

function getAnim(slug: string, special?: string) {
  if (special === "matrix")   return <MatrixRain />;
  if (slug === "taxidermie")  return <TaxidermieAnim />;
  if (slug === "bijoux")      return <BijouxAnim />;
  if (slug === "habillement") return <HackcycleAnim />;
  return null;
}

export default function HeroSection() {
  const subtitle = BRAND_PORTALS.map((b) => b.label).join(" · ");

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-neutral-900 to-black relative overflow-hidden">
        <Waves strokeColor="rgba(255,255,255,0.10)" backgroundColor="transparent" pointerSize={0} />

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 font-serif font-light leading-[0.88] tracking-tight text-center px-6 mb-8"
          style={{ fontSize: "clamp(2.8rem, 8.5vw, 7rem)" }}
        >
          <span className="block italic text-neutral-50">Un collectif,</span>
          <span className="block text-neutral-500">plusieurs univers.</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
          className="relative z-10 w-10 h-px bg-neutral-700 mx-auto mb-7 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.45, y: 0 }}
          transition={{ duration: 1.2, delay: 0.65 }}
          className="relative z-10 font-mono text-[0.55rem] md:text-[0.65rem] tracking-[0.55em] uppercase text-neutral-400"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 z-10 font-mono text-[0.6rem] tracking-[0.4em] uppercase text-neutral-600"
        >
          ↓ Découvrir
        </motion.div>
      </section>

      {/* ── GRILLE 2×2 ──────────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-5 p-5 bg-neutral-950 min-h-screen"
      >
        {BRAND_PORTALS.map((brand) => {
          const anim = getAnim(brand.slug, brand.special);

          const titleClass =
            brand.font === "serif" ? "font-serif italic font-light" :
            brand.font === "mono"  ? "font-mono" :
            "font-sans font-bold uppercase tracking-wider";

          const cell = (
            <div
              className="relative w-full h-full overflow-hidden rounded-[2rem] group"
              style={{ background: brand.bg }}
            >
              {/* Animation de marque en fond */}
              {anim}

              {/* Voile sombre — s'allège au survol */}
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/25 transition-colors duration-500 backdrop-blur-[3px]" />

              {/* Teinte de marque au survol */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none"
                style={{ background: brand.color }}
              />

              {/* Contenu centré */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">

                <span
                  className="font-mono text-[0.4rem] md:text-[0.48rem] tracking-[0.4em] uppercase mb-3"
                  style={{ color: brand.accent, opacity: 0.5 }}
                >
                  {brand.index}
                </span>

                <h2
                  className={titleClass}
                  style={{
                    color: brand.color,
                    fontSize: "clamp(1.5rem, 3.2vw, 3.4rem)",
                    marginBottom: "0.55rem",
                    ...(brand.font === "sans"
                      ? { textShadow: `1px 0 ${brand.accent}, -1px 0 #0a0a0a` }
                      : {}),
                  }}
                >
                  {brand.label}
                </h2>

                <p
                  className="font-mono text-[0.44rem] md:text-[0.52rem] tracking-[0.2em] uppercase mb-5"
                  style={{ color: brand.accent, opacity: 0.45 }}
                >
                  {brand.subtitle}
                </p>

                {/* CTA — monte au survol */}
                <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {brand.cta && !brand.special ? (
                    <span
                      className="font-mono text-[0.46rem] md:text-[0.54rem] tracking-[0.32em] uppercase pb-px border-b"
                      style={{ color: brand.color, borderColor: `${brand.accent}66` }}
                    >
                      {brand.cta} →
                    </span>
                  ) : (
                    <div className="flex items-center gap-2" style={{ color: brand.color }}>
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse opacity-50" />
                      <span className="font-mono text-[0.42rem] tracking-[0.3em] uppercase opacity-35">
                        Bientôt
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

          if (brand.cta && !brand.special) {
            return (
              <Link key={brand.slug} href={`/${brand.slug}`}>
                {cell}
              </Link>
            );
          }

          return (
            <div key={brand.slug}>
              {cell}
            </div>
          );
        })}
      </section>
    </>
  );
}
