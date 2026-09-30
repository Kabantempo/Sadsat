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
    content: `Lors de la création de compte : nom, adresse email, mot de passe (stocké sous forme chiffrée). Si vous vous connectez avec Google ou Apple : nom et adresse email fournis par ce service.
Lors d'une commande : nom, adresse de livraison, email, téléphone, contenu de la commande. Les données de paiement sont saisies chez Stripe et ne sont jamais stockées chez SADSAT.
Lors d'un message via le formulaire de contact : nom, email et contenu du message (reçus par email, non enregistrés sur le site).
Si vous laissez un avis : votre nom, votre email (non affiché) et votre commentaire.
Navigation : cookies indispensables (session, panier). Avec votre accord seulement : cookie de mesure d'audience Google Analytics.`,
  },
  {
    title: "Finalités et bases légales",
    content: `• Gestion du compte client — exécution du contrat (art. 6.1.b RGPD)
• Traitement, paiement et livraison des commandes — exécution du contrat
• Emails liés à votre compte et à vos commandes (confirmation, expédition, mot de passe) — exécution du contrat
• Facturation et comptabilité — obligation légale (art. 6.1.c)
• Newsletter — votre consentement (art. 6.1.a), donné en cochant la case puis en confirmant par email ; retrait possible à tout moment par le lien présent dans chaque email
• Relance de panier abandonné — votre consentement, uniquement si vous avez coché la case « recevoir nos offres » lors du paiement
• Mesure d'audience (Google Analytics) — votre consentement, recueilli par le bandeau cookies
• Sécurité du site (limitation des tentatives de connexion) — intérêt légitime (art. 6.1.f)`,
  },
  {
    title: "Destinataires et sous-traitants",
    content: `Vos données sont traitées par SADSAT et par ces prestataires, uniquement pour les finalités ci-dessus :
• Supabase — base de données (région Irlande, Union européenne)
• Hostinger — hébergement du site et envoi des emails (Union européenne)
• Stripe — paiement en ligne (Stripe Payments Europe ; possibles transferts vers les États-Unis encadrés par des clauses contractuelles types)
• Sendcloud — préparation des étiquettes et suivi des colis (Pays-Bas)
• Cloudinary — hébergement des photos et vidéos des produits (aucune donnée client)
• Google — connexion « Se connecter avec Google » et, avec votre accord, Google Analytics (Google Ireland ; transferts possibles vers les États-Unis encadrés par le Data Privacy Framework)
• Apple — connexion « Se connecter avec Apple »

Aucune donnée n'est vendue. Les transporteurs reçoivent les informations nécessaires à la livraison.`,
  },
  {
    title: "Durée de conservation",
    content: `• Compte client : jusqu'à la suppression du compte par vos soins ; un compte dont l'email n'a jamais été confirmé est supprimé après 30 jours
• Commandes et factures : 10 ans à compter de la commande (obligation comptable), même après suppression du compte
• Newsletter : jusqu'à votre désinscription
• Avis : tant que le produit est en vente ; anonymisés à la suppression du compte
• Messages de contact : 3 ans maximum dans la boîte email de SADSAT
• Cookie Google Analytics : 13 mois maximum ; votre choix est redemandé tous les 6 mois`,
  },
  {
    title: "Vos droits",
    content: `Conformément au RGPD, vous disposez des droits suivants :
• Accès et portabilité : bouton « Télécharger mes données » dans votre espace client (fichier JSON)
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
    content: `Cookies indispensables (aucun consentement requis) :
• session — connexion à votre compte
• panier — mémorisation de votre panier
• choix cookies — mémorisation de votre réponse au bandeau

Cookies soumis à votre accord :
• Google Analytics (_ga) — statistiques d'audience anonymisées

Vous pouvez modifier votre choix à tout moment avec le lien « Gérer les cookies » en bas de chaque page. Aucun cookie publicitaire n'est utilisé.`,
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
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-neutral-600 dark:text-neutral-400 mb-6">
            Protection des données
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl italic mb-6">
            Politique de<br />confidentialité.
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400">
            Dernière mise à jour : septembre 2026
          </p>
        </div>

        <div className="w-16 h-px bg-neutral-300 dark:bg-neutral-700 mb-20" />

        <div className="flex flex-col gap-16">
          {SECTIONS.map((section, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">
              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-neutral-600 dark:text-neutral-400 mb-2">
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
          <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-neutral-600 dark:text-neutral-400">
            SADSAT · Auto-entrepreneur · France
          </p>
        </div>
      </div>
    </div>
  );
}
