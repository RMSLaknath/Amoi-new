import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAdminAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAdminAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, payment } = await req.json()
    await db.collection('orders').doc(orderId).update({ payment })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
