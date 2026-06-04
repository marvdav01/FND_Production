import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET || 'supersecretkey'

export function authenticate(req, res, next) {
  let token = null
  const header = req.headers.authorization
  
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1]
    console.log(`[Auth] Token from Header: ${token.substring(0, 10)}...`)
  } else if (req.query.token) {
    token = req.query.token
    console.log(`[Auth] Token from Query: ${token.substring(0, 10)}...`)
  }

  if (!token) {
    console.warn(`[Auth] No token found for ${req.method} ${req.originalUrl}`)
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (error) {
    console.error(`[Auth Error] ${req.method} ${req.originalUrl}: ${error.message}`)
    return res.status(401).json({ success: false, error: 'Invalid token' })
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
