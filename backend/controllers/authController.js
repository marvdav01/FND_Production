import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { pool } from '../config/db.js'
import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
  findActiveRefreshToken,
  issueTokenPair,
  publicUser,
  revokeRefreshToken,
  revokeUserRefreshTokens,
  verifyRefreshToken,
} from '../utils/authTokens.js'
import { toPublicUploadUrl } from '../middlewares/upload.js'

const uploadRoot = path.resolve('uploads')

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

function removeLocalUpload(publicUrl) {
  if (!publicUrl || !publicUrl.startsWith('/uploads/')) return

  const relativePath = publicUrl.replace('/uploads/', '')
  const targetPath = path.resolve(uploadRoot, relativePath)
  if (!targetPath.startsWith(uploadRoot)) return

  fs.promises.unlink(targetPath).catch(() => {})
}

async function findUserById(userId) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, phone, avatar_url FROM users WHERE id = ? LIMIT 1',
    [userId],
  )
  return rows[0] || null
}

function tokenResponse(user, tokens) {
  return {
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: ACCESS_TOKEN_MAX_AGE_SECONDS,
    refreshExpiresIn: REFRESH_TOKEN_MAX_AGE_SECONDS,
    user: publicUser(user),
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, role, phone, avatar_url FROM users WHERE email = ? LIMIT 1',
      [email],
    )
    const user = rows[0]
    if (!user || !user.password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const matched = await bcrypt.compare(password, user.password)
    if (!matched) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const tokens = await issueTokenPair(user, req)
    res.json({ success: true, data: tokenResponse(user, tokens) })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed due to server error' })
  }
}

export async function refresh(req, res) {
  const refreshToken = req.body?.refreshToken || readCookie(req, 'refresh_token')
  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'Refresh token is required' })
  }

  try {
    verifyRefreshToken(refreshToken)
    const activeSession = await findActiveRefreshToken(refreshToken)
    if (!activeSession) {
      return res.status(401).json({ success: false, error: 'Refresh token is invalid or expired' })
    }

    const user = publicUser(activeSession)
    await revokeRefreshToken(refreshToken)
    const tokens = await issueTokenPair(user, req)

    res.json({ success: true, data: tokenResponse(user, tokens) })
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Refresh token is invalid or expired' })
  }
}

export async function logout(req, res) {
  const refreshToken = req.body?.refreshToken || readCookie(req, 'refresh_token')

  try {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken)
    }
    res.json({ success: true, message: 'Logged out' })
  } catch (error) {
    res.json({ success: true, message: 'Logged out' })
  }
}

export async function logoutAll(req, res) {
  try {
    await revokeUserRefreshTokens(req.user.id)
    res.json({ success: true, message: 'All sessions revoked' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to revoke sessions' })
  }
}

export async function signup(req, res) {
  const { name, email, password, role, phone } = req.body

  if (role === 'crew' || role === 'admin') {
    return res.status(400).json({ success: false, error: 'Registrasi akun crew/admin hanya dapat ditambahkan oleh admin' })
  }

  const hashed = await bcrypt.hash(password, 12)
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()
    
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashed, 'client', phone || null],
    )
    
    await connection.commit()
    res.status(201).json({ success: true, data: { userId: result.insertId, email } })
  } catch (error) {
    await connection.rollback()
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' })
    }
    res.status(500).json({ success: false, error: 'Registration failed' })
  } finally {
    connection.release()
  }
}

export async function profile(req, res) {
  try {
    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: publicUser(user) })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' })
  }
}

export async function updateProfile(req, res) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : undefined
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : undefined

  try {
    await pool.query(
      'UPDATE users SET name = COALESCE(NULLIF(?, ""), name), phone = ? WHERE id = ?',
      [name ?? '', phone ?? null, req.user.id],
    )
    const user = await findUserById(req.user.id)
    res.json({ success: true, data: publicUser(user) })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' })
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'Password baru minimal 8 karakter' })
  }

  try {
    const [rows] = await pool.query('SELECT id, password FROM users WHERE id = ? LIMIT 1', [req.user.id])
    const user = rows[0]
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const matched = await bcrypt.compare(currentPassword, user.password)
    if (!matched) {
      return res.status(400).json({ success: false, error: 'Password saat ini tidak sesuai' })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id])
    await revokeUserRefreshTokens(req.user.id)

    res.json({ success: true, message: 'Password berhasil diganti. Silakan login ulang.' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to change password' })
  }
}

export async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' })
  }

  try {
    const [currentRows] = await pool.query('SELECT avatar_url FROM users WHERE id = ? LIMIT 1', [req.user.id])
    const avatarUrl = toPublicUploadUrl(req.file)

    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id])
    removeLocalUpload(currentRows[0]?.avatar_url)

    const user = await findUserById(req.user.id)
    res.json({ success: true, data: publicUser(user), message: 'Avatar berhasil diperbarui' })
  } catch (error) {
    removeLocalUpload(toPublicUploadUrl(req.file))
    res.status(500).json({ success: false, error: 'Failed to upload avatar' })
  }
}

export async function uploadAvatarBase64(req, res) {
  const { image, mimeType } = req.body
  if (!image) {
    return res.status(400).json({ success: false, error: 'No image data provided' })
  }

  try {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const mime = mimeType || 'image/jpeg'
    if (!allowedTypes.includes(mime)) {
      return res.status(400).json({ success: false, error: 'Format file tidak didukung' })
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'Ukuran file maksimal 5MB' })
    }

    const extMap = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
    const ext = extMap[mime] || 'jpg'
    const filename = `avatar-u${req.user.id}-${Date.now()}.${ext}`
    const avatarDir = path.join(uploadRoot, 'avatars')
    fs.mkdirSync(avatarDir, { recursive: true })
    const filepath = path.join(avatarDir, filename)
    fs.writeFileSync(filepath, buffer)

    const [currentRows] = await pool.query('SELECT avatar_url FROM users WHERE id = ? LIMIT 1', [req.user.id])
    const avatarUrl = `/uploads/avatars/${filename}`

    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id])
    removeLocalUpload(currentRows[0]?.avatar_url)

    const user = await findUserById(req.user.id)
    res.json({ success: true, data: publicUser(user), message: 'Avatar berhasil diperbarui' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload avatar' })
  }
}

export async function deleteAvatar(req, res) {
  try {
    const [currentRows] = await pool.query('SELECT avatar_url FROM users WHERE id = ? LIMIT 1', [req.user.id])
    await pool.query('UPDATE users SET avatar_url = NULL WHERE id = ?', [req.user.id])
    removeLocalUpload(currentRows[0]?.avatar_url)

    const user = await findUserById(req.user.id)
    res.json({ success: true, data: publicUser(user), message: 'Avatar berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete avatar' })
  }
}

export async function getUsers(req, res) {
  const { role, search = '' } = req.query
  let query = 'SELECT id, name AS full_name, name, email, role, phone, avatar_url FROM users'
  const params = []
  const conditions = []
  
  if (role) {
    conditions.push('role = ?')
    params.push(role)
  }

  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }
  
  query += ' ORDER BY name ASC LIMIT 200'
  
  try {
    const [rows] = await pool.query(query, params)
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' })
  }
}

export async function createUser(req, res) {
  const { name, email, password, role, phone } = req.body
  try {
    const hashed = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, role, phone || null],
    )

    const user = await findUserById(result.insertId)
    res.status(201).json({ success: true, data: publicUser(user), message: 'User berhasil dibuat' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' })
    }
    res.status(500).json({ success: false, error: 'Failed to create user' })
  }
}

export async function updateUser(req, res) {
  const userId = Number(req.params.id)
  const { name, email, password, role, phone } = req.body

  try {
    const existing = await findUserById(userId)
    if (!existing) return res.status(404).json({ success: false, error: 'User not found' })

    const updates = []
    const params = []

    if (name !== undefined) {
      updates.push('name = ?')
      params.push(name)
    }
    if (email !== undefined) {
      updates.push('email = ?')
      params.push(email)
    }
    if (role !== undefined) {
      updates.push('role = ?')
      params.push(role)
    }
    if (phone !== undefined) {
      updates.push('phone = ?')
      params.push(phone || null)
    }
    if (password) {
      updates.push('password = ?')
      params.push(await bcrypt.hash(password, 12))
    }

    if (updates.length) {
      params.push(userId)
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params)
    }

    if (password || role !== undefined) {
      await revokeUserRefreshTokens(userId)
    }

    const user = await findUserById(userId)
    res.json({ success: true, data: publicUser(user), message: 'User berhasil diperbarui' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' })
    }
    res.status(500).json({ success: false, error: 'Failed to update user' })
  }
}

export async function deleteUser(req, res) {
  const userId = Number(req.params.id)
  if (userId === req.user.id) {
    return res.status(400).json({ success: false, error: 'Tidak dapat menghapus akun sendiri' })
  }

  try {
    const existing = await findUserById(userId)
    if (!existing) return res.status(404).json({ success: false, error: 'User not found' })

    await revokeUserRefreshTokens(userId)
    removeLocalUpload(existing.avatar_url)
    await pool.query('DELETE FROM users WHERE id = ?', [userId])

    res.json({ success: true, message: 'User berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete user' })
  }
}
