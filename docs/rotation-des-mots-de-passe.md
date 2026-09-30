# Changer les mots de passe de la base et du SMTP sans coupure

Contexte : l'ancien script `scripts/patch-server-env.js` contenait en clair le mot de passe de la base Supabase et celui du SMTP, dans un dépôt public. Ces mots de passe sont à considérer comme compromis et doivent être changés partout où ils servent.

Le nouveau script `scripts/postbuild.js` ne contient aucun secret. Il lit les variables d'environnement et **bloque le déploiement sur Hostinger** si `DATABASE_URL` ou `SESSION_SECRET` manquent : l'ancienne version du site reste alors en ligne.

## Pourquoi l'ordre compte

Le site en ligne a l'ancien mot de passe écrit dans son propre build. Si le mot de passe de la base change avant le redéploiement, le site perd sa base jusqu'au redéploiement. Il faut donc préparer les nouvelles valeurs **avant** de changer les mots de passe.

## Étapes

1. **Générer deux mots de passe uniquement alphanumériques** (sans `#`, `!`, `%`, `@`, `:` ni `/`, que Hostinger et les adresses de connexion déforment) :
   ```bash
   node -p "require('crypto').randomBytes(24).toString('hex')"
   ```
   Un pour la base, un pour la boîte mail. Un mot de passe différent pour chacun, et différent de tous vos autres comptes.

2. **Préparer les variables dans hPanel** (site sadsat.com, variables d'environnement), sans encore les activer si possible :
   - `DATABASE_URL` = `postgresql://postgres:<nouveau-mot-de-passe-base>@db.<référence-du-projet>.supabase.co:5432/postgres`
   - `SMTP_PASS` = `<nouveau-mot-de-passe-mail>`
   - `SESSION_SECRET` = une valeur de 32 caractères minimum (`node -p "require('crypto').randomBytes(32).toString('hex')"`)
   - `STRIPE_WEBHOOK_SECRET`, `SHIPPING_FLAT_CENTS`, `MEDIATOR_*` : voir `.env.example`.

3. **Changer le mot de passe de la base** : Supabase, Réglages du projet, Base de données, « Reset database password », avec le mot de passe du point 1.

4. **Changer le mot de passe de la boîte mail** dans hPanel (Emails), avec celui du point 1.

5. **Redéployer** (fusionner la PR ou relancer le déploiement dans hPanel). Sans les variables du point 2, le build s'arrête et l'ancienne version reste en ligne.

6. **Vérifier** : la page d'accueil, la connexion à un compte, l'envoi d'un message via `/contact`, et `https://sadsat.com/api/health` (doit répondre `{"ok":true}`).

7. **Changer le même mot de passe partout où il est réutilisé** (mails personnels, hPanel, autres services).

8. **Regarder les journaux de connexion Supabase** (Logs, Postgres) pour repérer des connexions inconnues depuis la publication du dépôt. Si un accès suspect apparaît, suivre `docs/rgpd/procedure-violation-de-donnees.md` (notification à la CNIL sous 72 h).

## `prisma db push`

L'ancien script lançait `prisma db push` sur la base de production à chaque build. Ce n'est plus le cas par défaut. Pour appliquer volontairement un changement de schéma au prochain déploiement, définir `PRISMA_DB_PUSH=1` dans hPanel pour ce déploiement seulement, puis le retirer.

## Purger l'historique Git (facultatif)

Réécrire l'historique pour effacer l'ancien fichier de GitHub est possible mais lourd (publication forcée, copies déjà téléchargées non concernées). Une fois les mots de passe changés, les anciennes valeurs ne servent plus à rien : ce n'est pas nécessaire.
