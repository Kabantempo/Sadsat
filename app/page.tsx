export const revalidate = 30;

import type { Metadata } from "next";
import Link from "next/link";
import { getUsers } from "@/lib/db";
import { getProducts } from "@/lib/products";
import HeroSection from "@/components/shared/HeroSection";
import ScrollStory from "@/components/shared/ScrollStory";
import CreateurCarousel, { type CreateurCard } from "@/components/shared/CreateurCarousel";
import { UNIVERSES, UNIVERSE_LABELS } from "@/lib/definitions";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata: Metadata = {
  title: "SADSAT — Taxidermie éthique, Bijoux, Bougies & Mode artisanale",
  description:
    "SADSAT réunit quatre univers créatifs : Crystal Pets (taxidermie éthique), L0vers.cult (bijoux maille), Spectrum N°3 (bougies artisanales) et Hackcycle (mode upcycling). Pièces uniques, faites main en France.",
  keywords: [
    "SADSAT",
    "taxidermie éthique France",
    "bijoux maille métallique",
    "bougies artisanales cire végétale",
    "mode upcycling France",
    "pièces uniques artisanat",
    "boutique artisanale en ligne",
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "SADSAT — Quatre univers, une vision",
    description:
      "Taxidermie éthique · Bijoux en maille · Bougies artisanales · Mode upcycling. Édition limitée, fait main en France.",
    url: BASE_URL,
    type: "website",
    locale: "fr_FR",
    siteName: "SADSAT",
  },
  twitter: {
    card: "summary_large_image",
    title: "SADSAT — Quatre univers, une vision",
    description: "Taxidermie éthique · Bijoux en maille · Bougies artisanales · Mode upcycling.",
  },
}

export default async function Home() {
  try {
    console.log('[Home] Starting render...');
    const [users, products] = await Promise.all([
      getUsers().then(u => { console.log('[Home] getUsers() OK:', u?.length); return u; }).catch(e => { console.error('[Home] getUsers() failed:', e.message); return []; }),
      getProducts().then(p => { console.log('[Home] getProducts() OK:', p?.length); return p; }).catch(e => { console.error('[Home] getProducts() failed:', e.message); return []; }),
    ]);
    console.log('[Home] Data loaded, creating createurs...');

    const createurs: CreateurCard[] = (users || [])
      .filter((u) => u.role === "créateur")
      .filter((u) => {
        const hasProducts = (products || []).some((p) => p.createdBy === u.id && p.status !== "masqué")
        return u.avatar || u.bio || hasProducts
      })
      .map((u) => {
        const myProducts = (products || []).filter(
          (p) => p.createdBy === u.id && p.status !== "masqué"
        );
        const universes = UNIVERSES.filter((uv) =>
          myProducts.some((p) => p.universe === uv)
        ).map((uv) => UNIVERSE_LABELS[uv]);
        return {
          id: u.id,
          name: u.name,
          pseudo: u.pseudo,
          bio: u.bio,
          avatar: u.avatar,
          universes,
          instagram: u.instagram,
        };
      });

  const instagrams = createurs
    .filter((c) => c.instagram)
    .map((c) => ({ name: c.name, handle: c.instagram! }));

  return (
    <>
      <HeroSection />
      <ScrollStory instagrams={instagrams} />

      {/* QUI SOMMES NOUS */}
      <section className="py-16 md:py-32 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <h3 className="font-serif font-light text-4xl md:text-5xl mb-8 text-neutral-100">
          Qui sommes-nous
        </h3>
        <p className="text-neutral-400 leading-relaxed font-light mb-6 max-w-2xl mx-auto">
          SADSAT est né d'un dialogue entre trois langages : la délicatesse du vivant figé,
          la brutalité du métal travaillé, et la chaleur silencieuse de la cire. Chaque pièce
          est faite main, en série limitée, dans un même atelier — par les mêmes mains.
        </p>
        <p className="text-neutral-400 leading-relaxed font-light mb-10">
          Trois mondes, mais une seule signature.
        </p>
        <Link
          href="/a-propos"
          className="inline-block text-xs tracking-[0.3em] uppercase pb-1 border-b border-neutral-600 hover:border-neutral-200 transition"
        >
          Lire l'histoire complète
        </Link>

        {/* Carousel créateurs */}
        <CreateurCarousel createurs={createurs} />
      </section>
    </>
  );
  } catch (err) {
    console.error('[Home] Render error:', err);
    return (
      <>
        <HeroSection />
        <section className="py-16 md:py-32 px-4 md:px-8 max-w-5xl mx-auto text-center">
          <h3 className="font-serif font-light text-4xl md:text-5xl mb-8 text-neutral-100">Qui sommes-nous</h3>
          <p className="text-neutral-400 leading-relaxed font-light mb-6 max-w-2xl mx-auto">
            SADSAT est né d'un dialogue entre trois langages : la délicatesse du vivant figé,
            la brutalité du métal travaillé, et la chaleur silencieuse de la cire. Chaque pièce
            est faite main, en série limitée, dans un même atelier — par les mêmes mains.
          </p>
        </section>
      </>
    );
  }
}
