import { NextRequest, NextResponse } from 'next/server'
import { db, snapToArr } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'
import type { Order } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const snap = await db.collection('orders').where('userId', '==', auth.id).get()
    const orders = snapToArr<Order>(snap).sort((a, b) => b.date - a.date)

    return NextResponse.json({ success: true, orders })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
