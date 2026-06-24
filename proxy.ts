import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

async function verifyToken(token: string) {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) return null
  try {
    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl

    // ── Admin route protection ────────────────────────────────────────────
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      const token = req.cookies.get('admin_token')?.value
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      const payload = await verifyToken(token)
      if (!payload?.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // ── Protected store routes ────────────────────────────────────────────
    if (pathname === '/orders' || pathname === '/checkout') {
      const token = req.cookies.get('token')?.value
      if (!token) {
        return NextResponse.redirect(
          new URL(`/account?redirect=${encodeURIComponent(pathname)}`, req.url)
        )
      }
      const payload = await verifyToken(token)
      if (!payload || payload.isAdmin) {
        return NextResponse.redirect(
          new URL(`/account?redirect=${encodeURIComponent(pathname)}`, req.url)
        )
      }
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/orders', '/checkout'],
}
