import { verifyAdmin } from '@/lib/dal'
import CreateAdminForm from '@/components/admin/CreateAdminForm'
import CreateCreateurForm from '@/components/admin/CreateCreateurForm'
import CreateGrossisteForm from '@/components/admin/CreateGrossisteForm'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Palette, ShoppingBag } from 'lucide-react'

const ROLES = [
  {
    id: 'admin',
    label: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités du back-office : produits, comptes, commandes, marques.',
    icon: ShieldCheck,
    color: 'bg-neutral-900',
    badge: 'text-neutral-300 border-neutral-600',
    Form: CreateAdminForm,
  },
  {
    id: 'createur',
    label: 'Créateur',
    description: 'Peut publier et gérer ses propres produits. Associé à une marque (univers) par l\'admin.',
    icon: Palette,
    color: 'bg-rose-900',
    badge: 'text-rose-300 border-rose-700',
    Form: CreateCreateurForm,
  },
  {
    id: 'grossiste',
    label: 'Grossiste',
    description: 'Accès à un catalogue de tarifs spéciaux. Espace dédié avec conditions B2B.',
    icon: ShoppingBag,
    color: 'bg-sky-900',
    badge: 'text-sky-300 border-sky-700',
    Form: CreateGrossisteForm,
  },
]

export default async function NouveauComptePage() {
  await verifyAdmin()

  return (
    <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
      <Link
        href="/admin/comptes"
        className="flex items-center gap-2 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors mb-10"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Gestion des comptes
      </Link>

      <div className="mb-12">
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
        <h1 className="font-serif text-4xl tracking-wide text-neutral-900">
          Créer un compte
        </h1>
        <p className="text-[0.82rem] text-neutral-500 mt-3 max-w-lg">
          Choisissez le type de compte à créer. Chaque rôle donne accès à des fonctionnalités spécifiques.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ROLES.map(({ id, label, description, icon: Icon, color, badge, Form }) => (
          <div key={id} className="flex flex-col border border-neutral-200 bg-white overflow-hidden">
            {/* En-tête coloré */}
            <div className={`${color} px-6 py-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon size={20} strokeWidth={1.5} className="text-white/70" />
                <span className={`text-[0.55rem] tracking-[0.2em] uppercase border px-2 py-0.5 ${badge}`}>
                  {label}
                </span>
              </div>
              <p className="text-[0.72rem] text-white/60 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Formulaire */}
            <div className="flex-1 px-6 py-6">
              <Form />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
