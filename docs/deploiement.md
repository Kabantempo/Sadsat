# Déployer Sadsat sur Hostinger

## Principe

Le site est **compilé sur GitHub** (Actions), puis le résultat est envoyé sur Hostinger et l'application redémarre. Hostinger ne compile pas : le serveur n'a pas les ressources pour cela et renvoie des erreurs 503. C'est la même méthode que Nexart.

Fichier : `.github/workflows/deploy-hostinger.yml`. Déclenchement **manuel** : onglet Actions de GitHub, « Deploy to Hostinger », « Run workflow », ou :

```bash
gh workflow run deploy-hostinger.yml --repo Kabantempo/Sadsat
gh run watch --repo Kabantempo/Sadsat
```

Pour déployer automatiquement à chaque fusion dans `main`, ajouter `push: branches: [main]` sous `on:` dans le fichier.

## Avant le premier déploiement (une seule fois)

1. **Secret GitHub `HOSTINGER_DEPLOY_KEY`** : la clé SSH privée qui ouvre le serveur. Depuis le PC où elle se trouve :
   ```bash
   gh secret set HOSTINGER_DEPLOY_KEY --repo Kabantempo/Sadsat < ~/.ssh/hostinger_nexart
   ```
   (la même clé que pour Nexart : le compte Hostinger est le même). Le contenu n'est jamais affiché.
2. **Variables d'environnement dans hPanel** (site sadsat.com, Node.js) : elles restent là-bas et ne passent jamais par GitHub. Liste dans `.env.example`. Points de vigilance :
   - `DATABASE_URL` : adresse du **pooler** Supabase, pas la connexion directe (voir `docs/rotation-des-mots-de-passe.md`).
   - `SESSION_SECRET` : 32 caractères minimum.
3. **Prisma** : `prisma/schema.prisma` liste les moteurs `debian-openssl-1.1.x` (celui qui tourne en production) et `rhel-openssl-3.0.x` (secours). Ne pas les retirer : sans le bon fichier, la base ne répond plus.

## Ce que fait le workflow

1. Installe les dépendances, lance les types et les tests. Un échec arrête tout avant toute modification du serveur.
2. Compile le site, prépare le paquet et vérifie que le moteur Prisma de production y est.
3. **Sauvegarde** la version en ligne (`~/backups/sadsat/`, les 3 dernières sont gardées).
4. Envoie le paquet avec `rsync` dans `~/domains/sadsat.com/nodejs/` (en conservant `tmp`, `console.log`, `stderr.log`, `.env`).
5. Redémarre l'application (`tmp/restart.txt`).
6. Contrôle `https://sadsat.com/api/health` (jusqu'à 80 secondes). Si le site ne répond pas `{"ok":true}`, il **restaure automatiquement la sauvegarde** et redémarre.

## Retour arrière manuel

```bash
ssh -i ~/.ssh/hostinger_nexart -p 65002 u142938038@147.79.103.73
cd ~/domains/sadsat.com/nodejs
ls -1t ~/backups/sadsat/          # choisir une sauvegarde
find . -mindepth 1 -maxdepth 1 ! -name tmp ! -name console.log ! -name stderr.log -exec rm -rf {} +
tar -xzf ~/backups/sadsat/<fichier>.tgz -C .
touch tmp/restart.txt
```

## À ne jamais faire

- Lancer un build depuis hPanel ou l'API Hostinger (« Start Node.js build ») : il compile sur le serveur, écrase le site et provoque des erreurs 503.
- Mettre un mot de passe ou une clé dans le dépôt : il est public.
