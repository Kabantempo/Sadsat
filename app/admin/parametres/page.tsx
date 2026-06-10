import { verifyAdmin } from '@/lib/dal'
import { getSetting } from '@/lib/settings'
import { updateGrossisteDiscountAction } from '@/app/actions/settings'
import { Settings, Tag, Download, MessageSquare } from 'lucide-react'

export default async function AdminParametresPage() {
  await verifyAdmin()

  const discountRaw = await getSetting('grossiste_discount')
  const discount = discountRaw ? parseInt(discountRaw) : 30
  const contactMsg = await getSetting('contact_message') || ''
  const checkoutMsg = await getSetting('checkout_message') || ''
  const emptyCartMsg = await getSetting('empty_cart_message') || ''

  return (
    <div className="px-4 md:px-6 py-12 max-w-3xl mx-auto">

      {/* En-tête */}
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Administration
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Paramètres
      </h1>

      {/* Section tarifs grossiste */}
      <div className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Tag size={13} strokeWidth={1.5} className="text-neutral-400" />
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Tarifs grossiste
          </p>
        </div>

        <div className="px-6 py-6">
          <p className="text-[0.75rem] text-neutral-500 mb-6">
            Ce pourcentage de remise est appliqué sur tous les prix publics pour les comptes grossiste.
          </p>

          <form action={updateGrossisteDiscountAction} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <label
                htmlFor="discount"
                className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-2"
              >
                Remise (%)
              </label>
              <div className="relative">
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={discount}
                  required
                  className="w-full border border-neutral-200 px-4 py-2.5 text-[0.88rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors pr-10 appearance-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.8rem] text-neutral-400 pointer-events-none">
                  %
                </span>
              </div>
              <p className="text-[0.62rem] text-neutral-400 mt-1.5">
                Valeur entre 0 et 100. Actuellement : {discount} %
              </p>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[0.6rem] tracking-[0.18em] uppercase hover:bg-neutral-700 transition-colors shrink-0"
            >
              <Settings size={11} strokeWidth={1.5} />
              Sauvegarder
            </button>
          </form>
        </div>
      </div>

      {/* Section messages personnalisés */}
      <div className="mt-8 border border-neutral-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <MessageSquare size={13} strokeWidth={1.5} className="text-neutral-400" />
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Messages personnalisés
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <p className="text-[0.75rem] text-neutral-500">
            Personnalisez les messages affichés sur les pages principales.
          </p>

          {/* Message contact */}
          <div>
            <label htmlFor="contact_message" className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-2">
              Message page contact
            </label>
            <textarea
              id="contact_message"
              name="contact_message"
              rows={3}
              defaultValue={contactMsg}
              placeholder="Ex: Pour les demandes urgentes, appelez directement..."
              className="w-full border border-neutral-200 px-4 py-2.5 text-[0.88rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors resize-none"
            />
          </div>

          {/* Message checkout */}
          <div>
            <label htmlFor="checkout_message" className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-2">
              Message page paiement
            </label>
            <textarea
              id="checkout_message"
              name="checkout_message"
              rows={3}
              defaultValue={checkoutMsg}
              placeholder="Ex: Livraison 48h ouvrables en France métro..."
              className="w-full border border-neutral-200 px-4 py-2.5 text-[0.88rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors resize-none"
            />
          </div>

          {/* Message panier vide */}
          <div>
            <label htmlFor="empty_cart_message" className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-2">
              Message panier vide
            </label>
            <textarea
              id="empty_cart_message"
              name="empty_cart_message"
              rows={3}
              defaultValue={emptyCartMsg}
              placeholder="Ex: Votre panier est vide. Parcourez nos univers..."
              className="w-full border border-neutral-200 px-4 py-2.5 text-[0.88rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[0.6rem] tracking-[0.18em] uppercase hover:bg-neutral-700 transition-colors"
          >
            <Settings size={11} strokeWidth={1.5} />
            Sauvegarder messages
          </button>
        </div>
      </div>

      {/* Section export base de données */}
      <div className="mt-8 border border-neutral-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Download size={13} strokeWidth={1.5} className="text-neutral-400" />
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
            Exports données
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          <p className="text-[0.75rem] text-neutral-500">
            Téléchargez vos données au format CSV pour analyse externe ou sauvegarde.
          </p>

          <div className="space-y-2 pt-4">
            <a href="/api/admin/export/products" download className="flex items-center justify-between px-4 py-3 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <span className="text-[0.75rem] text-neutral-600">Produits (CSV)</span>
              <Download size={14} className="text-neutral-400" />
            </a>

            <a href="/api/admin/export/orders" download className="flex items-center justify-between px-4 py-3 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <span className="text-[0.75rem] text-neutral-600">Commandes (CSV)</span>
              <Download size={14} className="text-neutral-400" />
            </a>

            <a href="/api/admin/export/users" download className="flex items-center justify-between px-4 py-3 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <span className="text-[0.75rem] text-neutral-600">Utilisateurs (CSV)</span>
              <Download size={14} className="text-neutral-400" />
            </a>

            <a href="/api/admin/export/reviews" download className="flex items-center justify-between px-4 py-3 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <span className="text-[0.75rem] text-neutral-600">Avis clients (CSV)</span>
              <Download size={14} className="text-neutral-400" />
            </a>

            <a href="/api/admin/export/newsletter" download className="flex items-center justify-between px-4 py-3 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <span className="text-[0.75rem] text-neutral-600">Abonnés newsletter (CSV)</span>
              <Download size={14} className="text-neutral-400" />
            </a>
          </div>

          <p className="text-[0.62rem] text-neutral-400 pt-4">
            💡 Les exports incluent toutes les données actuelles. Utile pour audit, sauvegarde ou import dans un tiers.
          </p>
        </div>
      </div>

    </div>
  )
}
