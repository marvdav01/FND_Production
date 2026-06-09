import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { mockPool } from './mockDb.js'

dotenv.config()

let pool;

async function createDatabasePool() {
  const candidate = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_lighting',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  candidate.on('error', (err) => {
    console.warn('MySQL pool error:', err.message)
  })

  try {
    const connection = await candidate.getConnection()
    await connection.query('SELECT 1')
    connection.release()
    return candidate
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw err
    }
    console.warn('Failed to connect to MySQL, using mock database:', err.message)
    try {
      await candidate.end()
    } catch (_) {}
    return mockPool
  }
}

try {
  pool = await createDatabasePool()
} catch (err) {
  if (process.env.NODE_ENV === 'production') {
    throw err
  }
  console.warn('Failed to initialize database pool, using mock database:', err.message)
  pool = mockPool
}

export { pool }
