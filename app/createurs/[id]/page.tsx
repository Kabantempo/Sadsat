export const revalidate = 30;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserById } from "@/lib/db";
import { getProducts } from "@/lib/products";
import { UNIVERSES, UNIVERSE_LABELS } from "@/lib/definitions";
import type { Universe, Product } from "@/lib/definitions";

function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/produits/${p.id}`} className="group relative overflow-hidden bg-neutral-900 block rounded-xl">
      <div className="relative aspect-[3/4] overflow-hidden">
        {p.images[0] ? (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900">
            <span className="text-neutral-700 text-3xl">✦</span>
          </div>
        )}

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
          <p className="font-serif italic text-lg text-white leading-tight mb-1">{p.name}</p>
          <p className="text-[0.68rem] tracking-[0.14em] uppercase text-neutral-300 mb-2">{p.category}</p>
          <p className="text-[0.82rem] text-neutral-200">{(p.price / 100).toFixed(2)} €</p>
        </div>

        {p.status === "vendu" && (
          <div className="absolute top-3 left-3">
            <span className="text-[0.56rem] tracking-[0.18em] uppercase bg-black/70 text-neutral-400 px-2.5 py-1 border border-neutral-700">
              Vendu
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function CreateurPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user || user.role !== "créateur") notFound();

  const products = (await getProducts()).filter(
    (p) => p.createdBy === id && p.status !== "masqué"
  );

  const byUniverse = Object.fromEntries(
    UNIVERSES.map((u) => [u, products.filter((p) => p.universe === u)])
  ) as Record<Universe, typeof products>;

  const activeUniverses = UNIVERSES.filter((u) => byUniverse[u].length > 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">

      {/* ── Hero plein écran ── */}
      <div className="relative h-screen flex items-end overflow-hidden">

        {/* Image de fond — avatar agrandi */}
        {user.avatar ? (
          <>
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover object-top scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent 0 40px, rgba(255,255,255,0.03) 40px 41px)"
            }} />
          </div>
        )}

        {/* Contenu hero */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-8 pb-20">
          <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Créateur SADSAT
          </p>
          <h1 className="font-serif font-light text-6xl md:text-8xl italic text-neutral-100 mb-6 leading-none">
            {user.pseudo ?? user.name}
          </h1>

          {/* Tags univers */}
          <div className="flex flex-wrap gap-2 mb-6">
            {activeUniverses.map((u) => (
              <a
                key={u}
                href={`#${u}`}
                className="text-[0.58rem] tracking-[0.2em] uppercase px-3 py-1.5 border border-neutral-600 text-neutral-400 hover:border-neutral-300 hover:text-neutral-100 transition-colors"
              >
                {UNIVERSE_LABELS[u]}
              </a>
            ))}
          </div>

          {user.bio && (
            <p className="text-[0.9rem] leading-relaxed text-neutral-400 max-w-2xl mb-4">
              {user.bio}
            </p>
          )}

          {user.instagram && (
            <a
              href={`https://instagram.com/${user.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.12em] text-neutral-500 hover:text-pink-400 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              @{user.instagram}
            </a>
          )}
        </div>

        {/* Stats flottantes */}
        <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 z-10 flex flex-col gap-6 text-right">
          <div>
            <p className="font-serif text-4xl text-neutral-100">{products.length}</p>
            <p className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-neutral-500 mt-0.5">
              Créations
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl text-neutral-100">{activeUniverses.length}</p>
            <p className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-neutral-500 mt-0.5">
              Univers
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono text-[0.56rem] tracking-[0.3em] uppercase text-neutral-600 animate-bounce">
          ↓ collections
        </div>
      </div>

      {/* ── Collections par univers ── */}
      {products.length === 0 ? (
        <div className="py-40 text-center">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-neutral-600">
            Collections à venir
          </p>
        </div>
      ) : (
        activeUniverses.map((u, uIdx) => (
          <section key={u} id={u} className="py-24">

            {/* En-tête section */}
            <div className="max-w-6xl mx-auto px-8 mb-12 flex items-end justify-between">
              <div>
                <p className="font-mono text-[0.56rem] tracking-[0.3em] uppercase text-neutral-600 mb-2">
                  {String(uIdx + 1).padStart(2, "0")}
                </p>
                <h2 className={`font-serif font-light text-4xl md:text-5xl italic ${
                  u === "bijoux" ? "text-[#8b0000]/80" : u === "bougies" ? "text-[#00ff41]/60" : "text-neutral-100"
                }`}>
                  {UNIVERSE_LABELS[u]}
                </h2>
              </div>
              <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-neutral-600 mb-2">
                {byUniverse[u].length} pièce{byUniverse[u].length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Grille masonry-style */}
            <div className="max-w-6xl mx-auto px-8">
              {byUniverse[u].length === 1 ? (
                /* 1 produit — grande carte */
                <div className="max-w-sm">
                  <ProductCard p={byUniverse[u][0]} />
                </div>
              ) : byUniverse[u].length === 2 ? (
                /* 2 produits */
                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                  {byUniverse[u].map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              ) : (
                /* 3+ produits — grille alternée */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {byUniverse[u].map((p, pIdx) => (
                    <div key={p.id} className={pIdx === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                      <ProductCard p={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Séparateur entre sections */}
            {uIdx < activeUniverses.length - 1 && (
              <div className="max-w-6xl mx-auto px-8 mt-20">
                <div className="h-px bg-neutral-900" />
              </div>
            )}
          </section>
        ))
      )}

      {/* ── Pied de page portfolio ── */}
      <div className="border-t border-neutral-900 py-20 text-center">
        <p className="font-mono text-[0.56rem] tracking-[0.3em] uppercase text-neutral-600 mb-6">
          SADSAT · Créateur
        </p>
        <p className="font-serif italic text-3xl text-neutral-300 mb-10">{user.pseudo ?? user.name}</p>
        <Link
          href="/"
          className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-200 transition-colors border-b border-neutral-800 hover:border-neutral-400 pb-0.5"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
