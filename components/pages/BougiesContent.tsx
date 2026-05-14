"use client";

import { useEffect, useState } from "react";
import MatrixRain from "@/components/shared/MatrixRain";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ProductCarousel, { type CarouselItem } from "@/components/shared/ProductCarousel";

type FaqItem = { q: string; a: string; cmd: string };

const FAQ: FaqItem[] = [
  {
    cmd: "help --materiaux",
    q: "Quels matériaux utilisez-vous ?",
    a: "Cires 100 % végétales (soja, colza) et cire d'abeille brute. Mèches en coton non blanchi. Senteurs issues de la distillation de plantes et résines — aucun additif synthétique, aucun colorant artificiel.",
  },
  {
    cmd: "help --combustion",
    q: "Combien de temps brûle une bougie ?",
    a: "Entre 30 et 60 heures selon le format. Les piliers en cire d'abeille atteignent 80 heures. La première combustion doit durer au moins 2 heures pour créer un bassin de cire uniforme — c'est la règle d'or.",
  },
  {
    cmd: "help --securite",
    q: "Comment utiliser une bougie en sécurité ?",
    a: "Ne jamais laisser une bougie allumée sans surveillance. Couper la mèche à 5 mm avant chaque allumage. Ne pas brûler plus de 3 heures d'affilée. Conserver hors de portée des enfants et des animaux. Éteindre avec un éteignoir, jamais en soufflant.",
  },
  {
    cmd: "help --odeurs",
    q: "Les senteurs sont-elles naturelles ?",
    a: "Oui. Nous travaillons exclusivement avec des huiles essentielles et des absolues naturelles. Pas de fragrance synthétique. Résultat : des odeurs plus subtiles, plus vraies, et bénéfiques à la qualité de l'air intérieur.",
  },
  {
    cmd: "help --custom",
    q: "Puis-je commander une fragrance personnalisée ?",
    a: "Oui. Contactez-nous avec vos préférences olfactives (notes de tête, cœur, fond) et nous créons une fragrance unique pour vous. Délai : 2 à 3 semaines. Disponible en quantité limitée.",
  },
];

type Props = { carouselItems: CarouselItem[] };

export default function BougiesContent({ carouselItems }: Props) {
  const [intro, setIntro] = useState("");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const fullText = "> initializing.candle.system_";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setIntro(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black relative overflow-hidden" style={{ color: "#00ff41" }}>

      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <MatrixRain />
      </div>

      <div className="max-w-4xl mx-auto px-8 relative z-10 font-mono">

        {/* ── En-tête ── */}
        <div className="text-center mb-20">
          <div className="text-[0.7rem] tracking-[0.3em] mb-6" style={{ color: "#008f11" }}>
            &gt; SYS_03
          </div>
          <h1 className="font-mono font-normal text-6xl md:text-7xl mb-6" style={{ textShadow: "0 0 16px #00ff41" }}>
            Bougies
          </h1>
          <p className="text-sm tracking-[0.15em] opacity-80">
            {intro}<span className="animate-pulse">|</span>
          </p>
        </div>

        {/* ── Définition ── */}
        <div className="mb-20 border-l-2 pl-8" style={{ borderColor: "rgba(0,255,65,0.3)" }}>
          <p className="text-[0.6rem] tracking-[0.28em] uppercase mb-4" style={{ color: "#008f11" }}>
            &gt; definition.load
          </p>
          <p className="text-lg leading-relaxed mb-4" style={{ color: "#00ff41" }}>
            Une bougie n'est pas qu'une flamme. C'est une alchimie entre la cire, la mèche et la fragrance.
          </p>
          <p className="text-[0.84rem] leading-[1.85]" style={{ color: "rgba(0,255,65,0.6)" }}>
            Chez SADSAT, les bougies sont coulées à la main, en petites séries, dans des contenants récupérés ou fabriqués sur mesure. La cire est végétale — soja ou colza — ou animale dans sa forme la plus pure : la cire d'abeille brute. Chaque fragrance est une composition botanique, distillée lentement, sans raccourcis chimiques.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { val: "100%", label: "Végétal ou abeille" },
              { val: "0", label: "Additif synthétique" },
              { val: "∞", label: "Combinations" },
            ].map(({ val, label }) => (
              <div key={label} className="border p-4 text-center" style={{ borderColor: "rgba(0,255,65,0.2)" }}>
                <p className="text-2xl mb-1" style={{ textShadow: "0 0 10px #00ff41" }}>{val}</p>
                <p className="text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: "rgba(0,255,65,0.4)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ Terminal ── */}
        <div className="mb-20">
          <p className="text-[0.6rem] tracking-[0.28em] uppercase mb-6" style={{ color: "#008f11" }}>
            &gt; faq.interactive — cliquer sur une commande
          </p>
          <div className="border p-6 space-y-1" style={{ borderColor: "rgba(0,255,65,0.15)", background: "rgba(0,20,0,0.4)" }}>
            {FAQ.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                  className="w-full text-left flex items-center gap-3 py-2 group transition-opacity"
                  style={{ color: "rgba(0,255,65,0.8)" }}
                >
                  <ChevronRight
                    size={12}
                    strokeWidth={2}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      transform: activeIdx === i ? "rotate(90deg)" : "rotate(0deg)",
                      color: activeIdx === i ? "#00ff41" : "rgba(0,255,65,0.4)",
                    }}
                  />
                  <span className="text-[0.78rem] tracking-wide group-hover:opacity-100 opacity-80">
                    $ {item.cmd}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {activeIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 pt-1 pb-3 border-l" style={{ borderColor: "rgba(0,255,65,0.15)" }}>
                        <p className="text-[0.64rem] tracking-[0.12em] mb-2" style={{ color: "#008f11" }}>
                          &gt; {item.q}
                        </p>
                        <p className="text-[0.78rem] leading-[1.8]" style={{ color: "rgba(0,255,65,0.65)" }}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* ── Carousel produits ── */}
        <div className="mb-20">
          <p className="text-[0.6rem] tracking-[0.28em] uppercase mb-8" style={{ color: "#008f11" }}>
            &gt; collection.preview
          </p>
          <ProductCarousel items={carouselItems} theme="dark" aspectRatio="square" />
        </div>

        {/* ── En cours (si pas de produits) ── */}
        {carouselItems.every((i) => typeof i.id === "number") && (
          <div className="flex flex-col items-center justify-center py-12 gap-10">
            <div
              className="border px-16 py-12 flex flex-col items-center gap-6 max-w-md w-full"
              style={{ borderColor: "rgba(0, 255, 65, 0.25)" }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41] animate-pulse" />
              <div className="text-4xl md:text-5xl font-mono" style={{ textShadow: "0 0 20px #00ff41" }}>
                En cours
              </div>
              <p className="text-[0.7rem] tracking-[0.2em] uppercase text-center opacity-60">
                &gt; collection.build :: in_progress
              </p>
            </div>
            <p className="font-mono text-[0.68rem] tracking-wide opacity-50 text-center max-w-sm leading-relaxed">
              La collection Bougies est en cours de création.<br />
              Elle sera disponible très prochainement.
            </p>
          </div>
        )}

        <div className="mt-8 text-center border-t pt-12" style={{ borderColor: "rgba(0, 255, 65, 0.15)" }}>
          <div className="text-[0.7rem] tracking-[0.2em] opacity-70">
            &gt; system.ready :: awaiting_collection
          </div>
        </div>
      </div>
    </div>
  );
}
