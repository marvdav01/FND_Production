import { pool } from '../config/db.js'

export async function fetchCrew(req, res) {
  const status = req.query.status === 'tersedia' ? 'available' : req.query.status
  let query = 'SELECT * FROM crew'
  const params = []

  if (status) {
    query += ' WHERE status = ?'
    params.push(status)
  }

  query += ' ORDER BY status, id DESC'
  const [rows] = await pool.query(query, params)
  res.json({ success: true, data: rows })
}

export async function getCrew(req, res) {
  const [rows] = await pool.query('SELECT * FROM crew WHERE id = ?', [Number(req.params.id)])
  const item = rows[0]
  if (!item) {
    return res.status(404).json({ success: false, error: 'Crew not found' })
  }
  res.json({ success: true, data: item })
}

export async function createCrew(req, res) {
  const { name, role, phone } = req.body
  if (!name || !role) {
    return res.status(400).json({ success: false, error: 'Name and role are required' })
  }

  const [result] = await pool.query('INSERT INTO crew (name, role, phone) VALUES (?, ?, ?)', [name, role, phone || null])
  res.status(201).json({ success: true, data: { crewId: result.insertId } })
}

export async function updateCrew(req, res) {
  const id = Number(req.params.id)
  const { name, role, phone } = req.body
  const status = req.body.status === 'tersedia' ? 'available' : req.body.status
  const [rows] = await pool.query('SELECT * FROM crew WHERE id = ?', [id])
  if (!rows[0]) {
    return res.status(404).json({ success: false, error: 'Crew not found' })
  }

  await pool.query('UPDATE crew SET name = ?, role = ?, phone = ?, status = ? WHERE id = ?', [name || rows[0].name, role || rows[0].role, phone || rows[0].phone, status || rows[0].status, id])
  res.json({ success: true, message: 'Crew updated' })
}

export async function deleteCrew(req, res) {
  await pool.query('DELETE FROM crew WHERE id = ?', [Number(req.params.id)])
  res.json({ success: true, message: 'Crew removed' })
}

export async function assignCrew(req, res) {
  const eventId = Number(req.params.id)
  const { crewId, task } = req.body
  if (!crewId) {
    return res.status(400).json({ success: false, error: 'Crew ID is required' })
  }

  await pool.query('INSERT INTO event_crew (event_id, crew_id, task) VALUES (?, ?, ?)', [eventId, crewId, task || 'Support'])
  await pool.query('UPDATE crew SET status = ? WHERE id = ?', ['on_job', crewId])
  res.json({ success: true, message: 'Crew assigned' })
}

// Admin-only: Create crew member with login account
export async function registerCrewAccount(req, res) {
  const { name, email, password, role, phone } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' })
  }

  const bcrypt = (await import('bcryptjs')).default
  const hashed = bcrypt.hashSync(password, 12)
  const crewRole = role || 'Technician'
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Create user account with role 'crew'
    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, 'crew', phone || null]
    )

    // Create crew record
    const [crewResult] = await connection.query(
      'INSERT INTO crew (user_id, name, role, phone) VALUES (?, ?, ?, ?)',
      [userResult.insertId, name, crewRole, phone || null]
    )

    await connection.commit()
    res.status(201).json({
      success: true,
      data: { userId: userResult.insertId, crewId: crewResult.insertId }
    })
  } catch (error) {
    await connection.rollback()
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email sudah terdaftar' })
    }
    res.status(500).json({ success: false, error: error.message })
  } finally {
    connection.release()
  }
}
