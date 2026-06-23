'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useCart } from '@/context/CartContext'
import SizePicker from './SizePicker'
import Button from '@/components/ui/Button'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductActions({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState('')
  const { addToCart } = useCart()
  const router = useRouter()

  const validate = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return false
    }
    return true
  }

  const handleAddToCart = async () => {
    if (!validate()) return
    await addToCart(product._id, selectedSize)
    toast.success('Added to cart')
  }

  const handleBuyNow = async () => {
    if (!validate()) return
    await addToCart(product._id, selectedSize)
    router.push('/cart')
  }

  return (
    <div className="space-y-6">
      <SizePicker sizes={product.sizes} selected={selectedSize} onChange={setSelectedSize} />
      <div className="space-y-3">
        <Button fullWidth onClick={handleAddToCart}>Add to Cart</Button>
        <Button fullWidth variant="outline" onClick={handleBuyNow}>Buy Now</Button>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">
        Free shipping on orders above LKR 10,000. Standard delivery in 3–5 business days.
      </p>
    </div>
  )
}
