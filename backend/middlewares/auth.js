import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET || 'supersecretkey'

export function authenticate(req, res, next) {
  let token = null
  const header = req.headers.authorization
  
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1]
  } else if (req.query.token) {
    token = req.query.token
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (error) {
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
