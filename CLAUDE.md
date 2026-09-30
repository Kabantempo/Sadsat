# Sadsat — Instructions Claude Code

## Projet

- Site e-commerce **SADSAT** : 3 univers — Crystal Pets (taxidermie éthique), Spectrum N°3 (bougies), Hackcycle (habillement upcycling), plus les pièces uniques.
- Production : https://sadsat.com (Hostinger Node.js, déploiement auto depuis GitHub `main`)
- Dev : `npm run dev` → http://localhost:3000
- Stack : Next.js 15 (App Router), TypeScript, Tailwind, Prisma + PostgreSQL (Supabase), Stripe, Sendcloud, Cloudinary, Nodemailer (SMTP Hostinger)
- Contrôles : `npx tsc --noEmit`, `npm test`, `npm run lint`

## Secrets et accès

**Aucun identifiant, hôte ou identifiant de projet dans ce fichier** (il est versionné).
Toutes les valeurs sensibles sont dans `.env` / `.env.local` (jamais commités) et dans le panneau Hostinger.
Variables attendues : `DATABASE_URL`, `SESSION_SECRET` (32 caractères minimum, obligatoire en production), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`SENDCLOUD_PUBLIC_KEY`, `SENDCLOUD_SECRET_KEY` (sert aussi à vérifier la signature du webhook), `CLOUDINARY_*`, `SMTP_*`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_URL`,
`GOOGLE_CLIENT_ID/SECRET`, `APPLE_*`, `NEXT_PUBLIC_GA_ID` (optionnel, chargé seulement après consentement),
`SHIPPING_FLAT_CENTS` et `FREE_SHIPPING_THRESHOLD_CENTS` (frais de port, 0 = offerts), `MEDIATOR_NAME` / `MEDIATOR_URL` / `MEDIATOR_ADDRESS` (médiateur de la consommation).

## Règles de code

- Actions serveur et routes API : toujours vérifier la session via `lib/dal.ts` (`verifyAdmin`, `verifySession`, `getVerifiedSession`), qui relit le rôle en base.
- Toute valeur saisie par un client insérée dans un email HTML passe par `esc()` (`lib/email.ts`).
- Formulaires publics (login, inscription, contact, newsletter…) : limiter avec `allow()` de `lib/rate-limit.ts`.
- Paiement : prix, statut et stock sont recalculés côté serveur ; le webhook Stripe est idempotent et décrémente le stock (`createOrderWithStock`).
- Données personnelles : voir `docs/rgpd/` (registre des traitements, procédure de violation). Conservation appliquée par `npm run purge`.

@AGENTS.md
