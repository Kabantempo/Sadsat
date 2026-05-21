export const revalidate = 30;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { getBrandCategoryBySlug } from "@/lib/brand";
import ProductGrid from "@/components/shared/ProductGrid";

type Props = { params: Promise<{ categorie: string }> };

export default async function CategoriePage({ params }: Props) {
  const { categorie } = await params;
  const cat = await getBrandCategoryBySlug('taxidermie', categorie)
  if (!cat) notFound();

  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter(
    (p) =>
      p.universe === "taxidermie" &&
      p.category.toLowerCase() === cat.label.toLowerCase() &&
      p.status !== "masqué"
  );

  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        <div className="flex items-center gap-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-neutral-400 mb-16">
          <Link href="/taxidermie" className="hover:text-neutral-700 transition-colors">Taxidermie</Link>
          <span>›</span>
          <span className="text-neutral-700">{cat.label}</span>
        </div>

        <div className="mb-16">
          {cat.latin && (
            <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-4 text-neutral-400">{cat.latin}</div>
          )}
          <h1 className="font-serif font-light text-6xl md:text-7xl italic mb-6">{cat.label}</h1>
          {cat.description && (
            <p className="max-w-xl text-sm leading-relaxed tracking-wide text-neutral-500">
              {cat.description}
            </p>
          )}
        </div>

        <ProductGrid
          products={categoryProducts}
          theme="light"
          emptyMessage="Aucune pièce disponible dans cette catégorie pour le moment."
        />

        <div className="mt-20 text-center">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase opacity-50">
            Toutes nos pièces sont conformes à la réglementation CITES
          </div>
        </div>
      </div>
    </div>
  );
}
