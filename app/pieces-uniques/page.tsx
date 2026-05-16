import { getProducts } from "@/lib/products";
import PiecesUniquesContent from "@/components/pages/PiecesUniquesContent";

export default async function PiecesUniquesPage() {
  const allProducts = (await getProducts()).filter((p) => p.status !== "masqué");

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
        </div>

        <PiecesUniquesContent products={allProducts} totalCount={allProducts.length} />
      </div>
    </div>
  );
}
