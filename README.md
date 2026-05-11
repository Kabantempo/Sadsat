# SADSAT

Site e-commerce regroupant trois univers créatifs : taxidermie, bijoux en mailles, bougies.

## Stack
- **Framework** : Next.js 15 (App Router) + TypeScript
- **Styling** : Tailwind CSS + Framer Motion
- **State** : Zustand (panier persistant)
- **Hébergement** : Hostinger Node.js Hosting
- **CI/CD** : auto-deploy depuis GitHub `main`

## Développement local

```bash
npm install
npm run dev
```

Site accessible sur http://localhost:3000

## Build production

```bash
npm run build
npm start
```

## Structure

```
/app
  page.tsx                 # Accueil avec 3 portails
  /taxidermie/page.tsx     # Univers blanc minimaliste
  /bijoux/page.tsx         # Univers dark/destroy
  /bougies/page.tsx        # Univers Matrix
  /a-propos/page.tsx       # Histoire
  /panier/page.tsx
  /contact/page.tsx
  layout.tsx
  globals.css

/components
  /shared                  # Header, Footer, MatrixRain

/lib
  /store/cart.ts           # Panier Zustand persistant
```

## Déploiement Hostinger

1. Push sur `main` → déploiement automatique
2. Build command : `npm run build`
3. Start command : `npm start`
4. Output : `.next`
5. Node version : 20.x ou 22.x

## Variables d'environnement

Voir `.env.example`. À renseigner dans hPanel.
