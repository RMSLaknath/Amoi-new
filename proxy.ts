import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    if (!payload.isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = {
  matcher: '/admin/:path*',
}
