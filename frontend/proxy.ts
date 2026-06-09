import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type JwtPayload = {
  role?: string
  exp?: number
}

type AuthPayload = {
  accessToken?: string
  token?: string
  refreshToken?: string
  expiresIn?: number
  refreshExpiresIn?: number
  user?: {
    role?: string
  }
}

type AuthResponse = AuthPayload & {
  success?: boolean
  data?: AuthPayload
}

function decodeJWT(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isExpired(payload: JwtPayload | null) {
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now()
}

function clearAuthCookies(response: NextResponse) {
  for (const name of ['access_token', 'refresh_token', 'session', 'role_hint']) {
    response.cookies.delete(name)
  }
}

function setAuthCookies(response: NextResponse, data: AuthResponse) {
  const payload = data?.data || data
  const accessToken = payload?.accessToken || payload?.token
  const refreshToken = payload?.refreshToken
  const role = payload?.user?.role

  if (accessToken) {
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(payload?.expiresIn || 15 * 60),
    })
    response.cookies.set('session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(payload?.expiresIn || 15 * 60),
    })
  }

  if (refreshToken) {
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(payload?.refreshExpiresIn || 30 * 24 * 60 * 60),
    })
  }

  if (role) {
    response.cookies.set('role_hint', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(payload?.refreshExpiresIn || 30 * 24 * 60 * 60),
    })
  }
}

async function refreshSession(refreshToken: string) {
  const backendApiUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:4000/api'

  const response = await fetch(`${backendApiUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.success || data.data?.user?.role !== 'admin') {
    return null
  }

  return data
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken =
    request.cookies.get('access_token')?.value ||
    request.cookies.get('session')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  const isAuthRoute = pathname.startsWith('/auth')
  const isAdminRoute = pathname.startsWith('/admin')

  if (!isAdminRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  const payload = accessToken ? decodeJWT(accessToken) : null
  const hasUsableAdminAccess = payload?.role === 'admin' && !isExpired(payload)
  const roleHint = request.cookies.get('role_hint')?.value
  const hasPotentialRefresh = Boolean(refreshToken && (!payload || payload.role === 'admin' || roleHint === 'admin'))

  if (isAdminRoute && !hasUsableAdminAccess && !hasPotentialRefresh) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    clearAuthCookies(response)
    return response
  }

  if (!hasUsableAdminAccess && hasPotentialRefresh && refreshToken) {
    const refreshed = await refreshSession(refreshToken).catch(() => null)

    if (refreshed) {
      const response = isAuthRoute
        ? NextResponse.redirect(new URL('/admin', request.url))
        : NextResponse.next()
      setAuthCookies(response, refreshed)
      return response
    }

    if (isAdminRoute) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      clearAuthCookies(response)
      return response
    }
  }

  if (isAuthRoute && hasUsableAdminAccess) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
