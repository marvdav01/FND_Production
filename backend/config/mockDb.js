import bcrypt from 'bcryptjs'

const now = () => new Date()

const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@fnd.com',
    password: bcrypt.hashSync('adminpass', 12),
    role: 'admin',
    phone: '081234567890',
    avatar_url: null,
    created_at: now(),
  },
  {
    id: 2,
    name: 'Client One',
    email: 'client@fnd.com',
    password: bcrypt.hashSync('clientpass', 12),
    role: 'client',
    phone: '081234567891',
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
  { id: 1, user_id: null, name: 'Crew Member 1', role: 'Technician', phone: '082222222222', status: 'available', created_at: now() },
  { id: 2, user_id: null, name: 'Crew Member 2', role: 'Operator', phone: '083333333333', status: 'on_job', created_at: now() },
  { id: 3, user_id: null, name: 'Crew Member 3', role: 'Assistant', phone: '084444444444', status: 'available', created_at: now() },
]

const mockPayments = [
  { id: 1, event_id: 2, amount: 5000000, payment_type: 'dp', status: 'paid', proof_url: null, created_at: now(), event_name: 'Corporate Event', event_status: 'running', client_name: 'Client One' },
]

let nextId = 100

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
  if (sql.includes('refresh_tokens SET revoked_at')) {
    mockRefreshTokens
      .filter((entry) => entry.token_hash === params[0] || entry.user_id === params[0])
      .forEach((entry) => {
        entry.revoked_at = now()
      })
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

  return { affectedRows: 1 }
}

export const mockPool = {
  query: async (sql, params = []) => {
    if (sql.includes('SELECT') && sql.includes('FROM refresh_tokens')) {
      return [selectRefreshTokens(params), []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM events')) {
      return [mockEvents, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM equipment')) {
      return [mockEquipment, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM crew')) {
      return [mockCrew, []]
    }
    if (sql.includes('SELECT') && sql.includes('FROM payments')) {
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

  getConnection: async () => ({
    query: async (sql, params) => mockPool.query(sql, params),
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: async () => {},
  }),

  end: async () => {},
}
