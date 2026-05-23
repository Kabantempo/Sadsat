import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { createProductAction } from '@/app/actions/products'
import ProductForm from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'

export default async function NouveauProduitPage() {
  await verifyAdmin()

  return (
    <div className="px-4 md:px-6 py-12 max-w-6xl mx-auto">
      <Link
        href="/admin/produits"
        className="flex items-center gap-2 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors mb-10"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Produits
      </Link>

      <div className="mb-10">
        <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
        <h1 className="font-serif text-4xl tracking-wide text-neutral-900">Nouveau produit</h1>
      </div>

      <ProductForm action={createProductAction} showPreview />
    </div>
  )
}
