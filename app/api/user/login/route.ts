import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/firebase'
import { signToken, setTokenCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get()
    if (snap.empty) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const userDoc = snap.docs[0]
    const userData = userDoc.data()

    const valid = await bcrypt.compare(password, userData.password as string)
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({ id: userDoc.id })
    const response = NextResponse.json({ success: true, message: 'Logged in' })
    setTokenCookie(response, token)
    return response
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
