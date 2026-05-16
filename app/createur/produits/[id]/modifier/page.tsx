import { notFound } from 'next/navigation'
import Link from 'next/link'
import { verifyCreateur } from '@/lib/dal'
import { getProductById } from '@/lib/products'
import { updateCreateurProductAction, deleteCreateurProductAction } from '@/app/actions/createur'
import ProductForm from '@/components/admin/ProductForm'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { ChevronRight } from 'lucide-react'

export default async function ModifierProduitCreateurPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await verifyCreateur()
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()
  if (product.createdBy && product.createdBy !== session.userId && session.role !== 'admin') {
    notFound()
  }

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <nav className="flex items-center gap-2 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 mb-8">
        <Link href="/createur" className="hover:text-neutral-700 transition-colors">Créateur</Link>
        <ChevronRight size={10} strokeWidth={1.5} />
        <Link href="/createur/produits" className="hover:text-neutral-700 transition-colors">Produits</Link>
        <ChevronRight size={10} strokeWidth={1.5} />
        <span className="text-neutral-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
          Modifier le produit
        </h1>
        <DeleteProductButton id={product.id} name={product.name} variant="full" deleteAction={deleteCreateurProductAction} />
      </div>

      <ProductForm action={updateCreateurProductAction} product={product} variant="createur" />
    </div>
  )
}
