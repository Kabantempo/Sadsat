# 🛒 Sadsat — Instructions Claude Code

## 🧠 Protocole avant chaque action

**IMPORTANT** : Avant de répondre à une demande ou d'agir :

1. **Vérifier Obsidian en premier** :
   - `C:\Users\mini-pc-01\Documents\Obsidian Vault\Projets\Sadsat.md` — Notes détaillées du projet
   - `C:\Users\mini-pc-01\Documents\Obsidian Vault\Memory\État des projets.md` — État global
   - `C:\Users\mini-pc-01\Documents\Obsidian Vault\Projets\Sadsat\Fonctionnalités.md` — Fonctionnalités complètes
   - `C:\Users\mini-pc-01\Documents\Obsidian Vault\Projets\Sadsat\Dashboard.md` — Données en temps réel

2. **Chercher le contexte** : Existe-t-il une note pertinente à la demande ?
   - Si oui → lire et prendre en compte
   - Si non → continuer normalement

3. **Puis répondre/agir** avec le contexte à jour

---

## 📊 Contexte Sadsat

- **URL** : https://sadsat.com (production)
- **Dev server** : `npm run dev` → http://localhost:3000
- **Database** : PostgreSQL (Supabase) — `wazmbsfvfhcqgtibewnz.supabase.co`
- **Framework** : Next.js 15.5.18
- **Stack** : TypeScript, Tailwind, Prisma, Stripe live, SendCloud

---

## ✅ Features confirmées

- ✅ Auth complète (email/password + Google OAuth + Apple Sign-in)
- ✅ Panier & checkout Stripe live
- ✅ Table `reviews` complète (avis clients avec modération)
- ✅ Portfolio créateur
- ✅ Newsletter Resend + email Nodemailer
- ✅ Global error boundary + health check
- ✅ 3 univers (Taxidermie, Bijoux, Bougies)

---

## ⚠️ Points à surveiller

- Pool PostgreSQL Supabase limité à 15 clients (session mode)
- `/api/health` peut retourner erreur pool si saturé
- Navbar responsive améliorée (breakpoint `lg:` à 1024px)

---

## @AGENTS.md
