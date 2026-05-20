export const revalidate = 30;

import Link from "next/link";
import Image from "next/image";
import { getUsers } from "@/lib/db";
import { getProducts } from "@/lib/products";

export default async function CreateursPage() {
  const createurs = (await getUsers()).filter((u) => u.role === "créateur");
  const allProducts = await getProducts();

  const creatorsWithStats = createurs.map((c) => {
    const products = allProducts.filter((p) => p.createdBy === c.id && p.status !== "masqué");
    const universes = [...new Set(products.map((p) => p.universe))];
    return { ...c, productCount: products.length, universes };
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* En-tête */}
        <div className="mb-20">
          <p className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-neutral-600 mb-4">
            SADSAT
          </p>
          <h1 className="font-serif font-light text-6xl md:text-7xl italic text-neutral-100 mb-6 leading-none">
            Nos créateurs
          </h1>
          <p className="text-[0.85rem] text-neutral-500 max-w-xl leading-relaxed">
            Des artisans passionnés qui donnent vie à trois univers distincts. Explorez leurs univers, découvrez leurs créations.
          </p>
        </div>

        {creatorsWithStats.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-neutral-600">
              Les créateurs arrivent bientôt
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creatorsWithStats.map((c) => (
              <Link
                key={c.id}
                href={`/createurs/${c.id}`}
                className="group block"
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden bg-neutral-900 mb-5">
                  {c.avatar ? (
                    <Image
                      src={c.avatar}
                      alt={c.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-5xl text-neutral-700 italic">
                        {c.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Overlay survol */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-[0.6rem] tracking-[0.22em] uppercase text-white border border-white/60 px-4 py-2">
                      Voir le portfolio →
                    </span>
                  </div>
                </div>

                {/* Infos */}
                <div>
                  <h2 className="font-serif italic text-xl text-neutral-100 group-hover:text-white transition-colors mb-1">
                    {c.pseudo ?? c.name}
                  </h2>
                  {c.bio && (
                    <p className="text-[0.78rem] text-neutral-500 leading-relaxed mb-3 line-clamp-2">
                      {c.bio}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {c.universes.map((u) => (
                        <span
                          key={u}
                          className="text-[0.52rem] tracking-[0.16em] uppercase px-2 py-0.5 border border-neutral-800 text-neutral-600"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[0.6rem] text-neutral-600">
                      {c.productCount} pièce{c.productCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
