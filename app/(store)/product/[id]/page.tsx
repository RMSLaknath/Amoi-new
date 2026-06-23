import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { db, docToObj } from '@/lib/firebase'
import { verifyToken } from '@/lib/auth'
import ImageGallery from '@/components/product/ImageGallery'
import ProductActions from '@/components/product/ProductActions'
import ReviewSection from '@/components/product/ReviewSection'
import type { Product } from '@/types'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

function Breadcrumb({ category, name }: { category: string; name: string }) {
  return (
    <nav className="text-xs text-text-muted mb-4 flex items-center gap-2">
      <a href="/" className="hover:text-text-primary transition-colors">Home</a>
      <span>/</span>
      <a href={`/collection?category=${category}`} className="hover:text-text-primary transition-colors capitalize">
        {category}
      </a>
      <span>/</span>
      <span className="text-text-primary">{name}</span>
    </nav>
  )
}

function PriceDisplay({ price }: { price: number }) {
  return (
    <p className="text-xl font-medium text-text-primary">
      Rs. {price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </p>
  )
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const doc = await db.collection('products').doc(id).get()
  if (!doc.exists) notFound()

  const product = docToObj<Product>(doc)

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let isAuthenticated = false
  if (token) {
    try {
      await verifyToken(token)
      isAuthenticated = true
    } catch { /* invalid token */ }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb category={product.category} name={product.name} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ImageGallery images={product.image} name={product.name} />
        <div className="space-y-6">
          <div>
            <h1 className="font-playfair text-3xl mb-3">{product.name}</h1>
            <PriceDisplay price={product.price} />
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
          <ProductActions product={product} />
        </div>
      </div>
      <ReviewSection productId={product._id} isAuthenticated={isAuthenticated} />
    </div>
  )
}
