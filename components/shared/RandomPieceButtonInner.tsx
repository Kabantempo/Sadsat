"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { motion } from "framer-motion";

type Item = { href: string; label: string };

export default function RandomPieceButtonInner({ items }: { items: Item[] }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("Pièce aléatoire");

  const handleClick = () => {
    if (active || items.length === 0) return;
    setActive(true);

    let ticks = 0;
    const max = 10;
    const id = setInterval(() => {
      const pick = items[Math.floor(Math.random() * items.length)];
      setLabel(pick.label);
      ticks++;
      if (ticks >= max) {
        clearInterval(id);
        const final = items[Math.floor(Math.random() * items.length)];
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
