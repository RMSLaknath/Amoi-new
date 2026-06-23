import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/firebase'
import { signToken, setTokenCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
    }

    const existing = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get()
    if (!existing.empty) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const ref = await db.collection('users').add({
      name,
      email: email.toLowerCase(),
      password: hashed,
      cartData: {},
    })

    const token = await signToken({ id: ref.id })
    const response = NextResponse.json({ success: true, message: 'Account created' })
    setTokenCookie(response, token)
    return response
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
