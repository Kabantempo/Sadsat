export const revalidate = 30;

import type { Metadata } from "next";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Pièces uniques — SADSAT",
  description:
    "Toutes les créations uniques SADSAT réunies : taxidermie éthique, bijoux en maille, bougies artisanales et mode upcycling. Chaque pièce est faite main, en série très limitée.",
  keywords: ["pièces uniques", "artisanat français", "édition limitée", "taxidermie", "bijoux", "bougies"],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'}/pieces-uniques` },
  openGraph: {
    title: "Pièces uniques — SADSAT",
    description: "Toutes les créations SADSAT réunies. Chaque pièce est unique, faite main.",
    type: "website",
  },
}
import PiecesUniquesContent from "@/components/pages/PiecesUniquesContent";
import { getAvgRatings } from "@/lib/reviews";

export default async function PiecesUniquesPage() {
  const [allProducts, ratings] = await Promise.all([
    getProducts().then((p) => p.filter((p) => p.status !== "masqué")),
    getAvgRatings(),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* En-tête */}
        <div className="text-center mb-20">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-neutral-400">✦</div>
          <h1 className="font-serif font-light text-6xl md:text-7xl text-neutral-900 dark:text-neutral-100 mb-6">
            Pièces uniques
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">
            Crystal Pets · L0vers.cult · Spectrum N°3 · Hackcycle
          </p>
        </div>

        <PiecesUniquesContent products={allProducts} totalCount={allProducts.length} ratings={ratings} />
      </div>
    </div>
  );
}
