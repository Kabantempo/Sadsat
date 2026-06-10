"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Menu, X, LayoutDashboard, LogOut, Heart, ShoppingBag } from "lucide-react";
import { logout } from "@/app/actions/auth";
import ThemeToggle from "@/components/shared/ThemeToggle";
import SearchModal from "@/components/shared/SearchModal";
import { useFavorites } from "@/components/shared/FavoritesProvider";
import { useCart } from "@/components/shared/CartProvider";

type SubItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  bordeaux?: boolean;
  dropdown?: SubItem[];
};

type NavCat = { label: string; slug: string };
type NavCategories = {
  taxidermie: NavCat[];
  bijoux: NavCat[];
  bougies: NavCat[];
  habillement: NavCat[];
};

function buildNav(cats: NavCategories): NavItem[] {
  const dd = (universe: keyof NavCategories, base: string): SubItem[] | undefined => {
    const list = cats[universe];
    if (!list?.length) return undefined;
    return list.map(c => ({ label: c.label, href: `/${base}/${c.slug}` }));
  };
  return [
    { label: "Pièces uniques", href: "/pieces-uniques", bordeaux: true },
    { label: "Crystal Pets",  href: "/taxidermie", dropdown: dd('taxidermie', 'taxidermie') },
    { label: "L0vers.cult",   href: "/bijoux",     dropdown: dd('bijoux', 'bijoux') },
    { label: "Spectrum N°3",  href: "/bougies",    dropdown: dd('bougies', 'bougies') },
    { label: "Hackcycle",     href: "/habillement",dropdown: dd('habillement', 'habillement') },
    { label: "Créateurs",     href: "/createurs" },
    { label: "Contact",       href: "/contact" },
  ];
}

type UserProp = { name: string; role: 'admin' | 'client' | 'créateur' | 'grossiste' } | null

const ease = [0.22, 1, 0.36, 1] as const;

export default function Header({ user, navCategories }: { user?: UserProp; navCategories?: NavCategories }) {
  const NAV = buildNav(navCategories ?? { taxidermie: [], bijoux: [], bougies: [], habillement: [] });
  const { count: favCount } = useFavorites();
  const { count: cartCount, openDrawer } = useCart();
  const [openMenu, setOpenMenu]         = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileSub, setMobileSub]       = useState<string | null>(null);
  const [hidden, setHidden]             = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const lastScrollY                     = useRef(0);
  const userMenuRef                     = useRef<HTMLDivElement>(null);

  const BRAND_ACCENTS: Record<string, { color: string; glow: string }> = {
    taxidermie:  { color: '#c9b896', glow: 'rgba(201,184,150,0.5)' },
    bijoux:      { color: '#8b0000', glow: 'rgba(139,0,0,0.6)'     },
    bougies:     { color: '#00ff41', glow: 'rgba(0,255,65,0.5)'    },
    habillement: { color: '#a0a0a0', glow: 'rgba(160,160,160,0.4)' },
  };
  const activeBrand = hoveredBrand ? BRAND_ACCENTS[hoveredBrand] : null;

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
        className="sticky top-0 z-50 bg-black/55 backdrop-blur-2xl text-neutral-100 transition-all duration-300"
      >
        {/* ── Bordure basse lumineuse réactive ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          animate={{
            background: activeBrand
              ? `linear-gradient(90deg, transparent 0%, ${activeBrand.color}33 15%, ${activeBrand.color} 50%, ${activeBrand.color}33 85%, transparent 100%)`
              : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)',
            boxShadow: activeBrand
              ? `0 0 16px 2px ${activeBrand.glow}`
              : 'none',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
        {/* ── Barre unique desktop ── */}
        <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 lg:px-10 lg:py-0 lg:h-16 w-full">

          {/* Gauche mobile : hamburger */}
          <button
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo — Mobile: centered, Desktop: left */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link
              href="/"
              className="font-serif italic text-[1.4rem] sm:text-[1.6rem] lg:text-2xl tracking-[0.08em] select-none bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 bg-clip-text text-transparent hover:from-amber-100 hover:via-neutral-200 hover:to-amber-100 transition-all duration-500 whitespace-nowrap"
            >
              Sadsat
              <span className="not-italic text-neutral-300 dark:text-neutral-600 ml-1.5 text-sm">✦</span>
            </Link>
          </div>

          {/* Nav desktop — hidden below lg breakpoint */}
          <nav
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1"
            onMouseLeave={() => setHoveredBrand(null)}
          >
            {NAV.map((item) => {
              const brandSlug = item.href.replace('/', '');
              const accent = BRAND_ACCENTS[brandSlug];
              return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (item.dropdown) setOpenMenu(item.label);
                  if (accent) setHoveredBrand(brandSlug);
                  else setHoveredBrand(null);
                }}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {(
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] tracking-[0.12em] uppercase transition-all duration-200 ${
                      item.bordeaux
                        ? "text-[#8b0000] hover:bg-[#8b0000]/8"
                        : "text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06]"
                    }`}
                    style={accent && hoveredBrand === brandSlug ? { color: accent.color } : undefined}
                  >
                    {item.bordeaux && <span className="w-1 h-1 rounded-full bg-[#8b0000] shrink-0" />}
                    {accent && !item.bordeaux && (
                      <motion.span
                        className="w-1 h-1 rounded-full shrink-0"
                        animate={{ background: hoveredBrand === brandSlug ? accent.color : '#404040', scale: hoveredBrand === brandSlug ? 1.5 : 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
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
                  {item.dropdown && openMenu === item.label && (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-neutral-950/90 backdrop-blur-2xl border min-w-[180px] py-2 z-50 shadow-[0_25px_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden"
                      style={{
                        borderColor: accent ? `${accent.color}30` : 'rgba(255,255,255,0.08)',
                        boxShadow: accent
                          ? `0 25px 50px rgba(0,0,0,0.8), 0 0 0 1px ${accent.color}20`
                          : undefined,
                      }}
                    >
                      {/* Accent top line */}
                      {accent && (
                        <div
                          className="absolute top-0 left-0 right-0 h-px"
                          style={{ background: `linear-gradient(90deg, transparent, ${accent.color}80, transparent)` }}
                        />
                      )}
                      {item.dropdown.map((sub, i) => (
                        <motion.div
                          key={sub.href}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.12, delay: i * 0.03 }}
                        >
                          <Link
                            href={sub.href}
                            className="block px-5 py-2.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400 transition-colors"
                            style={accent ? { ['--hover-color' as string]: accent.color } : undefined}
                            onMouseEnter={e => { if (accent) (e.currentTarget as HTMLElement).style.color = accent.color; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; }}
                          >
                            {sub.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
            })}
          </nav>

          {/* Actions desktop */}
          <div className="hidden lg:flex ml-auto items-center gap-1.5 text-neutral-400">
            <ThemeToggle />

            <SearchModal />

            {/* Icône utilisateur */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.15 }}
                  aria-label="Mon compte"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="p-1.5 lg:p-2 rounded-full hover:bg-white/[0.08] hover:text-neutral-100 transition-all"
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
                      className="absolute top-full right-0 mt-2 bg-neutral-950/90 backdrop-blur-2xl border border-white/[0.08] min-w-[200px] py-2 z-50 shadow-[0_25px_50px_rgba(0,0,0,0.7)] rounded-2xl overflow-hidden"
                    >
                      <p className="px-5 pb-2 pt-1 text-[0.52rem] tracking-[0.18em] uppercase text-neutral-500 border-b border-white/[0.07] mb-1">
                        {user.name}
                      </p>
                      {(user.role === 'admin' || user.role === 'créateur') && (
                        <Link
                          href={user.role === 'admin' ? '/admin/produits/nouveau' : '/createur/produits/nouveau'}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-5 py-2.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] transition-colors"
                        >
                          <span className="text-base leading-none">+</span>
                          Nouveau produit
                        </Link>
                      )}
                      <Link
                        href={user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur/produits' : '/compte'}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-[0.6rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] transition-colors"
                      >
                        <LayoutDashboard size={12} strokeWidth={1.5} />
                        {user.role === 'admin' ? 'Administration' : 'Mon espace'}
                      </Link>
                      <div className="border-t border-white/[0.07] mt-1 pt-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="flex items-center gap-2.5 px-5 py-2.5 w-full text-left text-[0.6rem] tracking-[0.12em] uppercase text-neutral-500 hover:text-red-400 hover:bg-white/[0.05] transition-colors"
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
                className="relative p-1.5 lg:p-2 rounded-full hover:bg-white/[0.08] hover:text-neutral-100 transition-all cursor-pointer"
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
              className="relative p-1.5 lg:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-white/25 backdrop-blur-sm border border-white/20 text-white text-[0.4rem] leading-none rounded-full w-[13px] h-[13px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </motion.button>

          </div>

          {/* Droite mobile */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-1">
            <button
              aria-label="Panier"
              onClick={openDrawer}
              className="relative p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-white/25 backdrop-blur-sm border border-white/20 text-white text-[0.4rem] leading-none rounded-full w-[12px] h-[12px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            {!user ? (
              <Link
                href="/connexion"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] tracking-[0.1em] uppercase font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 transition-colors"
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
                <Link
                  href={user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur/produits' : '/compte'}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.08] transition-all"
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
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[82vw] max-w-[340px] bg-neutral-950/95 backdrop-blur-2xl text-neutral-100 flex flex-col lg:hidden overflow-y-auto shadow-2xl rounded-r-2xl border-r border-white/[0.07]"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-serif italic text-xl tracking-[0.06em] bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 bg-clip-text text-transparent"
                >
                  Sadsat <span className="not-italic text-neutral-300 dark:text-neutral-600 text-sm">✦</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                  className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-100 hover:bg-white/[0.08] transition-all -mr-1"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Liens */}
              <nav className="flex-1 px-4 py-3 flex flex-col" aria-label="Navigation principale">
                {NAV.map((item) => (
                  <div key={item.label} className="border-b border-white/[0.06] last:border-0">
                    <div className="flex items-center">
                      {(
                        <Link
                          href={item.href}
                          onClick={() => !item.dropdown && setMobileOpen(false)}
                          className={`flex-1 py-3.5 px-2 rounded-lg text-[0.75rem] tracking-[0.12em] uppercase font-medium transition-colors ${
                            item.bordeaux ? "text-[#8b0000]" : "text-neutral-300 hover:text-neutral-100 hover:bg-white/[0.05]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.dropdown && (
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
                              className="block pl-6 pr-4 py-2.5 text-[0.68rem] tracking-[0.1em] uppercase text-neutral-500 hover:text-neutral-100 transition-colors"
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
              <div className="px-4 py-5 border-t border-white/[0.07] space-y-0.5">
                {user ? (
                  <>
                    <p className="text-[0.5rem] tracking-[0.18em] uppercase text-neutral-400 px-2 mb-2">{user.name}</p>
                    {(user.role === 'admin' || user.role === 'créateur') && (
                      <Link
                        href={user.role === 'admin' ? '/admin/produits/nouveau' : '/createur/produits/nouveau'}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] transition-colors"
                      >
                        <span className="text-base leading-none">+</span>
                        Nouveau produit
                      </Link>
                    )}
                    <Link
                      href={user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur/produits' : '/compte'}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] transition-colors"
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
                    className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06] transition-colors"
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
