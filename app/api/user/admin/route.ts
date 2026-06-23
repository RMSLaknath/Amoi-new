import { NextRequest, NextResponse } from 'next/server'
import { signToken, setTokenCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = await signToken({ id: 'admin', isAdmin: true })
    const response = NextResponse.json({ success: true, message: 'Admin logged in' })
    setTokenCookie(response, token)
    return response
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
