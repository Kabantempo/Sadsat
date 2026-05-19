"use client";
import { useState, useEffect, useRef } from "react";
import { motion, type PanInfo } from "framer-motion";
import Link from "next/link";
import MatrixRain from "@/components/shared/MatrixRain";
import { BRAND_PORTALS } from "@/lib/definitions";
import { TaxidermieAnim, BijouxAnim, HackcycleAnim } from "@/components/shared/BrandAnimations";

function BrandSlide({ brand }: { brand: typeof BRAND_PORTALS[0] }) {
  const anim =
    brand.special === "matrix" ? <MatrixRain /> :
    brand.slug === "taxidermie" ? <TaxidermieAnim /> :
    brand.slug === "bijoux" ? <BijouxAnim /> :
    brand.slug === "habillement" ? <HackcycleAnim /> :
    null;

  return (
    <div className="absolute inset-0" style={{ background: brand.bg }}>
      {anim}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10"
        style={{ color: brand.color }}
      >
        <p
          className="font-mono text-[0.52rem] tracking-[0.38em] uppercase mb-6"
          style={{ color: brand.accent, opacity: 0.6 }}
        >
          {brand.index} / {String(BRAND_PORTALS.length).padStart(2, "0")}
        </p>
        <h2
          className={
            brand.font === "serif"
              ? "font-serif italic font-normal text-5xl md:text-7xl mb-4 leading-none"
              : brand.font === "mono"
              ? "font-mono font-normal text-5xl md:text-7xl mb-4 leading-none"
              : "font-sans font-bold uppercase text-5xl md:text-7xl mb-4 leading-none tracking-wider"
          }
          style={{
            color: brand.color,
            ...(brand.font === "sans"
              ? { textShadow: `3px 0 ${brand.accent}, -3px 0 #1a1a1a` }
              : {}),
          }}
        >
          {brand.label}
        </h2>
        <p
          className="font-mono text-[0.62rem] tracking-[0.25em] uppercase mb-10"
          style={{ color: brand.accent, opacity: 0.7 }}
        >
          {brand.subtitle}
        </p>
        {brand.cta && !brand.special ? (
          <Link
            href={`/${brand.slug}`}
            className="inline-block text-[0.62rem] tracking-[0.3em] uppercase pb-1 border-b transition-all duration-300 hover:pb-2"
            style={{ color: brand.color, borderColor: `${brand.accent}88` }}
          >
            {brand.cta} →
          </Link>
        ) : !brand.cta || brand.special === "comingSoon" ? (
          <div
            className="inline-flex items-center gap-2 border px-4 py-2"
            style={{ borderColor: `${brand.accent}55`, color: brand.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span className="font-mono text-[0.58rem] tracking-[0.3em] uppercase">En cours</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BrandCarousel() {
  const [current, setCurrent] = useState(0);
  const [containerW, setContainerW] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const total = BRAND_PORTALS.length;

  useEffect(() => {
    if (!sectionRef.current) return;
    const update = () => setContainerW(sectionRef.current!.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, []);

  // Slide occupe 80% du container, gap 3%, les voisins débordent ~8.5% de chaque côté
  const slideW  = containerW > 0 ? containerW * 0.80 : 0;
  const gap     = containerW > 0 ? containerW * 0.03 : 0;
  const slotW   = slideW + gap;
  const startX  = containerW > 0 ? (containerW - slideW) / 2 : 0;
  const trackX  = containerW > 0 ? startX - current * slotW : 0;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) next();
    else if (info.offset.x > 50 || info.velocity.x > 400) prev();
  };

  const brand = BRAND_PORTALS[current];

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-neutral-950 select-none">
      {/* Track */}
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center"
        style={{ gap: `${gap}px` }}
        drag="x"
        dragConstraints={{
          left:  containerW > 0 ? startX - (total - 1) * slotW : 0,
          right: containerW > 0 ? startX : 0,
        }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={{ x: trackX }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
      >
        {BRAND_PORTALS.map((b, i) => (
          <motion.div
            key={b.slug}
            className="relative flex-shrink-0 rounded-2xl overflow-hidden h-[82vh]"
            style={{ width: slideW > 0 ? `${slideW}px` : "80vw" }}
            animate={{
              scale:   i === current ? 1    : 0.93,
              opacity: i === current ? 1    : 0.45,
            }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            <BrandSlide brand={b} />
          </motion.div>
        ))}
      </motion.div>

      {/* Dégradé bords gauche / droite pour fondre les voisins */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

      {/* Flèches desktop */}
      {current > 0 && (
        <button
          onClick={prev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full border transition-all duration-200 hover:bg-white/10 text-sm"
          style={{ borderColor: `${brand.accent}55`, color: brand.color }}
          aria-label="Précédent"
        >
          ←
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={next}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full border transition-all duration-200 hover:bg-white/10 text-sm"
          style={{ borderColor: `${brand.accent}55`, color: brand.color }}
          aria-label="Suivant"
        >
          →
        </button>
      )}

      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {BRAND_PORTALS.map((b, i) => (
          <button
            key={b.slug}
            onClick={() => setCurrent(i)}
            aria-label={b.label}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-1.5" : "w-1.5 h-1.5 opacity-35"
              }`}
              style={{ background: brand.accent }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default function HeroSection() {
  const subtitle = BRAND_PORTALS.map((b) => b.label).join(" · ");

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

      {/* CAROUSEL AVEC APERÇU */}
      <BrandCarousel />
    </>
  );
}
