import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { UNIVERSE_LABELS, universePath, type Product, type Universe } from "@/lib/definitions";

// Les nouveautés de chaque univers, en bas de l'accueil. Un univers sans pièce disponible n'a pas de rangée.
const ROWS: Universe[] = ["taxidermie", "habillement", "bougies", "pieces-uniques"];
const PER_ROW = 4;
const DOTS: Partial<Record<Universe, string>> = { taxidermie: "#19bdb8", bougies: "#00ff41", habillement: "#b8a882" };

function Card({ p }: { p: Product }) {
  return (
    <Link href={`/produits/${p.id}`} className="group block w-[62vw] max-w-[260px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-900">
        {p.images[0] && (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(min-width: 768px) 25vw, 62vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="min-w-0 truncate text-[0.88rem] text-neutral-800 dark:text-neutral-200">{p.name}</h3>
        <p className="shrink-0 text-[0.82rem] tabular-nums text-neutral-600 dark:text-neutral-400">{(p.price / 100).toFixed(2)} €</p>
      </div>
      <p className="mt-0.5 text-[0.58rem] tracking-[0.18em] uppercase text-neutral-500">{p.category}</p>
    </Link>
  );
}

export default async function NewArrivals({ products }: { products?: Product[] } = {}) {
  const all = (products ?? (await getProducts())).filter((p) => p.status === "disponible" && p.stock > 0);
  const rows = ROWS.map((u) => ({ u, items: all.filter((p) => p.universe === u).slice(0, PER_ROW) })).filter((r) => r.items.length > 0);
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="nouveautes-titre" className="bg-neutral-50 dark:bg-transparent px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="nouveautes-titre" className="mb-12 text-center font-serif text-4xl font-light text-neutral-900 dark:text-neutral-100 md:text-5xl">
          Les nouveautés
        </h2>
        <div className="space-y-14">
          {rows.map(({ u, items }) => (
            <div key={u}>
              <div className="mb-5 flex items-end justify-between border-b border-neutral-300 pb-3 dark:border-neutral-800">
                <h3 className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-neutral-800 dark:text-neutral-200">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: DOTS[u] ?? "#a3a3a3" }} />
                  {UNIVERSE_LABELS[u]}
                </h3>
                <Link href={universePath(u)} className="text-[0.6rem] uppercase tracking-[0.25em] text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white">
                  Tout voir →
                </Link>
              </div>
              <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0" style={{ scrollbarWidth: "none" }}>
                {items.map((p) => <Card key={p.id} p={p} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
