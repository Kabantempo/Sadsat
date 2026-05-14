"use client";
import { useState, useMemo } from "react";
import type { Product, Universe } from "@/lib/definitions";
import { UNIVERSE_LABELS } from "@/lib/definitions";
import ProductGrid from "@/components/shared/ProductGrid";
import { SlidersHorizontal } from "lucide-react";

const UNIVERSES: Array<Universe | "tous"> = ["tous", "taxidermie", "bijoux", "bougies"];
const UNIVERS_LABELS: Record<Universe | "tous", string> = {
  tous: "Tous",
  taxidermie: "Taxidermie",
  bijoux: "Bijoux",
  bougies: "Bougies",
};

type Props = {
  products: Product[];
  totalCount: number;
};

export default function PiecesUniquesContent({ products, totalCount }: Props) {
  const [universe, setUniverse] = useState<Universe | "tous">("tous");
  const [disponibleOnly, setDisponibleOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (universe !== "tous" && p.universe !== universe) return false;
      if (disponibleOnly && p.status !== "disponible") return false;
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && p.price < min * 100) return false;
      if (!isNaN(max) && p.price > max * 100) return false;
      return true;
    });
  }, [products, universe, disponibleOnly, minPrice, maxPrice]);

  const hasFilters = universe !== "tous" || disponibleOnly || minPrice !== "" || maxPrice !== "";

  function resetFilters() {
    setUniverse("tous");
    setDisponibleOnly(false);
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <>
      {/* ── Barre de filtres ── */}
      <div className="mb-12">
        {/* Ligne 1 : univers + toggle filtres avancés */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {UNIVERSES.map((u) => (
            <button
              key={u}
              onClick={() => setUniverse(u)}
              className={`text-[0.6rem] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
                universe === u
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-500 hover:border-neutral-600 hover:text-neutral-800"
              }`}
            >
              {UNIVERS_LABELS[u]}
            </button>
          ))}

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`ml-auto flex items-center gap-1.5 text-[0.58rem] tracking-[0.18em] uppercase transition-colors ${
              filtersOpen ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <SlidersHorizontal size={12} strokeWidth={1.5} />
            Filtres
          </button>
        </div>

        {/* Ligne 2 : filtres avancés (prix + dispo) */}
        {filtersOpen && (
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-200">
            {/* Prix */}
            <div className="flex items-center gap-2">
              <span className="text-[0.58rem] tracking-[0.18em] uppercase text-neutral-500">Prix</span>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min €"
                className="w-20 border border-neutral-300 px-2 py-1.5 text-[0.78rem] text-neutral-800 outline-none focus:border-neutral-600 bg-white"
              />
              <span className="text-neutral-400 text-xs">—</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max €"
                className="w-20 border border-neutral-300 px-2 py-1.5 text-[0.78rem] text-neutral-800 outline-none focus:border-neutral-600 bg-white"
              />
            </div>

            {/* Disponible seulement */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setDisponibleOnly((v) => !v)}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  disponibleOnly ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                  disponibleOnly ? "left-4" : "left-0.5"
                }`} />
              </div>
              <span className="text-[0.58rem] tracking-[0.18em] uppercase text-neutral-500">
                Disponibles seulement
              </span>
            </label>
          </div>
        )}
      </div>

      {/* ── Compteur + reset ── */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-400">
          {filtered.length} pièce{filtered.length > 1 ? "s" : ""}
          {filtered.length !== totalCount && (
            <span className="text-neutral-300"> / {totalCount}</span>
          )}
        </p>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-[0.58rem] tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors border-b border-neutral-300 pb-0.5"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <ProductGrid
        products={filtered}
        theme="light"
        emptyMessage="Aucune pièce ne correspond à vos critères."
      />
    </>
  );
}
