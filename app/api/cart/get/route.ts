import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const userDoc = await db.collection('users').doc(auth.id).get()
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, cartData: userDoc.data()?.cartData ?? {} })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
