import { pool } from '../db.js'

export async function fetchCrew(req, res) {
  const [rows] = await pool.query('SELECT * FROM crew ORDER BY status, id DESC')
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
  const { name, role, phone, status } = req.body
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
