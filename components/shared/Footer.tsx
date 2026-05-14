"use client";

import Link from "next/link";
import { useState } from "react";
function InstagramIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const UNIVERS = [
  { label: "Taxidermie", href: "/taxidermie" },
  { label: "Bijoux", href: "/bijoux" },
  { label: "Bougies", href: "/bougies" },
  { label: "Pièces uniques", href: "/pieces-uniques" },
];

const INFOS = [
  { label: "À propos", href: "/a-propos" },
  { label: "Livraison", href: "/livraison" },
  { label: "Retours", href: "/retours" },
  { label: "Confidentialité", href: "/confidentialite" },
];

const COMPTE = [
  { label: "Mon compte", href: "/compte" },
  { label: "Connexion", href: "/connexion" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSent(true);
  }

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400">

      {/* Corps principal */}
      <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

        {/* Colonne 1 — Marque */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div>
            <Link
              href="/"
              className="font-serif text-3xl tracking-[0.2em] uppercase text-neutral-100 hover:opacity-60 transition-opacity"
            >
              SADSAT
            </Link>
            <p className="mt-3 text-[0.6rem] tracking-[0.22em] uppercase text-neutral-600">
              Taxidermie · Bijoux · Bougies
            </p>
          </div>

          <p className="text-[0.76rem] leading-relaxed text-neutral-500 max-w-[220px]">
            Créations artisanales uniques. Faites main, en série limitée.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram SADSAT"
              className="text-neutral-600 hover:text-neutral-100 transition-colors"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Colonne 2 — Univers */}
        <div>
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-neutral-600 mb-6">
            Univers
          </p>
          <ul className="space-y-4">
            {UNIVERS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.78rem] tracking-wide text-neutral-500 hover:text-neutral-100 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 3 — Informations */}
        <div>
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-neutral-600 mb-6">
            Informations
          </p>
          <ul className="space-y-4">
            {INFOS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.78rem] tracking-wide text-neutral-500 hover:text-neutral-100 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-neutral-600 mt-10 mb-6">
            Compte
          </p>
          <ul className="space-y-4">
            {COMPTE.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.78rem] tracking-wide text-neutral-500 hover:text-neutral-100 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 4 — Newsletter */}
        <div>
          <p className="text-[0.56rem] tracking-[0.28em] uppercase text-neutral-600 mb-6">
            Rester informé
          </p>
          {sent ? (
            <p className="text-[0.76rem] text-neutral-400 leading-relaxed">
              Merci — vous recevrez nos actualités en avant-première.
            </p>
          ) : (
            <>
              <p className="text-[0.76rem] text-neutral-500 leading-relaxed mb-6">
                Nouvelles pièces, ventes privées et accès anticipé aux collections.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="bg-transparent border-b border-neutral-800 py-2.5 text-[0.78rem] text-neutral-300 placeholder:text-neutral-700 outline-none focus:border-neutral-500 transition-colors"
                />
                <button
                  type="submit"
                  className="self-start mt-1 text-[0.58rem] tracking-[0.24em] uppercase px-5 py-2.5 border border-neutral-700 text-neutral-400 hover:border-neutral-400 hover:text-neutral-100 transition-colors"
                >
                  S'inscrire
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-neutral-900 py-6 px-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[0.56rem] tracking-[0.24em] uppercase text-neutral-700">
          © 2026 SADSAT — Tous droits réservés
        </p>
        <p className="text-[0.56rem] tracking-[0.2em] uppercase text-neutral-700">
          France · Fait main
        </p>
      </div>
    </footer>
  );
}
