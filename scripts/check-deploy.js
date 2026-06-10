#!/usr/bin/env node
/**
 * check-deploy.js — Vérifie le dernier déploiement Hostinger via SSH
 * Usage: node scripts/check-deploy.js
 *
 * Lit le dernier log de build et affiche le statut + erreurs.
 * Si échec, affiche l'erreur complète pour que Claude puisse corriger.
 */

const { execSync } = require('child_process');

const SSH = 'ssh -i ~/.ssh/hostinger_sadsat -p 65002 -o StrictHostKeyChecking=no -o ConnectTimeout=15 u142938038@147.79.103.73';
const LOGS_DIR = '/home/u142938038/domains/sadsat.com/public_html/.builds/logs';

function ssh(cmd) {
  return execSync(`${SSH} "${cmd}"`, { encoding: 'utf8' }).trim();
}

try {
  // Trouver le log le plus récent
  const latestLog = ssh(`find ${LOGS_DIR} -name '*_deploy.log' | sort | tail -1`);
  if (!latestLog) {
    console.log('❌ Aucun log de déploiement trouvé');
    process.exit(1);
  }

  const logName = latestLog.split('/').slice(-2).join('/');
  console.log(`\n📋 Dernier déploiement : ${logName}\n`);

  // Lire le log complet
  const log = ssh(`cat '${latestLog}'`);
  const lines = log.split('\n');

  // Détecter succès ou échec
  const failed = log.includes('ERROR: Failed to build') || log.includes('Failed to compile') || log.includes('Type error:') || log.includes('Build error');
  const success = log.includes('Route (app)') || log.includes('✓ Compiled successfully') || log.includes('Build completed');

  if (success && !failed) {
    console.log('✅ Déploiement RÉUSSI\n');
    // Afficher les dernières lignes
    console.log(lines.slice(-10).join('\n'));
  } else if (failed) {
    console.log('❌ Déploiement ÉCHOUÉ\n');
    // Trouver et afficher l'erreur
    const errorStart = lines.findIndex(l =>
      l.includes('Failed to compile') || l.includes('Type error:') || l.includes('ERROR:') || l.includes('Build error')
    );
    if (errorStart !== -1) {
      console.log('--- ERREUR ---');
      console.log(lines.slice(Math.max(0, errorStart - 2), errorStart + 20).join('\n'));
      console.log('--- FIN ERREUR ---\n');
    }
    console.log('Dernières lignes :');
    console.log(lines.slice(-15).join('\n'));
    process.exit(1);
  } else {
    console.log('⏳ Build en cours ou statut inconnu\n');
    console.log(lines.slice(-20).join('\n'));
  }

} catch (err) {
  console.error('❌ Impossible de se connecter à Hostinger :', err.message);
  process.exit(1);
}
