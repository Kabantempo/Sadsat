const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata = {
  title: "Conditions Générales de Vente — SADSAT",
  description: "Conditions générales de vente de la boutique artisanale SADSAT : commandes, paiement, livraison, retours et garanties.",
  alternates: { canonical: `${BASE_URL}/cgv` },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    title: "Objet",
    content: `Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits artisanaux réalisées sur le site sadsat.com par DOUCENDE VINCENT, entrepreneur individuel (SIRET : 989 034 061 00014), ci-après dénommé « SADSAT ».

Toute commande implique l'acceptation pleine et entière des présentes CGV.`,
  },
  {
    title: "Produits",
    content: `Les produits proposés sont des créations artisanales faites main, en série limitée, dans les univers suivants : taxidermie, bijoux et bougies. Chaque pièce est unique ou produite en petite série ; des variations légères de teinte, de texture ou de dimensions font partie de l'authenticité de l'objet artisanal.

Les photographies et descriptions sont aussi fidèles que possible mais ne sont pas contractuellement garanties à l'identique.`,
  },
  {
    title: "Prix",
    content: `Les prix sont indiqués en euros, toutes taxes comprises (TTC). SADSAT bénéficie de la franchise de TVA (article 293 B du CGI) — aucune TVA n'est applicable.

SADSAT se réserve le droit de modifier ses prix à tout moment. Les commandes sont facturées au prix en vigueur au moment de la validation.`,
  },
  {
    title: "Commande",
    content: `La commande est validée après :
1. Sélection des produits et ajout au panier
2. Renseignement des coordonnées et de l'adresse de livraison
3. Choix du mode de paiement
4. Confirmation et paiement

Un email de confirmation est adressé dès réception du paiement. SADSAT se réserve le droit d'annuler toute commande en cas de rupture de stock ou d'anomalie manifeste de prix, avec remboursement intégral.`,
  },
  {
    title: "Paiement",
    content: `Le paiement est exigible à la commande. Les moyens de paiement acceptés sont : carte bancaire (Visa, Mastercard, American Express) via prestataire sécurisé.

Les données de paiement ne sont pas stockées sur les serveurs de SADSAT ; elles sont traitées par notre prestataire de paiement dans un environnement sécurisé SSL.`,
  },
  {
    title: "Livraison",
    content: `Les commandes sont expédiées dans un délai de [X à Y jours ouvrés] après confirmation du paiement, par [Colissimo / Mondial Relay / …].

Les délais de livraison sont donnés à titre indicatif. SADSAT ne saurait être tenu responsable des retards imputables au transporteur ou à des événements de force majeure.

Les frais de port sont indiqués au moment de la commande. La livraison est offerte à partir de [XX €] d'achat.`,
  },
  {
    title: "Droit de rétractation",
    content: `Conformément aux articles L.221-18 et suivants du Code de la consommation, vous disposez d'un délai de 14 jours à compter de la réception du colis pour exercer votre droit de rétractation, sans motif à donner.

Pour l'exercer, contactez-nous à contact@sadsat.com avant expiration du délai. Les frais de retour sont à la charge du client.

Exception : les pièces de taxidermie personnalisées ou fabriquées sur mesure ne sont pas éligibles au droit de rétractation (article L.221-28 du Code de la consommation).`,
  },
  {
    title: "Retours et remboursements",
    content: `Les retours doivent être effectués dans leur emballage d'origine, en parfait état, dans les 14 jours suivant l'exercice du droit de rétractation. Le remboursement intervient dans un délai de 14 jours après réception du retour, par le même moyen de paiement que celui utilisé lors de la commande.`,
  },
  {
    title: "Garanties légales",
    content: `Tous les produits bénéficient des garanties légales prévues par le Code de la consommation :
• Garantie légale de conformité (articles L.217-4 et suivants)
• Garantie des vices cachés (articles 1641 et suivants du Code civil)

Pour toute demande, contactez : contact@sadsat.com`,
  },
  {
    title: "Responsabilité",
    content: `SADSAT ne saurait être tenu responsable des dommages indirects consécutifs à l'utilisation des produits. La responsabilité est limitée au montant de la commande concernée.`,
  },
  {
    title: "Litiges",
    content: `En cas de litige, une solution amiable sera recherchée en priorité. En cas d'échec, le client peut recourir à la médiation de la consommation via la plateforme européenne : https://ec.europa.eu/consumers/odr

À défaut de résolution amiable, les tribunaux français seront seuls compétents. Le droit français est applicable.`,
  },
];

export default function CGVPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#fafaf7] dark:bg-neutral-950 text-[#1a1a1a] dark:text-neutral-100">
      <div className="max-w-3xl mx-auto px-8">

        <div className="mb-20">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Conditions générales de vente
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl italic mb-6">
            CGV.
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
            Dernière mise à jour : mai 2026
          </p>
        </div>

        <div className="w-16 h-px bg-neutral-300 dark:bg-neutral-700 mb-20" />

        <div className="flex flex-col gap-16">
          {SECTIONS.map((section, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">
              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-neutral-400 mb-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="font-serif italic text-lg text-neutral-800 dark:text-neutral-200">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 pt-1 whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-neutral-400">
            SADSAT · Auto-entrepreneur · France
          </p>
        </div>
      </div>
    </div>
  );
}
