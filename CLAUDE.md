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

## 🔑 Credentials & Accès (Auto-Load)

### Hostinger
- **Domain** : sadsat.com
- **Panel** : https://hpanel.hostinger.com
- **SSH** : srv1746.hstgr.io
- **Max Processes** : 78 (⚠️ Monitor si dépasse 120)
- **GitHub Webhook** : Auto-deploy on push to main

### Supabase
- **Project ID** : wazmbsfvfhcqgtibewnz
- **URL** : https://wazmbsfvfhcqgtibewnz.supabase.co
- **Database** : PostgreSQL (aws-0-eu-west-1)
- **Connection Modes** :
  - Session mode (port 5432) : max 15 connections
  - Transaction mode (port 6543) : max 100+ connections
- **Current mode** : Transaction (port 6543)
- **Pool status** : Monitor in `.env.local`

### Auto-Load Instructions
À chaque session Claude Code :
1. Lire `.env.local` pour DATABASE_URL (Supabase)
2. Lire `.env` pour credentials (Stripe, Sendcloud, Cloudinary)
3. Consulter Obsidian pour l'état prod (5 fichiers clés)
4. Vérifier https://sadsat.com status

---

## ⚠️ Points à surveiller

- Pool PostgreSQL Supabase limité à 15 clients (session mode)
- `/api/health` peut retourner erreur pool si saturé
- Navbar responsive améliorée (breakpoint `lg:` à 1024px)
- **Max Processes Hostinger** : Si dépasse 120 → site bloqué 30 min

---

## @AGENTS.md
