import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeJWT(token: string) {
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
  } catch (e) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/auth')
  const isAdminRoute = pathname.startsWith('/admin')
  const isClientRoute = pathname.startsWith('/client')
  const isCrewRoute = pathname.startsWith('/crew')

  // 1. If accessing protected route without session
  if ((isAdminRoute || isClientRoute || isCrewRoute) && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // 2. If session exists, check role and enforce boundaries
  if (session) {
    const payload = decodeJWT(session)
    const role = payload?.role

    // Redirect logged-in users away from auth routes
    if (isAuthRoute) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
      if (role === 'crew') return NextResponse.redirect(new URL('/crew', request.url))
      return NextResponse.redirect(new URL('/client', request.url))
    }

    // Role-based protection
    if (isAdminRoute && role !== 'admin') {
      const target = role === 'crew' ? '/crew' : '/client'
      return NextResponse.redirect(new URL(target, request.url))
    }

    if (isCrewRoute && role !== 'crew') {
      const target = role === 'admin' ? '/admin' : '/client'
      return NextResponse.redirect(new URL(target, request.url))
    }

    if (isClientRoute && role !== 'client') {
      const target = role === 'admin' ? '/admin' : '/crew'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
