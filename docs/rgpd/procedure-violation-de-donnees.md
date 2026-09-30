# Procédure en cas de violation de données

Une violation = perte, vol, accès non autorisé ou divulgation de données personnelles (base de données, emails, sauvegardes, compte administrateur).

## 1. Dans l'heure : contenir
1. Changer `SESSION_SECRET` (déconnecte tout le monde) et redémarrer le site.
2. Changer les mots de passe : admin du site, Supabase, Hostinger, Stripe, Cloudinary, Sendcloud, boîte email.
3. Faire pivoter les clés API concernées (Stripe, Supabase, Cloudinary, Sendcloud, SMTP).
4. Si un compte administrateur est en cause : vérifier les comptes récemment créés dans l'admin.

## 2. Dans les 24 h : comprendre
Noter dans un fichier daté : ce qui s'est passé, depuis quand, quelles données (comptes, commandes, emails), combien de personnes, comment c'est arrivé. Consulter les journaux Supabase et Hostinger.

## 3. Sous 72 h : notifier la CNIL
Si la violation présente un risque pour les personnes : déclaration sur https://notifications.cnil.fr/notifications/index. Sans risque : consigner l'incident, sans notification.

## 4. Informer les personnes
Si le risque est élevé (mots de passe, adresses, commandes exposés) : email individuel expliquant ce qui s'est passé, quelles données, ce qu'elles doivent faire (changer leur mot de passe) et le contact : contact@sadsat.com.

## 5. Après
Corriger la cause, ajouter un test ou un contrôle, mettre à jour le registre des traitements et consigner l'incident dans un registre des violations (date, faits, effets, mesures).
