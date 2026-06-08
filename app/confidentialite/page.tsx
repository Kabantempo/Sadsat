const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata = {
  title: "Politique de confidentialité — SADSAT",
  description: "Politique de confidentialité et gestion des données personnelles de SADSAT. Informations sur la collecte, l'utilisation et la protection de vos données.",
  alternates: { canonical: `${BASE_URL}/confidentialite` },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    title: "Données collectées",
    content: `Nous collectons uniquement les données nécessaires au bon fonctionnement de la boutique : nom, prénom, adresse email, adresse de livraison et informations de paiement. Les données de paiement sont traitées directement par notre prestataire sécurisé et ne sont pas stockées sur nos serveurs.`,
  },
  {
    title: "Finalité du traitement",
    content: `Vos données sont utilisées exclusivement pour le traitement de vos commandes, la gestion de votre compte client, l'envoi de la newsletter si vous y avez consenti, et le respect de nos obligations légales (comptabilité, déclarations fiscales).`,
  },
  {
    title: "Base légale",
    content: `Le traitement de vos données repose sur l'exécution du contrat de vente (commandes), votre consentement (newsletter), et nos obligations légales. Vous pouvez retirer votre consentement à tout moment sans que cela n'affecte les traitements antérieurs.`,
  },
  {
    title: "Conservation",
    content: `Vos données de commande sont conservées pendant 10 ans conformément aux obligations comptables françaises. Les données de compte inactif sont supprimées après 3 ans. Les données de newsletter sont supprimées sur simple demande ou après 3 ans d'inactivité.`,
  },
  {
    title: "Partage des données",
    content: `Nous ne vendons ni ne louons vos données. Elles peuvent être transmises à nos prestataires logistiques (transporteurs) dans le seul but d'assurer la livraison de votre commande. Ces prestataires sont contractuellement tenus à la confidentialité.`,
  },
  {
    title: "Vos droits",
    content: `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition à vos données. Pour exercer ces droits, contactez-nous à l'adresse : confidentialite@sadsat.com. Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).`,
  },
  {
    title: "Cookies",
    content: `Notre site utilise des cookies strictement nécessaires à son fonctionnement (session, panier). Nous n'utilisons pas de cookies publicitaires ou de traçage tiers sans votre consentement explicite.`,
  },
  {
    title: "Contact",
    content: `Responsable du traitement : SADSAT — France. Pour toute question relative à la protection de vos données : confidentialite@sadsat.com.`,
  },
];

export default function ConfidentialitePage() {
  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-8">

        {/* En-tête */}
        <div className="mb-20">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Politique de confidentialité
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl italic mb-6">
            Vos données,<br />notre responsabilité.
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
            Dernière mise à jour : mai 2026
          </p>
        </div>

        <div className="w-16 h-px bg-neutral-300 mb-20" />

        {/* Sections */}
        <div className="flex flex-col gap-16">
          {SECTIONS.map((section, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">
              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-neutral-400 mb-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="font-serif italic text-lg text-neutral-800">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 pt-1">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-neutral-200">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-neutral-400">
            SADSAT · France · RGPD conforme
          </p>
        </div>
      </div>
    </div>
  );
}
