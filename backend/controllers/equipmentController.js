import { pool } from '../db.js'

export async function fetchEquipment(req, res) {
  const [rows] = await pool.query('SELECT * FROM equipment ORDER BY id DESC LIMIT 200')
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
  const { name, totalStock, availableStock } = req.body
  if (!name || totalStock == null || availableStock == null) {
    return res.status(400).json({ success: false, error: 'Name and stock are required' })
  }

  const [result] = await pool.query('INSERT INTO equipment (name, total_stock, available_stock) VALUES (?, ?, ?)', [name, totalStock, availableStock])
  res.status(201).json({ success: true, data: { equipmentId: result.insertId } })
}

export async function updateEquipment(req, res) {
  const id = Number(req.params.id)
  const { name, totalStock, availableStock } = req.body
  const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id])
  const item = rows[0]
  if (!item) {
    return res.status(404).json({ success: false, error: 'Equipment not found' })
  }
  await pool.query('UPDATE equipment SET name = ?, total_stock = ?, available_stock = ? WHERE id = ?', [name || item.name, totalStock ?? item.total_stock, availableStock ?? item.available_stock, id])
  res.json({ success: true, message: 'Equipment updated' })
}

export async function deleteEquipment(req, res) {
  await pool.query('DELETE FROM equipment WHERE id = ?', [Number(req.params.id)])
  res.json({ success: true, message: 'Equipment removed' })
}
