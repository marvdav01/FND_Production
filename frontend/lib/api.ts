export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isServer = typeof window === 'undefined'

  // On server, make sure we use an absolute URL so Node's fetch works correctly.
  const serverBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api'
  const clientBase = process.env.NEXT_PUBLIC_API_URL || '/api'
  const base = isServer ? serverBase : clientBase

  const url = `${base}${endpoint}`
  
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as any || {}),
  };

  if (!headers['Authorization']) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      // Server-side: try to read session cookie (set by server-side helpers)
      try {
        const { getSession } = await import('./session');
        const session = await getSession();
        if (session) {
          headers['Authorization'] = `Bearer ${session}`;
        }
      } catch (e) {
        console.error('Error getting session in fetchAPI:', e);
      }
    }
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (err: any) {
    console.error('[fetchAPI] Fetch error:', err?.message || err)
    throw new Error('Terjadi kesalahan pada server')
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const err: any = new Error(data.error || 'Terjadi kesalahan pada server')
    err.status = response.status
    err.data = data
    throw err
  }

  return data;
}
