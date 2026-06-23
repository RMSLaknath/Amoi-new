'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import type { CartItem as CartItemType } from '@/types'

interface Props {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { updateCart } = useCart()
  const { formatPrice } = useCurrency()

  const decrement = () => updateCart(item.productId, item.size, item.quantity - 1)
  const increment = () => updateCart(item.productId, item.size, item.quantity + 1)
  const remove = () => updateCart(item.productId, item.size, 0)

  return (
    <div className="flex gap-5 py-6 border-b border-border">
      {/* Image */}
      <div className="w-24 aspect-[3/4] bg-surface shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">{item.name}</p>
          <p className="text-xs text-text-secondary mt-1">Size: {item.size}</p>
          <p className="text-sm font-medium mt-2">{formatPrice(item.price)}</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Qty controls */}
          <div className="flex items-center border border-border">
            <button
              onClick={decrement}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <button
              onClick={increment}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={remove}
            className="text-xs tracking-wider uppercase text-text-muted hover:text-text-primary transition-colors"
            aria-label="Remove item"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
