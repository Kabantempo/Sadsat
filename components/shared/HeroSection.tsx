"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BRAND_PORTALS, universePath } from "@/lib/definitions";

// Trame ASCII décorative : chargée après l'affichage, jamais sur le chemin du titre (LCP).
const AsciiField = dynamic(() => import("@/components/shared/AsciiField"), { ssr: false });

// Petit point de couleur devant chaque univers, sous le titre de l'accueil.
const HERO_DOTS: Record<string, string> = { taxidermie: "#19bdb8", bougies: "#00ff41", habillement: "#b8a882" };

export default function HeroSection() {
  // La trame ASCII est décorative et coûte du temps de calcul : seulement à partir de la largeur tablette,
  // pour garder la page d'accueil rapide sur téléphone.
  const [showAscii, setShowAscii] = useState(false);

  useEffect(() => {
    setShowAscii(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-black relative overflow-hidden">
        <div className="hero-bg" aria-hidden="true">
          {showAscii && <AsciiField />}
        </div>
        <h1 className="hero-rise relative z-10 px-6 font-serif font-light text-5xl md:text-7xl tracking-wide text-neutral-900 dark:text-neutral-100 mb-6">
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
              className="inline-flex items-center gap-2.5 text-xs tracking-[0.3em] uppercase text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: HERO_DOTS[b.slug] ?? "#a3a3a3" }} />
              {b.label}
            </Link>
          ))}
        </nav>
        <div
          className="hero-fade absolute bottom-8 z-10 text-[0.65rem] tracking-[0.4em] uppercase text-neutral-600 dark:text-neutral-400"
          style={{ animationDelay: "1.2s" }}
        >
          ↓ Découvrir
        </div>
      </section>
    </>
  );
}
