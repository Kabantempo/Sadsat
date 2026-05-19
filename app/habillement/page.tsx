import Link from "next/link";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/shared/ProductGrid";

export const metadata = {
  title: "Habillement — SADSAT × HACKCYCLE",
  description: "HACKCYCLE : un sabotage textile. Créations originales à partir de récupération et bio-matériaux.",
};

export default async function Habillement() {
  const products = (await getProducts()).filter(
    (p) => p.universe === "habillement" && p.status !== "masqué"
  );
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-8">

        {/* Manifeste */}
        <div className="mb-24">
          <p className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-neutral-600 mb-6">
            SADSAT × Habillement
          </p>
          <h1 className="font-serif font-light text-6xl md:text-7xl italic text-neutral-100 mb-10 leading-none">
            HACKCYCLE
          </h1>

          <div className="space-y-5 mb-12">
            <p className="font-serif italic text-xl text-neutral-300 leading-relaxed">
              n'est pas une marque de vêtements,<br />
              c'est un sabotage textile.
            </p>
            <p className="text-[0.88rem] text-neutral-500 leading-relaxed">
              Un projet qui refuse les logiques de production industrielle.
              Refuse de produire vite. Refuse de produire trop.
            </p>
            <p className="text-[0.88rem] text-neutral-400 leading-relaxed">
              HACKCYCLE propose des créations originales, accessibles, responsables et humaines.
              Chaque pièce est unique, fabriquée à partir de récupération ou de bio-matériaux.
            </p>
            <p className="text-[0.88rem] text-neutral-500 leading-relaxed">
              L'objectif : corrompre collectivement les logiques ultra-consuméristes
              et propager le beau et l'audacieux comme un virus.
            </p>
          </div>

          <div className="border-l-2 border-neutral-700 pl-6 py-2">
            <p className="font-serif italic text-neutral-300 text-lg mb-6">
              Reprenons le contrôle sur ce qui nous habille.<br />
              Pour une mode punk, libre et vivante.
            </p>
            <p className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-neutral-500">
              Rejoins l'hacking social.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-800 mb-24" />

        {/* Deux offres */}
        <div className="space-y-20">

          {/* Petit budget */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16">
            <div>
              <p className="font-mono text-[0.52rem] tracking-[0.25em] uppercase text-neutral-600 mb-2">01</p>
              <h2 className="font-serif italic text-2xl text-neutral-100 leading-tight">
                Petit<br />budget
              </h2>
            </div>
            <div>
              <p className="text-[0.88rem] text-neutral-400 leading-relaxed mb-6">
                Indique les matières premières que tu souhaites fournir (vêtements, tissus,
                accessoires, chutes, etc.), joins-les en photos, puis décris l'essence de la
                pièce que tu aimerais obtenir ainsi que ton budget.
              </p>
              <p className="text-[0.88rem] text-neutral-500 leading-relaxed mb-8">
                À partir de ces éléments, je pourrai te proposer un devis accompagné de
                croquis préparatoires. Pour l'étape suivante, j'aurais besoin de tes
                mensurations pour adapter la pièce et j'estimerais le délai de production.
              </p>
              <Link
                href="/contact"
                className="inline-block text-[0.62rem] tracking-[0.22em] uppercase text-neutral-300 border border-neutral-700 hover:border-neutral-400 hover:text-neutral-100 px-6 py-3 transition-colors"
              >
                Contacter →
              </Link>
            </div>
          </div>

          {/* Budget plus libre */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16">
            <div>
              <p className="font-mono text-[0.52rem] tracking-[0.25em] uppercase text-neutral-600 mb-2">02</p>
              <h2 className="font-serif italic text-2xl text-neutral-100 leading-tight">
                Budget<br />plus libre
              </h2>
            </div>
            <div>
              <p className="text-[0.88rem] text-neutral-400 leading-relaxed mb-6">
                Il est également possible de commander une pièce sans fournir de matières
                premières. Dans ce cas, les prix seront fixés par mes soins, tout comme le
                choix des tissus, matières et motifs, en fonction de la direction artistique
                du projet.
              </p>
              <p className="text-[0.88rem] text-neutral-500 leading-relaxed mb-8">
                Décris-moi l'essence de la pièce que tu aimerais obtenir et laisse la magie
                opérer. Je t'enverrai les croquis préparatoires une fois la récupération des
                matières premières terminée. Pour l'étape suivante, j'aurais besoin de tes
                mensurations pour adapter la pièce et j'estimerais le délai de production.
              </p>
              <Link
                href="/contact"
                className="inline-block text-[0.62rem] tracking-[0.22em] uppercase text-neutral-300 border border-neutral-700 hover:border-neutral-400 hover:text-neutral-100 px-6 py-3 transition-colors"
              >
                Contacter →
              </Link>
            </div>
          </div>
        </div>

        {/* Produits */}
        {products.length > 0 && (
          <>
            <div className="w-full h-px bg-neutral-800 mb-16 mt-8" />
            <div className="mb-24">
              <p className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-neutral-600 mb-10">
                Les pièces
              </p>
              <ProductGrid products={products} theme="dark" />
            </div>
          </>
        )}

        {/* Footer manifeste */}
        <div className="mt-8 pt-12 border-t border-neutral-800 text-center">
          <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600">
            Moins de déchets · Plus d'identité · Plus de liberté
          </p>
        </div>
      </div>
    </div>
  );
}
