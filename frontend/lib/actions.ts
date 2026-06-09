'use server'

import { fetchAPI } from './api'
import { setSession, clearSession } from './session'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (res.success && (res.data?.accessToken || res.data?.token)) {
      // Save JWT in HTTP-only cookie
      await setSession(res.data.accessToken || res.data.token, res.data.refreshToken)
      return { success: true, user: res.data.user }
    } else {
      return { success: false, error: res.error || 'Login gagal' }
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Login gagal' }
  }
}

export async function logoutAction() {
  await clearSession()
  return { success: true }
}

export async function signupAction(formData: FormData) {
  const name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const phone = formData.get('phone') as string
  
  try {
    const res = await fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, phone }),
    })

    if (res.success) {
      return { success: true }
    } else {
      return { success: false, error: res.error || 'Pendaftaran gagal' }
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Pendaftaran gagal' }
  }
}
