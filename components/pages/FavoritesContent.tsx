"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/components/shared/FavoritesProvider";
import type { Product } from "@/lib/definitions";

export default function FavoritesContent({ allProducts }: { allProducts: Product[] }) {
  const { favorites, toggle } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="py-32 text-center">
        <p className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-neutral-600">
          Chargement…
        </p>
      </div>
    );
  }

  const favProducts = allProducts.filter((p) => favorites.includes(p.id));

  if (favProducts.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center gap-5 text-center">
        <Heart size={40} strokeWidth={1} className="text-neutral-700" />
        <p className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-neutral-500">
          Aucun favori pour l'instant
        </p>
        <Link
          href="/pieces-uniques"
          className="text-[0.6rem] tracking-[0.18em] uppercase text-neutral-500 hover:text-neutral-100 transition-colors border-b border-neutral-700 hover:border-neutral-400 pb-0.5 mt-2"
        >
          Découvrir les pièces →
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-600 mb-10">
        {favProducts.length} pièce{favProducts.length > 1 ? "s" : ""} sauvegardée{favProducts.length > 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favProducts.map((p) => (
          <div key={p.id} className="group relative">
            <Link href={`/produits/${p.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-4">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700 text-3xl">✦</div>
                )}
                {p.status === "vendu" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-[0.58rem] tracking-[0.2em] uppercase bg-black/70 text-neutral-400 px-3 py-1.5 border border-neutral-700">
                      Vendu
                    </span>
                  </div>
                )}
              </div>
              <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-1">{p.category}</p>
              <p className="font-serif italic text-[0.95rem] text-neutral-200 mb-1">{p.name}</p>
              <p className="text-[0.8rem] text-neutral-500">{(p.price / 100).toFixed(2)} €</p>
            </Link>
            <button
              onClick={() => toggle(p.id)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Retirer des favoris"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
