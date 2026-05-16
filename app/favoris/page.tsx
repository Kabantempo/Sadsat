import { getProducts } from "@/lib/products";
import FavoritesContent from "@/components/pages/FavoritesContent";
import { Heart } from "lucide-react";

export default async function FavorisPage() {
  const allProducts = (await getProducts()).filter((p) => p.status !== "masqué");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart size={18} strokeWidth={1.5} className="text-red-500 fill-red-500" />
          <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600">
            Mes favoris
          </p>
        </div>
        <h1 className="font-serif font-light text-5xl italic text-neutral-100 mb-16">
          Vos pièces sauvegardées
        </h1>
        <FavoritesContent allProducts={allProducts} />
      </div>
    </div>
  );
}
