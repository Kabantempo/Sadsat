"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MatrixRain from "@/components/shared/MatrixRain";
import { BRAND_PORTALS } from "@/lib/definitions";
import { TaxidermieAnim, BijouxAnim, HackcycleAnim } from "@/components/shared/BrandAnimations";

const COLLAPSED_PX = 54; // largeur des panneaux repliés (px)

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
    brand.slug === "bijoux" ? <BijouxAnim /> :
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
      ? "font-serif italic font-normal text-4xl md:text-6xl mb-3"
      : brand.font === "mono"
      ? "font-mono font-normal text-4xl md:text-6xl mb-3"
      : "font-sans font-bold uppercase text-4xl md:text-6xl mb-3 tracking-wider";

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
          className="font-mono text-[0.5rem] tracking-[0.3em] uppercase whitespace-nowrap"
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
        href={`/${brand.slug}`}
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
  const subtitle = BRAND_PORTALS.map((b) => b.label).join(" · ");
  const total = BRAND_PORTALS.length;

  const cols =
    total === 2 ? "grid-cols-2" :
    total === 3 ? "grid-cols-3" :
    total === 4 ? "grid-cols-2" :
    "grid-cols-2";

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

      {/* GRILLE — mobile uniquement */}
      <section className={`grid ${cols} md:hidden`}>
        {BRAND_PORTALS.map((brand) => {
          const anim =
            brand.special === "matrix" ? <MatrixRain /> :
            brand.slug === "taxidermie" ? <TaxidermieAnim /> :
            brand.slug === "bijoux" ? <BijouxAnim /> :
            brand.slug === "habillement" ? <HackcycleAnim /> :
            null;

          const inner = (
            <div className="relative z-10 text-center px-4" style={{ color: brand.color }}>
              <h2
                className={
                  brand.font === "serif" ? "font-serif italic text-2xl mb-2" :
                  brand.font === "mono"  ? "font-mono text-2xl mb-2" :
                  "font-sans font-bold uppercase text-2xl mb-2 tracking-wider"
                }
              >
                {brand.label}
              </h2>
              <p className="text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: brand.accent, opacity: 0.7 }}>
                {brand.subtitle}
              </p>
            </div>
          );

          if (brand.cta && !brand.special) {
            return (
              <Link key={brand.slug} href={`/${brand.slug}`} className="relative flex items-center justify-center min-h-[45vw] overflow-hidden" style={{ background: brand.bg }}>
                {anim}
                {inner}
              </Link>
            );
          }
          return (
            <div key={brand.slug} className="relative flex items-center justify-center min-h-[45vw] overflow-hidden" style={{ background: brand.bg }}>
              {anim}
              {inner}
            </div>
          );
        })}
      </section>
    </>
  );
}
