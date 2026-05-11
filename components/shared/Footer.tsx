"use client";

import Link from "next/link";
import { useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2 } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

type LinkItem = { label: string; href: string };
type SocialEntry = { label: string; href: string; render: () => ReactElement };

const SADSAT_LINKS: LinkItem[] = [
  { label: "Sale", href: "/sale" },
  { label: "Cartes cadeau", href: "/cartes-cadeau" },
  { label: "Politique boutique", href: "/politique-boutique" },
  { label: "Précommandes", href: "/precommandes" },
  { label: "Réservations", href: "/reservations" },
];

const AIDE_LINKS: LinkItem[] = [
  { label: "Livraison", href: "/livraison" },
  { label: "Retours", href: "/retours" },
  { label: "Guide des tailles", href: "/guide-tailles" },
  { label: "FAQ", href: "/faq" },
];

const CONTACT_LINKS: LinkItem[] = [
  { label: "Mon compte", href: "/compte" },
  { label: "Nous contacter", href: "/contact" },
];


const SOCIALS: SocialEntry[] = [
  { label: "Instagram", href: "#", render: () => <InstagramIcon /> },
  { label: "TikTok", href: "#", render: () => <Music2 size={17} strokeWidth={1.5} /> },
  { label: "Facebook", href: "#", render: () => <FacebookIcon /> },
  { label: "Twitter", href: "#", render: () => <TwitterIcon /> },
  { label: "Youtube", href: "#", render: () => <YoutubeIcon /> },
];

// Variants réutilisables
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const colVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

function FooterLinks({ title, links }: { title: string; links: LinkItem[] }) {
  return (
    <>
      <p className="text-[0.55rem] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-10">
        {title}
      </p>
      <ul className="flex flex-col gap-5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group relative text-[0.75rem] tracking-wide text-neutral-600 hover:text-neutral-900 transition-colors pb-px"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-neutral-400 transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Footer() {
  const [showBanner, setShowBanner] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="bg-white border-t border-neutral-200 text-neutral-900">

        {/* Grille 5 colonnes — apparition en décalé au scroll */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 divide-y divide-neutral-200 md:divide-y-0 md:divide-x md:divide-neutral-200 pt-16 pb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {/* Col 1 — Logo + réseaux */}
          <motion.div
            variants={colVariant}
            className="flex flex-col gap-10 px-6 md:pl-16 md:pr-12 py-8 md:py-0"
          >
            <Link
              href="/"
              className="font-serif text-5xl tracking-[0.18em] uppercase text-neutral-900 select-none leading-none transition-opacity hover:opacity-60 duration-300"
            >
              SADSAT
            </Link>
            <p className="text-[0.65rem] tracking-[0.15em] text-neutral-500 leading-relaxed uppercase">
              Taxidermie · Bijoux · Bougies
            </p>
            <div className="flex items-center gap-5">
              {SOCIALS.map(({ label, href, render }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                  whileHover={{ scale: 1.18, y: -2 }}
                  transition={{ duration: 0.15 }}
                >
                  {render()}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Col 2 — SADSAT */}
          <motion.div
            variants={colVariant}
            className="flex flex-col px-6 md:px-12 py-8 md:py-0"
          >
            <FooterLinks title="SADSAT" links={SADSAT_LINKS} />
          </motion.div>

          {/* Col 3 — Aide */}
          <motion.div
            variants={colVariant}
            className="flex flex-col px-6 md:px-12 py-8 md:py-0"
          >
            <FooterLinks title="Aide" links={AIDE_LINKS} />
          </motion.div>

          {/* Col 4 — Contact */}
          <motion.div
            variants={colVariant}
            className="flex flex-col px-6 md:px-12 py-8 md:py-0"
          >
            <FooterLinks title="Contact" links={CONTACT_LINKS} />
          </motion.div>

          {/* Col 5 — Newsletter */}
          <motion.div
            variants={colVariant}
            className="flex flex-col gap-8 px-6 md:pl-12 md:pr-16 py-8 md:py-0"
          >
            <div className="flex flex-col gap-3">
              <p className="font-serif italic text-2xl text-neutral-900 leading-snug">
                Plus jamais<br />sans nous
              </p>
              <p className="text-[0.68rem] text-neutral-600 leading-loose">
                — toi, après avoir rejoint l&apos;atelier.
                Nouvelles pièces, ventes privées, accès anticipé.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Prénom"
                aria-label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-b border-neutral-200 bg-transparent py-3 text-[0.75rem] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors duration-300"
              />
              <input
                type="email"
                placeholder="Email"
                aria-label="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b border-neutral-200 bg-transparent py-3 text-[0.75rem] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-colors duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="mt-3 bg-neutral-900 text-white text-[0.58rem] tracking-[0.25em] uppercase font-semibold px-6 py-4 hover:bg-black transition-colors self-start"
              >
                REJOINDRE
              </motion.button>
            </div>

          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-neutral-200 py-7 px-6 md:px-16 flex items-center justify-between"
        >
          <p className="text-[0.58rem] tracking-[0.28em] uppercase text-neutral-500">
            SADSAT · © 2026 · Tous droits réservés.
          </p>
          <p className="text-[0.58rem] tracking-[0.2em] uppercase text-neutral-500">
            France
          </p>
        </motion.div>
      </footer>

      {/* Bouton flottant */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 left-8 z-40 flex items-center gap-4 bg-neutral-900 text-white px-6 py-3.5"
          >
            <span className="text-[0.62rem] tracking-[0.2em] uppercase font-medium">
              🔥 NOUVEAUTÉS
            </span>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Fermer"
              className="text-neutral-400 hover:text-white transition-colors text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
