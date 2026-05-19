"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import MatrixRain from "@/components/shared/MatrixRain";
import { BRAND_PORTALS } from "@/lib/definitions";
import { TaxidermieAnim, BijouxAnim, HackcycleAnim } from "@/components/shared/BrandAnimations";

function BrandPanel({ brand }: { brand: typeof BRAND_PORTALS[0] }) {
  const anim =
    brand.special === "matrix" ? <MatrixRain /> :
    brand.slug === "taxidermie" ? <TaxidermieAnim /> :
    brand.slug === "bijoux" ? <BijouxAnim /> :
    brand.slug === "habillement" ? <HackcycleAnim /> :
    null;

  const titleClass =
    brand.font === "serif"
      ? "font-serif italic font-normal text-4xl md:text-5xl mb-3 transition-all duration-500 group-hover:tracking-wider"
      : brand.font === "mono"
      ? "font-mono font-normal text-4xl md:text-5xl mb-3"
      : "font-sans font-bold uppercase text-4xl md:text-5xl mb-3 tracking-wider";

  const inner = (
    <div
      className="relative z-10 text-center px-6 transition-transform duration-700 group-hover:scale-105"
      style={{ color: brand.color }}
    >
      <h2
        className={titleClass}
        style={
          brand.font === "sans"
            ? { textShadow: `2px 0 ${brand.accent}, -2px 0 #1a1a1a` }
            : undefined
        }
      >
        {brand.label}
      </h2>
      <p
        className="text-[0.7rem] tracking-[0.25em] uppercase"
        style={{ color: brand.accent, opacity: 0.7 }}
      >
        {brand.subtitle}
      </p>
      {brand.cta && !brand.special ? (
        <p
          className="inline-block mt-8 text-[0.65rem] tracking-[0.35em] uppercase pb-1 border-b border-current opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
          style={{ color: brand.color }}
        >
          {brand.cta} →
        </p>
      ) : (
        <div
          className="inline-flex items-center gap-2 mt-6 border px-4 py-2"
          style={{ borderColor: `${brand.accent}66`, color: brand.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">En cours</span>
        </div>
      )}
    </div>
  );

  const panelClass =
    "relative group flex items-center justify-center flex-1 min-h-[60vh] md:min-h-screen overflow-hidden transition-all duration-700";

  if (brand.cta && !brand.special) {
    return (
      <Link
        href={`/${brand.slug}`}
        className={panelClass}
        style={{ background: brand.bg }}
      >
        {anim}
        {inner}
      </Link>
    );
  }

  return (
    <div className={`${panelClass} cursor-default`} style={{ background: brand.bg }}>
      {anim}
      {inner}
    </div>
  );
}

export default function HeroSection() {
  const subtitle = BRAND_PORTALS.map((b) => b.label).join(" · ");

  const cols =
    BRAND_PORTALS.length === 2 ? "md:grid-cols-2" :
    BRAND_PORTALS.length === 3 ? "md:grid-cols-3" :
    BRAND_PORTALS.length === 4 ? "md:grid-cols-4" :
    "md:grid-cols-3 lg:grid-cols-4";

  return (
    <>
      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-neutral-900 to-black relative">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-serif font-light text-5xl md:text-7xl tracking-wide text-neutral-100 mb-4"
        >
          Un collectif, plusieurs univers.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase text-neutral-400"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 text-[0.65rem] tracking-[0.4em] uppercase text-neutral-400"
        >
          ↓ Découvrir
        </motion.div>
      </section>

      {/* 4 PANNEAUX */}
      <section className={`grid grid-cols-1 ${cols}`}>
        {BRAND_PORTALS.map((brand) => (
          <BrandPanel key={brand.slug} brand={brand} />
        ))}
      </section>
    </>
  );
}
