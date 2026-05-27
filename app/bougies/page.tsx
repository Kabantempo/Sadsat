export const revalidate = 30;

import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { getBrandSlides } from "@/lib/brand";
import BougiesContent from "@/components/pages/BougiesContent";
import type { CarouselItem } from "@/components/shared/ProductCarousel";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.fr'

export const metadata: Metadata = {
  title: "Spectrum N°3 — Bougies artisanales · SADSAT",
  description:
    "Bougies artisanales en cire végétale, parfums sourcés en France, mèches en coton naturel. Sans paraben ni phtalate. Collection Spectrum N°3 par SADSAT.",
  keywords: ["bougies artisanales", "Spectrum N°3", "cire végétale", "bougie parfumée France", "bougie naturelle", "mèche coton", "bougie fait main"],
  alternates: { canonical: `${BASE_URL}/bougies` },
  openGraph: {
    title: "Spectrum N°3 — Bougies artisanales · SADSAT",
    description:
      "Bougies artisanales cire végétale, parfums sourcés en France. Collection Spectrum N°3 par SADSAT.",
    type: "website",
    url: `${BASE_URL}/bougies`,
    locale: "fr_FR",
    siteName: "SADSAT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectrum N°3 — Bougies artisanales · SADSAT",
    description: "Bougies artisanales en cire végétale, parfums sourcés en France.",
  },
};

export default async function BougiesPage() {
  const [allProducts, slides] = await Promise.all([
    getProducts(),
    getBrandSlides('bougies'),
  ])
  const products = allProducts.filter(
    (p) => p.universe === "bougies" && p.status !== "masqué"
  );

  const slideItems: CarouselItem[] = slides
    .filter(s => s.mediaId)
    .map(s => ({
      id: s.id,
      title: s.title ?? '',
      subtitle: s.subtitle ?? undefined,
      image: `/api/images/${s.mediaId}`,
    }))

  const carouselItems: CarouselItem[] =
    slideItems.length > 0
      ? slideItems
      : products.length > 0
        ? products.map((p) => ({
            id: p.id,
            title: p.name,
            subtitle: p.category,
            price: `${(p.price / 100).toFixed(2)} €`,
            image: p.images[0],
            href: `/produits/${p.id}`,
          }))
        : [1, 2, 3, 4, 5, 6].map((i) => ({
            id: i,
            title: `> bougie_${String(i).padStart(2, "0")}`,
            subtitle: "// bientôt disponible",
          }));

  return <BougiesContent carouselItems={carouselItems} />;
}
