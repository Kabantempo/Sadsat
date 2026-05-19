"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, ChevronDown, Menu, X, LayoutDashboard, LogOut, Heart } from "lucide-react";
import { logout } from "@/app/actions/auth";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useCart } from "@/components/shared/CartProvider";
import { useFavorites } from "@/components/shared/FavoritesProvider";

type SubItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  bordeaux?: boolean;
  comingSoon?: boolean;
  dropdown?: SubItem[];
};

const NAV: NavItem[] = [
  { label: "Pièces uniques", href: "/pieces-uniques", bordeaux: true },
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
    comingSoon: true,
    dropdown: [
      { label: "Cire de soja", href: "/bougies/soja" },
      { label: "Cire d'abeille", href: "/bougies/abeille" },
      { label: "Piliers", href: "/bougies/piliers" },
      { label: "Fondants", href: "/bougies/fondants" },
    ],
  },
  { label: "Habillement", href: "/habillement" },
  { label: "Créateurs", href: "/createurs" },
  { label: "Contact", href: "/contact" },
];

type UserProp = { name: string; role: 'admin' | 'client' | 'créateur' | 'grossiste' } | null

const ease = [0.22, 1, 0.36, 1] as const;

export default function Header({ user }: { user?: UserProp }) {
  const { count, openDrawer } = useCart();
  const { count: favCount } = useFavorites();
  const [openMenu, setOpenMenu]         = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileSub, setMobileSub]       = useState<string | null>(null);
  const [hidden, setHidden]             = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const lastScrollY                     = useRef(0);
  const userMenuRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 80);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-900 dark:text-neutral-100 transition-colors duration-300"
      >
        {/* ── Barre unique desktop ── */}
        <div className="relative flex items-center px-5 py-3 md:px-10 md:py-0 md:h-16">

          {/* Gauche mobile : hamburger */}
          <button
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:flex-none md:justify-start">
            <Link
              href="/"
              className="font-serif italic text-[1.5rem] md:text-2xl tracking-[0.08em] select-none text-neutral-900 dark:text-neutral-100 transition-opacity hover:opacity-50 duration-300"
            >
              Sadsat
              <span className="not-italic text-neutral-300 dark:text-neutral-600 ml-1.5 text-sm">✦</span>
            </Link>
          </div>

          {/* Nav desktop — centrée en absolu */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && !item.comingSoon && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {item.comingSoon ? (
                  <span className="flex items-center gap-1 px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400 cursor-default select-none">
                    {item.label}
                    <span className="text-[0.45rem] tracking-[0.18em] opacity-60">(bientôt)</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] tracking-[0.12em] uppercase transition-all duration-200 ${
                      item.bordeaux
                        ? "text-[#8b0000] hover:bg-[#8b0000]/8"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/70"
                    }`}
                  >
                    {item.bordeaux && <span className="w-1 h-1 rounded-full bg-[#8b0000] shrink-0" />}
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown
                        size={9}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${openMenu === item.label ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>
                )}

                <AnimatePresence>
                  {item.dropdown && !item.comingSoon && openMenu === item.label && (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 min-w-[180px] py-2 z-50 shadow-xl rounded-2xl overflow-hidden"
                    >
                      {item.dropdown.map((sub, i) => (
                        <motion.div
                          key={sub.href}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.12, delay: i * 0.03 }}
                        >
                          <Link
                            href={sub.href}
                            className="block px-5 py-2.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
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

          {/* Actions desktop */}
          <div className="hidden md:flex ml-auto items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <ThemeToggle />

            <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
              aria-label="Rechercher"
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
            >
              <Search size={15} strokeWidth={1.5} />
            </motion.button>

            {/* Icône utilisateur */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.15 }}
                  aria-label="Mon compte"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
                >
                  <User size={15} strokeWidth={1.5} />
                </motion.button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 min-w-[200px] py-2 z-50 shadow-xl rounded-2xl overflow-hidden"
                    >
                      <p className="px-5 pb-2 pt-1 text-[0.52rem] tracking-[0.18em] uppercase text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                        {user.name}
                      </p>
                      {(user.role === 'admin' || user.role === 'créateur') && (
                        <Link
                          href={user.role === 'admin' ? '/admin/produits/nouveau' : '/createur/produits/nouveau'}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-5 py-2.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                        >
                          <span className="text-base leading-none">+</span>
                          Nouveau produit
                        </Link>
                      )}
                      <Link
                        href={user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur/produits' : '/compte'}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                      >
                        <LayoutDashboard size={12} strokeWidth={1.5} />
                        {user.role === 'admin' ? 'Administration' : 'Mon espace'}
                      </Link>
                      <div className="border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="flex items-center gap-2.5 px-5 py-2.5 w-full text-left text-[0.6rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                        >
                          <LogOut size={12} strokeWidth={1.5} />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/connexion"
                  aria-label="Se connecter"
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all block"
                >
                  <User size={15} strokeWidth={1.5} />
                </Link>
              </motion.div>
            )}

            <Link href="/favoris">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.15 }}
                className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all cursor-pointer"
              >
                <Heart size={15} strokeWidth={1.5} />
                {favCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[0.4rem] leading-none rounded-full w-[13px] h-[13px] flex items-center justify-center font-bold">
                    {favCount}
                  </span>
                )}
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
              aria-label="Panier"
              onClick={openDrawer}
              className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[0.4rem] leading-none rounded-full w-[13px] h-[13px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </motion.button>
          </div>

          {/* Droite mobile */}
          <div className="md:hidden flex items-center gap-1">
            {!user ? (
              <Link
                href="/connexion"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] tracking-[0.1em] uppercase font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 transition-colors"
              >
                <User size={13} strokeWidth={1.5} />
                Connexion
              </Link>
            ) : (
              <>
                <Link
                  href="/favoris"
                  className="relative p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <Heart size={19} strokeWidth={1.5} />
                  {favCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[0.4rem] leading-none rounded-full w-[12px] h-[12px] flex items-center justify-center font-bold">
                      {favCount}
                    </span>
                  )}
                </Link>
                <button
                  aria-label="Boutique"
                  onClick={openDrawer}
                  className="relative p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <ShoppingBag size={19} strokeWidth={1.5} />
                  {count > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[0.4rem] leading-none rounded-full w-[12px] h-[12px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </button>
                <Link
                  href={user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur/produits' : '/compte'}
                  className="p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <User size={19} strokeWidth={1.5} />
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Menu mobile plein écran ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[82vw] max-w-[340px] bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col md:hidden overflow-y-auto shadow-2xl rounded-r-2xl"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-serif italic text-xl tracking-[0.06em] text-neutral-900 dark:text-neutral-100"
                >
                  Sadsat <span className="not-italic text-neutral-300 dark:text-neutral-600 text-sm">✦</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                  className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all -mr-1"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Liens */}
              <nav className="flex-1 px-4 py-3 flex flex-col" aria-label="Navigation principale">
                {NAV.map((item) => (
                  <div key={item.label} className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
                    <div className="flex items-center">
                      {item.comingSoon ? (
                        <span className="flex-1 py-3.5 px-2 text-[0.75rem] tracking-[0.12em] uppercase font-medium text-neutral-400 cursor-default select-none flex items-center gap-2">
                          {item.label}
                          <span className="text-[0.5rem] tracking-[0.16em] text-neutral-300">(bientôt)</span>
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => !item.dropdown && setMobileOpen(false)}
                          className={`flex-1 py-3.5 px-2 rounded-lg text-[0.75rem] tracking-[0.12em] uppercase font-medium transition-colors ${
                            item.bordeaux ? "text-[#8b0000]" : "text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.dropdown && !item.comingSoon && (
                        <button
                          onClick={() => setMobileSub(mobileSub === item.label ? null : item.label)}
                          aria-label={`Sous-menu ${item.label}`}
                          className="py-3.5 px-3 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          <ChevronDown
                            size={13}
                            strokeWidth={2}
                            className={`transition-transform duration-200 ${mobileSub === item.label ? "rotate-180" : ""}`}
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
                              className="block pl-6 pr-4 py-2.5 text-[0.68rem] tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
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
              <div className="px-4 py-5 border-t border-neutral-100 dark:border-neutral-800 space-y-0.5">
                {user ? (
                  <>
                    <p className="text-[0.5rem] tracking-[0.18em] uppercase text-neutral-400 px-2 mb-2">{user.name}</p>
                    {(user.role === 'admin' || user.role === 'créateur') && (
                      <Link
                        href={user.role === 'admin' ? '/admin/produits/nouveau' : '/createur/produits/nouveau'}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <span className="text-base leading-none">+</span>
                        Nouveau produit
                      </Link>
                    )}
                    <Link
                      href={user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur/produits' : '/compte'}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <LayoutDashboard size={13} strokeWidth={1.5} />
                      {user.role === 'admin' ? 'Administration' : 'Mon espace'}
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg w-full text-left text-[0.65rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <LogOut size={13} strokeWidth={1.5} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    href="/connexion"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <User size={13} strokeWidth={1.5} />
                    Se connecter
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
