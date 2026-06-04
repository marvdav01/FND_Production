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
  const { pathname } = request.nextUrl
  if (request.nextUrl.searchParams.get('expired') === '1') {
    const response = pathname.startsWith('/auth') 
      ? NextResponse.next() 
      : NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('session')
    return response
  }

  const session = request.cookies.get('session')?.value

  const isAuthRoute = pathname.startsWith('/auth')
  const isAdminRoute = pathname.startsWith('/admin')

  // 1. If accessing protected route without session
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // 2. If session exists, check role and enforce boundaries
  if (session) {
    const payload = decodeJWT(session)
    const role = payload?.role

    if (!payload || role !== 'admin') {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('session')
      return response
    }

    // Redirect logged-in users away from auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
