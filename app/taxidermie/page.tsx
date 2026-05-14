import Link from "next/link";
import Image from "next/image";
import Accordion, { type AccordionItem } from "@/components/shared/Accordion";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ProductCarousel, { type CarouselItem } from "@/components/shared/ProductCarousel";
import { getProducts } from "@/lib/products";

const CATEGORIES = [
  { slug: "oiseaux",    label: "Oiseaux",    latin: "Aves",      description: "Passereaux, rapaces, exotiques",    primaryImage: "/images/taxidermie/oiseaux-1.jpg",    hoverImage: "/images/taxidermie/oiseaux-2.jpg"    },
  { slug: "mammiferes", label: "Mammifères", latin: "Mammalia",  description: "Petits et grands mammifères",        primaryImage: "/images/taxidermie/mammiferes-1.jpg", hoverImage: "/images/taxidermie/mammiferes-2.jpg" },
  { slug: "insectes",   label: "Insectes",   latin: "Insecta",   description: "Entomologie & sous verre",          primaryImage: "/images/taxidermie/insectes-1.jpg",   hoverImage: "/images/taxidermie/insectes-2.jpg"   },
  { slug: "cranes",     label: "Crânes",     latin: "Crania",    description: "Crânes préparés & blanchis",        primaryImage: "/images/taxidermie/cranes-1.jpg",     hoverImage: "/images/taxidermie/cranes-2.jpg"     },
  { slug: "reptiles",   label: "Reptiles",   latin: "Reptilia",  description: "Serpents, lézards, tortues",        primaryImage: "/images/taxidermie/reptiles-1.jpg",   hoverImage: "/images/taxidermie/reptiles-2.jpg"   },
];

const PROCESS: AccordionItem[] = [
  { question: "01 — Sélection & provenance", answer: "Chaque spécimen est sourcé exclusivement depuis des mortalités naturelles, des confiscations douanières reversées, ou des élevages éthiques. Aucun animal n'est prélevé dans le seul but de la naturalisation. Chaque pièce est accompagnée de son certificat d'origine." },
  { question: "02 — Préparation", answer: "La peau est délicatement séparée du corps, dégraissée et nettoyée. Les os, lorsqu'ils sont conservés, subissent un traitement de dégraissage et de blanchiment naturel. Cette étape peut prendre plusieurs semaines pour les grandes pièces." },
  { question: "03 — Conservation", answer: "Des agents tannants naturels et des techniques de conservation à froid sont utilisés pour stabiliser les matières. Nous privilégions des méthodes issues de la tannerie traditionnelle, en évitant les produits chimiques agressifs." },
  { question: "04 — Montage & finition", answer: "La pièce est montée sur un mannequin sur mesure, positionnée dans une posture naturelle étudiée, puis fixée. Les dernières retouches — pigmentation, yeux en verre, socle — confèrent à la pièce son caractère définitif." },
];

const FAQ: AccordionItem[] = [
  { question: "Vos animaux sont-ils tués pour la taxidermie ?", answer: "Non, jamais. Toutes nos pièces proviennent d'animaux morts de cause naturelle, d'accidents, de confiscations légales ou d'élevages réglementés. La provenance de chaque spécimen est documentée et traçable." },
  { question: "Quelle est la durée de vie d'une pièce ?", answer: "Conservée correctement — à l'abri de la lumière directe, de l'humidité et des variations de température — une pièce dure plusieurs dizaines d'années, voire des siècles. Les musées naturels conservent des spécimens vieux de plus de 200 ans." },
  { question: "Comment entretenir ma pièce ?", answer: "Un dépoussiérage doux au pinceau souple une à deux fois par an suffit. Évitez l'exposition directe au soleil et les pièces humides. Nous fournissons une fiche d'entretien avec chaque commande." },
  { question: "Puis-je commander une pièce sur mesure ?", answer: "Oui. Si vous avez un animal (trouvé mort, ou issu d'un élevage) et souhaitez le faire naturaliser, contactez-nous. Nous étudions chaque demande au cas par cas selon la faisabilité et la réglementation applicable à l'espèce." },
  { question: "La taxidermie est-elle légale en France ?", answer: "Oui, sous conditions. La vente et la possession de spécimens naturalisés sont réglementées par la convention CITES. Toutes nos pièces sont conformes et accompagnées des documents légaux nécessaires." },
];

export default function TaxidermiePage() {
  const products = getProducts().filter(
    (p) => p.universe === "taxidermie" && p.status !== "masqué"
  );
  const carouselItems: CarouselItem[] =
    products.length > 0
      ? products.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: p.category,
          price: `${p.price} €`,
          image: p.images[0],
          href: "/pieces-uniques",
        }))
      : [1, 2, 3, 4, 5, 6].map((i) => ({
          id: i,
          title: `Pièce ${String(i).padStart(2, "0")}`,
          subtitle: "Bientôt disponible",
        }));

  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pb-24">

      {/* ── En-tête ── */}
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-8 text-center">
        <ScrollReveal>
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-neutral-500">— 01 —</div>
          <h1 className="font-serif font-light text-6xl md:text-7xl italic mb-6">Taxidermie</h1>
          <p className="text-sm tracking-[0.2em] uppercase opacity-60">Pièces uniques · Provenance éthique</p>
        </ScrollReveal>
      </div>

      {/* ── Définition (scroll reveal) ── */}
      <div className="max-w-3xl mx-auto px-8 mb-10">
        <ScrollReveal>
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-neutral-400 pt-1 whitespace-nowrap">
              Qu'est-ce que c'est
            </div>
            <div>
              <p className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-neutral-800 mb-5">
                La taxidermie est l'art de conserver et de présenter la dépouille d'un animal dans une apparence naturelle et vivante.
              </p>
              <p className="text-[0.84rem] leading-[1.85] text-neutral-600">
                Pratiquée depuis des siècles dans les cabinets de curiosités et les musées d'histoire naturelle, elle est aujourd'hui un médium artistique à part entière. Chez SADSAT, chaque pièce est une ode à la beauté du vivant — réalisée avec respect, patience, et une exigence absolue sur la provenance des spécimens.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Valeurs ── */}
      <div className="max-w-3xl mx-auto px-8 mb-16">
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-3 gap-px bg-neutral-200">
            {[
              { label: "Provenance éthique",          detail: "Mortalités naturelles uniquement" },
              { label: "Certification CITES",          detail: "Conformité réglementaire totale"  },
              { label: "Pièces uniques",               detail: "Aucune reproduction possible"     },
            ].map(({ label, detail }) => (
              <div key={label} className="bg-[#fafaf7] px-5 py-6 text-center">
                <p className="font-mono text-[0.56rem] tracking-[0.18em] uppercase text-neutral-400 mb-2">{detail}</p>
                <p className="font-serif text-[0.88rem] italic text-neutral-700">{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ── Processus ── */}
      <div className="max-w-3xl mx-auto px-8 mb-16">
        <ScrollReveal delay={0.05}>
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-400 mb-6">
            Notre processus
          </p>
          <Accordion items={PROCESS} theme="light" />
        </ScrollReveal>
      </div>

      {/* ── FAQ + bouton ── */}
      <div className="max-w-3xl mx-auto px-8 mb-24" id="faq">
        <ScrollReveal delay={0.05}>
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-400 mb-6">
            Questions fréquentes
          </p>
          <Accordion items={FAQ} theme="light" />
          <div className="mt-10 flex items-center gap-6">
            <Link
              href="/contact"
              className="inline-block text-[0.62rem] tracking-[0.22em] uppercase px-7 py-3.5 bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
            >
              Poser une question
            </Link>
            <Link
              href="/a-propos"
              className="text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
            >
              En savoir plus sur SADSAT →
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Carousel produits ── */}
      <div className="max-w-6xl mx-auto px-8 mb-24">
        <ScrollReveal>
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-400 mb-10">
            Nos pièces
          </p>
          <ProductCarousel items={carouselItems} theme="light" aspectRatio="portrait" />
        </ScrollReveal>
      </div>

      {/* ── Grille catégories ── */}
      <div className="max-w-6xl mx-auto px-8">
        <ScrollReveal>
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-400 mb-10">
            Explorer par catégorie
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 0.06}>
              <Link href={`/taxidermie/${cat.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-neutral-200">
                  <Image src={cat.primaryImage} alt={cat.label} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" />
                  <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                    <Image src={cat.hoverImage} alt={`${cat.label} — vue alternative`} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-6 py-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <p className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-white/70">{cat.description}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">{cat.latin}</div>
                    <h2 className="font-serif text-2xl font-light italic group-hover:opacity-60 transition-opacity duration-300">{cat.label}</h2>
                  </div>
                  <span className="text-neutral-400 text-sm mb-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-24 text-center">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase opacity-50">Toutes nos pièces sont conformes à la réglementation CITES</div>
        </div>
      </div>
    </div>
  );
}
