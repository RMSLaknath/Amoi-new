'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'
import type { Product } from '@/types'

type Props = Pick<Product, '_id' | 'name' | 'price' | 'image'>

export default function ProductCard({ _id, name, price, image }: Props) {
  const { formatPrice } = useCurrency()

  return (
    <Link href={`/product/${_id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={image[0]}
          alt={name}
          width={400}
          height={533}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm text-text-primary font-normal leading-snug">{name}</p>
        <p className="text-sm text-text-primary font-medium">{formatPrice(price)}</p>
      </div>
    </Link>
  )
}
