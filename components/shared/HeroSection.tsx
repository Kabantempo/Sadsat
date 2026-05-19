"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import MatrixRain from "@/components/shared/MatrixRain";
import { BRAND_PORTALS, type BrandPortal } from "@/lib/definitions";

function BrandPanel({ brand, index, total }: { brand: BrandPortal; index: number; total: number }) {
  const isMatrix = brand.special === 'matrix';
  const isComingSoon = brand.special === 'comingSoon';

  const titleClass =
    brand.font === 'serif'
      ? 'font-serif italic font-normal text-4xl md:text-5xl mb-3 transition-all duration-500 group-hover:tracking-wider'
      : brand.font === 'mono'
      ? 'font-mono font-normal text-4xl md:text-5xl mb-3'
      : 'font-sans font-bold uppercase text-4xl md:text-5xl mb-3 tracking-wider';

  const panelStyle = { background: brand.bg, color: brand.color };

  const inner = (
    <div
      className="relative text-center px-8 transition-transform duration-700 group-hover:scale-105"
      style={{ color: brand.color }}
    >
      <h2
        className={titleClass}
        style={brand.font === 'sans' ? { textShadow: `2px 0 ${brand.accent}, -2px 0 #1a1a1a` } : undefined}
      >
        {brand.label}
      </h2>
      <div className="text-[0.7rem] tracking-[0.25em] uppercase opacity-70">
        {brand.subtitle}
      </div>
      {isComingSoon ? (
        <div
          className="inline-flex items-center gap-2 mt-6 border px-4 py-2"
          style={{ borderColor: `${brand.accent}66` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">En cours</span>
        </div>
      ) : brand.cta ? (
        <div className="inline-block mt-8 text-[0.65rem] tracking-[0.35em] uppercase pb-1 border-b border-current opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {brand.cta} →
        </div>
      ) : (
        <div
          className="inline-flex items-center gap-2 mt-6 border px-4 py-2"
          style={{ borderColor: `${brand.accent}66` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">En cours</span>
        </div>
      )}
    </div>
  );

  const panelClass = `relative overflow-hidden group flex items-center justify-center min-h-[60vh] md:min-h-screen`;

  if (isComingSoon || (!brand.cta && !isMatrix)) {
    return (
      <div className={`${panelClass} cursor-default`} style={panelStyle}>
        {isMatrix && <MatrixRain />}
        <div className="relative z-10">{inner}</div>
      </div>
    );
  }

  if (isMatrix) {
    return (
      <div className={`${panelClass} cursor-default`} style={panelStyle}>
        <MatrixRain />
        <div className="relative z-10">{inner}</div>
      </div>
    );
  }

  return (
    <Link
      href={`/${brand.slug}`}
      className={`${panelClass} transition-all duration-700`}
      style={panelStyle}
    >
      {brand.slug === 'bijoux' && (
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent 0 6px, rgba(139,0,0,0.04) 6px 7px), radial-gradient(circle at 30% 70%, rgba(139,0,0,0.15), transparent 60%)',
          }}
        />
      )}
      <div className="relative z-10">{inner}</div>
    </Link>
  );
}

export default function HeroSection() {
  const subtitle = BRAND_PORTALS.map((b) => b.label).join(' · ');
  const cols =
    BRAND_PORTALS.length === 3
      ? 'md:grid-cols-3'
      : BRAND_PORTALS.length === 4
      ? 'md:grid-cols-4'
      : BRAND_PORTALS.length === 2
      ? 'md:grid-cols-2'
      : 'md:grid-cols-3 lg:grid-cols-4';

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

      {/* PORTAILS MARQUES */}
      <section className={`grid grid-cols-1 ${cols} min-h-screen`}>
        {BRAND_PORTALS.map((brand, i) => (
          <BrandPanel key={brand.slug} brand={brand} index={i} total={BRAND_PORTALS.length} />
        ))}
      </section>
    </>
  );
}
