export const metadata = {
  title: "Mentions légales — SADSAT",
  description: "Mentions légales du site SADSAT, boutique artisanale française.",
};

const SECTIONS = [
  {
    title: "Éditeur du site",
    content: `SADSAT est édité par [Prénom NOM], auto-entrepreneur.
Adresse : [Votre adresse complète], France
Email : contact@sadsat.fr
SIRET : [À compléter après immatriculation]
Non assujetti à la TVA (article 293 B du CGI)`,
  },
  {
    title: "Directeur de la publication",
    content: `[Prénom NOM], en qualité d'auto-entrepreneur responsable de l'activité SADSAT.`,
  },
  {
    title: "Hébergement",
    content: `Ce site est hébergé par :
Hostinger International Ltd
61 Lordou Vironos Street, 6023 Larnaca, Chypre
https://www.hostinger.fr`,
  },
  {
    title: "Propriété intellectuelle",
    content: `L'ensemble du contenu de ce site (textes, photographies, visuels, logos, illustrations) est protégé par le droit d'auteur. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.`,
  },
  {
    title: "Données personnelles",
    content: `Le traitement de vos données personnelles est détaillé dans notre Politique de confidentialité. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits : contact@sadsat.fr.`,
  },
  {
    title: "Cookies",
    content: `Le site utilise des cookies strictement nécessaires à son fonctionnement (session utilisateur, panier). Aucun cookie publicitaire n'est déposé sans votre consentement.`,
  },
  {
    title: "Liens hypertextes",
    content: `SADSAT ne peut être tenu responsable du contenu des sites tiers vers lesquels des liens peuvent pointer. La mise en place d'un lien vers ce site nécessite une autorisation préalable écrite.`,
  },
  {
    title: "Droit applicable",
    content: `Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.`,
  },
];

export default function MentionsLegalesPage() {
  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-8">

        <div className="mb-20">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Informations légales
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl italic mb-6">
            Mentions<br />légales.
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
            Dernière mise à jour : mai 2026
          </p>
        </div>

        <div className="w-16 h-px bg-neutral-300 mb-20" />

        <div className="flex flex-col gap-16">
          {SECTIONS.map((section, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">
              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-neutral-400 mb-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="font-serif italic text-lg text-neutral-800">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 pt-1 whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-neutral-200">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-neutral-400">
            SADSAT · Auto-entrepreneur · France
          </p>
        </div>
      </div>
    </div>
  );
}
