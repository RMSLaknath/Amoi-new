import { NextResponse } from 'next/server'
import { db, snapToArr } from '@/lib/firebase'
import type { Product } from '@/types'

export async function GET() {
  try {
    const snap = await db.collection('products').orderBy('date', 'desc').get()
    const products = snapToArr<Product>(snap)
    return NextResponse.json({ success: true, products })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
