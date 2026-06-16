export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Hostinger injects DATABASE_URL without the Supabase project ref in the username.
    // Next.js overrides system env with .env files, but if .env is missing, this
    // fallback ensures the pooler URL format is correct.
    const url = process.env.DATABASE_URL
    if (
      url &&
      url.includes('pooler.supabase.com') &&
      !url.includes('.wazmbsfvfhcqgtibewnz')
    ) {
      process.env.DATABASE_URL = url.replace(
        '://postgres:',
        '://postgres.wazmbsfvfhcqgtibewnz:'
      )
    }
  }
}
