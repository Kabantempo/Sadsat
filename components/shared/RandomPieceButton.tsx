"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { motion } from "framer-motion";

/*
  Ajoute ici toutes tes pièces au fur et à mesure.
  Format : { href: "/chemin/vers/la/piece", label: "Nom affiché" }
*/
const POOL = [
  { href: "/taxidermie/oiseaux",    label: "Oiseaux" },
  { href: "/taxidermie/mammiferes", label: "Mammifères" },
  { href: "/taxidermie/insectes",   label: "Insectes" },
  { href: "/taxidermie/cranes",     label: "Crânes" },
  { href: "/taxidermie/reptiles",   label: "Reptiles" },
  { href: "/bijoux",                label: "Bijoux" },
];

export default function RandomPieceButton() {
  const router   = useRouter();
  const [active, setActive] = useState(false);
  const [label, setLabel]   = useState("Pièce aléatoire");

  const handleClick = () => {
    if (active) return;
    setActive(true);

    // Effet de "tirage" — change le label rapidement
    let ticks = 0;
    const max  = 10;
    const id   = setInterval(() => {
      const pick = POOL[Math.floor(Math.random() * POOL.length)];
      setLabel(pick.label);
      ticks++;
      if (ticks >= max) {
        clearInterval(id);
        const final = POOL[Math.floor(Math.random() * POOL.length)];
        setLabel(final.label);
        setTimeout(() => {
          router.push(final.href);
          setActive(false);
          setLabel("Pièce aléatoire");
        }, 350);
      }
    }, 60);
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label="Découvrir une pièce aléatoire"
      className="fixed bottom-8 right-8 z-40 flex items-center gap-3 bg-neutral-900 text-white px-5 py-3.5 shadow-lg hover:bg-black transition-colors duration-200 select-none"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
    >
      <motion.span
        animate={{ rotate: active ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Shuffle size={13} strokeWidth={1.5} />
      </motion.span>
      <span className="font-mono text-[0.58rem] tracking-[0.22em] uppercase min-w-[110px] text-left">
        {label}
      </span>
    </motion.button>
  );
}
