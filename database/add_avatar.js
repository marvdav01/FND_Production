import { pool } from '../backend/config/db.js'

async function run() {
  try {
    const [rows] = await pool.query('SHOW COLUMNS FROM users LIKE "avatar_url"')
    if (rows.length === 0) {
      await pool.query('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL')
      console.log('avatar_url column added to users table')
    } else {
      console.log('avatar_url column already exists')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

run()
