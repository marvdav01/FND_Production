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

export async function getSession() {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    return session
  } catch (e) {
    return null
  }
}

export async function clearSession() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
