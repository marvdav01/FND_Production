import { pool } from '../backend/config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, './schema.sql'), 'utf8')
    const statements = sql.split(/;[\r\n]+/).filter(st => st.trim())
    for (const statement of statements) {
      try {
        await pool.query(statement)
      } catch (err) {
        if (err.code !== 'ER_DUP_KEYNAME' && err.code !== 'ER_TABLE_EXISTS_ERROR') {
          throw err
        }
      }
    }

    // Clear old data to prevent duplicate primary keys / entry accumulation during re-seed
    console.log('Cleaning old database records...')
    await pool.query('SET FOREIGN_KEY_CHECKS = 0')
    await pool.query('TRUNCATE TABLE refresh_tokens')
    await pool.query('TRUNCATE TABLE payments')
    await pool.query('TRUNCATE TABLE event_equipment')
    await pool.query('TRUNCATE TABLE event_crew')
    await pool.query('TRUNCATE TABLE events')
    await pool.query('TRUNCATE TABLE equipment')
    await pool.query('TRUNCATE TABLE crew')
    await pool.query('SET FOREIGN_KEY_CHECKS = 1')

    // Seed Users
    const users = [
      ['Admin Name', 'admin@fnd.com', 'adminpass', 'admin'],
      ['Client One', 'client@fnd.com', 'clientpass', 'client'],
    ]

    for (const [name, email, password, role] of users) {
      const existing = await pool.query('SELECT id FROM users WHERE email = ?', [email])
      const hash = bcrypt.hashSync(password, 10)
      if (existing[0].length === 0) {
        await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hash, role])
      } else {
        await pool.query('UPDATE users SET password = ?, role = ?, name = ? WHERE email = ?', [hash, role, name, email])
      }
    }

    // Seed Crew
    const crew = [
      ['Rian Setiawan', 'Technician', '081234567890'],
      ['Maya Putri', 'Operator', '081234567891'],
      ['Anton Pratama', 'Rigger', '081234567892'],
    ]
    for (const [name, role, phone] of crew) {
      await pool.query('INSERT IGNORE INTO crew (name, role, phone) VALUES (?, ?, ?)', [name, role, phone])
    }

    // Seed Equipment: Real FND Production items + Legacy items for safety
    const equipment = [
      // FND Production Real-world Equipment
      ['Moving Head Beam', 24, 24],
      ['Par Light LED', 48, 48],
      ['Fresnel LED', 12, 12],
      ['Follow Spotlight', 4, 4],
      ['Moving Head Big Eye', 8, 8],
      ['Minibrute', 16, 16],
      ['Wall Washer', 12, 12],
      ['Stromy / Strobo Light', 6, 6],
      ['Mesin Laser RGB', 4, 4],
      ['Mixer Light GrandMA2', 2, 2],
      ['Mesin Dry Ice', 4, 4],
      ['Mesin Haze / Smoke', 6, 6],
      // Legacy Equipment for test/report compatibility
      ['LED Par Light', 30, 30],
      ['Moving Head', 12, 12],
      ['Smoke Machine', 8, 8],
      ['DJ Board', 5, 5],
    ]
    for (const [name, totalStock, availableStock] of equipment) {
      await pool.query('INSERT INTO equipment (name, total_stock, available_stock) VALUES (?, ?, ?)', [name, totalStock, availableStock])
    }

    const [clientRows] = await pool.query('SELECT id FROM users WHERE email = ?', ['client@fnd.com'])
    const clientId = clientRows[0]?.id || 2

    const [eventResult] = await pool.query(
      'INSERT INTO events (name, type, event_date, location, notes, status, client_id, total_amount, dp_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Wedding Lighting Package', 'wedding', '2026-06-20', 'Grand Ballroom Jakarta', 'Classic warm lighting', 'deal', clientId, 12500.00, 5000.00, 5000.00],
    )

    const eventId = eventResult.insertId

    // Retrieve equipment IDs dynamically to prevent hardcoded key mismatches
    const [ledParRows] = await pool.query('SELECT id FROM equipment WHERE name = ?', ['LED Par Light'])
    const ledParId = ledParRows[0]?.id || 1

    const [crewRows] = await pool.query('SELECT id FROM crew LIMIT 1')
    const crewId = crewRows[0]?.id || 1

    await pool.query('INSERT INTO event_equipment (event_id, equipment_id, quantity) VALUES (?, ?, ?)', [eventId, ledParId, 8])
    await pool.query('INSERT INTO event_crew (event_id, crew_id, task) VALUES (?, ?, ?)', [eventId, crewId, 'Setup'])
    await pool.query('INSERT INTO payments (event_id, amount, payment_type, status, proof_url) VALUES (?, ?, ?, ?, ?)', [eventId, 5000.00, 'dp', 'paid', 'https://example.com/proof-dp.jpg'])

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Seed error', error)
  } finally {
    await pool.end()
  }
}

run()
