import { NextRequest, NextResponse } from 'next/server'
import { db, snapToArr } from '@/lib/firebase'
import type { Review } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const snap = await db.collection('reviews').where('productId', '==', productId).get()
    const reviews = snapToArr<Review>(snap).sort((a, b) => (b.date as unknown as number) - (a.date as unknown as number))

    const avgRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0

    return NextResponse.json({ success: true, reviews, avgRating })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
