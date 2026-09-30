"use client";
import { useState, useRef, useEffect } from "react";
import MatrixRain from "@/components/shared/MatrixRain";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BRAND_PORTALS, universePath } from "@/lib/definitions";

// Trame ASCII décorative : chargée après l'affichage, jamais sur le chemin du titre (LCP).
const AsciiField = dynamic(() => import("@/components/shared/AsciiField"), { ssr: false });

// Petit point de couleur devant chaque univers, sous le titre de l'accueil.
const HERO_DOTS: Record<string, string> = { taxidermie: "#19bdb8", bougies: "#00ff41", habillement: "#b8a882" };
import { TaxidermieAnim, HackcycleAnim } from "@/components/shared/BrandAnimations";

const COLLAPSED_PX = 150; // largeur des panneaux repliés (px)

function BrandPanel({
  brand,
  total,
  state,
  onEnter,
}: {
  brand: typeof BRAND_PORTALS[0];
  total: number;
  state: "expanded" | "collapsed" | "default";
  onEnter: () => void;
}) {
  const anim =
    brand.special === "matrix" ? <MatrixRain /> :
    brand.slug === "taxidermie" ? <TaxidermieAnim /> :
    brand.slug === "habillement" ? <HackcycleAnim /> :
    null;

  const isExpanded  = state === "expanded";
  const isCollapsed = state === "collapsed";

  const width =
    isExpanded  ? `calc(100% - ${(total - 1) * COLLAPSED_PX}px)` :
    isCollapsed ? `${COLLAPSED_PX}px` :
                  `${100 / total}%`;

  const titleClass =
    brand.font === "serif"
      ? `font-serif italic font-normal mb-3 ${isExpanded ? "text-5xl md:text-7xl" : "text-2xl md:text-4xl"}`
      : brand.font === "mono"
      ? `font-mono font-normal mb-3 ${isExpanded ? "text-5xl md:text-7xl" : "text-2xl md:text-4xl"}`
      : `font-sans font-bold uppercase mb-3 tracking-wider ${isExpanded ? "text-5xl md:text-7xl" : "text-xl md:text-3xl"}`;

  const inner = (
    <>
      {/* Contenu principal — visible en état normal / étendu */}
      <div
        className="relative z-10 text-center px-8 pointer-events-none"
        style={{
          color: brand.color,
          opacity: isCollapsed ? 0 : 1,
          transform: isCollapsed ? "scale(0.92)" : "scale(1)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
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
          className="text-[0.7rem] tracking-[0.25em] uppercase mb-8"
          style={{ color: brand.accent, opacity: 0.7 }}
        >
          {brand.subtitle}
        </p>
        {brand.cta && !brand.special && (
          <span
            className="inline-block text-[0.65rem] tracking-[0.35em] uppercase pb-1 border-b"
            style={{
              color: brand.color,
              borderColor: `${brand.accent}88`,
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
            }}
          >
            {brand.cta} →
          </span>
        )}
        {(!brand.cta || brand.special === "comingSoon") && (
          <div
            className="inline-flex items-center gap-2 border px-4 py-2"
            style={{ borderColor: `${brand.accent}66`, color: brand.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">En cours</span>
          </div>
        )}
      </div>

      {/* Étiquette verticale — visible seulement quand replié */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        style={{
          opacity: isCollapsed ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <span
          className="font-mono text-[0.85rem] tracking-[0.28em] uppercase whitespace-nowrap"
          style={{
            color: brand.accent,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}
        >
          {brand.label}
        </span>
      </div>
    </>
  );

  const sharedStyle: React.CSSProperties = {
    width,
    flexShrink: 0,
    background: brand.bg,
    transition: "width 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const sharedClass =
    "relative hidden md:flex items-center justify-center min-h-screen overflow-hidden cursor-pointer";

  if (brand.cta && !brand.special) {
    return (
      <Link
        href={universePath(brand.slug)}
        className={sharedClass}
        style={sharedStyle}
        onMouseEnter={onEnter}
      >
        {anim}
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={sharedClass}
      style={sharedStyle}
      onMouseEnter={onEnter}
    >
      {anim}
      {inner}
    </div>
  );
}

export default function HeroSection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // La trame ASCII est décorative et coûte du temps de calcul : seulement à partir de la largeur tablette,
  // pour garder la page d'accueil rapide sur téléphone.
  const [showAscii, setShowAscii] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const total = BRAND_PORTALS.length;

  function scrollToIndex(i: number) {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setActiveIndex(i);
  }

  useEffect(() => {
    setShowAscii(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BRAND_PORTALS.length);
    const el = carouselRef.current;
    if (el) el.scrollLeft = randomIndex * el.clientWidth;
    setActiveIndex(randomIndex);
  }, []);

  function onScroll() {
    const el = carouselRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(i);
  }

  return (
    <>
      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-black relative overflow-hidden">
        <div className="hero-bg" aria-hidden="true">
          <span className="hero-orb hero-orb--cp" />
          <span className="hero-orb hero-orb--sp" />
          <span className="hero-orb hero-orb--hc" />
          {showAscii && <AsciiField />}
        </div>
        <h1 className="hero-rise relative z-10 px-6 font-serif font-light text-5xl md:text-7xl tracking-wide text-neutral-100 mb-6">
          Un collectif, plusieurs univers.
        </h1>
        <div className="hero-rule relative z-10" aria-hidden="true" />
        <nav
          aria-label="Nos univers"
          className="hero-fade relative z-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 px-6"
          style={{ animationDelay: "0.5s" }}
        >
          {BRAND_PORTALS.map((b) => (
            <Link
              key={b.slug}
              href={universePath(b.slug)}
              className="inline-flex items-center gap-2.5 text-xs tracking-[0.3em] uppercase text-neutral-300 hover:text-white transition-colors"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: HERO_DOTS[b.slug] ?? "#a3a3a3" }} />
              {b.label}
            </Link>
          ))}
        </nav>
        <div
          className="hero-fade absolute bottom-8 z-10 text-[0.65rem] tracking-[0.4em] uppercase text-neutral-400"
          style={{ animationDelay: "1.2s" }}
        >
          ↓ Découvrir
        </div>
      </section>

      {/* ACCORDÉON — desktop uniquement */}
      <section
        className="hidden md:flex min-h-screen"
        onMouseLeave={() => setHoveredSlug(null)}
      >
        {BRAND_PORTALS.map((brand) => {
          const state =
            hoveredSlug === null     ? "default" :
            hoveredSlug === brand.slug ? "expanded" :
            "collapsed";
          return (
            <BrandPanel
              key={brand.slug}
              brand={brand}
              total={total}
              state={state}
              onEnter={() => setHoveredSlug(brand.slug)}
            />
          );
        })}
      </section>

      {/* CAROUSEL — mobile uniquement */}
      <section className="md:hidden relative">
        {/* Pistes de défilement */}
        <div
          ref={carouselRef}
          onScroll={onScroll}
          className="flex overflow-x-scroll snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", touchAction: "pan-x", paddingLeft: "10vw", paddingRight: "10vw", gap: "12px" }}
        >
          {BRAND_PORTALS.map((brand) => {
            const anim =
              brand.special === "matrix" ? <MatrixRain /> :
              brand.slug === "taxidermie" ? <TaxidermieAnim /> :
              brand.slug === "habillement" ? <HackcycleAnim /> :
              null;

            const inner = (
              <div className="relative z-10 text-center px-6" style={{ color: brand.color }}>
                <p
                  className="font-mono text-[0.5rem] tracking-[0.35em] uppercase mb-4"
                  style={{ color: brand.accent, opacity: 0.55 }}
                >
                  {brand.index}
                </p>
                <h2
                  className={
                    brand.font === "serif" ? "font-serif italic text-6xl mb-3 whitespace-nowrap" :
                    brand.font === "mono"  ? "font-mono text-4xl mb-3 whitespace-nowrap" :
                    "font-sans font-bold uppercase text-5xl mb-3 tracking-wider whitespace-nowrap"
                  }
                  style={brand.font === "sans" ? { textShadow: `2px 0 ${brand.accent}, -2px 0 #1a1a1a` } : undefined}
                >
                  {brand.label}
                </h2>
                <p className="text-[0.72rem] tracking-[0.25em] uppercase mb-8" style={{ color: brand.accent, opacity: 0.7 }}>
                  {brand.subtitle}
                </p>
                {brand.cta && !brand.special && (
                  <span
                    className="inline-block text-[0.6rem] tracking-[0.3em] uppercase pb-1 border-b"
                    style={{ color: brand.color, borderColor: `${brand.accent}88` }}
                  >
                    {brand.cta} →
                  </span>
                )}
                {(!brand.cta || brand.special === "comingSoon") && (
                  <div
                    className="inline-flex items-center gap-2 border px-4 py-2"
                    style={{ borderColor: `${brand.accent}66`, color: brand.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span className="font-mono text-[0.58rem] tracking-[0.3em] uppercase">En cours</span>
                  </div>
                )}
              </div>
            );

            const cardClass = "relative flex-shrink-0 snap-center flex items-center justify-center overflow-hidden rounded-xl transition-all duration-500";
            const cardStyle = { background: brand.bg, height: "82vh", width: "65vw" };

            if (brand.cta && !brand.special) {
              return (
                <Link key={brand.slug} href={universePath(brand.slug)} className={cardClass} style={cardStyle}>
                  {anim}
                  {inner}
                </Link>
              );
            }
            return (
              <div key={brand.slug} className={cardClass} style={cardStyle}>
                {anim}
                {inner}
              </div>
            );
          })}
        </div>

        {/* Flèches */}
        {activeIndex > 0 && (
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            aria-label="Précédent"
          >
            ‹
          </button>
        )}
        {activeIndex < total - 1 && (
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            aria-label="Suivant"
          >
            ›
          </button>
        )}

        {/* Points indicateurs */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BRAND_PORTALS.map((brand, i) => (
            <button
              key={brand.slug}
              onClick={() => scrollToIndex(i)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i === activeIndex ? "#e5e5e5" : "#525252" }}
              aria-label={brand.label}
            />
          ))}
        </div>
      </section>
    </>
  );
}
