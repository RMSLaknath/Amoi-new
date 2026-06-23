import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db, FieldValue } from '@/lib/firebase'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    const snap = await db.collection('users').where('resetToken', '==', token).limit(1).get()
    if (snap.empty) {
      return NextResponse.json({ success: false, message: 'Invalid or expired reset token' }, { status: 400 })
    }

    const userDoc = snap.docs[0]
    const expiry = userDoc.data().resetTokenExpiry as number
    if (!expiry || Date.now() > expiry) {
      return NextResponse.json({ success: false, message: 'Invalid or expired reset token' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    await db.collection('users').doc(userDoc.id).update({
      password: hashed,
      resetToken: FieldValue.delete(),
      resetTokenExpiry: FieldValue.delete(),
    })

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
