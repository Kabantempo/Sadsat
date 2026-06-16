export const revalidate = 30;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/products";
import { getUserById } from "@/lib/db";
import { UNIVERSE_LABELS } from "@/lib/definitions";
import ProductAccordion from "@/components/shared/ProductAccordion";
import FavoriteButton from "@/components/shared/FavoriteButton";
import PreviewBanner from "@/components/shared/PreviewBanner";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ProductGallery from "@/components/shared/ProductGallery";
import JsonLd from "@/components/shared/JsonLd";
import ReviewsSection from "@/components/shared/ReviewsSection";
import ProductGrid from "@/components/shared/ProductGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Produit introuvable — SADSAT" };

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'
  const title = `${product.name} — SADSAT`;
  const description = product.description.slice(0, 155);
  const image = product.images[0] ?? undefined;
  const canonical = `${BASE_URL}/produits/${id}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "fr_FR",
      siteName: "SADSAT",
      images: image ? [{ url: image, width: 1200, height: 900, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
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

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'
  const [creator, allProducts] = await Promise.all([
    product.createdBy ? getUserById(product.createdBy) : Promise.resolve(null),
    getProducts(),
  ]);
  const similar = allProducts
    .filter((p) => p.id !== product.id && p.universe === product.universe && p.status !== 'masqué')
    .slice(0, 4);
  const creatorData = creator
    ? { id: creator.id, name: creator.name, avatar: creator.avatar }
    : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/produits/${product.id}`,
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img),
    url: `${BASE_URL}/produits/${product.id}`,
    brand: {
      "@type": "Brand",
      name: UNIVERSE_LABELS[product.universe] ?? "SADSAT",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/produits/${product.id}`,
      priceCurrency: "EUR",
      price: (product.price / 100).toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability:
        product.status === "vendu"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "SADSAT",
        url: BASE_URL,
      },
    },
    ...(creator && {
      manufacturer: {
        "@type": "Person",
        name: creator.name,
        url: `${BASE_URL}/createurs/${creator.id}`,
      },
    }),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: UNIVERSE_LABELS[product.universe], item: `${BASE_URL}/${product.universe}` },
        { "@type": "ListItem", position: 3, name: product.name, item: `${BASE_URL}/produits/${product.id}` },
      ],
    },
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
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
          {product.images.length > 0 || product.video ? (
            <ProductGallery
              images={product.images}
              name={product.name}
              sold={product.status === "vendu"}
              video={product.video}
            />
          ) : (
            <div className="aspect-[3/4] bg-neutral-900 flex items-center justify-center">
              <span className="text-neutral-700 text-5xl">✦</span>
            </div>
          )}

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
        {/* ── Avis clients ── */}
        <ReviewsSection productId={product.id} productName={product.name} />

        {/* ── Vous aimerez aussi ── */}
        {similar.length > 0 && (
          <div className="mt-24 border-t border-neutral-800 pt-16">
            <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase text-neutral-600 mb-2">
              Dans le même univers
            </p>
            <h2 className="font-serif font-light text-2xl italic text-neutral-300 mb-10">
              Vous aimerez aussi
            </h2>
            <ProductGrid products={similar} theme="dark" />
          </div>
        )}
      </div>
    </div>
    </>
  );
}
