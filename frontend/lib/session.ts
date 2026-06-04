export async function setSession(token: string) {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 hours
  })
}

export function setClientSession(token: string) {
  if (typeof window === 'undefined') return
  const secure = process.env.NODE_ENV === 'production' ? 'secure; ' : ''
  document.cookie = `session=${token}; path=/; max-age=${60 * 60 * 2}; SameSite=Lax; ${secure}`
}

export async function getSession() {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    return session
  } catch (e: any) {
    console.error('[getSession] Error:', e.message)
    return null
  }
}

export function clearClientSession() {
  if (typeof window === 'undefined') return
  document.cookie = 'session=; path=/; max-age=0; SameSite=Lax;'
}

export async function clearSession() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
