const ACCESS_COOKIE = "access_token"
const REFRESH_COOKIE = "refresh_token"
const LEGACY_SESSION_COOKIE = "session"

function secureCookie() {
  return process.env.NODE_ENV === "production"
}

export async function setSession(accessToken: string, refreshToken?: string) {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()

  const accessOptions = {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 15 * 60,
  }

  cookieStore.set(ACCESS_COOKIE, accessToken, accessOptions)
  cookieStore.set(LEGACY_SESSION_COOKIE, accessToken, accessOptions)

  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    })
  }
}

export function setClientSession(_token: string) {
  // Kept for compatibility. Client-side auth now relies on httpOnly cookies set by /api/proxy.
}

export async function getSession() {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    return (
      cookieStore.get(ACCESS_COOKIE)?.value ||
      cookieStore.get(LEGACY_SESSION_COOKIE)?.value ||
      null
    )
  } catch {
    return null
  }
}

export async function getRefreshSession() {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    return cookieStore.get(REFRESH_COOKIE)?.value || null
  } catch {
    return null
  }
}

export function clearClientSession() {
  if (typeof window === "undefined") return
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, LEGACY_SESSION_COOKIE]) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
  }
}

export async function clearSession() {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, LEGACY_SESSION_COOKIE]) {
    cookieStore.delete(name)
  }
}
