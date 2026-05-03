import { pool } from '../config/db.js'

export async function fetchEquipment(req, res) {
  const { category } = req.query
  let query = 'SELECT * FROM equipment'
  const params = []
  
  if (category) {
    query += ' WHERE category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY id DESC LIMIT 200'
  const [rows] = await pool.query(query, params)
  res.json({ success: true, data: rows })
}

export async function getEquipment(req, res) {
  const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [Number(req.params.id)])
  const item = rows[0]
  if (!item) {
    return res.status(404).json({ success: false, error: 'Equipment not found' })
  }
  res.json({ success: true, data: item })
}

export async function createEquipment(req, res) {
  const { name, totalStock, availableStock, category, description } = req.body
  if (!name || totalStock == null || availableStock == null) {
    return res.status(400).json({ success: false, error: 'Name and stock are required' })
  }

  const [result] = await pool.query(
    'INSERT INTO equipment (name, total_stock, available_stock, category, description) VALUES (?, ?, ?, ?, ?)',
    [name, totalStock, availableStock, category || null, description || null]
  )
  res.status(201).json({ success: true, data: { equipmentId: result.insertId } })
}

export async function updateEquipment(req, res) {
  const id = Number(req.params.id)
  const { name, totalStock, availableStock, category, description } = req.body
  const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id])
  const item = rows[0]
  if (!item) {
    return res.status(404).json({ success: false, error: 'Equipment not found' })
  }
  await pool.query(
    'UPDATE equipment SET name = ?, total_stock = ?, available_stock = ?, category = ?, description = ? WHERE id = ?',
    [name || item.name, totalStock ?? item.total_stock, availableStock ?? item.available_stock, category !== undefined ? category : item.category, description !== undefined ? description : item.description, id]
  )
  res.json({ success: true, message: 'Equipment updated' })
}

export async function deleteEquipment(req, res) {
  await pool.query('DELETE FROM equipment WHERE id = ?', [Number(req.params.id)])
  res.json({ success: true, message: 'Equipment removed' })
}
