# Registre des traitements — SADSAT

Document interne (art. 30 RGPD). À tenir à jour à chaque nouveau traitement ou prestataire. Dernière révision : septembre 2026.

Responsable du traitement : SADSAT — contact@sadsat.com

| # | Traitement | Finalité | Base légale | Données | Personnes | Destinataires | Durée |
|---|------------|----------|-------------|---------|-----------|---------------|-------|
| 1 | Comptes clients | Accès à l'espace client, commandes, favoris | Contrat | Nom, email, mot de passe chiffré, favoris | Clients | Supabase (UE), Hostinger (UE) | Jusqu'à suppression du compte ; non vérifié : 30 jours |
| 2 | Commandes | Vente, livraison, facturation | Contrat, obligation légale | Nom, adresse, email, téléphone, articles, montants | Clients | Stripe, Sendcloud, Supabase, Hostinger | 10 ans |
| 3 | Paiement | Encaissement | Contrat | Traité par Stripe (aucune donnée de carte chez SADSAT) | Clients | Stripe | Selon Stripe |
| 4 | Newsletter | Informer des nouveautés | Consentement (double opt-in) | Email, date d'inscription | Abonnés | Supabase, Hostinger (SMTP) | Jusqu'à désinscription |
| 5 | Relance panier abandonné | Relancer un panier non payé | Consentement (case Stripe) | Email, contenu du panier | Visiteurs | Stripe, Hostinger (SMTP) | Envoi unique, non conservé |
| 6 | Avis clients | Publication d'avis | Intérêt légitime / consentement | Nom, email (non affiché), commentaire | Clients | Supabase | Durée de vie du produit ; anonymisés à la suppression du compte |
| 7 | Formulaire de contact | Répondre aux demandes | Intérêt légitime | Nom, email, message | Visiteurs | Hostinger (email) | 3 ans dans la boîte email |
| 8 | Mesure d'audience | Statistiques de fréquentation | Consentement (bandeau cookies) | Identifiant cookie _ga, pages vues, IP tronquée | Visiteurs | Google Ireland | 13 mois |
| 9 | Connexion Google / Apple | Faciliter la connexion | Contrat | Nom, email | Clients | Google, Apple | Comme le compte |
| 10 | Sécurité | Limiter les abus (tentatives de connexion) | Intérêt légitime | Adresse IP (en mémoire, non journalisée) | Visiteurs | — | Quelques minutes |

## Sous-traitants et contrats (DPA)

À vérifier et archiver (PDF signé ou acceptation en ligne) :

- [ ] Supabase — DPA : https://supabase.com/legal/dpa
- [ ] Stripe — DPA inclus dans les conditions Stripe (à accepter dans le tableau de bord)
- [ ] Hostinger — DPA : à demander / accepter dans hPanel
- [ ] Sendcloud — DPA dans les conditions du compte
- [ ] Cloudinary — DPA : https://cloudinary.com/gdpr
- [ ] Google (Analytics) — Conditions de traitement des données à accepter dans Google Analytics (Administration > Paramètres du compte)
- [ ] Apple (Sign in with Apple)

## Transferts hors Union européenne

Stripe, Google, Cloudinary : transferts possibles vers les États-Unis, encadrés par le Data Privacy Framework et/ou des clauses contractuelles types. Mentionné dans la politique de confidentialité.
