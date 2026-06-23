import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center text-text-muted text-sm tracking-widest uppercase">
        No products found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
      {products.map((p) => (
        <ProductCard key={p._id} {...p} />
      ))}
    </div>
  )
}
