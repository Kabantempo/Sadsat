import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/shared/ProductGrid";

export default function PiecesUniquesPage() {
  const allProducts = getProducts();
  const available = allProducts.filter((p) => p.status !== "masqué");

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* En-tête */}
        <div className="text-center mb-20">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-neutral-400">✦</div>
          <h1 className="font-serif font-light text-6xl md:text-7xl text-neutral-900 mb-6">
            Pièces uniques
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">
            Taxidermie · Bijoux · Bougies
          </p>
          {available.length > 0 && (
            <p className="mt-4 text-[0.72rem] text-neutral-400">
              {available.length} pièce{available.length > 1 ? "s" : ""} disponible{available.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ProductGrid
          products={available}
          theme="light"
          emptyMessage="La collection arrive bientôt. Revenez nous voir."
        />
      </div>
    </div>
  );
}
