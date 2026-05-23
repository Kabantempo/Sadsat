import { verifyAdmin } from '@/lib/dal'
import { getSetting } from '@/lib/settings'
import { updateGrossisteDiscountAction } from '@/app/actions/settings'
import { Settings, Tag } from 'lucide-react'

export default async function AdminParametresPage() {
  await verifyAdmin()

  const discountRaw = await getSetting('grossiste_discount')
  const discount = discountRaw ? parseInt(discountRaw) : 30

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

    </div>
  )
}
