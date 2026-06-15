import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:4000/api"

const ACCESS_COOKIE = "access_token"
const LEGACY_SESSION_COOKIE = "session"
const REFRESH_COOKIE = "refresh_token"
const ROLE_HINT_COOKIE = "role_hint"

type ProxyContext = {
  params: Promise<{ path: string[] }> | { path: string[] }
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

function isSecureCookie() {
  return process.env.NODE_ENV === "production"
}

function setAuthCookies(response: NextResponse, data: AuthResponse) {
  const payload = data?.data || data
  const accessToken = payload?.accessToken || payload?.token
  const refreshToken = payload?.refreshToken

  if (accessToken) {
    const maxAge = Number(payload?.expiresIn || 15 * 60)
    response.cookies.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: isSecureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge,
    })
    response.cookies.set(LEGACY_SESSION_COOKIE, accessToken, {
      httpOnly: true,
      secure: isSecureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge,
    })
  }

  if (refreshToken) {
    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isSecureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: Number(payload?.refreshExpiresIn || 30 * 24 * 60 * 60),
    })
  }

  if (payload?.user?.role) {
    response.cookies.set(ROLE_HINT_COOKIE, payload.user.role, {
      httpOnly: true,
      secure: isSecureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: Number(payload?.refreshExpiresIn || 30 * 24 * 60 * 60),
    })
  }
}

function clearAuthCookies(response: NextResponse) {
  for (const name of [ACCESS_COOKIE, LEGACY_SESSION_COOKIE, REFRESH_COOKIE, ROLE_HINT_COOKIE]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: isSecureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  }
}

function filteredResponseHeaders(headers: Headers) {
  const nextHeaders = new Headers()
  for (const [key, value] of headers.entries()) {
    if (["content-type", "content-disposition", "cache-control"].includes(key.toLowerCase())) {
      nextHeaders.set(key, value)
    }
  }
  return nextHeaders
}

function backendHeaders(request: NextRequest, accessToken?: string | null) {
  const headers = new Headers(request.headers)
  for (const name of [
    "host",
    "cookie",
    "content-length",
    "connection",
    "expect",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ]) {
    headers.delete(name)
  }

  if (accessToken && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${accessToken}`)
  }

  return headers
}

async function refreshAccessToken(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (!refreshToken) return null

  const response = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.success) return null

  return data
}

async function handleProxy(request: NextRequest, context: ProxyContext) {
  const params = await context.params
  const path = params.path.join("/")
  const target = new URL(`${BACKEND_API_URL}/${path}`)
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value))

  const method = request.method
  let body: BodyInit | undefined = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer()
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value || request.cookies.get(LEGACY_SESSION_COOKIE)?.value
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value

  if (path === "auth/logout" && refreshToken && body instanceof ArrayBuffer && body.byteLength === 0) {
    body = JSON.stringify({ refreshToken })
  }

  const makeRequest = (token?: string | null) =>
    fetch(target, {
      method,
      headers: backendHeaders(request, token),
      body,
      cache: "no-store",
    })

  let backendResponse = await makeRequest(accessToken)
  let refreshedData: AuthResponse | null = null

  if (backendResponse.status === 401 && !path.startsWith("auth/login") && !path.startsWith("auth/refresh")) {
    refreshedData = await refreshAccessToken(request)
    const nextAccessToken = refreshedData?.data?.accessToken || refreshedData?.data?.token
    if (nextAccessToken) {
      backendResponse = await makeRequest(nextAccessToken)
    }
  }

  const contentType = backendResponse.headers.get("content-type") || ""
  let responseBody: BodyInit = await backendResponse.arrayBuffer()
  const responseHeaders = filteredResponseHeaders(backendResponse.headers)
  let response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  })

  if (refreshedData) {
    setAuthCookies(response, refreshedData)
  }

  if (contentType.includes("application/json")) {
    try {
      const json = JSON.parse(new TextDecoder().decode(responseBody as ArrayBuffer)) as AuthResponse
      if (path === "auth/login" || path === "auth/refresh") {
        const sanitized = new NextResponse(responseBody, {
          status: backendResponse.status,
          headers: responseHeaders,
        })
        setAuthCookies(sanitized, json)
        
        if (json?.data) {
          delete json.data.token
          delete json.data.accessToken
          delete json.data.refreshToken
        }
        
        const stringifiedJson = JSON.stringify(json)
        const finalResponse = new NextResponse(stringifiedJson, {
          status: sanitized.status,
          headers: sanitized.headers,
        })
        finalResponse.headers.set("content-type", "application/json")
        for (const [key, value] of sanitized.headers.entries()) {
           if (key.toLowerCase() === 'set-cookie') {
              finalResponse.headers.append('set-cookie', value)
           }
        }
        // Workaround for Next.js cookies API
        for (const cookie of sanitized.cookies.getAll()) {
           finalResponse.cookies.set(cookie.name, cookie.value, {
             httpOnly: cookie.httpOnly,
             secure: cookie.secure,
             sameSite: cookie.sameSite as "lax" | "strict" | "none",
             path: cookie.path,
             maxAge: cookie.maxAge,
             expires: cookie.expires
           })
        }
        
        response = finalResponse
      }
      if (path === "auth/logout") {
        clearAuthCookies(response)
      }
    } catch {
      // Keep original backend response when JSON parsing fails.
    }
  }

  return response
}

export async function GET(request: NextRequest, context: ProxyContext) {
  return handleProxy(request, context)
}

export async function POST(request: NextRequest, context: ProxyContext) {
  return handleProxy(request, context)
}

export async function PUT(request: NextRequest, context: ProxyContext) {
  return handleProxy(request, context)
}

export async function PATCH(request: NextRequest, context: ProxyContext) {
  return handleProxy(request, context)
}

export async function DELETE(request: NextRequest, context: ProxyContext) {
  return handleProxy(request, context)
}
