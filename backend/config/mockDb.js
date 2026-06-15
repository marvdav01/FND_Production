import bcrypt from 'bcryptjs'
import fs from 'fs'

const now = () => new Date()

function logQuery(sql, params, result, error) {
  try {
    const timestamp = new Date().toISOString()
    const logMsg = `[${timestamp}] SQL: ${sql.replace(/\s+/g, ' ')}\nParams: ${JSON.stringify(params)}\nResult: ${JSON.stringify(result)}\nError: ${error ? error.stack || error.message || error : 'None'}\n-----------------------------------\n`
    fs.appendFileSync('./query_log.txt', logMsg)
  } catch (err) {
    // Ignore logging errors
  }
}

const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@fnd.com',
    password: bcrypt.hashSync('password123', 12),
    role: 'admin',
    phone: '081234567890',
    avatar_url: null,
    created_at: now(),
  },
  {
    id: 2,
    name: 'Client One',
    email: 'client@fnd.com',
    password: bcrypt.hashSync('password123', 12),
    role: 'client',
    phone: '081234567891',
    avatar_url: null,
    created_at: now(),
  },
  {
    id: 3,
    name: 'Rian Setiawan',
    email: 'crew@fnd.com',
    password: bcrypt.hashSync('password123', 12),
    role: 'crew',
    phone: '082222222222',
    avatar_url: null,
    created_at: now(),
  },
  {
    id: 4,
    name: 'Maya Putri',
    email: 'maya@fnd.com',
    password: bcrypt.hashSync('crew123', 12),
    role: 'crew',
    phone: '083333333333',
    avatar_url: null,
    created_at: now(),
  },
  {
    id: 5,
    name: 'Anton Pratama',
    email: 'anton@fnd.com',
    password: bcrypt.hashSync('crew123', 12),
    role: 'crew',
    phone: '084444444444',
    avatar_url: null,
    created_at: now(),
  },
]

const mockRefreshTokens = []

const mockEvents = [
  {
    id: 1,
    name: 'Wedding Event',
    type: 'Wedding',
    event_date: '2026-06-15',
    location: 'Jakarta',
    notes: 'Classic warm lighting',
    status: 'pending',
    client_id: 2,
    client_name: 'Client One',
    client_phone: '081234567891',
    total_amount: 5000000,
    dp_amount: 1000000,
    paid_amount: 0,
    reference_images: [],
    created_at: now(),
  },
  {
    id: 2,
    name: 'Corporate Event',
    type: 'Corporate Event',
    event_date: '2026-06-20',
    location: 'Bandung',
    notes: 'Stage lighting and LED wall',
    status: 'running',
    client_id: 2,
    client_name: 'Client One',
    client_phone: '081234567891',
    total_amount: 10000000,
    dp_amount: 5000000,
    paid_amount: 5000000,
    reference_images: [],
    created_at: now(),
  },
]

const mockEquipment = [
  { id: 1, name: 'Lighting Rig 1', description: 'Main rig package', category: 'Lighting', total_stock: 10, available_stock: 7, image_url: null, created_at: now() },
  { id: 2, name: 'Sound System', description: 'FOH and monitor package', category: 'Audio', total_stock: 5, available_stock: 3, image_url: null, created_at: now() },
  { id: 3, name: 'LED Screen', description: 'Indoor LED panel', category: 'Display', total_stock: 3, available_stock: 2, image_url: null, created_at: now() },
]

const mockCrew = [
  { id: 1, user_id: 3, name: 'Rian Setiawan', role: 'Technician', phone: '082222222222', status: 'available', created_at: now() },
  { id: 2, user_id: 4, name: 'Maya Putri', role: 'Operator', phone: '083333333333', status: 'on_job', created_at: now() },
  { id: 3, user_id: 5, name: 'Anton Pratama', role: 'Assistant', phone: '084444444444', status: 'available', created_at: now() },
]

const mockPayments = [
  { id: 1, event_id: 2, amount: 5000000, payment_type: 'dp', status: 'paid', proof_url: null, created_at: now(), event_name: 'Corporate Event', event_status: 'running', client_name: 'Client One' },
]

const mockEventEquipment = [
  { id: 1, event_id: 1, equipment_id: 1, quantity: 3 },
  { id: 2, event_id: 2, equipment_id: 2, quantity: 2 },
]

const mockEventCrew = [
  { id: 1, event_id: 1, crew_id: 1, task: 'Setup lighting' },
  { id: 2, event_id: 2, crew_id: 2, task: 'Operate sound' },
]

const mockEventCheckins = []

let nextId = 200

function selectUsers(sql, params) {
  if (sql.includes('WHERE email = ?')) {
    return mockUsers.filter((user) => user.email === params[0])
  }
  if (sql.includes('WHERE id = ?')) {
    return mockUsers.filter((user) => user.id === Number(params[0]))
  }
  if (sql.includes('role = ?')) {
    return mockUsers.filter((user) => user.role === params[0]).map((user) => ({
      ...user,
      full_name: user.name,
      password: undefined,
    }))
  }
  return mockUsers.map((user) => ({ ...user, full_name: user.name, password: undefined }))
}

function selectRefreshTokens(params) {
  const tokenHash = params[0]
  const session = mockRefreshTokens.find((entry) => entry.token_hash === tokenHash && !entry.revoked_at && entry.expires_at > now())
  if (!session) return []
  const user = mockUsers.find((entry) => entry.id === session.user_id)
  return user ? [{ ...session, ...user }] : []
}

function insertByTable(sql, params) {
  if (sql.includes('INTO refresh_tokens')) {
    mockRefreshTokens.push({
      id: nextId++,
      user_id: params[0],
      token_hash: params[1],
      user_agent: params[2],
      ip_address: params[3],
      expires_at: params[4],
      revoked_at: null,
      created_at: now(),
    })
    return { insertId: nextId - 1 }
  }

  // --- Junction tables FIRST (before base tables to avoid substring match) ---
  if (sql.includes('INTO event_equipment')) {
    const row = { id: nextId++, event_id: params[0], equipment_id: params[1], quantity: params[2] }
    mockEventEquipment.push(row)
    return { insertId: row.id }
  }

  if (sql.includes('INTO event_crew')) {
    const row = { id: nextId++, event_id: params[0], crew_id: params[1], task: params[2] || 'Support' }
    mockEventCrew.push(row)
    const crew = mockCrew.find(c => c.id === Number(params[1]))
    if (crew) crew.status = 'on_job'
    return { insertId: row.id }
  }

  if (sql.includes('INTO event_checkins')) {
    const existing = mockEventCheckins.find(ci => ci.event_id === params[0] && ci.crew_user_id === params[1])
    if (existing) {
      // ON DUPLICATE KEY UPDATE behavior
      if (sql.includes('check_out_at')) {
        existing.check_out_at = now()
      } else {
        existing.check_in_at = existing.check_in_at || now()
      }
      existing.latitude = params[2] ?? existing.latitude
      existing.longitude = params[3] ?? existing.longitude
      existing.updated_at = now()
      return { insertId: existing.id, affectedRows: 2 }
    }
    const row = {
      id: nextId++,
      event_id: params[0],
      crew_user_id: params[1],
      check_in_at: now(),
      check_out_at: sql.includes('check_out_at') ? now() : null,
      latitude: params[2] ?? null,
      longitude: params[3] ?? null,
      updated_at: now(),
    }
    mockEventCheckins.push(row)
    return { insertId: row.id }
  }

  if (sql.includes('INTO users')) {
    const row = { id: nextId++, name: params[0], email: params[1], password: params[2], role: params[3], phone: params[4] ?? null, avatar_url: null, created_at: now() }
    mockUsers.push(row)
    return { insertId: row.id }
  }

  if (sql.includes('INTO crew')) {
    const hasUserId = sql.includes('(user_id')
    const row = hasUserId
      ? { id: nextId++, user_id: params[0], name: params[1], role: params[2], phone: params[3] ?? null, status: 'available', created_at: now() }
      : { id: nextId++, user_id: null, name: params[0], role: params[1], phone: params[2] ?? null, status: 'available', created_at: now() }
    mockCrew.push(row)
    return { insertId: row.id }
  }

  if (sql.includes('INTO equipment')) {
    const row = { id: nextId++, name: params[0], total_stock: params[1], available_stock: params[2], category: params[3] ?? null, description: params[4] ?? null, image_url: null, created_at: now() }
    mockEquipment.push(row)
    return { insertId: row.id }
  }

  if (sql.includes('INTO events')) {
    const row = {
      id: nextId++,
      name: params[0],
      type: params[1],
      event_date: params[2],
      location: params[3],
      notes: params[4],
      client_id: params[5],
      total_amount: params[6] ?? 0,
      dp_amount: params[7] ?? 0,
      paid_amount: params[8] ?? 0,
      reference_images: params[9] ? JSON.parse(params[9]) : [],
      status: 'pending',
      created_at: now(),
    }
    const client = mockUsers.find((user) => user.id === row.client_id)
    row.client_name = client?.name
    row.client_phone = client?.phone
    mockEvents.push(row)
    return { insertId: row.id }
  }

  return { insertId: nextId++ }
}

function applyUpdate(sql, params) {
  if (sql.includes('DELETE FROM event_crew')) {
    const eventId = Number(params[0])
    const crewId = Number(params[1])
    const idx = mockEventCrew.findIndex(ec => ec.event_id === eventId && ec.crew_id === crewId)
    if (idx !== -1) {
      mockEventCrew.splice(idx, 1)
    }
    const crew = mockCrew.find(c => c.id === crewId)
    if (crew) crew.status = 'available'
    return { affectedRows: 1 }
  }

  if (sql.includes('DELETE FROM crew')) {
    const crewId = Number(params[0])
    const idx = mockCrew.findIndex(c => c.id === crewId)
    if (idx !== -1) mockCrew.splice(idx, 1)
    return { affectedRows: 1 }
  }

  if (sql.includes('refresh_tokens SET revoked_at')) {

    mockRefreshTokens
      .filter((entry) => entry.token_hash === params[0] || entry.user_id === params[0])
      .forEach((entry) => {
        entry.revoked_at = now()
      })
  }

  if (sql.includes('UPDATE events SET')) {
    const eventId = Number(params[params.length - 1])
    const event = mockEvents.find(e => e.id === eventId)
    if (event) {
      event.name = params[0] || event.name
      event.type = params[1] || event.type
      event.event_date = params[2] || event.event_date
      event.location = params[3] || event.location
      event.notes = params[4] || event.notes
      event.status = params[5] || event.status
      event.total_amount = params[6] ?? event.total_amount
      event.dp_amount = params[7] ?? event.dp_amount
      if (sql.includes('reference_images = ?')) {
        event.reference_images = params[8] ? JSON.parse(params[8]) : event.reference_images
      }
    }
  }

  if (sql.includes('UPDATE events SET status = ? WHERE id = ?')) {
    const status = params[0]
    const eventId = Number(params[1])
    const event = mockEvents.find(e => e.id === eventId)
    if (event) event.status = status
  }

  if (sql.includes('users SET avatar_url = NULL')) {
    const user = mockUsers.find((entry) => entry.id === Number(params[0]))
    if (user) user.avatar_url = null
  } else if (sql.includes('users SET avatar_url = ?')) {
    const user = mockUsers.find((entry) => entry.id === Number(params[1]))
    if (user) user.avatar_url = params[0]
  } else if (sql.includes('users SET name')) {
    const user = mockUsers.find((entry) => entry.id === Number(params[2]))
    if (user) {
      if (params[0]) user.name = params[0]
      user.phone = params[1]
    }
  } else if (sql.includes('users SET password')) {
    const user = mockUsers.find((entry) => entry.id === Number(params[1]))
    if (user) user.password = params[0]
  }

  if (sql.includes('UPDATE crew SET status = ?')) {
    // UPDATE crew SET status = ? WHERE id = ?
    const status = params[0]
    const crewId = Number(params[1])
    const crew = mockCrew.find(c => c.id === crewId)
    if (crew) crew.status = status === 'tersedia' ? 'available' : status
  } else if (sql.includes('UPDATE crew SET')) {
    // Full update: name, role, phone, status
    const crewId = Number(params[params.length - 1])
    const crew = mockCrew.find(c => c.id === crewId)
    if (crew) {
      if (params[0] != null) crew.name = params[0]
      if (params[1] != null) crew.role = params[1]
      if (params[2] != null) crew.phone = params[2]
      if (params[3] != null) crew.status = params[3] === 'tersedia' ? 'available' : params[3]
    }
  }

  return { affectedRows: 1 }
}

export const mockPool = {
  queryInternal: async (sql, params = []) => {
    // --- Junction / association tables FIRST (before base tables) ---
    if (sql.includes('SELECT') && sql.includes('event_checkins')) {
      if (sql.includes('WHERE') && params.length >= 1) {
        const eventId = Number(params[0])
        if (sql.includes('crew_user_id = ?')) {
          // getCheckInStatus / checkIn / checkOut – filter by event + user
          const userId = Number(params[1])
          return [mockEventCheckins.filter(ci => ci.event_id === eventId && ci.crew_user_id === userId), []]
        }
        return [mockEventCheckins.filter(ci => ci.event_id === eventId), []]
      }
      return [mockEventCheckins, []]
    }

    if (sql.includes('SELECT') && sql.includes('event_equipment')) {
      if (sql.includes('WHERE') && params.length >= 1) {
        const eventId = Number(params[0])
        const rows = mockEventEquipment
          .filter(ee => ee.event_id === eventId)
          .map(ee => {
            const eq = mockEquipment.find(e => e.id === ee.equipment_id)
            return { id: eq?.id || ee.equipment_id, name: eq?.name || 'Unknown', quantity: ee.quantity, equipment_id: ee.equipment_id }
          })
        return [rows, []]
      }
      return [mockEventEquipment, []]
    }

    if (sql.includes('SELECT') && sql.includes('event_crew')) {
      if (sql.includes('WHERE') && params.length >= 1) {
        if (sql.includes('c.user_id')) {
          // getAssignedEvents – filter by c.user_id = ? (params[0] is user_id)
          const userId = Number(params[0])
          const rows = mockEventCrew
            .filter(ec => {
              const crew = mockCrew.find(c => c.id === ec.crew_id)
              return crew && crew.user_id === userId
            })
            .map(ec => {
              const event = mockEvents.find(e => e.id === ec.event_id)
              return { ...(event || {}), task: ec.task }
            })
          return [rows, []]
        }
        if (sql.includes('ec.event_id = ?') && sql.includes('c.user_id = ?') && params.length >= 2) {
          // ensureCrewAssigned / uploadEventDocumentation – params: [eventId, userId]
          const eventId = Number(params[0])
          const userId = Number(params[1])
          const rows = mockEventCrew.filter(ec => {
            if (ec.event_id !== eventId) return false
            const crew = mockCrew.find(c => c.id === ec.crew_id)
            return crew && crew.user_id === userId
          })
          return [rows, []]
        }
        if (sql.includes('ec.crew_id = ?') && params.length >= 1) {
          // deleteCrew active assignment check – params: [crewId]
          const crewId = Number(params[0])
          const rows = mockEventCrew.filter(ec => ec.crew_id === crewId)
          return [rows, []]
        }
        // getEvent – lookup by event_id only
        const eventId = Number(params[0])
        const rows = mockEventCrew
          .filter(ec => ec.event_id === eventId)
          .map(ec => {
            const c = mockCrew.find(cr => cr.id === ec.crew_id)
            return { id: c?.id || ec.crew_id, name: c?.name || 'Unknown', role: c?.role || 'Support', status: c?.status || 'available', task: ec.task }
          })
        return [rows, []]
      }
      return [mockEventCrew, []]
    }



    // --- Base tables ---
    if (sql.includes('SELECT') && sql.includes('FROM refresh_tokens')) {
      return [selectRefreshTokens(params), []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM events')) {
      if (sql.includes('WHERE') && (sql.includes('e.id =') || sql.includes('id =')) && params.length >= 1) {
        const eventId = Number(params[0])
        const row = mockEvents.find(e => e.id === eventId)
        return [row ? [row] : [], []]
      }
      if (sql.includes('client_id = ?')) {
        const clientId = Number(params[0])
        return [mockEvents.filter(e => e.client_id === clientId), []]
      }
      return [mockEvents, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM equipment')) {
      if (sql.includes('WHERE') && params.length >= 1) {
        const row = mockEquipment.find(e => e.id === Number(params[0]))
        return [row ? [row] : [], []]
      }
      return [mockEquipment, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM crew')) {
      if (sql.includes('WHERE') && params.length >= 1) {
        if (sql.includes('user_id = ?')) {
          return [mockCrew.filter(c => c.user_id === Number(params[0])), []]
        }
        if (sql.includes('status = ?')) {
          return [mockCrew.filter(c => c.status === params[0]), []]
        }
        // id = ? lookup
        const row = mockCrew.find(c => c.id === Number(params[0]))
        return [row ? [row] : [], []]
      }
      return [mockCrew, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM payments')) {
      if (sql.includes('WHERE') && params.length >= 1) {
        const eventId = Number(params[0])
        return [mockPayments.filter(p => p.event_id === eventId), []]
      }
      return [mockPayments, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM users')) {
      return [selectUsers(sql, params), []]
    }
    if (sql.includes('INSERT')) {
      return [insertByTable(sql, params), []]
    }
    if (sql.includes('UPDATE') || sql.includes('DELETE')) {
      return [applyUpdate(sql, params), []]
    }
    return [[], []]
  },

  query: async (sql, params = []) => {
    try {
      const res = await mockPool.queryInternal(sql, params)
      logQuery(sql, params, res, null)
      // Return a deep copy of rows to prevent reference sharing/mutability bugs
      const clonedRows = res[0] ? JSON.parse(JSON.stringify(res[0])) : res[0]
      return [clonedRows, res[1]]
    } catch (error) {
      logQuery(sql, params, null, error)
      throw error
    }
  },

  getConnection: async () => ({
    // Proxy all queries back through mockPool so INSERT writes go to the shared in-memory arrays
    query: async (sql, params) => mockPool.query(sql, params),
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
  }),

  end: async () => {},
}
