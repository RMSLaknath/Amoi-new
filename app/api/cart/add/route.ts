import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, size } = await req.json()
    const cartKey = `${itemId}_${size}`

    const userDoc = await db.collection('users').doc(auth.id).get()
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const cartData: Record<string, number> = { ...(userDoc.data()?.cartData ?? {}) }
    cartData[cartKey] = (cartData[cartKey] ?? 0) + 1

    await db.collection('users').doc(auth.id).set({ cartData }, { merge: true })
    return NextResponse.json({ success: true, message: 'Added to cart' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
