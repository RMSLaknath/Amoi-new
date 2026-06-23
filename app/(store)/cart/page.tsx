'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import CartItemComponent from '@/components/cart/CartItem'
import OrderSummary from '@/components/cart/OrderSummary'
import type { CartItem, Product } from '@/types'

export default function CartPage() {
  const { cartItems } = useCart()
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = useCallback(async () => {
    const ids = [...new Set(Object.keys(cartItems).map((k) => k.split('_')[0]))]
    if (ids.length === 0) { setLoading(false); return }

    const results = await Promise.all(
      ids.map((id) =>
        fetch('/api/product/single', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id }),
        }).then((r) => r.json())
      )
    )
    const map: Record<string, Product> = {}
    results.forEach((r) => { if (r.success) map[r.product._id] = r.product })
    setProducts(map)
    setLoading(false)
  }, [cartItems])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const items: CartItem[] = Object.entries(cartItems)
    .map(([key, qty]) => {
      const [productId, size] = key.split('_')
      const p = products[productId]
      if (!p) return null
      return { productId, size, quantity: qty, name: p.name, price: p.price, image: p.image[0] }
    })
    .filter(Boolean) as CartItem[]

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-text-muted">Loading cart…</div>
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted text-sm mb-6">Your cart is empty.</p>
        <Link href="/collection" className="text-sm tracking-wider uppercase underline underline-offset-2 hover:text-text-secondary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair italic text-3xl mb-10">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart items */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItemComponent key={`${item.productId}_${item.size}`} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummary
            subtotal={subtotal}
            ctaLabel="Proceed to Checkout"
            onCta={() => router.push('/checkout')}
          />
        </div>
      </div>
    </div>
  )
}
