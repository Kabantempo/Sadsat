import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserById } from "@/lib/db";
import { getProducts } from "@/lib/products";
import { UNIVERSE_LABELS } from "@/lib/definitions";
import type { Universe } from "@/lib/definitions";

const UNIVERSES: Universe[] = ["taxidermie", "bijoux", "bougies"];

export default async function CreateurPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = getUserById(id);

  if (!user || user.role !== "créateur") notFound();

  const products = getProducts().filter(
    (p) => p.createdBy === id && p.status !== "masqué"
  );

  const byUniverse = Object.fromEntries(
    UNIVERSES.map((u) => [u, products.filter((p) => p.universe === u)])
  ) as Record<Universe, typeof products>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-8">

        {/* En-tête créateur */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-24">
          {/* Avatar */}
          <div className="shrink-0 w-32 h-32 md:w-44 md:h-44 overflow-hidden bg-neutral-800">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={176} height={176} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-serif text-neutral-500">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="text-center md:text-left">
            <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-neutral-500 mb-3">
              Créateur SADSAT
            </p>
            <h1 className="font-serif font-light text-4xl md:text-5xl italic text-neutral-100 mb-4">
              {user.name}
            </h1>
            {user.bio && (
              <p className="text-[0.88rem] leading-relaxed text-neutral-400 max-w-xl">
                {user.bio}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {UNIVERSES.filter((u) => byUniverse[u].length > 0).map((u) => (
                <span
                  key={u}
                  className="text-[0.58rem] tracking-[0.16em] uppercase px-3 py-1 border border-neutral-700 text-neutral-500"
                >
                  {UNIVERSE_LABELS[u]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Produits par univers */}
        {products.length === 0 ? (
          <p className="text-center text-neutral-500 text-[0.82rem] italic">
            Aucun produit disponible pour l'instant.
          </p>
        ) : (
          UNIVERSES.filter((u) => byUniverse[u].length > 0).map((u) => (
            <section key={u} className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <p className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-neutral-500">
                  {UNIVERSE_LABELS[u]}
                </p>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {byUniverse[u].map((p) => (
                  <div key={p.id} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-3">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-neutral-700 text-2xl">✦</span>
                        </div>
                      )}
                      {p.status === "vendu" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-300 border border-neutral-500 px-3 py-1">
                            Vendu
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[0.82rem] text-neutral-300 leading-tight mb-1">{p.name}</p>
                    <p className="text-[0.72rem] text-neutral-500">
                      {(p.price / 100).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-200 transition-colors underline underline-offset-4"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
