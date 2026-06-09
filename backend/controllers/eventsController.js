import { pool } from '../config/db.js'


export async function fetchEvents(req, res) {
  const { status, clientId } = req.query
  let query = 'SELECT e.*, u.name AS client_name, u.phone AS client_phone FROM events e JOIN users u ON e.client_id = u.id'
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

  const [equipment] = await pool.query(
    `SELECT eq.id, eq.name, ee.quantity
     FROM event_equipment ee
     JOIN equipment eq ON ee.equipment_id = eq.id
     WHERE ee.event_id = ?`,
    [eventId],
  )

  const [crewMembers] = await pool.query(
    `SELECT c.id, c.name, c.role, c.status, ec.task
     FROM event_crew ec
     JOIN crew c ON ec.crew_id = c.id
     WHERE ec.event_id = ?`,
    [eventId],
  )

  const [payments] = await pool.query(
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
    referenceImages = [],
    equipment = [],
    crew = [],
  } = req.body

  if (!name || !type || !eventDate || !location) {
    return res.status(400).json({ success: false, error: 'Required fields are missing' })
  }

  const clientId = req.user.role === 'client' ? req.user.id : req.body.clientId || req.user.id
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // 1. Check Crew Conflict
    if (crew.length > 0) {
      const crewIds = crew.map(m => m.crewId)
      const [busyCrew] = await connection.query(
        `SELECT c.name, e.name as event_name 
         FROM event_crew ec 
         JOIN crew c ON ec.crew_id = c.id 
         JOIN events e ON ec.event_id = e.id 
         WHERE ec.crew_id IN (?) AND e.event_date = ? AND e.status != 'cancel'`,
        [crewIds, eventDate]
      )

      if (busyCrew.length > 0) {
        await connection.rollback()
        return res.status(400).json({ 
          success: false, 
          error: `Konflik Jadwal: ${busyCrew[0].name} sudah bertugas di event "${busyCrew[0].event_name}" pada tanggal tersebut.` 
        })
      }
    }

    // 2. Check Equipment Stock
    for (const item of equipment) {
      if (!item.equipmentId || !item.quantity) continue
      const [stockRows] = await connection.query(
        'SELECT name, available_stock FROM equipment WHERE id = ?',
        [item.equipmentId]
      )
      if (stockRows[0] && stockRows[0].available_stock < item.quantity) {
        await connection.rollback()
        return res.status(400).json({
          success: false,
          error: `Stok Tidak Cukup: ${stockRows[0].name} hanya tersedia ${stockRows[0].available_stock} unit.`
        })
      }
    }

    const [result] = await connection.query(
      'INSERT INTO events (name, type, event_date, location, notes, client_id, total_amount, dp_amount, paid_amount, reference_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, eventDate, location, notes, clientId, totalAmount || 0, dpAmount || 0, dpAmount || 0, JSON.stringify(referenceImages)],
    )

    const eventId = result.insertId

    for (const item of equipment) {
      if (!item.equipmentId || !item.quantity) continue
      await connection.query('INSERT INTO event_equipment (event_id, equipment_id, quantity) VALUES (?, ?, ?)', [eventId, item.equipmentId, item.quantity])
      await connection.query('UPDATE equipment SET available_stock = GREATEST(available_stock - ?, 0) WHERE id = ?', [item.quantity, item.equipmentId])
    }

    for (const member of crew) {
      if (!member.crewId) continue
      await connection.query('INSERT INTO event_crew (event_id, crew_id, task) VALUES (?, ?, ?)', [eventId, member.crewId, member.task || 'Support'])
      // Update crew status to on_job if it was available
      await connection.query('UPDATE crew SET status = ? WHERE id = ?', ['on_job', member.crewId])
    }

    await connection.commit()
    res.status(201).json({ success: true, data: { eventId }, message: 'Event created' })
  } catch (error) {
    await connection.rollback()
    res.status(500).json({ success: false, error: error.message })
  } finally {
    connection.release()
  }
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

  if (status === 'selesai' && existing.status !== 'selesai') {
    await returnEquipmentAndCrew(eventId)
  }

  res.json({ success: true, message: 'Event updated' })
}

export async function deleteEvent(req, res) {
  const eventId = Number(req.params.id)
  const [rows] = await pool.query('SELECT status FROM events WHERE id = ?', [eventId])
  if (!rows[0]) {
    return res.status(404).json({ success: false, error: 'Event not found' })
  }
  await pool.query('UPDATE events SET status = ? WHERE id = ?', ['cancel', eventId])
  if (!['cancel', 'selesai'].includes(rows[0].status)) {
    await returnEquipmentAndCrew(eventId)
  }
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

const statusOrder = ['pending', 'survey', 'deal', 'running', 'selesai', 'cancel']

export async function updateStatus(req, res) {
  try {
    const eventId = Number(req.params.id)
    const { status } = req.body
    if (!statusOrder.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status: ' + status })
    }

    const [rows] = await pool.query('SELECT status FROM events WHERE id = ?', [eventId])
    if (!rows[0]) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }

    await pool.query('UPDATE events SET status = ? WHERE id = ?', [status, eventId])
    if (['selesai', 'cancel'].includes(status) && !['selesai', 'cancel'].includes(rows[0].status)) {
      await returnEquipmentAndCrew(eventId)
    }
    res.json({ success: true, message: 'Event status updated', data: { status } })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

export async function getAssignedEvents(req, res) {
  const crewId = req.user.id
  if (req.user.role !== 'crew') {
    return res.status(403).json({ success: false, error: 'Only crew can fetch assigned events' })
  }

  // Find crew mapping by user email/phone logic if necessary, or assume user.id maps to crew.user_id 
  // Wait, the original code used 'crew_id', userData.user.id. 
  // In our backend schema, how do we link users to crew? 
  // users table has role='crew'. `crew` table doesn't have `user_id`, just `id`, `name`, `role`, `phone`, `status`.
  // If the frontend was doing `crew_id`, userData.user.id in Supabase, they had the same ID.
  // In the new system, we need to match users.email/name to crew.name or handle crew mapping differently.
  // Wait, let's just use a JOIN with users on phone/name or assume they have matching names for now.
  const query = `
    SELECT e.*, ec.task 
    FROM events e
    JOIN event_crew ec ON e.id = ec.event_id
    JOIN crew c ON ec.crew_id = c.id
    WHERE c.user_id = ? OR c.name = ? 
    ORDER BY e.event_date ASC
  `
  const [rows] = await pool.query(query, [req.user.id, req.user.name])
  res.json({ success: true, data: rows })
}
