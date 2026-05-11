"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";

type SubItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  bordeaux?: boolean;
  dropdown?: SubItem[];
};

const NAV: NavItem[] = [
  { label: "✦ Pièces uniques", href: "/pieces-uniques", bordeaux: true },
  {
    label: "Taxidermie",
    href: "/taxidermie",
    dropdown: [
      { label: "Oiseaux", href: "/taxidermie/oiseaux" },
      { label: "Mammifères", href: "/taxidermie/mammiferes" },
      { label: "Insectes", href: "/taxidermie/insectes" },
      { label: "Crânes", href: "/taxidermie/cranes" },
      { label: "Reptiles", href: "/taxidermie/reptiles" },
    ],
  },
  {
    label: "Bijoux",
    href: "/bijoux",
    dropdown: [
      { label: "Bagues", href: "/bijoux/bagues" },
      { label: "Colliers", href: "/bijoux/colliers" },
      { label: "Bracelets", href: "/bijoux/bracelets" },
      { label: "Boucles d'oreilles", href: "/bijoux/boucles" },
    ],
  },
  {
    label: "Bougies",
    href: "/bougies",
    dropdown: [
      { label: "Cire de soja", href: "/bougies/soja" },
      { label: "Cire d'abeille", href: "/bougies/abeille" },
      { label: "Piliers", href: "/bougies/piliers" },
      { label: "Fondants", href: "/bougies/fondants" },
    ],
  },
  { label: "À propos", href: "/a-propos" },
  { label: "Sale", href: "/sale" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Header() {
  const [openMenu, setOpenMenu]     = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub]   = useState<string | null>(null);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="sticky top-0 z-50 bg-white border-b border-neutral-200 text-neutral-900"
      >
        {/* ── Barre principale ── */}
        <div className="relative flex items-center px-5 py-4 md:justify-center md:px-12 md:py-10">

          {/* Gauche mobile : hamburger */}
          <button
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo — centré sur mobile via flex-1 des deux côtés */}
          <div className="flex-1 flex justify-center md:flex-none md:justify-start">
            <Link
              href="/"
              className="font-serif text-[1.45rem] md:text-4xl tracking-[0.22em] uppercase flex items-center gap-2 md:gap-4 select-none text-neutral-900 transition-opacity hover:opacity-60 duration-300"
            >
              SADSAT
              <span className="text-xs md:text-lg leading-none text-neutral-400">✦</span>
            </Link>
          </div>

          {/* Droite mobile : panier uniquement */}
          <button
            aria-label="Panier"
            className="md:hidden relative text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[0.42rem] leading-none rounded-full w-[13px] h-[13px] flex items-center justify-center font-bold">
              0
            </span>
          </button>

          {/* Actions desktop — absolues à droite */}
          <div className="hidden md:flex absolute right-12 items-center gap-7 text-neutral-600">
            <motion.button
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.15 }}
              aria-label="Rechercher"
              className="hover:text-neutral-900 transition-colors"
            >
              <Search size={16} strokeWidth={1.5} />
            </motion.button>
            <span className="text-[0.6rem] tracking-[0.2em] font-medium text-neutral-500">EUR</span>
            <motion.button
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.15 }}
              aria-label="Mon compte"
              className="hover:text-neutral-900 transition-colors"
            >
              <User size={16} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.15 }}
              aria-label="Panier"
              className="relative hover:text-neutral-900 transition-colors"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2.5 bg-neutral-900 text-white text-[0.45rem] leading-none rounded-full w-[16px] h-[16px] flex items-center justify-center font-bold">
                0
              </span>
            </motion.button>
          </div>
        </div>

        {/* ── Nav desktop ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28, ease }}
          className="hidden md:block border-t border-neutral-200"
        >
          <nav className="flex items-center justify-center gap-14 px-8 py-5">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-1.5 text-[0.62rem] tracking-[0.16em] uppercase font-medium transition-colors pb-0.5 ${
                    item.bordeaux
                      ? "text-[#8b0000] hover:text-[#6b0000]"
                      : "text-neutral-700 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      size={10}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${openMenu === item.label ? "rotate-180" : ""}`}
                    />
                  )}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
                </Link>

                <AnimatePresence>
                  {item.dropdown && openMenu === item.label && (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white border border-neutral-200 min-w-[190px] py-4 z-50 shadow-lg"
                    >
                      {item.dropdown.map((sub, i) => (
                        <motion.div
                          key={sub.href}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.14, delay: i * 0.04, ease: "easeOut" }}
                        >
                          <Link
                            href={sub.href}
                            className="block px-7 py-3.5 text-[0.62rem] tracking-[0.14em] uppercase text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </motion.div>
      </motion.header>

      {/* ── Menu mobile plein écran ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[82vw] max-w-[340px] bg-white text-neutral-900 flex flex-col md:hidden overflow-y-auto shadow-2xl"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-xl tracking-[0.2em] uppercase text-neutral-900"
                >
                  SADSAT ✦
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 -mr-1"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Liens */}
              <nav className="flex-1 px-6 py-4 flex flex-col" aria-label="Navigation principale">
                {NAV.map((item) => (
                  <div key={item.label} className="border-b border-neutral-100">
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => !item.dropdown && setMobileOpen(false)}
                        className={`flex-1 py-4 text-[0.78rem] tracking-[0.14em] uppercase font-medium ${
                          item.bordeaux ? "text-[#8b0000]" : "text-neutral-800"
                        }`}
                      >
                        {item.label}
                      </Link>
                      {item.dropdown && (
                        <button
                          onClick={() =>
                            setMobileSub(mobileSub === item.label ? null : item.label)
                          }
                          aria-label={`Sous-menu ${item.label}`}
                          className="py-4 pl-4 pr-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <ChevronDown
                            size={14}
                            strokeWidth={2}
                            className={`transition-transform duration-200 ${
                              mobileSub === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {item.dropdown && mobileSub === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block pl-5 py-3 text-[0.7rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors border-b border-neutral-50 last:border-0"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Actions bas du drawer */}
              <div className="px-6 py-5 border-t border-neutral-100 flex items-center gap-6 text-neutral-600">
                <button aria-label="Rechercher" className="hover:text-neutral-900 transition-colors">
                  <Search size={18} strokeWidth={1.5} />
                </button>
                <span className="text-[0.65rem] tracking-[0.18em] font-medium text-neutral-500">EUR</span>
                <button aria-label="Mon compte" className="hover:text-neutral-900 transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
