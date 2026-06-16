#!/usr/bin/env node
/**
 * Patch le server.js standalone de Next.js pour corriger le format
 * de DATABASE_URL injecté par Hostinger (username sans project ref Supabase).
 * Exécuté automatiquement via "postbuild" dans package.json.
 */
const fs = require('fs')
const path = require('path')

const serverPath = path.join(__dirname, '..', '.next', 'standalone', 'server.js')

if (!fs.existsSync(serverPath)) {
  console.log('[patch-server-env] No standalone/server.js found — skipping')
  process.exit(0)
}

const content = fs.readFileSync(serverPath, 'utf8')

if (content.includes('wazmbsfvfhcqgtibewnz')) {
  console.log('[patch-server-env] Already patched — skipping')
  process.exit(0)
}

const patch = `// [patch-server-env] Force connexion directe Supabase (bypass pooler + circuit breaker)
process.env.DATABASE_URL = "postgresql://postgres:%23!Kalvert123@db.wazmbsfvfhcqgtibewnz.supabase.co:5432/postgres";

`

fs.writeFileSync(serverPath, patch + content, 'utf8')
console.log('[patch-server-env] server.js patched successfully')

// Run prisma db push to sync schema (non-blocking)
const { execSync } = require('child_process')
try {
  execSync('npx prisma db push', { stdio: 'inherit', timeout: 30000 })
  console.log('[patch-server-env] prisma db push OK')
} catch (e) {
  console.warn('[patch-server-env] prisma db push failed (non-fatal):', e.message)
}
