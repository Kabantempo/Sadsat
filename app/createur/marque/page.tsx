import { getSession } from '@/lib/session'
import { getUserById } from '@/lib/db'
import { getBrandCategories, getBrandSlides } from '@/lib/brand'
import Link from 'next/link'
import { Images, Tag, ArrowRight } from 'lucide-react'
import { redirect } from 'next/navigation'

const UNIVERSE_LABELS: Record<string, string> = {
  taxidermie: 'Crystal Pets',
  bijoux: 'L0vers.cult',
  bougies: 'Spectrum N°3',
  habillement: 'Hackcycle',
}

export default async function MarquePage() {
  const session = await getSession()
  if (!session?.userId) redirect('/connexion')
  const user = await getUserById(session.userId)
  if (!user?.universe) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-24">
        <p className="text-neutral-500 text-sm mb-2">Aucun univers assigné à votre compte.</p>
        <p className="text-neutral-400 text-xs">Contactez l'administrateur pour être associé à une marque.</p>
      </div>
    )
  }

  const universe = user.universe
  const brandName = UNIVERSE_LABELS[universe] ?? universe
  const [categories, slides] = await Promise.all([
    getBrandCategories(universe),
    getBrandSlides(universe),
  ])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-[0.58rem] tracking-[0.24em] uppercase text-neutral-400 mb-1">Votre marque</p>
        <h1 className="text-3xl font-light text-neutral-800">{brandName}</h1>
        <p className="text-neutral-500 text-sm mt-1 capitalize">{universe}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/createur/marque/carousel" className="group bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Images size={20} strokeWidth={1.5} className="text-neutral-600" />
            </div>
            <ArrowRight size={16} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
          </div>
          <h2 className="font-medium text-neutral-800 mb-1">Carrousel</h2>
          <p className="text-sm text-neutral-500">Photos et vidéos affichées sur la page de votre marque</p>
          <p className="text-xs text-neutral-400 mt-3">{slides.length} slide{slides.length > 1 ? 's' : ''}</p>
        </Link>

        <Link href="/createur/marque/categories" className="group bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Tag size={20} strokeWidth={1.5} className="text-neutral-600" />
            </div>
            <ArrowRight size={16} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
          </div>
          <h2 className="font-medium text-neutral-800 mb-1">Catégories</h2>
          <p className="text-sm text-neutral-500">Gérez les sections de votre marque (ex. Oiseaux, Insectes…)</p>
          <p className="text-xs text-neutral-400 mt-3">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </Link>
      </div>
    </div>
  )
}
