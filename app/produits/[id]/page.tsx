import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { getUserById } from "@/lib/db";
import { UNIVERSE_LABELS } from "@/lib/definitions";

export default async function FicheProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product || product.status === "masqué") notFound();

  const creator = product.createdBy ? getUserById(product.createdBy) : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-12 font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600">
          <Link href="/" className="hover:text-neutral-300 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href={`/${product.universe}`} className="hover:text-neutral-300 transition-colors">
            {UNIVERSE_LABELS[product.universe]}
          </Link>
          {creator && (
            <>
              <span>/</span>
              <Link href={`/createurs/${creator.id}`} className="hover:text-neutral-300 transition-colors">
                {creator.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-500">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Galerie photos ── */}
          <div className="space-y-3">
            {product.images.length > 0 ? (
              <>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {product.status === "vendu" && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[0.58rem] tracking-[0.2em] uppercase bg-black/80 text-neutral-400 px-3 py-1.5 border border-neutral-700">
                        Vendu
                      </span>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((img, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden bg-neutral-900">
                        <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-[3/4] bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-700 text-5xl">✦</span>
              </div>
            )}
          </div>

          {/* ── Infos produit ── */}
          <div className="flex flex-col">

            {/* Univers + catégorie */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-500">
                {UNIVERSE_LABELS[product.universe]}
              </span>
              <span className="text-neutral-700">·</span>
              <span className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600">
                {product.category}
              </span>
            </div>

            {/* Nom */}
            <h1 className="font-serif font-light text-4xl md:text-5xl italic text-neutral-100 leading-tight mb-6">
              {product.name}
            </h1>

            {/* Prix */}
            <div className="mb-8">
              <p className="font-serif text-3xl text-neutral-100">
                {(product.price / 100).toFixed(2)} <span className="text-lg text-neutral-500">€</span>
              </p>
              {product.status === "vendu" ? (
                <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-600 mt-1">
                  Cette pièce a trouvé son propriétaire
                </p>
              ) : (
                <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-600 mt-1">
                  {product.stock > 1 ? `${product.stock} exemplaires disponibles` : "Pièce unique"}
                </p>
              )}
            </div>

            {/* Séparateur */}
            <div className="h-px bg-neutral-800 mb-8" />

            {/* Description */}
            <div className="mb-8">
              <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-500 mb-3">
                Description
              </p>
              <p className="text-[0.9rem] leading-relaxed text-neutral-400 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Détails */}
            <div className="space-y-3 mb-8">
              <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-500 mb-3">
                Détails
              </p>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[0.75rem] text-neutral-600 font-mono tracking-wider uppercase">Univers</span>
                <span className="text-[0.8rem] text-neutral-300">{UNIVERSE_LABELS[product.universe]}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[0.75rem] text-neutral-600 font-mono tracking-wider uppercase">Catégorie</span>
                <span className="text-[0.8rem] text-neutral-300">{product.category}</span>
              </div>
              {product.serialNumber && (
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-[0.75rem] text-neutral-600 font-mono tracking-wider uppercase">N° de série</span>
                  <span className="text-[0.8rem] text-neutral-300 font-mono">{product.serialNumber}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[0.75rem] text-neutral-600 font-mono tracking-wider uppercase">Disponibilité</span>
                <span className={`text-[0.8rem] ${product.status === "vendu" ? "text-neutral-600" : "text-neutral-300"}`}>
                  {product.status === "vendu" ? "Vendu" : product.stock === 1 ? "Pièce unique" : `${product.stock} disponibles`}
                </span>
              </div>
            </div>

            {/* Créateur */}
            {creator && (
              <>
                <div className="h-px bg-neutral-800 mb-6" />
                <Link
                  href={`/createurs/${creator.id}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                    {creator.avatar ? (
                      <Image src={creator.avatar} alt={creator.name} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-xl text-neutral-500">{creator.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-[0.52rem] tracking-[0.24em] uppercase text-neutral-600 mb-0.5">Créateur</p>
                    <p className="font-serif italic text-lg text-neutral-300 group-hover:text-neutral-100 transition-colors">
                      {creator.name}
                    </p>
                  </div>
                  <span className="ml-auto text-[0.56rem] tracking-[0.2em] uppercase text-neutral-600 group-hover:text-neutral-300 transition-colors">
                    Voir le portfolio →
                  </span>
                </Link>
              </>
            )}

            {/* CTA contact */}
            {product.status !== "vendu" && (
              <div className="mt-8">
                <a
                  href={`mailto:contact@sadsat.fr?subject=Demande — ${encodeURIComponent(product.name)}`}
                  className="block w-full text-center py-4 bg-neutral-100 text-neutral-900 text-[0.62rem] tracking-[0.24em] uppercase font-medium hover:bg-white transition-colors"
                >
                  Contacter pour acquérir cette pièce
                </a>
                <p className="text-center text-[0.6rem] text-neutral-700 mt-3 tracking-wider">
                  Les transactions se font par messagerie directe
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
