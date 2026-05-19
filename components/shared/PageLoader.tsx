"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "SADSAT".split("");

export default function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("sadsat_loaded")) return;
    setVisible(true);
  }, []);

  const handleComplete = () => {
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("sadsat_loaded", "1");
    }, 500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col items-center justify-center"
        >
          {/* Lettres une par une */}
          <motion.div
            className="flex items-baseline"
            initial="hidden"
            animate="visible"
            onAnimationComplete={handleComplete}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.14, delayChildren: 0.3 },
              },
            }}
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="font-serif font-light text-7xl md:text-9xl text-neutral-100 tracking-[0.06em]"
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                  },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Sous-titre discret */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="font-mono text-[0.52rem] tracking-[0.45em] uppercase text-neutral-500 mt-6"
          >
            Collectif
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
