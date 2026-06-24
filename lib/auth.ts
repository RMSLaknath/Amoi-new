import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface JwtPayload {
  id: string
  isAdmin?: boolean
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret)
  return payload as unknown as JwtPayload
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get('token')?.value ?? null
}

export async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
  const token = getTokenFromRequest(req)
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

export async function getAdminAuthUser(req: NextRequest): Promise<JwtPayload | null> {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null
  try {
    const payload = await verifyToken(token)
    return payload.isAdmin ? payload : null
  } catch {
    return null
  }
}

export function setTokenCookie(res: NextResponse, token: string): void {
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export function setAdminTokenCookie(res: NextResponse, token: string): void {
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export function clearTokenCookie(res: NextResponse): void {
  res.cookies.set('token', '', { maxAge: 0, path: '/' })
  res.cookies.set('admin_token', '', { maxAge: 0, path: '/' })
}
