import { pool } from '../db.js'

const statusOrder = ['pending', 'survey', 'deal', 'running', 'done', 'cancel']

export async function fetchEvents(req, res) {
  const { status, clientId } = req.query
  let query = 'SELECT e.*, u.name AS client_name FROM events e JOIN users u ON e.client_id = u.id'
  const params = []
  const conditions = []

  if (req.user.role === 'client') {
    conditions.push('e.client_id = ?')
    params.push(req.user.id)
  }

  if (status) {
    conditions.push('e.status = ?')
    params.push(status)
  }

  if (clientId && req.user.role === 'admin') {
    conditions.push('e.client_id = ?')
    params.push(clientId)
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' ORDER BY e.event_date DESC LIMIT 100'
  const [events] = await pool.query(query, params)
  res.json({ success: true, data: events })
}

export async function getEvent(req, res) {
  const eventId = Number(req.params.id)
  const [rows] = await pool.query(
    `SELECT e.*, u.name AS client_name, u.email AS client_email
     FROM events e
     JOIN users u ON e.client_id = u.id
     WHERE e.id = ?`,
    [eventId],
  )
  const event = rows[0]
  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' })
  }

  if (req.user.role === 'client' && event.client_id !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }

  const [[equipment]] = await pool.query(
    `SELECT eq.id, eq.name, ee.quantity
     FROM event_equipment ee
     JOIN equipment eq ON ee.equipment_id = eq.id
     WHERE ee.event_id = ?`,
    [eventId],
  )

  const [[crewMembers]] = await pool.query(
    `SELECT c.id, c.name, c.role, c.status, ec.task
     FROM event_crew ec
     JOIN crew c ON ec.crew_id = c.id
     WHERE ec.event_id = ?`,
    [eventId],
  )

  const [[payments]] = await pool.query(
    `SELECT * FROM payments WHERE event_id = ? ORDER BY created_at DESC`,
    [eventId],
  )

  res.json({ success: true, data: { ...event, equipment, crew: crewMembers, payments } })
}

export async function createEvent(req, res) {
  const {
    name,
    type,
    eventDate,
    location,
    notes,
    totalAmount,
    dpAmount,
    equipment = [],
    crew = [],
  } = req.body

  if (!name || !type || !eventDate || !location) {
    return res.status(400).json({ success: false, error: 'Required fields are missing' })
  }

  const clientId = req.user.role === 'client' ? req.user.id : req.body.clientId || req.user.id
  const [result] = await pool.query(
    'INSERT INTO events (name, type, event_date, location, notes, client_id, total_amount, dp_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, type, eventDate, location, notes, clientId, totalAmount || 0, dpAmount || 0, dpAmount || 0],
  )

  const eventId = result.insertId

  for (const item of equipment) {
    if (!item.equipmentId || !item.quantity) continue
    await pool.query('INSERT INTO event_equipment (event_id, equipment_id, quantity) VALUES (?, ?, ?)', [eventId, item.equipmentId, item.quantity])
    await pool.query('UPDATE equipment SET available_stock = GREATEST(available_stock - ?, 0) WHERE id = ?', [item.quantity, item.equipmentId])
  }

  for (const member of crew) {
    if (!member.crewId) continue
    await pool.query('INSERT INTO event_crew (event_id, crew_id, task) VALUES (?, ?, ?)', [eventId, member.crewId, member.task || 'Support'])
    await pool.query('UPDATE crew SET status = ? WHERE id = ?', ['on_job', member.crewId])
  }

  res.status(201).json({ success: true, data: { eventId }, message: 'Event created' })
}

export async function updateEvent(req, res) {
  const eventId = Number(req.params.id)
  const { name, type, eventDate, location, notes, status, totalAmount, dpAmount } = req.body
  const [eventRows] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId])
  const existing = eventRows[0]

  if (!existing) {
    return res.status(404).json({ success: false, error: 'Event not found' })
  }

  if (req.user.role === 'client' && existing.client_id !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }

  const updatedStatus = status && statusOrder.includes(status) ? status : existing.status
  await pool.query(
    'UPDATE events SET name = ?, type = ?, event_date = ?, location = ?, notes = ?, status = ?, total_amount = ?, dp_amount = ? WHERE id = ?',
    [name || existing.name, type || existing.type, eventDate || existing.event_date, location || existing.location, notes || existing.notes, updatedStatus, totalAmount || existing.total_amount, dpAmount || existing.dp_amount, eventId],
  )

  if (status === 'done') {
    await returnEquipmentAndCrew(eventId)
  }

  res.json({ success: true, message: 'Event updated' })
}

export async function deleteEvent(req, res) {
  const eventId = Number(req.params.id)
  await pool.query('UPDATE events SET status = ? WHERE id = ?', ['cancel', eventId])
  await returnEquipmentAndCrew(eventId)
  res.json({ success: true, message: 'Event cancelled' })
}

async function returnEquipmentAndCrew(eventId) {
  const [equipRows] = await pool.query('SELECT equipment_id, quantity FROM event_equipment WHERE event_id = ?', [eventId])
  for (const item of equipRows) {
    await pool.query('UPDATE equipment SET available_stock = available_stock + ? WHERE id = ?', [item.quantity, item.equipment_id])
  }

  const [crewRows] = await pool.query('SELECT crew_id FROM event_crew WHERE event_id = ?', [eventId])
  for (const row of crewRows) {
    await pool.query('UPDATE crew SET status = ? WHERE id = ?', ['available', row.crew_id])
  }
}

export async function updateStatus(req, res) {
  const eventId = Number(req.params.id)
  const { status } = req.body
  if (!statusOrder.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' })
  }

  await pool.query('UPDATE events SET status = ? WHERE id = ?', [status, eventId])
  if (status === 'done') {
    await returnEquipmentAndCrew(eventId)
  }
  res.json({ success: true, message: 'Event status updated', data: { status } })
}
