export const revalidate = 30;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { getUserById } from "@/lib/db";
import { UNIVERSE_LABELS } from "@/lib/definitions";
import ProductAccordion from "@/components/shared/ProductAccordion";
import FavoriteButton from "@/components/shared/FavoriteButton";
import ProductVideo from "@/components/shared/ProductVideo";
import PreviewBanner from "@/components/shared/PreviewBanner";
import AddToCartButton from "@/components/shared/AddToCartButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Produit introuvable — SADSAT" };

  const title = `${product.name} — SADSAT`;
  const description = product.description.slice(0, 155);
  const image = product.images[0] ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 800, height: 600 }] : [],
      type: "website",
    },
  };
}

export default async function FicheProduitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { id } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "1";
  const product = await getProductById(id);
  if (!product) notFound();
  if (product.status === "masqué" && !isPreview) notFound();

  const creator = product.createdBy ? await getUserById(product.createdBy) : null;
  const creatorData = creator
    ? { id: creator.id, name: creator.name, avatar: creator.avatar }
    : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {isPreview && product.status === "masqué" && (
        <PreviewBanner productId={product.id} />
      )}
      <div className={`max-w-6xl mx-auto px-6 py-16 ${isPreview && product.status === "masqué" ? "pt-28" : ""}`}>

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-12 font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600">
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
            {product.video || product.images.length > 0 ? (
              <>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                  {product.video ? (
                    <ProductVideo src={product.video} />
                  ) : (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  {product.status === "vendu" && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[0.58rem] tracking-[0.2em] uppercase bg-black/80 text-neutral-400 px-3 py-1.5 border border-neutral-700">
                        Vendu
                      </span>
                    </div>
                  )}
                </div>
                {product.images.length > (product.video ? 0 : 1) && (
                  <div className="grid grid-cols-4 gap-2">
                    {(product.video ? product.images : product.images.slice(1)).map((img, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden bg-neutral-900">
                        <Image src={img} alt={`${product.name} ${i + (product.video ? 1 : 2)}`} fill className="object-cover" />
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

            {/* Nom + Favori */}
            <div className="flex items-start gap-3 mb-6">
              <h1 className="font-serif font-light text-4xl md:text-5xl italic text-neutral-100 leading-tight flex-1">
                {product.name}
              </h1>
              <FavoriteButton productId={product.id} className="mt-2 shrink-0" size={20} />
            </div>

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

            {/* Description — toujours visible */}
            <div className="mb-8">
              <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase text-neutral-500 mb-3">
                Description
              </p>
              <p className="text-[0.9rem] leading-relaxed text-neutral-400 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Accordéon détails / dimensions / créateur */}
            <ProductAccordion product={product} creator={creatorData} />

            {/* CTA panier */}
            <div className="mt-8">
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images[0] ?? null}
                category={product.category}
                universe={product.universe}
                disabled={product.status === "vendu"}
              />
              {product.status !== "vendu" && (
                <p className="text-center text-[0.6rem] text-neutral-700 mt-3 tracking-wider">
                  Paiement sécurisé · Livraison Colissimo
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
