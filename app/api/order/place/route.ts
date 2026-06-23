import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { items, amount, address } = await req.json()

    const ref = await db.collection('orders').add({
      userId: auth.id,
      items,
      amount,
      address,
      status: 'Order Placed',
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    })

    await db.collection('users').doc(auth.id).set({ cartData: {} }, { merge: true })

    return NextResponse.json({ success: true, orderId: ref.id })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
