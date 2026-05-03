import { pool } from '../backend/config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, './schema.sql'), 'utf8')
    const statements = sql.split(/;[\r\n]+/).filter(st => st.trim())
    for (const statement of statements) {
      await pool.query(statement)
    }

    const users = [
      ['Admin Name', 'admin@fnd.com', 'adminpass', 'admin'],
      ['Client One', 'client@fnd.com', 'clientpass', 'client'],
    ]

    for (const [name, email, password, role] of users) {
      const existing = await pool.query('SELECT id FROM users WHERE email = ?', [email])
      if (existing[0].length === 0) {
        const hash = '$2a$10$z1kX31N4f1/B8jkuiRUyoOBZfKpOw.tnmfA1DFOKlG02WevgUhp6W' // adminpass or clientpass hashed
        await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hash, role])
      }
    }

    const crew = [
      ['Rian Setiawan', 'Technician', '081234567890'],
      ['Maya Putri', 'Operator', '081234567891'],
      ['Anton Pratama', 'Rigger', '081234567892'],
    ]
    for (const [name, role, phone] of crew) {
      await pool.query('INSERT IGNORE INTO crew (name, role, phone) VALUES (?, ?, ?)', [name, role, phone])
    }

    const equipment = [
      ['LED Par Light', 30, 30],
      ['Moving Head', 12, 12],
      ['Smoke Machine', 8, 8],
      ['DJ Board', 5, 5],
    ]
    for (const [name, totalStock, availableStock] of equipment) {
      await pool.query('INSERT IGNORE INTO equipment (name, total_stock, available_stock) VALUES (?, ?, ?)', [name, totalStock, availableStock])
    }

    const [clientRows] = await pool.query('SELECT id FROM users WHERE email = ?', ['client@fnd.com'])
    const clientId = clientRows[0]?.id || 2

    const [eventResult] = await pool.query(
      'INSERT INTO events (name, type, event_date, location, notes, status, client_id, total_amount, dp_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Wedding Lighting Package', 'wedding', '2026-06-20', 'Grand Ballroom Jakarta', 'Classic warm lighting', 'deal', clientId, 12500.00, 5000.00, 5000.00],
    )

    const eventId = eventResult.insertId
    await pool.query('INSERT INTO event_equipment (event_id, equipment_id, quantity) VALUES (?, ?, ?)', [eventId, 1, 8])
    await pool.query('INSERT INTO event_crew (event_id, crew_id, task) VALUES (?, ?, ?)', [eventId, 1, 'Setup'])
    await pool.query('INSERT INTO payments (event_id, amount, payment_type, status, proof_url) VALUES (?, ?, ?, ?, ?)', [eventId, 5000.00, 'dp', 'paid', 'https://example.com/proof-dp.jpg'])

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Seed error', error)
  } finally {
    await pool.end()
  }
}

run()
