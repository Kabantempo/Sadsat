import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { createProductAction } from '@/app/actions/products'
import ProductForm from '@/components/admin/ProductForm'
import { ChevronRight } from 'lucide-react'

export default async function NouveauProduitPage() {
  await verifyAdmin()

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 mb-8">
        <Link href="/admin" className="hover:text-neutral-700 transition-colors">Admin</Link>
        <ChevronRight size={10} strokeWidth={1.5} />
        <Link href="/admin/produits" className="hover:text-neutral-700 transition-colors">Produits</Link>
        <ChevronRight size={10} strokeWidth={1.5} />
        <span className="text-neutral-600">Nouveau</span>
      </nav>

      <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-10">
        Nouveau produit
      </h1>

      <ProductForm action={createProductAction} />
    </div>
  )
}
