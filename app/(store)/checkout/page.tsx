'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useCart } from '@/context/CartContext'
import OrderSummary from '@/components/cart/OrderSummary'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Address, CartItem, Product } from '@/types'

const PAYHERE_URL =
  process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true'
    ? 'https://sandbox.payhere.lk/pay/checkout'
    : 'https://www.payhere.lk/pay/checkout'

const EMPTY_ADDRESS: Address = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', zip: '', country: 'Sri Lanka',
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'PayHere'>('COD')
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [placing, setPlacing] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    fetch('/api/cart/get', { method: 'POST' }).then((res) => {
      if (res.status === 401) {
        toast.info('Please sign in to checkout')
        router.push('/account?redirect=/checkout')
      } else {
        setAuthChecked(true)
      }
    })
  }, [router])

  const fetchProducts = useCallback(async () => {
    const ids = [...new Set(Object.keys(cartItems).map((k) => k.split('_')[0]))]
    if (ids.length === 0) return
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
  const delivery = subtotal >= 10000 ? 0 : 350
  const total = subtotal + delivery

  const set = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value }))

  const handlePlace = async () => {
    const required: (keyof Address)[] = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'country']
    for (const f of required) {
      if (!address[f]) { toast.error(`Please fill in ${f}`); return }
    }
    if (items.length === 0) { toast.error('Your cart is empty'); return }

    setPlacing(true)
    try {
      if (paymentMethod === 'COD') {
        const res = await fetch('/api/order/place', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, amount: total, address }),
        })
        const data = await res.json()
        if (data.success) {
          clearCart()
          router.push('/orders')
        } else {
          toast.error(data.message ?? 'Failed to place order')
        }
      } else {
        const res = await fetch('/api/order/payhere/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, amount: total, address }),
        })
        const data = await res.json()
        if (!data.success) { toast.error(data.message ?? 'Failed to initiate payment'); return }

        // Programmatically submit to PayHere gateway
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = PAYHERE_URL
        Object.entries(data.paymentData as Record<string, string>).forEach(([k, v]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = k
          input.value = v
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
      }
    } finally {
      setPlacing(false)
    }
  }

  if (!authChecked) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair italic text-3xl mb-10">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Address form */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-xs tracking-widest uppercase mb-6">Delivery Information</h2>
            <div className="grid grid-cols-2 gap-5">
              <Input label="First Name" value={address.firstName} onChange={set('firstName')} required />
              <Input label="Last Name" value={address.lastName} onChange={set('lastName')} required />
              <Input label="Email" type="email" value={address.email} onChange={set('email')} required className="col-span-2" />
              <Input label="Phone" type="tel" value={address.phone} onChange={set('phone')} required className="col-span-2" />
              <Input label="Street Address" value={address.street} onChange={set('street')} required className="col-span-2" />
              <Input label="City" value={address.city} onChange={set('city')} required />
              <Input label="State / Province" value={address.state} onChange={set('state')} />
              <Input label="ZIP / Postal Code" value={address.zip} onChange={set('zip')} />
              <Input label="Country" value={address.country} onChange={set('country')} required />
            </div>
          </section>

          <section>
            <h2 className="text-xs tracking-widest uppercase mb-6">Payment Method</h2>
            <div className="space-y-3">
              {(['COD', 'PayHere'] as const).map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-cta"
                  />
                  <span className="text-sm text-text-primary">
                    {method === 'COD' ? 'Cash on Delivery' : 'PayHere (Card / Bank)'}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummary
            subtotal={subtotal}
            ctaLabel={placing ? 'Placing Order…' : 'Place Order'}
            onCta={handlePlace}
            ctaDisabled={placing || items.length === 0}
          />
        </div>
      </div>
    </div>
  )
}
