import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { adminApp, db } from '@/lib/firebase'
import { signToken, setTokenCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 })
    }

    const decoded = await getAuth(adminApp).verifyIdToken(idToken)
    const { email, name } = decoded

    if (!email) {
      return NextResponse.json({ success: false, message: 'No email from Google account' }, { status: 400 })
    }

    const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get()

    let userId: string
    if (!snap.empty) {
      userId = snap.docs[0].id
    } else {
      const ref = await db.collection('users').add({
        name: name ?? email.split('@')[0],
        email: email.toLowerCase(),
        cartData: {},
      })
      userId = ref.id
    }

    const token = await signToken({ id: userId })
    const response = NextResponse.json({ success: true })
    setTokenCookie(response, token)
    return response
  } catch (err) {
    console.error('google-auth error:', err)
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 })
  }
}
