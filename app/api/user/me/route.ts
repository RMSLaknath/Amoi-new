import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ success: false }, { status: 401 })

    // Admin tokens are not store user accounts
    if (auth.isAdmin) return NextResponse.json({ success: false }, { status: 401 })

    const doc = await db.collection('users').doc(auth.id).get()
    if (!doc.exists) return NextResponse.json({ success: false }, { status: 404 })

    const data = doc.data()!
    const email = (data.email || data.emailAddress || data.userEmail || '') as string
    let name = (data.name || data.displayName || data.fullName || '') as string

    // Backfill missing name from email prefix
    if (!name && email) {
      name = email.split('@')[0]
      await db.collection('users').doc(auth.id).update({ name })
    }

    // Backfill missing email if name exists (shouldn't normally happen)
    if (name && !email) {
      // Can't recover email without auth lookup — return what we have
    }

    return NextResponse.json({
      success: true,
      user: { name, email },
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
