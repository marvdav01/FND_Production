import dotenv from 'dotenv'
import { verifyAccessToken } from '../utils/authTokens.js'

dotenv.config()

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return null

  return cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .reduce((value, entry) => {
      const [key, ...rest] = entry.split('=')
      return key === name ? decodeURIComponent(rest.join('=')) : value
    }, null)
}

export function authenticate(req, res, next) {
  let token = null
  const header = req.headers.authorization
  
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1]
  } else {
    token = readCookie(req, 'access_token') || readCookie(req, 'session')
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    next()
  }
}
