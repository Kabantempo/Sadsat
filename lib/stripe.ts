import Stripe from 'stripe'

// Le client n'est créé qu'au premier appel : un build sans STRIPE_SECRET_KEY (aperçu Vercel, CI) ne plante plus,
// et l'erreur n'apparaît que si une route de paiement est réellement utilisée sans clé.
let client: Stripe | undefined

function getClient(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY manquante')
    client = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
  }
  return client
}

export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => Reflect.get(getClient(), prop),
})
