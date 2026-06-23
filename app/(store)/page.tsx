import { db, snapToArr } from '@/lib/firebase'
import Hero from '@/components/home/Hero'
import CategoryGrid from '@/components/home/CategoryGrid'
import ProductRow from '@/components/home/ProductRow'
import Newsletter from '@/components/home/Newsletter'
import type { Product } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  let dresses: Product[] = []
  let bestsellers: Product[] = []

  try {
    const [dressSnap, bestSnap] = await Promise.all([
      db.collection('products').where('subcategory', '==', 'Dresses').orderBy('date', 'desc').limit(8).get(),
      db.collection('products').where('bestseller', '==', true).orderBy('date', 'desc').limit(8).get(),
    ])
    dresses = snapToArr<Product>(dressSnap)
    bestsellers = snapToArr<Product>(bestSnap)
  } catch {
    // DB unavailable — show empty product rows
  }

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductRow title="Dresses" products={dresses} viewAllHref="/collection?subcategory=Dresses" />
      <ProductRow title="Bestsellers" products={bestsellers} viewAllHref="/collection?bestseller=true" />
      <Newsletter />
    </>
  )
}
