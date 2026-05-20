export const revalidate = 30;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/shared/ProductGrid";

const CATEGORIES: Record<string, { label: string; latin: string; description: string }> = {
  oiseaux: {
    label: "Oiseaux",
    latin: "Aves",
    description: "Passereaux, rapaces et espèces exotiques — chaque pièce est une étude du vol suspendu.",
  },
  mammiferes: {
    label: "Mammifères",
    latin: "Mammalia",
    description: "Du petit rongeur au grand gibier, la matière et la forme naturelle préservées.",
  },
  insectes: {
    label: "Insectes",
    latin: "Insecta",
    description: "Entomologie artistique — spécimens épinglés, montages sous verre et vitrines.",
  },
  cranes: {
    label: "Crânes",
    latin: "Crania",
    description: "Crânes préparés, blanchis et montés. Architecture osseuse mise en lumière.",
  },
  reptiles: {
    label: "Reptiles",
    latin: "Reptilia",
    description: "Serpents, lézards et tortues — écailles et carapaces figées dans leur perfection.",
  },
};

const SLUG_TO_CATEGORY: Record<string, string> = {
  oiseaux: "Oiseaux",
  mammiferes: "Mammifères",
  insectes: "Insectes",
  cranes: "Crânes",
  reptiles: "Reptiles",
};

type Props = { params: Promise<{ categorie: string }> };

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((categorie) => ({ categorie }));
}

export default async function CategoriePage({ params }: Props) {
  const { categorie } = await params;
  const cat = CATEGORIES[categorie];
  if (!cat) notFound();

  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter(
    (p) =>
      p.universe === "taxidermie" &&
      p.category === SLUG_TO_CATEGORY[categorie] &&
      p.status !== "masqué"
  );

  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* Fil d'Ariane */}
        <div className="flex items-center gap-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-neutral-400 mb-16">
          <Link href="/taxidermie" className="hover:text-neutral-700 transition-colors">Taxidermie</Link>
          <span>›</span>
          <span className="text-neutral-700">{cat.label}</span>
        </div>

        {/* En-tête */}
        <div className="mb-16">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-4 text-neutral-400">{cat.latin}</div>
          <h1 className="font-serif font-light text-6xl md:text-7xl italic mb-6">{cat.label}</h1>
          <p className="max-w-xl text-sm leading-relaxed tracking-wide text-neutral-500">
            {cat.description}
          </p>
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
