import Link from 'next/link'
import { verifyGrossiste, getCurrentUser } from '@/lib/dal'
import { getProducts } from '@/lib/products'
import { getSetting } from '@/lib/settings'
import ChangePasswordForm from '@/components/shared/ChangePasswordForm'
import { Package, Layers, Tag, ArrowRight, User, Truck, ShoppingBag } from 'lucide-react'

export default async function GrossistePage() {
  await verifyGrossiste()
  const user = await getCurrentUser()
  const products = await getProducts()

  const discountRaw = await getSetting('grossiste_discount')
  const discount = discountRaw ? parseInt(discountRaw) : 30

  const available = products.filter((p) => p.status !== 'masqué')
  const universes = [...new Set(available.map((p) => p.universe))]

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">

      {/* En-tête greeting */}
      <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">
        Espace grossiste
      </p>
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Bonjour, {user?.name}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {[
          {
            label: 'Produits disponibles',
            value: available.length,
            icon: Package,
            bg: 'bg-sky-50',
            fg: 'text-sky-700',
          },
          {
            label: 'Univers actifs',
            value: universes.length,
            icon: Layers,
            bg: 'bg-white',
            fg: 'text-neutral-700',
          },
          {
            label: 'Remise B2B',
            value: `${discount} %`,
            icon: Tag,
            bg: 'bg-neutral-900',
            fg: 'text-white',
          },
        ].map(({ label, value, icon: Icon, bg, fg }) => (
          <div key={label} className={`${bg} border border-neutral-200 px-5 py-4 flex items-center gap-3`}>
            <Icon size={18} strokeWidth={1.5} className={`${fg} opacity-60 shrink-0`} />
            <div>
              <p className={`font-serif text-2xl leading-none ${fg}`}>{value}</p>
              <p className={`text-[0.56rem] tracking-[0.18em] uppercase mt-1 ${fg} opacity-60`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Conditions B2B */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
              <Tag size={13} strokeWidth={1.5} className="text-neutral-400" />
              <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
                Conditions B2B
              </p>
            </div>
            <div className="divide-y divide-neutral-100">
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400 mb-0.5">
                    Remise appliquée
                  </p>
                  <p className="text-[0.88rem] text-neutral-800">
                    {discount} % sur tous les produits
                  </p>
                </div>
                <span className="text-[0.52rem] tracking-[0.14em] uppercase px-2.5 py-1 bg-sky-100 text-sky-700 shrink-0">
                  Actif
                </span>
              </div>
              <div className="px-6 py-4 flex items-center gap-3">
                <ShoppingBag size={14} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
                <div>
                  <p className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400 mb-0.5">
                    Minimum de commande
                  </p>
                  <p className="text-[0.88rem] text-neutral-800">500 € HT</p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-3">
                <Truck size={14} strokeWidth={1.5} className="text-neutral-400 shrink-0" />
                <div>
                  <p className="text-[0.6rem] tracking-[0.16em] uppercase text-neutral-400 mb-0.5">
                    Délai de livraison
                  </p>
                  <p className="text-[0.88rem] text-neutral-800">5 à 10 jours ouvrés</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA catalogue */}
          <Link
            href="/grossiste/catalogue"
            className="flex items-center justify-between px-6 py-5 bg-neutral-900 text-white group hover:bg-neutral-700 transition-colors"
          >
            <div>
              <p className="text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-0.5">
                Découvrir les produits
              </p>
              <p className="text-[0.95rem] tracking-wide">Accéder au catalogue B2B</p>
            </div>
            <ArrowRight
              size={18}
              strokeWidth={1.5}
              className="text-neutral-400 group-hover:text-white transition-colors shrink-0"
            />
          </Link>
        </div>

        {/* Infos compte */}
        <div className="space-y-4">
          <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
              <User size={13} strokeWidth={1.5} className="text-neutral-400" />
              <p className="text-[0.62rem] tracking-[0.18em] uppercase text-neutral-500">
                Mon compte
              </p>
            </div>
            <div className="divide-y divide-neutral-100">
              <div className="px-5 py-3.5">
                <p className="text-[0.58rem] tracking-[0.14em] uppercase text-neutral-400 mb-0.5">
                  Nom
                </p>
                <p className="text-[0.82rem] text-neutral-800">{user?.name}</p>
              </div>
              <div className="px-5 py-3.5">
                <p className="text-[0.58rem] tracking-[0.14em] uppercase text-neutral-400 mb-0.5">
                  Email
                </p>
                <p className="text-[0.82rem] text-neutral-800 break-all">{user?.email}</p>
              </div>
              <div className="px-5 py-3.5">
                <p className="text-[0.58rem] tracking-[0.14em] uppercase text-neutral-400 mb-0.5">
                  Type de compte
                </p>
                <span className="text-[0.52rem] tracking-[0.12em] uppercase px-2 py-0.5 bg-sky-100 text-sky-700">
                  Grossiste
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Changement de mot de passe */}
      <div className="mt-6 border border-neutral-200 bg-white overflow-hidden">
        <ChangePasswordForm />
      </div>

    </div>
  )
}
