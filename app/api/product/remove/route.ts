import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAdminAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminAuthUser(req)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()
    await db.collection('products').doc(id).delete()

    return NextResponse.json({ success: true, message: 'Product removed' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
