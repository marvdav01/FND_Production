import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.JWT_SECRET || 'supersecretkey'
const expiresIn = process.env.JWT_EXPIRES_IN || '2h'

export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' })
  }

  try {
    const [rows] = await pool.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const matched = bcrypt.compareSync(password, user.password)
    if (!matched) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, secret, { expiresIn })
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } })
  } catch (error) {
    console.error('[login] Error:', error.message || error)
    res.status(500).json({ success: false, error: 'Login failed due to server error' })
  }
}

export async function signup(req, res) {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email and password are required' })
  }

  // Public signup only allows 'client' role. Crew accounts are created by admin.
  const validRole = 'client'

  const hashed = bcrypt.hashSync(password, 10)
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()
    
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, validRole, req.body.phone || null]
    )
    
    const userId = result.insertId
    
    await connection.commit()
    res.status(201).json({ success: true, data: { userId, email } })
  } catch (error) {
    await connection.rollback()
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' })
    }
    res.status(500).json({ success: false, error: error.message })
  } finally {
    connection.release()
  }
}

export async function profile(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function updateProfile(req, res) {
  const { name, phone } = req.body
  try {
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?',
      [name || null, phone || null, req.user.id]
    )
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' })
  }
  
  const avatarUrl = `/uploads/${req.file.filename}`
  try {
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id])
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
export async function getUsers(req, res) {
  const { role } = req.query
  let query = 'SELECT id, name AS full_name, email, role, phone FROM users'
  const params = []
  
  if (role) {
    query += ' WHERE role = ?'
    params.push(role)
  }
  
  query += ' ORDER BY name ASC'
  
  try {
    const [rows] = await pool.query(query, params)
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
