export const revalidate = 30;

import type { Metadata } from "next";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCarousel, { type CarouselItem } from "@/components/shared/ProductCarousel";
import BijouxDetails from "@/components/pages/BijouxDetails";
import { getProducts } from "@/lib/products";
import { getBrandSlides } from "@/lib/brand";
import type { AccordionItem } from "@/components/shared/Accordion";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata: Metadata = {
  title: "L0vers.cult — Bijoux en maille métallique · SADSAT",
  description:
    "Bijoux artisanaux en maille métallique, faits main en édition limitée. Bagues, colliers, bracelets en argent, laiton et cuivre. Collection L0vers.cult par SADSAT.",
  keywords: ["bijoux maille métallique", "L0vers.cult", "bijoux artisanaux", "bague maille", "collier maille", "bijoux fait main France", "édition limitée"],
  alternates: { canonical: `${BASE_URL}/bijoux` },
  openGraph: {
    title: "L0vers.cult — Bijoux en maille métallique · SADSAT",
    description:
      "Bijoux artisanaux en maille métallique, faits main. Bagues, colliers, bracelets. Collection L0vers.cult par SADSAT.",
    type: "website",
    url: `${BASE_URL}/bijoux`,
    locale: "fr_FR",
    siteName: "SADSAT",
  },
  twitter: {
    card: "summary_large_image",
    title: "L0vers.cult — Bijoux en maille métallique · SADSAT",
    description: "Bijoux artisanaux en maille métallique, faits main en édition limitée.",
  },
};

const FAQ: AccordionItem[] = [
  { question: "Comment nettoyer mes bijoux en maille métallique ?", answer: "Pour l'argent : utilisez un chiffon doux et sec, ou une solution d'eau tiède et de liquide vaisselle doux. Séchez immédiatement. Pour le laiton et le cuivre, du bicarbonate de soude humidifié ravive l'éclat. Évitez les produits chimiques agressifs qui altèrent la patine naturelle." },
  { question: "Les bijoux sont-ils hypoallergéniques ?", answer: "L'argent sterling 925 est généralement bien toléré. Le laiton et le cuivre peuvent provoquer des réactions chez certaines personnes — nous le précisons sur chaque fiche produit. Sur demande, certaines pièces peuvent être réalisées en argent avec finition rhodiée." },
  { question: "Combien de temps faut-il pour réaliser une pièce ?", answer: "Une bague simple demande entre 2 et 5 heures. Un collier long peut nécessiter 10 à 20 heures de travail. Chaque anneau est formé, coupé et plié à la main — c'est ce qui rend chaque pièce unique." },
  { question: "Puis-je commander sur mesure ?", answer: "Oui, c'est le cœur de notre démarche. Taille, métal, densité de maille, motif — tout est ajustable. Contactez-nous avec vos idées et votre taille (pour les bagues et bracelets) et nous vous proposerons un devis et un délai." },
  { question: "La patine change-t-elle avec le temps ?", answer: "Oui, et c'est voulu. Le laiton et le cuivre développent naturellement une patine qui approfondit les teintes — une signature vivante. Si vous souhaitez maintenir l'éclat initial, un vernis à bijoux transparent peut être appliqué." },
];

export default async function BijouxPage() {
  const [allProducts, slides] = await Promise.all([
    getProducts(),
    getBrandSlides('bijoux'),
  ])
  const products = allProducts.filter(
    (p) => p.universe === "bijoux" && p.status !== "masqué"
  );

  const slideItems: CarouselItem[] = slides
    .filter(s => s.mediaId)
    .map(s => ({
      id: s.id,
      title: s.title ?? '',
      subtitle: s.subtitle ?? undefined,
      image: `/api/images/${s.mediaId}`,
    }))

  const carouselItems: CarouselItem[] =
    slideItems.length > 0
      ? slideItems
      : products.length > 0
        ? products.map((p) => ({
            id: p.id,
            title: p.name,
            subtitle: p.category,
            price: `${(p.price / 100).toFixed(2)} €`,
            image: p.images[0],
            href: `/produits/${p.id}`,
          }))
        : [1, 2, 3, 4, 5, 6].map((i) => ({
            id: i,
            title: `Pièce ${String(i).padStart(2, "0")}`,
            subtitle: "// bientôt disponible",
          }));

  return (
    <div className="min-h-screen pb-24 bg-[#0a0a0a] text-neutral-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 6px, rgba(139,0,0,0.04) 6px 7px), radial-gradient(circle at 30% 70%, rgba(139,0,0,0.15), transparent 60%)" }} />

      <div className="max-w-6xl mx-auto px-8 relative">

        {/* ── En-tête ── */}
        <div className="pt-32 pb-24 text-center">
          <ScrollReveal>
            <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-[#8b0000]">— 02 —</div>
            <h1 className="font-sans font-bold uppercase text-6xl md:text-7xl tracking-wider mb-6" style={{ textShadow: "3px 0 #8b0000, -3px 0 #1a1a1a" }}>
              Bijoux
            </h1>
            <p className="text-sm tracking-[0.2em] uppercase opacity-60">Mailles · Métal · Sur mesure</p>
          </ScrollReveal>
        </div>

        {/* ── Définition ── */}
        <div className="max-w-3xl mx-auto mb-10">
          <ScrollReveal>
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
              <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-neutral-600 pt-1 whitespace-nowrap">
                L'art de la maille
              </div>
              <div>
                <p className="font-sans text-xl md:text-2xl font-light leading-relaxed text-neutral-200 mb-5">
                  Chaque bijou SADSAT naît d'un fil de métal, formé anneau par anneau, tressé à la main selon des techniques millénaires.
                </p>
                <p className="text-[0.84rem] leading-[1.85] text-neutral-500">
                  La maille métallique — ou <em className="text-neutral-400">chainmail</em> — est un savoir-faire ancestral originellement appliqué aux armures. Réinterprétée dans une esthétique contemporaine et sombre, elle devient ici un langage : celui d'une beauté qui ne s'excuse pas d'être tranchante.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Valeurs ── */}
        <div className="max-w-3xl mx-auto mb-16">
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-900">
              {[
                { val: "100%", label: "Fait main" },
                { val: "0",    label: "Moule ou fonte" },
                { val: "∞",   label: "Combinaisons" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-[#0a0a0a] px-5 py-6 text-center border border-neutral-900">
                  <p className="font-serif text-3xl text-neutral-300 mb-1">{val}</p>
                  <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600">{label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ── Matériaux + FAQ masqués ── */}
        <ScrollReveal delay={0.05}>
          <BijouxDetails faq={FAQ} />
        </ScrollReveal>

        {/* ── Carrousel ── */}
        <ScrollReveal>
          <ProductCarousel items={carouselItems} theme="dark" aspectRatio="square" />
        </ScrollReveal>

        <div className="mt-24 text-center border-t border-neutral-900 pt-12">
          <div className="font-sans text-sm uppercase tracking-[0.2em] mb-4 opacity-80">Commande sur mesure</div>
          <div className="font-mono text-[0.7rem] tracking-widest uppercase opacity-50">// contact pour devis personnalisé</div>
        </div>
      </div>
    </div>
  );
}
