const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

export const metadata = {
  title: "Politique de confidentialité — SADSAT",
  description: "Politique de confidentialité de SADSAT : données collectées, utilisation, droits RGPD et protection de vos informations personnelles.",
  alternates: { canonical: `${BASE_URL}/politique-confidentialite` },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    title: "Responsable du traitement",
    content: `SADSAT, auto-entrepreneur — contact@sadsat.com`,
  },
  {
    title: "Données collectées",
    content: `Lors de la création de compte : nom, adresse email, mot de passe chiffré.
Lors d'une commande : nom, prénom, adresse postale, email, données de paiement (traitées par Stripe, non stockées chez SADSAT).
Navigation : cookies de session (strictement nécessaires) ; aucun cookie publicitaire sans consentement.`,
  },
  {
    title: "Finalités et bases légales",
    content: `• Gestion du compte client — exécution du contrat (art. 6.1.b RGPD)
• Traitement des commandes — exécution du contrat
• Envoi d'emails transactionnels (confirmation, livraison) — exécution du contrat
• Newsletter — consentement (art. 6.1.a RGPD), révocable à tout moment
• Amélioration du service — intérêt légitime (art. 6.1.f RGPD)`,
  },
  {
    title: "Destinataires des données",
    content: `Vos données sont traitées par SADSAT et ses sous-traitants techniques :
• Supabase (hébergement base de données) — Union Européenne
• Hostinger (hébergement serveur) — Union Européenne
• Stripe (paiement) — conforme PCI-DSS
• Resend/Nodemailer (emails transactionnels)

Aucune donnée n'est vendue ni cédée à des tiers à des fins commerciales.`,
  },
  {
    title: "Durée de conservation",
    content: `• Données de compte : jusqu'à suppression du compte + 3 ans (obligations légales)
• Données de commandes : 10 ans (obligations comptables)
• Données de navigation (cookies) : 13 mois maximum`,
  },
  {
    title: "Vos droits",
    content: `Conformément au RGPD, vous disposez des droits suivants :
• Accès à vos données
• Rectification de vos données
• Suppression de votre compte (depuis votre espace client)
• Opposition au traitement
• Portabilité de vos données
• Limitation du traitement

Pour exercer ces droits : contact@sadsat.com — réponse sous 30 jours.
Vous pouvez également introduire une réclamation auprès de la CNIL : www.cnil.fr`,
  },
  {
    title: "Cookies",
    content: `Cookies strictement nécessaires (aucun consentement requis) :
• session — authentification utilisateur
• panier — mémorisation du panier

Nous n'utilisons pas de cookies publicitaires, de tracking tiers ou de réseaux sociaux intégrés sans votre consentement explicite.`,
  },
  {
    title: "Sécurité",
    content: `Vos données sont protégées par chiffrement TLS en transit. Les mots de passe sont hachés avec bcrypt (coût 12). Les données de paiement ne transitent jamais par nos serveurs — elles sont traitées directement par Stripe.`,
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#fafaf7] dark:bg-neutral-950 text-[#1a1a1a] dark:text-neutral-100">
      <div className="max-w-3xl mx-auto px-8">

        <div className="mb-20">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Protection des données
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl italic mb-6">
            Politique de<br />confidentialité.
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
            Dernière mise à jour : juin 2026
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
