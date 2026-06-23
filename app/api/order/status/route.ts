import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth?.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status } = await req.json()
    await db.collection('orders').doc(orderId).update({ status })

    return NextResponse.json({ success: true, message: 'Status updated' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
