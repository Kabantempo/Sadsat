"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { label: "Taxidermie", href: "/taxidermie" },
  { label: "Bijoux", href: "/bijoux" },
  { label: "Bougies", href: "/bougies" },
  { label: "Pièces uniques", href: "/pieces-uniques" },
  { label: "Créateurs", href: "/createurs" },
  { label: "Contact", href: "/contact" },
  { label: "À propos", href: "/a-propos" },
  { label: "Mon compte", href: "/compte" },
];

function InstagramIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSent(true);
  }

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto px-8 py-24 flex flex-col items-center text-center gap-16">

        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-5xl md:text-6xl tracking-[0.18em] uppercase text-neutral-100 hover:opacity-50 transition-opacity duration-300"
        >
          SADSAT
        </Link>

        {/* Liens */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {NAV.map((l) =>
            l.label === 'Bougies' ? (
              <span
                key={l.href}
                className="text-[0.65rem] tracking-[0.22em] uppercase text-neutral-700 cursor-default select-none"
              >
                {l.label}
              </span>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-[0.65rem] tracking-[0.22em] uppercase text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* Newsletter */}
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div>
            <p className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-neutral-400 mb-1">
              Newsletter
            </p>
            <p className="text-[0.72rem] text-neutral-600 tracking-wide">
              Recevez nos nouvelles pièces en avant-première
            </p>
          </div>
          {sent ? (
            <p className="text-[0.72rem] tracking-wide text-neutral-500">
              Merci — vous recevrez nos actualités en avant-première.
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-[0.72rem] text-neutral-300 placeholder:text-neutral-700 outline-none focus:border-neutral-600 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 border border-neutral-800 rounded-lg text-[0.6rem] tracking-[0.22em] uppercase text-neutral-500 hover:bg-neutral-900 hover:text-neutral-100 transition-colors duration-200 whitespace-nowrap"
              >
                S'inscrire
              </button>
            </form>
          )}
        </div>

        {/* Légal */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/mentions-legales" className="text-[0.54rem] tracking-[0.2em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors">
            Mentions légales
          </Link>
          <Link href="/cgv" className="text-[0.54rem] tracking-[0.2em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors">
            CGV
          </Link>
          <Link href="/confidentialite" className="text-[0.54rem] tracking-[0.2em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors">
            Confidentialité
          </Link>
        </div>

        {/* Bas */}
        <div className="flex items-center justify-between w-full border-t border-neutral-900 pt-8">
          <p className="text-[0.54rem] tracking-[0.22em] uppercase text-neutral-700">
            © 2026 SADSAT — France · Fait main
          </p>
          <a
            href="#"
            aria-label="Instagram SADSAT"
            className="text-neutral-700 hover:text-neutral-400 transition-colors"
          >
            <InstagramIcon />
          </a>
          <p className="text-[0.54rem] tracking-[0.22em] uppercase text-neutral-700">
            Tous droits réservés
          </p>
        </div>

      </div>
    </footer>
  );
}
