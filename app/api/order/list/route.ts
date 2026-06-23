import { NextRequest, NextResponse } from 'next/server'
import { db, snapToArr } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'
import type { Order } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth?.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const snap = await db.collection('orders').orderBy('date', 'desc').get()
    const orders = snapToArr<Order>(snap)

    return NextResponse.json({ success: true, orders })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
