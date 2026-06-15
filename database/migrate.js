import { fileURLToPath } from 'url'
import path from 'path'
import { pool } from '../backend/config/db.js'

async function scalar(sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return Number(rows?.[0]?.value ?? 0)
}

async function tableExists(tableName) {
  return scalar(
    `SELECT COUNT(*) AS value
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [tableName],
  )
}

async function columnExists(tableName, columnName) {
  return scalar(
    `SELECT COUNT(*) AS value
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName],
  )
}

async function indexExists(tableName, indexName) {
  return scalar(
    `SELECT COUNT(*) AS value
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [tableName, indexName],
  )
}

async function foreignKeyExists(tableName, constraintName) {
  return scalar(
    `SELECT COUNT(*) AS value
     FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
    [tableName, constraintName],
  )
}

async function addColumn(tableName, columnName, definition) {
  if (!(await columnExists(tableName, columnName))) {
    await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`)
    console.log(`Added ${tableName}.${columnName}`)
  }
}

async function addIndex(tableName, indexName, definition) {
  if (!(await indexExists(tableName, indexName))) {
    await pool.query(`ALTER TABLE ${tableName} ADD INDEX ${indexName} ${definition}`)
    console.log(`Added index ${indexName}`)
  }
}

async function runMigrations() {
  if (pool.queryInternal) {
    console.log('Mock database is active. Skipping migrations.')
    return
  }

  if (!(await tableExists('users'))) {
    throw new Error('Table users does not exist. Run database/schema.sql or npm --workspace backend run seed first.')
  }

  await addColumn('users', 'avatar_url', 'VARCHAR(255) NULL')
  await addColumn('users', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

  if (!(await tableExists('refresh_tokens'))) {
    await pool.query(`
      CREATE TABLE refresh_tokens (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash CHAR(64) NOT NULL UNIQUE,
        user_agent VARCHAR(255),
        ip_address VARCHAR(64),
        expires_at DATETIME NOT NULL,
        revoked_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_refresh_tokens_user (user_id),
        INDEX idx_refresh_tokens_expires (expires_at)
      )
    `)
    console.log('Created refresh_tokens')
  }

  await addColumn('crew', 'user_id', 'INT NULL')
  await addColumn('crew', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
  await addIndex('crew', 'idx_crew_user', '(user_id)')
  if (!(await foreignKeyExists('crew', 'fk_crew_user'))) {
    await pool.query('ALTER TABLE crew ADD CONSTRAINT fk_crew_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL')
    console.log('Added crew user foreign key')
  }

  await addColumn('equipment', 'description', 'TEXT NULL')
  await addColumn('equipment', 'category', 'VARCHAR(80) NULL')
  await addColumn('equipment', 'image_url', 'VARCHAR(255) NULL')
  await addColumn('equipment', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

  await pool.query(
    "ALTER TABLE events MODIFY COLUMN status ENUM('pending','survey','deal','running','done','selesai','cancel') NOT NULL DEFAULT 'pending'",
  )
  await pool.query("UPDATE events SET status = 'selesai' WHERE status = 'done'")
  await pool.query(
    "ALTER TABLE events MODIFY COLUMN status ENUM('pending','survey','deal','running','selesai','cancel') NOT NULL DEFAULT 'pending'",
  )
  await addColumn('events', 'reference_images', 'JSON NULL')
  await addColumn('events', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

  await addColumn('payments', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

  if (!(await tableExists('event_checkins'))) {
    await pool.query(`
      CREATE TABLE event_checkins (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        crew_user_id INT NOT NULL,
        check_in_at DATETIME NULL,
        check_out_at DATETIME NULL,
        latitude DECIMAL(10,7) NULL,
        longitude DECIMAL(10,7) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (crew_user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uniq_event_checkin_crew (event_id, crew_user_id),
        INDEX idx_event_checkins_event (event_id)
      )
    `)
    console.log('Created event_checkins')
  }

  console.log('Database migrations completed')
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  runMigrations()
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exitCode = 1
    })
    .finally(async () => {
      await pool.end()
    })
}

export { runMigrations }
