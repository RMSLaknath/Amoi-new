import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAdminAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAdminAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status } = await req.json()
    const updateData: Record<string, unknown> = { status }

    // Auto-mark COD orders as paid when delivered
    if (status === 'Delivered') {
      const orderDoc = await db.collection('orders').doc(orderId).get()
      if (orderDoc.exists && orderDoc.data()?.paymentMethod === 'COD') {
        updateData.payment = true
      }
    }

    await db.collection('orders').doc(orderId).update(updateData)

    return NextResponse.json({ success: true, message: 'Status updated' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
