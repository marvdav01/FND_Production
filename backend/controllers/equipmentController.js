import { pool } from '../config/db.js'

// Bug Fix #2: All functions now have try/catch
export async function fetchEquipment(req, res) {
  try {
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
  } catch (error) {
    console.error('fetchEquipment error:', error)
    res.status(500).json({ success: false, error: 'Gagal mengambil data peralatan' })
  }
}

export async function getEquipment(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [Number(req.params.id)])
    const item = rows[0]
    if (!item) {
      return res.status(404).json({ success: false, error: 'Equipment not found' })
    }
    res.json({ success: true, data: item })
  } catch (error) {
    console.error('getEquipment error:', error)
    res.status(500).json({ success: false, error: 'Gagal mengambil data peralatan' })
  }
}

export async function createEquipment(req, res) {
  try {
    const { name, totalStock, availableStock, category, description } = req.body
    if (!name || totalStock == null || availableStock == null) {
      return res.status(400).json({ success: false, error: 'Name and stock are required' })
    }

    const [result] = await pool.query(
      'INSERT INTO equipment (name, total_stock, available_stock, category, description) VALUES (?, ?, ?, ?, ?)',
      [name, totalStock, availableStock, category || null, description || null]
    )
    res.status(201).json({ success: true, data: { equipmentId: result.insertId } })
  } catch (error) {
    console.error('createEquipment error:', error)
    res.status(500).json({ success: false, error: 'Gagal membuat data peralatan' })
  }
}

export async function updateEquipment(req, res) {
  try {
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
  } catch (error) {
    console.error('updateEquipment error:', error)
    res.status(500).json({ success: false, error: 'Gagal memperbarui data peralatan' })
  }
}

export async function deleteEquipment(req, res) {
  try {
    const [rows] = await pool.query('SELECT id FROM equipment WHERE id = ?', [Number(req.params.id)])
    if (!rows[0]) {
      return res.status(404).json({ success: false, error: 'Equipment not found' })
    }
    await pool.query('DELETE FROM equipment WHERE id = ?', [Number(req.params.id)])
    res.json({ success: true, message: 'Equipment removed' })
  } catch (error) {
    console.error('deleteEquipment error:', error)
    res.status(500).json({ success: false, error: 'Gagal menghapus peralatan' })
  }
}

export async function uploadEquipmentImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image uploaded' })
  }

  try {
    const id = Number(req.params.id)
    const [rows] = await pool.query('SELECT id, image_url FROM equipment WHERE id = ?', [id])
    if (!rows[0]) {
      return res.status(404).json({ success: false, error: 'Equipment not found' })
    }

    // toPublicUploadUrl converts file.path to /uploads/images/...
    const { toPublicUploadUrl } = await import('../middlewares/upload.js')
    const imageUrl = toPublicUploadUrl(req.file)

    await pool.query('UPDATE equipment SET image_url = ? WHERE id = ?', [imageUrl, id])

    res.json({ success: true, data: { image_url: imageUrl }, message: 'Image uploaded successfully' })
  } catch (error) {
    console.error('uploadEquipmentImage error:', error)
    res.status(500).json({ success: false, error: 'Gagal mengunggah gambar' })
  }
}
