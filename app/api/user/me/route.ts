import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ success: false }, { status: 401 })

    const doc = await db.collection('users').doc(auth.id).get()
    if (!doc.exists) return NextResponse.json({ success: false }, { status: 404 })

    const data = doc.data()!
    return NextResponse.json({
      success: true,
      user: { name: data.name as string, email: data.email as string },
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
