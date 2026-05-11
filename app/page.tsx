"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MatrixRain from "@/components/shared/MatrixRain";

export default function Home() {
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
          Trois univers, une vision.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase text-neutral-400"
        >
          Taxidermie · Bijoux · Bougies
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 text-[0.65rem] tracking-[0.4em] uppercase"
        >
          ↓ Découvrir
        </motion.div>
      </section>

      {/* 3 PORTAILS */}
      <section className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
        {/* PORTAIL 1 — TAXIDERMIE */}
        <Link
          href="/taxidermie"
          className="relative overflow-hidden group flex items-center justify-center min-h-[60vh] md:min-h-screen transition-all duration-700"
          style={{ background: "linear-gradient(180deg, #fafaf7 0%, #ebebe6 100%)", color: "#1a1a1a" }}
        >
          <div className="text-center px-8 transition-transform duration-700 group-hover:scale-105">
            <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-neutral-500">— 01 —</div>
            <h2 className="font-serif italic font-normal text-4xl md:text-5xl mb-3 transition-all duration-500 group-hover:tracking-wider">
              Taxidermie
            </h2>
            <div className="text-[0.7rem] tracking-[0.25em] uppercase opacity-70">
              Pièces uniques · Éthique
            </div>
            <div className="inline-block mt-8 text-[0.65rem] tracking-[0.35em] uppercase pb-1 border-b border-current opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              Entrer dans la galerie →
            </div>
          </div>
        </Link>

        {/* PORTAIL 2 — BIJOUX */}
        <Link
          href="/bijoux"
          className="relative overflow-hidden group flex items-center justify-center min-h-[60vh] md:min-h-screen bg-[#0a0a0a] text-neutral-200"
        >
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent 0 6px, rgba(139,0,0,0.04) 6px 7px), radial-gradient(circle at 30% 70%, rgba(139,0,0,0.15), transparent 60%)"
          }} />
          <div className="relative text-center px-8 transition-transform duration-700 group-hover:scale-105">
            <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-[#8b0000]">— 02 —</div>
            <h2
              className="font-sans font-bold uppercase text-4xl md:text-5xl mb-3 tracking-wider"
              style={{ textShadow: "2px 0 #8b0000, -2px 0 #1a1a1a" }}
            >
              Bijoux
            </h2>
            <div className="text-[0.7rem] tracking-[0.25em] uppercase opacity-70">
              Mailles · Métal · Contre-culture
            </div>
            <div className="inline-block mt-8 text-[0.65rem] tracking-[0.35em] uppercase pb-1 border-b border-current opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              Pénétrer la collection →
            </div>
          </div>
        </Link>

        {/* PORTAIL 3 — BOUGIES */}
        <Link
          href="/bougies"
          className="relative overflow-hidden group flex items-center justify-center min-h-[60vh] md:min-h-screen bg-black"
          style={{ color: "#00ff41" }}
        >
          <MatrixRain />
          <div className="relative z-10 text-center px-8 transition-transform duration-700 group-hover:scale-105">
            <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6" style={{ color: "#008f11" }}>
              &gt; SYS_03
            </div>
            <h2 className="font-mono font-normal text-4xl md:text-5xl mb-3" style={{ textShadow: "0 0 12px #00ff41" }}>
              Bougies
            </h2>
            <div className="font-mono text-[0.7rem] tracking-[0.2em] uppercase opacity-70">
              &gt; system.boot
            </div>
            <div className="inline-block mt-8 font-mono text-[0.65rem] tracking-[0.3em] uppercase pb-1 border-b border-current opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              &gt; access_console
            </div>
          </div>
        </Link>
      </section>

      {/* QUI SOMMES NOUS */}
      <section className="py-32 px-8 max-w-3xl mx-auto text-center">
        <h3 className="font-serif font-light text-4xl md:text-5xl mb-8 text-neutral-100">
          Qui sommes-nous
        </h3>
        <p className="text-neutral-400 leading-relaxed font-light mb-6">
          SADSAT est né d'un dialogue entre trois langages : la délicatesse du vivant figé,
          la brutalité du métal travaillé, et la chaleur silencieuse de la cire. Chaque pièce
          est faite main, en série limitée, dans un même atelier — par les mêmes mains.
        </p>
        <p className="text-neutral-400 leading-relaxed font-light mb-10">
          Trois mondes, mais une seule signature.
        </p>
        <Link
          href="/a-propos"
          className="inline-block text-xs tracking-[0.3em] uppercase pb-1 border-b border-neutral-600 hover:border-neutral-200 transition"
        >
          Lire l'histoire complète
        </Link>
      </section>
    </>
  );
}
