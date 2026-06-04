// Mock database responses for development without MySQL

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin', phone: '081234567890', created_at: new Date() }
];

const mockEvents = [
  { 
    id: 1, 
    name: 'Wedding Event', 
    type: 'wedding', 
    event_date: '2026-06-15', 
    location: 'Jakarta', 
    status: 'pending', 
    client_id: 1,
    client_name: 'Admin User',
    client_phone: '081234567890',
    total_amount: 5000000, 
    dp_amount: 1000000, 
    paid_amount: 0,
    created_at: new Date()
  },
  { 
    id: 2, 
    name: 'Corporate Event', 
    type: 'corporate', 
    event_date: '2026-06-20', 
    location: 'Bandung', 
    status: 'running', 
    client_id: 1,
    client_name: 'Admin User',
    client_phone: '081234567890',
    total_amount: 10000000, 
    dp_amount: 5000000, 
    paid_amount: 5000000,
    created_at: new Date()
  }
];

const mockEquipment = [
  { id: 1, name: 'Lighting Rig 1', total_stock: 10, available_stock: 7, created_at: new Date() },
  { id: 2, name: 'Sound System', total_stock: 5, available_stock: 3, created_at: new Date() },
  { id: 3, name: 'LED Screen', total_stock: 3, available_stock: 2, created_at: new Date() }
];

const mockCrew = [
  { id: 1, name: 'Crew Member 1', role: 'Technician', phone: '082222222222', status: 'available', created_at: new Date() },
  { id: 2, name: 'Crew Member 2', role: 'Operator', phone: '083333333333', status: 'on_job', created_at: new Date() },
  { id: 3, name: 'Crew Member 3', role: 'Assistant', phone: '084444444444', status: 'available', created_at: new Date() }
];

export const mockPool = {
  query: async (sql, params = []) => {
    // Parse SQL to determine what mock data to return
    if (sql.includes('SELECT') && sql.includes('FROM events')) {
      return [mockEvents, []];
    }
    if (sql.includes('SELECT') && sql.includes('FROM equipment')) {
      return [mockEquipment, []];
    }
    if (sql.includes('SELECT') && sql.includes('FROM crew')) {
      return [mockCrew, []];
    }
    if (sql.includes('SELECT') && sql.includes('FROM users')) {
      return [mockUsers, []];
    }
    if (sql.includes('INSERT')) {
      return [{ insertId: Math.floor(Math.random() * 1000) }, []];
    }
    if (sql.includes('UPDATE') || sql.includes('DELETE')) {
      return [{ affectedRows: 1 }, []];
    }
    return [[], []];
  },

  getConnection: async () => ({
    query: async (sql, params) => {
      return mockPool.query(sql, params);
    },
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: async () => {},
  }),
};
