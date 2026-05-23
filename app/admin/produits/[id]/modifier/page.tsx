import { notFound } from 'next/navigation'
import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { getProductById } from '@/lib/products'
import { updateProductAction } from '@/app/actions/products'
import ProductForm from '@/components/admin/ProductForm'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { ArrowLeft } from 'lucide-react'

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await verifyAdmin()
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div className="px-4 md:px-6 py-12 max-w-6xl mx-auto">
      <Link
        href="/admin/produits"
        className="flex items-center gap-2 text-[0.6rem] tracking-[0.14em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors mb-10"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Produits
      </Link>

      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-neutral-400 mb-2">Administration</p>
          <h1 className="font-serif text-4xl tracking-wide text-neutral-900">Modifier</h1>
          <p className="text-[0.75rem] text-neutral-500 mt-1.5 truncate max-w-sm">{product.name}</p>
        </div>
        <DeleteProductButton id={product.id} name={product.name} variant="full" />
      </div>

      <ProductForm action={updateProductAction} product={product} showPreview />
    </div>
  )
}
