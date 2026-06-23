import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/firebase'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get()
    if (snap.empty) {
      return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent' })
    }

    const userDoc = snap.docs[0]
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour

    await db.collection('users').doc(userDoc.id).update({ resetToken, resetTokenExpiry })

    const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password/${resetToken}`
    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent' })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
