export const revalidate = 30;

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/shared/HeroSection";
import NewArrivals from "@/components/shared/NewArrivals";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata: Metadata = {
  title: "SADSAT — Taxidermie éthique, Bougies & Mode artisanale",
  description:
    "SADSAT réunit trois univers créatifs : Crystal Pets (taxidermie éthique), Spectrum N°3 (bougies artisanales) et Hackcycle (mode upcycling). Pièces uniques, faites main en France.",
  keywords: [
    "SADSAT",
    "taxidermie éthique France",
    "bougies artisanales cire végétale",
    "mode upcycling France",
    "pièces uniques artisanat",
    "boutique artisanale en ligne",
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "SADSAT — Trois univers, une vision",
    description:
      "Taxidermie éthique · Bougies artisanales · Mode upcycling. Édition limitée, fait main en France.",
    url: BASE_URL,
    type: "website",
    locale: "fr_FR",
    siteName: "SADSAT",
  },
  twitter: {
    card: "summary_large_image",
    title: "SADSAT — Trois univers, une vision",
    description: "Taxidermie éthique · Bougies artisanales · Mode upcycling.",
  },
}

export default async function Home() {
  return (
    <>
      <HeroSection />
      <NewArrivals />

      {/* QUI SOMMES NOUS */}
      <div className="bg-neutral-50 dark:bg-transparent">
      <section className="py-16 md:py-32 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <h3 className="font-serif font-light text-4xl md:text-5xl mb-8 text-neutral-900 dark:text-neutral-100">
          Qui sommes-nous
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mb-6 max-w-2xl mx-auto">
          SADSAT est né d'un dialogue entre créateurs indépendants : la transparence du vivant
          diaphanisé (Crystal Pets), la chaleur silencieuse de la cire (Spectrum N°3) et la liberté
          du textile recyclé (Hackcycle). Chaque marque garde sa voix, son univers, son identité.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mb-10">
          Plusieurs univers, une vision partagée.
        </p>
        <Link
          href="/a-propos"
          className="inline-block text-xs tracking-[0.3em] uppercase pb-1 border-b border-neutral-400 hover:border-neutral-900 dark:border-neutral-600 dark:hover:border-neutral-200 transition"
        >
          Lire l'histoire complète
        </Link>

      </section>
      </div>
    </>
  );
}
