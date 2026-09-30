#!/usr/bin/env node
/**
 * Étape exécutée après le build ("postbuild" dans package.json).
 *
 * AUCUN secret dans ce fichier : le dépôt est public. Les valeurs sensibles viennent
 * des variables d'environnement définies dans le panneau Hostinger (ou dans .env.local en local).
 *
 * 1. Contrôle les variables d'environnement critiques.
 *    - Sur Hostinger (chemin .../domains/<site>/public_html), une variable indispensable manquante
 *      fait ÉCHOUER le build : l'ancienne version du site reste alors en ligne au lieu de
 *      déployer un site qui plante au démarrage.
 *    - Ailleurs (poste local, Vercel, intégration continue), on affiche seulement un avertissement.
 * 2. Optionnel : `prisma db push` seulement si PRISMA_DB_PUSH=1 (voir docs/rotation-des-mots-de-passe.md).
 */

const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET']
const RECOMMENDED = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SMTP_USER', 'SMTP_PASS', 'NEXT_PUBLIC_SITE_URL']

function onHostinger(cwd) {
  return /[\\/]domains[\\/][^\\/]+[\\/]public_html/.test(cwd)
}

/** Renvoie { errors, warnings } sans jamais inclure de valeur de variable dans les messages. */
function checkEnv(env, cwd = process.cwd()) {
  const issues = []
  for (const name of REQUIRED) {
    if (!env[name]) issues.push(`${name} est absente`)
  }
  if (env.SESSION_SECRET && env.SESSION_SECRET.length < 32) {
    issues.push('SESSION_SECRET fait moins de 32 caractères')
  }
  const warnings = []
  for (const name of RECOMMENDED) {
    if (!env[name]) warnings.push(`${name} est absente`)
  }
  if (env.DATABASE_URL) {
    try {
      const url = new URL(env.DATABASE_URL)
      if (!/^postgres(ql)?:$/.test(url.protocol)) warnings.push('DATABASE_URL ne commence pas par postgresql://')
      if (url.hostname.endsWith('.pooler.supabase.com') && !url.username.includes('.')) {
        warnings.push("DATABASE_URL passe par le pooler Supabase : l'identifiant doit être postgres.<référence-du-projet>")
      }
    } catch {
      warnings.push('DATABASE_URL est illisible : un caractère spécial du mot de passe doit être encodé (# devient %23, ! devient %21) ou, mieux, utiliser un mot de passe uniquement alphanumérique')
    }
  }
  const enforce = onHostinger(cwd)
  return enforce ? { errors: issues, warnings } : { errors: [], warnings: [...issues, ...warnings] }
}

function main() {
  const { errors, warnings } = checkEnv(process.env)
  for (const w of warnings) console.warn(`[postbuild] Attention : ${w}`)
  if (errors.length > 0) {
    for (const e of errors) console.error(`[postbuild] ERREUR : ${e}`)
    console.error('[postbuild] Build interrompu : définir ces variables dans le panneau Hostinger, puis relancer le déploiement.')
    process.exit(1)
  }
  console.log('[postbuild] Variables d\'environnement contrôlées.')

  if (process.env.PRISMA_DB_PUSH === '1') {
    const { execSync } = require('child_process')
    try {
      execSync('npx prisma db push', { stdio: 'inherit', timeout: 60000 })
      console.log('[postbuild] prisma db push terminé.')
    } catch (e) {
      console.warn('[postbuild] prisma db push a échoué (non bloquant) :', e.message)
    }
  }
}

if (require.main === module) main()

module.exports = { checkEnv, onHostinger }
