import { NextRequest, NextResponse } from 'next/server'
import { db, docToObj } from '@/lib/firebase'
import type { Product } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json()
    const doc = await db.collection('products').doc(productId).get()

    if (!doc.exists) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product: docToObj<Product>(doc) })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
