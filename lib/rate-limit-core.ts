// Limiteur en mémoire (une seule instance Node sur Hostinger). Suffisant contre le brute force basique ;
// à remplacer par Redis / Upstash si le site passe sur plusieurs instances.
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function hit(key: string, max: number, windowMs: number, now = Date.now()): { ok: boolean; retryAfterSec: number } {
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSec: 0 }
  }
  b.count++
  return { ok: b.count <= max, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) }
}

export function resetBuckets(): void {
  buckets.clear()
}
