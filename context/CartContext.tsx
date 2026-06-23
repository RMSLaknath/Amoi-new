'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface CartContextType {
  cartItems: Record<string, number>
  addToCart: (productId: string, size: string) => Promise<void>
  updateCart: (productId: string, size: string, quantity: number) => Promise<void>
  getCartCount: () => number
  isAuthenticated: boolean
  syncCart: () => Promise<void>
  mergeGuestCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

function getLocalCart(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('guestCart') ?? '{}')
  } catch {
    return {}
  }
}

function setLocalCart(data: Record<string, number>) {
  localStorage.setItem('guestCart', JSON.stringify(data))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Record<string, number>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const syncCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart/get', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setCartItems(data.cartData as Record<string, number>)
          setIsAuthenticated(true)
          return
        }
      }
    } catch {
      // network error — fall through to guest
    }
    setCartItems(getLocalCart())
    setIsAuthenticated(false)
  }, [])

  const mergeGuestCart = useCallback(async () => {
    const guest = getLocalCart()
    if (Object.keys(guest).length === 0) return
    for (const [key, qty] of Object.entries(guest)) {
      const [itemId, size] = key.split('_')
      for (let i = 0; i < qty; i++) {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, size }),
        })
      }
    }
    localStorage.removeItem('guestCart')
    await syncCart()
  }, [syncCart])

  useEffect(() => { syncCart() }, [syncCart])

  const addToCart = async (productId: string, size: string) => {
    const cartKey = `${productId}_${size}`
    if (isAuthenticated) {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: productId, size }),
      })
      await syncCart()
    } else {
      const current = getLocalCart()
      current[cartKey] = (current[cartKey] ?? 0) + 1
      setLocalCart(current)
      setCartItems({ ...current })
    }
  }

  const updateCart = async (productId: string, size: string, quantity: number) => {
    const cartKey = `${productId}_${size}`
    if (isAuthenticated) {
      await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: productId, size, quantity }),
      })
      await syncCart()
    } else {
      const current = getLocalCart()
      if (quantity <= 0) delete current[cartKey]
      else current[cartKey] = quantity
      setLocalCart(current)
      setCartItems({ ...current })
    }
  }

  const clearCart = () => {
    setCartItems({})
    if (!isAuthenticated) localStorage.removeItem('guestCart')
  }

  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCart, getCartCount, isAuthenticated, syncCart, mergeGuestCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
