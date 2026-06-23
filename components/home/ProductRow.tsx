import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface Props {
  title: string
  products: Product[]
  viewAllHref: string
}

export default function ProductRow({ title, products, viewAllHref }: Props) {
  if (products.length === 0) return null

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between mb-10">
        <h2 className="font-playfair italic text-3xl">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-xs tracking-[0.15em] uppercase text-text-secondary hover:text-text-primary transition-colors border-b border-current pb-0.5"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p._id} {...p} />
        ))}
      </div>
    </section>
  )
}
