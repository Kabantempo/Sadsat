"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Product, Dimensions } from "@/lib/definitions";
import { UNIVERSE_LABELS } from "@/lib/definitions";

type Creator = {
  id: string;
  name: string;
  avatar?: string;
};

type Props = {
  product: Product;
  creator: Creator | null;
};

export default function ProductAccordion({ product, creator }: Props) {
  const [open, setOpen] = useState(false);

  const hasDimensions =
    product.dimensions &&
    Object.values(product.dimensions).some((v) => v !== undefined);

  return (
    <>
      {/* Chevron trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border-t border-neutral-800 pt-5 mb-0 group"
      >
        <span className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-500 group-hover:text-neutral-300 transition-colors">
          Détails & dimensions
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-neutral-600 group-hover:text-neutral-300 transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Contenu repliable */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-6 space-y-6">

          {/* Détails */}
          <div className="space-y-3">
            <div className="flex justify-between border-b border-neutral-900 pb-2">
              <span className="text-[0.7rem] text-neutral-600 font-mono tracking-wider uppercase">Univers</span>
              <span className="text-[0.78rem] text-neutral-300">{UNIVERSE_LABELS[product.universe]}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-2">
              <span className="text-[0.7rem] text-neutral-600 font-mono tracking-wider uppercase">Catégorie</span>
              <span className="text-[0.78rem] text-neutral-300">{product.category}</span>
            </div>
            {product.serialNumber && (
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[0.7rem] text-neutral-600 font-mono tracking-wider uppercase">N° de série</span>
                <span className="text-[0.78rem] text-neutral-300 font-mono">{product.serialNumber}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-neutral-900 pb-2">
              <span className="text-[0.7rem] text-neutral-600 font-mono tracking-wider uppercase">Disponibilité</span>
              <span className={`text-[0.78rem] ${product.status === "vendu" ? "text-neutral-600" : "text-neutral-300"}`}>
                {product.status === "vendu" ? "Vendu" : product.stock === 1 ? "Pièce unique" : `${product.stock} disponibles`}
              </span>
            </div>
            {product.materials && (
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[0.7rem] text-neutral-600 font-mono tracking-wider uppercase">Matériaux</span>
                <span className="text-[0.78rem] text-neutral-300 text-right max-w-[55%]">{product.materials}</span>
              </div>
            )}
          </div>

          {/* Dimensions */}
          {hasDimensions && (
            <div>
              <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-3">
                Dimensions
              </p>
              <div className="grid grid-cols-3 gap-2">
                {product.dimensions!.hauteur !== undefined && (
                  <div className="bg-neutral-900 px-3 py-3 text-center">
                    <p className="font-serif text-lg text-neutral-200">{product.dimensions!.hauteur}</p>
                    <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">Hauteur cm</p>
                  </div>
                )}
                {product.dimensions!.largeur !== undefined && (
                  <div className="bg-neutral-900 px-3 py-3 text-center">
                    <p className="font-serif text-lg text-neutral-200">{product.dimensions!.largeur}</p>
                    <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">Largeur cm</p>
                  </div>
                )}
                {product.dimensions!.profondeur !== undefined && (
                  <div className="bg-neutral-900 px-3 py-3 text-center">
                    <p className="font-serif text-lg text-neutral-200">{product.dimensions!.profondeur}</p>
                    <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">Profondeur cm</p>
                  </div>
                )}
                {product.dimensions!.diametre !== undefined && (
                  <div className="bg-neutral-900 px-3 py-3 text-center">
                    <p className="font-serif text-lg text-neutral-200">{product.dimensions!.diametre}</p>
                    <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">Diamètre cm</p>
                  </div>
                )}
                {product.dimensions!.longueur !== undefined && (
                  <div className="bg-neutral-900 px-3 py-3 text-center">
                    <p className="font-serif text-lg text-neutral-200">{product.dimensions!.longueur}</p>
                    <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">Longueur cm</p>
                  </div>
                )}
                {product.dimensions!.poids !== undefined && (
                  <div className="bg-neutral-900 px-3 py-3 text-center">
                    <p className="font-serif text-lg text-neutral-200">{product.dimensions!.poids}</p>
                    <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase text-neutral-600 mt-0.5">Poids g</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Créateur */}
          {creator && (
            <div className="border-t border-neutral-900 pt-5">
              <Link href={`/createurs/${creator.id}`} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                  {creator.avatar ? (
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-lg text-neutral-500">
                        {creator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase text-neutral-600 mb-0.5">Créateur</p>
                  <p className="font-serif italic text-base text-neutral-300 group-hover:text-neutral-100 transition-colors">
                    {creator.name}
                  </p>
                </div>
                <span className="ml-auto text-[0.54rem] tracking-[0.18em] uppercase text-neutral-600 group-hover:text-neutral-300 transition-colors">
                  Portfolio →
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
