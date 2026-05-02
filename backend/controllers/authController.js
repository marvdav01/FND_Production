import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.JWT_SECRET || 'supersecretkey'
const expiresIn = process.env.JWT_EXPIRES_IN || '2h'

export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' })
  }

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
}

export async function signup(req, res) {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email and password are required' })
  }

  const hashed = bcrypt.hashSync(password, 10)
  try {
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, 'client'])
    res.status(201).json({ success: true, data: { userId: result.insertId, email } })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' })
    }
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function profile(req, res) {
  res.json({ success: true, data: req.user })
}
