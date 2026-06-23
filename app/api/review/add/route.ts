import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { productId, rating, comment } = await req.json()

    const userDoc = await db.collection('users').doc(auth.id).get()
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }
    const userName = userDoc.data()?.name as string

    // Use deterministic doc ID to enforce one review per user per product
    const reviewId = `${productId}_${auth.id}`
    const existingDoc = await db.collection('reviews').doc(reviewId).get()
    if (existingDoc.exists) {
      return NextResponse.json({ success: false, message: 'You have already reviewed this product' }, { status: 409 })
    }

    await db.collection('reviews').doc(reviewId).set({
      productId,
      userId: auth.id,
      userName,
      rating,
      comment,
      date: Date.now(),
    })

    return NextResponse.json({ success: true, message: 'Review added' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
