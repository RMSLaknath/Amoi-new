import { Suspense } from 'react'
import { db, snapToArr } from '@/lib/firebase'
import CollectionClient from '@/components/collection/CollectionClient'
import type { Product } from '@/types'

export const revalidate = 60

export default async function CollectionPage() {
  let products: Product[] = []
  try {
    const snap = await db.collection('products').orderBy('date', 'desc').get()
    products = snapToArr<Product>(snap)
  } catch {
    // DB unavailable
  }

  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-text-muted">Loading…</div>}>
      <CollectionClient allProducts={products} />
    </Suspense>
  )
}
