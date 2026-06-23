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
    const email = (data.email || data.emailAddress || '') as string
    let name = (data.name || data.displayName || '') as string

    // Backfill missing name so it won't be blank on next load
    if (!name && email) {
      name = email.split('@')[0]
      await db.collection('users').doc(auth.id).update({ name })
    }

    return NextResponse.json({
      success: true,
      user: { name, email },
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
