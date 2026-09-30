# SADSAT

Site e-commerce de trois univers créatifs : taxidermie éthique (Crystal Pets), bougies (Spectrum N°3) et habillement upcycling (Hackcycle).

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind CSS, Framer Motion
- Prisma + PostgreSQL (Supabase)
- Stripe (paiement), Sendcloud (expédition), Cloudinary (médias), Nodemailer (emails)
- Zustand (panier)
- Hébergement Hostinger Node.js, déploiement automatique depuis `main`

## Développement local

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs (voir CLAUDE.md)
npm run dev
```

Site : http://localhost:3000

## Contrôles

```bash
npx tsc --noEmit   # types
npm test           # tests (Vitest)
npm run lint       # ESLint
```

## Production

```bash
npm run build
npm start
```

## Conformité

- `docs/rgpd/registre-des-traitements.md` — registre des traitements et sous-traitants
- `docs/rgpd/procedure-violation-de-donnees.md` — que faire en cas de fuite
- `npm run purge` — applique les durées de conservation (simulation par défaut, `-- --apply` pour supprimer)
