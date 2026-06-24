import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(token, secret)
      if (!payload.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // ── Protected store routes ──────────────────────────────────────────────
  const protectedStorePaths = ['/orders', '/checkout']
  if (protectedStorePaths.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(
        new URL(`/account?redirect=${pathname}`, req.url)
      )
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(token, secret)
      if (payload.isAdmin) {
        // Admin token on store route — redirect to admin
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    } catch {
      return NextResponse.redirect(
        new URL(`/account?redirect=${pathname}`, req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout/:path*'],
}
