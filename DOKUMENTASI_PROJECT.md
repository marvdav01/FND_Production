# DOKUMENTASI PROJECT FULLSTACK
## FND Production - Event Lighting Management System

**Nama Proyek:** FND Production Event Lighting Management System  
**Tipe Aplikasi:** Web Application Fullstack  
**Technology Stack:** Next.js + Node.js + PostgreSQL (Supabase)  
**Tanggal Dokumentasi:** 2 Mei 2026

---

## DAFTAR ISI
1. [Latar Belakang & Tujuan Sistem](#1-latar-belakang--tujuan-sistem)
2. [Arsitektur Aplikasi](#2-arsitektur-aplikasi)
3. [Desain Database](#3-desain-database)
4. [Implementasi Aplikasi](#4-implementasi-aplikasi)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [CRUD & Business Logic](#6-crud--business-logic)
7. [Dashboard](#7-dashboard)
8. [API & Integrasi](#8-api--integrasi)
9. [DevOps](#9-devops)

---

## 1. LATAR BELAKANG & TUJUAN SISTEM

### 1.1 Masalah yang Ingin Diselesaikan

**FND Production** adalah perusahaan penyedia layanan event lighting profesional yang menghadapi beberapa tantangan operasional:

1. **Manajemen Booking yang Kompleks**
   - Menerima ratusan permintaan booking dari berbagai klien
   - Sulit melacak status setiap event dari awal hingga selesai
   - Proses approval yang manual dan memakan waktu

2. **Alokasi Sumber Daya yang Tidak Efisien**
   - Lebih dari 520 peralatan (lighting, effects, rigging, etc.) sulit dilacak
   - Tidak ada sistem untuk mengetahui equipment mana yang tersedia
   - Sering terjadi overbooking atau konflik alokasi equipment

3. **Manajemen Crew yang Sulit**
   - 35+ crew members perlu dijadwalkan untuk berbagai event
   - Tidak ada visibility tentang siapa yang tersedia untuk assignment
   - Komunikasi assignment masih manual

4. **Tracking Keuangan yang Transparan**
   - Kesulitan melacak pembayaran dari 50+ klien
   - Proses pembayaran tidak terstruktur
   - Revenue tracking sulit dilakukan

5. **Kurangnya Insights untuk Decision Making**
   - Tidak ada dashboard untuk melihat overview bisnis
   - Analitik revenue, event count, dan resource utilization tidak tersedia
   - Management kesulitan membuat keputusan berbasis data

### 1.2 Mengapa Sistem Ini Penting

1. **Efisiensi Operasional**: Mengurangi waktu booking dari hours menjadi minutes
2. **Transparansi**: Semua stakeholder (admin, client, crew) punya visibility penuh
3. **Scalability**: Siap menangani pertumbuhan dari 128 events menjadi ribuan
4. **Professionalism**: Meningkatkan citra perusahaan dengan sistem yang modern
5. **Revenue Growth**: Better resource allocation → reduced costs → higher profits

### 1.3 Siapa Pengguna Sistem

| Pengguna | Role | Kebutuhan Utama |
|----------|------|-----------------|
| **Admin** | System Manager, Operations Manager | Kelola semua aspek: events, crew, equipment, keuangan |
| **Client** | Event Organizer, Event Planner | Booking event, tracking status, manage payment |
| **Crew** | Lighting Technician, Operator, Helper, Rigger | View assignments, manage availability, coordinate tasks |

---

## 2. ARSITEKTUR APLIKASI

### 2.1 Struktur Aplikasi (3-Layer Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND LAYER                         │
│  (Next.js React + Tailwind CSS + shadcn/ui)           │
│                                                         │
│  ┌─────────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Admin     │  │  Client  │  │   Crew   │          │
│  │  Dashboard  │  │  Portal  │  │  Portal  │          │
│  └─────────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────────┐
│                   API LAYER                             │
│  (Next.js API Routes + Middleware + Auth)              │
│                                                         │
│  Route Groups:                                          │
│  - /api/events: Event management                       │
│  - /api/equipment: Inventory management                │
│  - /api/crew: Crew management                          │
│  - /api/payments: Payment tracking                     │
│  - /api/auth: Authentication handlers                  │
└─────────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────────┐
│                   BACKEND LAYER                         │
│  (Supabase PostgreSQL + Auth Service)                  │
│                                                         │
│  Database Tables:                                       │
│  - profiles (users with roles)                         │
│  - events (bookings & schedules)                       │
│  - equipment (inventory items)                         │
│  - event_equipment (event-equipment mapping)           │
│  - event_crew (crew assignments)                       │
│  - payments (payment tracking)                         │
│  - event_schedules (event timelines)                   │
│  - event_status_history (audit trail)                  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Alur Sistem (Request → Response)

#### Alur Booking Event (Client)
```
1. Client membuka /client/booking
   ↓
2. Frontend render form booking (3-step wizard)
   ↓
3. Client submit data booking
   ↓
4. Frontend validate input (Zod schema)
   ↓
5. POST /api/events/create dengan data
   ↓
6. Backend:
   - Validate input
   - Insert ke table events (status: pending)
   - Insert ke table event_equipment
   - Create event_status_history record
   ↓
7. Supabase Store data di PostgreSQL
   ↓
8. Response: {success: true, eventId: xxx}
   ↓
9. Frontend redirect ke /client/events
   ↓
10. Client bisa lihat event dengan status "Pending"
```

#### Alur Approval Event (Admin)
```
1. Admin lihat /admin/request (pending events)
   ↓
2. Admin click "Approve" atau "Reject"
   ↓
3. Frontend POST /api/admin/events/update-status
   ↓
4. Backend:
   - Validate admin authorization
   - Update events.status (pending → survey/cancel)
   - Create event_status_history entry
   - (Optional) Notify client via email
   ↓
5. Supabase update PostgreSQL
   ↓
6. Response: {success: true}
   ↓
7. Frontend update UI realtime
```

#### Alur Crew Assignment (Admin)
```
1. Admin di /admin/events/[id], scroll ke "Assigned Crew"
   ↓
2. Admin select crew dari dropdown + pilih position
   ↓
3. Admin click "Add Crew"
   ↓
4. Frontend POST /api/admin/crew/assign
   ↓
5. Backend:
   - Validate: crew exists, event exists
   - Check crew availability
   - Insert ke event_crew table
   - Update crew.availability = on_job
   ↓
6. Supabase insert record
   ↓
7. Response: {success: true, crewId: xxx}
   ↓
8. Frontend update crew list di event detail
   ↓
9. Crew menerima notification di /crew dashboard
```

### 2.3 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16.2.4 | React framework dengan server components |
| **Frontend UI** | Tailwind CSS 4.2.0 | Styling utility-first |
| **Components** | shadcn/ui (40+ components) | Pre-built accessible components |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **Backend API** | Next.js API Routes | Server-side API endpoints |
| **Database** | Supabase PostgreSQL | Relational database |
| **Auth** | Supabase Auth | Email/password authentication |
| **Charts** | Recharts 2.15.0 | Data visualization |
| **Notifications** | Sonner | Toast notifications |
| **Icons** | Lucide React | Icon library |
| **Analytics** | Vercel Analytics | Performance monitoring |

### 2.4 Diagram Arsitektur Lengkap

```
                    ┌─ BROWSER USER ─┐
                    │                 │
         ┌──────────┼─────────────────┼──────────┐
         │          │                 │          │
      ADMIN      CLIENT           CREW         GUEST
    (/admin)   (/client)         (/crew)    (/auth/login)
         │          │                 │
         └──────────┼─────────────────┼──────────┘
                    ↓
        ┌──────────────────────────────┐
        │   Next.js App Router         │
        │   (Frontend Routes)          │
        └──────────────────────────────┘
                    ↓
        ┌──────────────────────────────┐
        │   Middleware                 │
        │   (Auth Check, Session)      │
        └──────────────────────────────┘
                    ↓
        ┌──────────────────────────────┐
        │   API Routes                 │
        │   (/api/events, /api/crew)   │
        └──────────────────────────────┘
                    ↓
        ┌──────────────────────────────┐
        │   Supabase Client (Server)   │
        │   - Auth validation          │
        │   - Data validation          │
        │   - Business logic           │
        └──────────────────────────────┘
                    ↓
        ┌──────────────────────────────┐
        │   Supabase PostgreSQL        │
        │   (Database Tables)          │
        └──────────────────────────────┘
```

---

## 3. DESAIN DATABASE

### 3.1 Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│   PROFILES      │  (Users with roles)
├─────────────────┤
│ id (PK)         │
│ email (UK)      │
│ role            │ ──┐
│ full_name       │   │
│ phone           │   │
│ availability    │   │
│ position        │   └─→ Can be: Admin, Client, Crew
│ created_at      │
└─────────────────┘
        ↑
        │ owns/creates
        ├──────────────────────┐
        │                      │
        ├─────── 1:N ─────────→ EVENTS
        │                      │
        │                      │ (1 Admin or Client creates many Events)
        │
        ├─────────────────────→ EVENT_CREW
                              │ (1 Crew assigned to many Events)
                              │

┌──────────────────┐
│     EVENTS       │  (Main entity - bookings)
├──────────────────┤
│ id (PK)          │
│ client_id (FK)   │ ──→ PROFILES (role: client)
│ created_by (FK)  │ ──→ PROFILES (role: admin)
│ event_name       │
│ event_type       │ ──┐
│ date             │   ├─→ Status workflow: pending→survey→deal→running→selesai/cancel
│ start_time       │  ╱
│ end_time         │
│ location         │
│ city             │
│ status           │ ──→ Tracks current state
│ price            │
│ notes            │
│ created_at       │
│ updated_at       │
└──────────────────┘
     ↓ owns         ↓ owns        ↓ owns
  
  ┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐
  │ EVENT_EQUIPMENT  │  │ EVENT_CREW   │  │ EVENT_SCHEDULES │
  ├──────────────────┤  ├──────────────┤  ├─────────────────┤
  │ id (PK)          │  │ id (PK)      │  │ id (PK)         │
  │ event_id (FK)    │  │ event_id(FK) │  │ event_id (FK)   │
  │ equipment_id(FK) │  │ crew_id (FK) │  │ activity_name   │
  │ quantity         │  │ position     │  │ description     │
  │ added_at         │  │ assigned_at  │  │ scheduled_time  │
  └──────────────────┘  └──────────────┘  └─────────────────┘
    ↑                         ↑
    │ references              │ references
    │                         │
    └─→ EQUIPMENT        └─→ PROFILES (role: crew)
    
    
┌──────────────────────┐
│    EQUIPMENT         │  (Inventory)
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ category             │ ──→ Lighting, Effects, Display, Rigging, 
│ quantity_total       │     Control, Audio, Other
│ quantity_available   │
│ unit                 │
│ price_per_day        │
│ condition            │
│ location             │
│ created_at           │
└──────────────────────┘


┌──────────────────────┐
│     PAYMENTS         │  (Financial tracking)
├──────────────────────┤
│ id (PK)              │
│ event_id (FK)        │ ──→ EVENTS
│ amount               │
│ status               │ ──→ lunas / belum_lunas
│ payment_date         │
│ payment_method       │
│ bank_account         │
│ proof_image_url      │
│ notes                │
│ created_at           │
└──────────────────────┘


┌─────────────────────────┐
│ EVENT_STATUS_HISTORY    │  (Audit trail)
├─────────────────────────┤
│ id (PK)                 │
│ event_id (FK)           │ ──→ EVENTS
│ old_status              │
│ new_status              │
│ changed_by (FK)         │ ──→ PROFILES (admin user)
│ reason/notes            │
│ changed_at              │
└─────────────────────────┘
```

### 3.2 Schema Database (PostgreSQL via Supabase)

#### Tabel: PROFILES
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client', 'crew')),
  full_name TEXT,
  phone TEXT,
  availability TEXT DEFAULT 'tersedia' CHECK (availability IN ('tersedia', 'on_job')),
  position TEXT CHECK (position IN ('operator', 'technician', 'helper', 'rigger', 'dmx_programmer', 'director', 'other')),
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_auth FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_availability ON profiles(availability);
```

#### Tabel: EVENTS
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  admin_id UUID REFERENCES profiles(id),
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'survey', 'deal', 'running', 'selesai', 'cancel')),
  price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CHECK (end_time > start_time)
);

CREATE INDEX idx_events_client_id ON events(client_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);
```

#### Tabel: EQUIPMENT
```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL 
    CHECK (category IN ('lighting', 'effects', 'display', 'rigging', 'control', 'audio', 'other')),
  quantity_total INTEGER NOT NULL,
  quantity_available INTEGER NOT NULL,
  unit TEXT,
  price_per_day DECIMAL(10, 2),
  condition TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CHECK (quantity_available <= quantity_total)
);

CREATE INDEX idx_equipment_category ON equipment(category);
```

#### Tabel: EVENT_EQUIPMENT
```sql
CREATE TABLE event_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  quantity INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(event_id, equipment_id)
);

CREATE INDEX idx_event_equipment_event_id ON event_equipment(event_id);
```

#### Tabel: EVENT_CREW
```sql
CREATE TABLE event_crew (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  crew_id UUID NOT NULL REFERENCES profiles(id),
  position TEXT NOT NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(event_id, crew_id)
);

CREATE INDEX idx_event_crew_event_id ON event_crew(event_id);
CREATE INDEX idx_event_crew_crew_id ON event_crew(crew_id);
```

#### Tabel: PAYMENTS
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'belum_lunas' 
    CHECK (status IN ('lunas', 'belum_lunas', 'pending')),
  payment_date DATE,
  payment_method TEXT,
  bank_account TEXT,
  proof_image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_event_id ON payments(event_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### Tabel: EVENT_SCHEDULES
```sql
CREATE TABLE event_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  description TEXT,
  scheduled_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_event_schedules_event_id ON event_schedules(event_id);
```

#### Tabel: EVENT_STATUS_HISTORY
```sql
CREATE TABLE event_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_event_status_history_event_id ON event_status_history(event_id);
```

### 3.3 Relasi Data

| Entity | Relationship | Entity | Type | Keterangan |
|--------|------------|--------|------|-----------|
| PROFILES | creates | EVENTS | 1:N | 1 Admin/Client bisa membuat banyak events |
| PROFILES | assigned_to | EVENTS (via EVENT_CREW) | M:N | 1 Crew bisa assign ke banyak events |
| EVENTS | allocates | EQUIPMENT (via EVENT_EQUIPMENT) | M:N | 1 Event butuh banyak equipment |
| EVENTS | has | PAYMENTS | 1:N | 1 Event bisa punya banyak payment records |
| EVENTS | has | SCHEDULES | 1:N | 1 Event bisa punya banyak activities/schedules |
| EVENTS | has_history | STATUS_HISTORY | 1:N | 1 Event track semua status changes |

---

## 4. IMPLEMENTASI APLIKASI

### 4.1 Struktur Folder Project

```
/workspaces/FND_Production/
├── /app                          # Next.js App Router
│   ├── /admin                    # Admin portal
│   │   ├── layout.tsx           # Admin layout dengan sidebar
│   │   ├── page.tsx             # Dashboard utama
│   │   ├── /crew                # Crew management
│   │   ├── /events              # Event management
│   │   │   ├── page.tsx          # Events list
│   │   │   ├── /[id]            # Event detail
│   │   │   └── /new             # Create event form
│   │   ├── /finance             # Payment tracking
│   │   ├── /inventory           # Equipment management
│   │   └── /request             # Booking requests queue
│   │
│   ├── /client                  # Client portal
│   │   ├── layout.tsx           # Client mobile layout
│   │   ├── page.tsx             # Home tab
│   │   ├── /booking             # Create booking form
│   │   ├── /events              # My events list
│   │   └── /profile             # Profile management
│   │
│   ├── /crew                    # Crew portal
│   │   ├── layout.tsx           # Crew mobile layout
│   │   ├── page.tsx             # Today's assignments
│   │   ├── /events              # All assigned events
│   │   └── /profile             # Crew profile
│   │
│   ├── /auth                    # Authentication
│   │   ├── /login               # Login page
│   │   ├── /signup              # Registration page
│   │   └── /callback            # OAuth callback
│   │
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── /components                  # Reusable React components
│   ├── /admin                   # Admin-specific components
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   ├── stats-card.tsx       # Dashboard cards
│   │   ├── events-chart.tsx     # Monthly chart
│   │   ├── status-chart.tsx     # Status distribution
│   │   ├── events-table.tsx     # Recent events table
│   │   ├── upcoming-events.tsx  # Future events
│   │   ├── inventory-status.tsx # Equipment status
│   │   └── crew-status.tsx      # Crew overview
│   │
│   ├── /ui                      # shadcn/ui components (40+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   └── ... (many more)
│   │
│   └── theme-provider.tsx       # Theme/Dark mode setup
│
├── /lib                         # Utility functions
│   ├── /supabase                # Supabase clients
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── middleware.ts        # Auth middleware
│   │
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Helper functions
│
├── /hooks                       # Custom React hooks
│   ├── use-mobile.ts            # Check if mobile
│   └── use-toast.ts             # Toast notifications
│
├── /public                      # Static assets
│   ├── /icons                   # App icons
│   └── ... (images, etc)
│
├── middleware.ts                # Next.js middleware for auth
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── postcss.config.mjs           # PostCSS config
└── package.json                 # Dependencies

```

### 4.2 Backend Implementation (API Routes)

#### Event API Endpoints

```typescript
// /app/api/events/route.ts

// GET /api/events - Fetch events dengan filtering
// Query params: status, clientId, limit, offset
// Response: {events: Event[], total: number}

// POST /api/events - Create new event
// Body: {eventName, eventType, date, startTime, endTime, location, clientId}
// Response: {eventId, status: 'pending'}

// /app/api/events/[id]/route.ts

// GET /api/events/[id] - Get event details dengan crew & equipment
// Response: {event, crew, equipment, payments, schedules}

// PUT /api/events/[id] - Update event details
// Body: {eventName, eventType, date, startTime, ...}
// Response: {success, updatedEvent}

// DELETE /api/events/[id] - Soft delete event
// Response: {success, deletedEventId}

// PATCH /api/events/[id]/status - Update event status
// Body: {newStatus, reason}
// Response: {success, newStatus}
```

#### Crew API Endpoints

```typescript
// /app/api/crew/route.ts

// GET /api/crew - List all crew members
// Query params: availability, limit, offset
// Response: {crew: Profile[], total: number}

// POST /api/crew - Create crew member
// Body: {fullName, email, phone, position}
// Response: {crewId, email}

// /app/api/crew/[id]/route.ts

// GET /api/crew/[id] - Get crew profile
// Response: {crew, assignedEvents, availability}

// PUT /api/crew/[id] - Update crew profile
// Body: {fullName, phone, position, availability}
// Response: {success, updatedCrew}

// PATCH /api/crew/[id]/availability - Toggle availability
// Body: {availability: 'tersedia' | 'on_job'}
// Response: {success, newAvailability}
```

#### Equipment API Endpoints

```typescript
// /app/api/equipment/route.ts

// GET /api/equipment - List equipment dengan filter
// Query params: category, search, limit, offset
// Response: {equipment: Equipment[], total: number}

// POST /api/equipment - Add new equipment
// Body: {name, category, quantityTotal, unit, pricePerDay}
// Response: {equipmentId}

// /app/api/equipment/[id]/route.ts

// PUT /api/equipment/[id] - Update equipment
// Body: {name, quantity, unit, condition}
// Response: {success, updatedEquipment}

// DELETE /api/equipment/[id] - Delete equipment
// Response: {success, deletedId}
```

#### Payment API Endpoints

```typescript
// /app/api/payments/route.ts

// GET /api/payments - List payments dengan filter
// Query params: status, eventId, limit, offset
// Response: {payments: Payment[], total: number}

// POST /api/payments - Create payment record
// Body: {eventId, amount, paymentMethod}
// Response: {paymentId}

// /app/api/payments/[id]/route.ts

// PATCH /api/payments/[id] - Update payment status
// Body: {status: 'lunas' | 'belum_lunas', proofImageUrl}
// Response: {success, updatedPayment}
```

### 4.3 Frontend Implementation (React Components)

#### Event Management (Admin)

```typescript
// /app/admin/events/page.tsx
// Features:
// - List all events dengan search & filter by status
// - Status badges dengan warna berbeda
// - Action buttons: View, Edit, Delete
// - Real-time updated

// /app/admin/events/[id]/page.tsx
// Features:
// - Event details lengkap
// - Equipment allocation section
// - Crew assignment section
// - Payment tracking
// - Status workflow buttons (Survey → Deal → Running → Selesai/Cancel)
// - Interactive UI dengan form dialogs

// /app/admin/events/new/page.tsx
// Features:
// - Multi-step form wizard:
//   1. Event info (name, type, date, time, location)
//   2. Client selection
//   3. Equipment allocation dengan quantity
//   4. Price calculation
// - Auto-calculate total price from equipment
// - Validation dengan Zod schema
```

#### Client Booking (Client Portal)

```typescript
// /app/client/booking/page.tsx
// Features:
// - 3-step wizard:
//   1. Event type selection (dropdown dari enums)
//   2. Date picker, time selector, location input, price range
//   3. Requirements textarea, image uploads
// - Form validation dengan React Hook Form + Zod
// - Success: Redirect ke /client/events dengan success toast
// - Auto-create event dengan status 'pending'
```

#### Crew Assignment (Admin)

```typescript
// /app/admin/events/[id]/page.tsx (Crew section)
// Features:
// - Dropdown list available crew members
// - Position selector (Operator, Technician, etc)
// - "Add Crew" button
// - Real-time list of assigned crew
// - Remove button untuk setiap crew member
// - Check crew availability sebelum assign
```

### 4.4 Validation & Error Handling

```typescript
// lib/types.ts - Zod Schemas untuk validation

export const EventCreateSchema = z.object({
  eventName: z.string().min(3).max(100),
  eventType: z.enum(['wedding', 'concert', 'corporate', 'conference', 'festival']),
  date: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().min(5),
  clientId: z.string().uuid(),
  price: z.number().positive(),
});

export const CrewAssignSchema = z.object({
  eventId: z.string().uuid(),
  crewId: z.string().uuid(),
  position: z.enum(['operator', 'technician', 'helper', 'rigger', 'dmx_programmer']),
});

export const PaymentUpdateSchema = z.object({
  eventId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(['lunas', 'belum_lunas']),
  paymentMethod: z.string(),
});
```

---

## 5. AUTHENTICATION & AUTHORIZATION

### 5.1 Login Flow

```
1. User visit /auth/login
   ↓
2. Input email & password
   ↓
3. Submit → POST /auth/login
   ↓
4. Backend:
   - Validate input (email format, password length)
   - Call Supabase Auth.signInWithPassword()
   ↓
5. Supabase Auth:
   - Find user by email
   - Verify password hash
   - Generate session token (JWT)
   - Set auth cookie
   ↓
6. Backend:
   - Query profiles table dengan email
   - Get user role (admin/client/crew)
   ↓
7. Response: 
   - Success: {accessToken, user: {id, email, role}}
   - Set cookie dengan JWT
   ↓
8. Frontend:
   - Store token di localStorage
   - Redirect based on role:
     - admin → /admin
     - client → /client
     - crew → /crew
```

### 5.2 Middleware & Session Management

```typescript
// middleware.ts - Auth middleware untuk setiap request

export async function middleware(request: NextRequest) {
  // 1. Get session dari cookie
  const session = await getSession(request)
  
  // 2. Check user role & route access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (session?.role !== 'admin') {
      // Redirect ke login atau home
      return NextResponse.redirect('/auth/login')
    }
  }
  
  if (request.nextUrl.pathname.startsWith('/crew')) {
    if (session?.role !== 'crew') {
      return NextResponse.redirect('/auth/login')
    }
  }
  
  // 3. Refresh session jika near expiry
  const newSession = await refreshSessionIfNeeded(session)
  
  // 4. Attach session ke request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', session.id)
  requestHeaders.set('x-user-role', session.role)
  
  return NextResponse.next({ request: { headers: requestHeaders } })
}
```

### 5.3 Role-Based Access Control

#### Authorization Matrix

| Resource | Admin | Client | Crew |
|----------|-------|--------|------|
| **Events** |       |        |      |
| - View All | ✅ | ❌ | ❌ |
| - View Own | ✅ | ✅ (own) | ✅ (assigned) |
| - Create | ✅ | ✅ | ❌ |
| - Edit | ✅ | Limited | ❌ |
| - Delete | ✅ | ❌ | ❌ |
| - Change Status | ✅ | ❌ | ❌ |
| **Equipment** | | | |
| - View | ✅ | ❌ | ❌ |
| - Create | ✅ | ❌ | ❌ |
| - Edit | ✅ | ❌ | ❌ |
| - Delete | ✅ | ❌ | ❌ |
| **Crew** | | | |
| - View All | ✅ | ❌ | ❌ |
| - Edit Own | ✅ | ✅ (profile) | ✅ (profile) |
| - Manage All | ✅ | ❌ | ❌ |
| **Payments** | | | |
| - View All | ✅ | ❌ | ❌ |
| - View Own | ✅ | ✅ (event) | ❌ |
| - Approve | ✅ | ❌ | ❌ |

### 5.4 JWT Token Structure

```json
{
  "sub": "user-uuid-here",
  "email": "admin@fnd.com",
  "role": "admin",
  "iat": 1672531200,
  "exp": 1672617600,
  "aud": "authenticated"
}
```

### 5.5 Protected Endpoints Example

```typescript
// /app/api/admin/events/[id]/update-status/route.ts

export async function PATCH(request: Request, {params}: {params: {id: string}}) {
  try {
    // 1. Get user dari session (middleware sudah validate)
    const user = await getUser()
    
    // 2. Authorize: Only admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        {error: 'Unauthorized'},
        {status: 403}
      )
    }
    
    // 3. Parse & validate body
    const body = await request.json()
    const validated = EventStatusUpdateSchema.parse(body)
    
    // 4. Get event
    const event = await supabase
      .from('events')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (!event.data) {
      return NextResponse.json({error: 'Event not found'}, {status: 404})
    }
    
    // 5. Update event status
    const {data, error} = await supabase
      .from('events')
      .update({status: validated.newStatus, updated_at: new Date()})
      .eq('id', params.id)
      .select()
    
    // 6. Record history
    await supabase
      .from('event_status_history')
      .insert({
        event_id: params.id,
        old_status: event.data.status,
        new_status: validated.newStatus,
        changed_by: user.id,
        reason: validated.reason,
      })
    
    // 7. Notify client (optional)
    await notifyClient(event.data.client_id, `Status changed to ${validated.newStatus}`)
    
    return NextResponse.json({success: true, new_status: validated.newStatus})
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}
```

---

## 6. CRUD & BUSINESS LOGIC

### 6.1 Events CRUD & Business Logic

#### CREATE Event (Client)

```typescript
// Input validation
- Event name: required, 3-100 chars
- Event type: required, enum
- Date: required, date > today
- Time: required, start < end
- Location: required, 5+ chars
- Client: auto-filled from session

// Auto calculations
- Validate date not in past
- Calculate event duration
- Initialize status = 'pending'

// Side effects
- Create payment record (auto-generated)
- Create event_status_history entry
```

#### READ Event (All roles)

```typescript
// Admin: See all events with full details
// Client: See own events + equipment + payments
// Crew: See assigned events + schedules

// Filters available:
- By status (pending, survey, deal, running, selesai, cancel)
- By date range
- By client/crew
- Search by event name or location

// Pagination: 10 items per page
```

#### UPDATE Event (Admin)

```typescript
// Admin dapat update:
- Event details (name, type, date, time, location)
- Equipment allocation
- Crew assignments
- Price

// Validation:
- Date tidak boleh di masa lalu
- Equipment quantity vs available
- Crew availability

// History tracking:
- Record semua perubahan di event_status_history
```

#### DELETE Event (Admin)

```typescript
// Soft delete:
- Set status = 'cancel'
- Record reason di history
- Keep data untuk audit trail

// Hard delete (rare):
- Only jika belum ada pembayaran
- Delete cascading: event_equipment, event_crew, schedules
```

### 6.2 Crew CRUD & Business Logic

#### CREATE Crew (Admin)

```typescript
// Input:
- Full name: required
- Email: required, unique
- Phone: required
- Position: required, enum
- Initial availability: 'tersedia'

// Auto:
- Create Supabase auth account
- Set password (temporary)
- Send invitation email
- Create profile record
```

#### READ Crew

```typescript
// Admin: View all crew + assignments + availability
// Crew: View own profile
// Client: Cannot view crew details

// Filters:
- By position
- By availability (tersedia / on_job)
- By event assignment
```

#### UPDATE Crew

```typescript
// Admin: Update full profile
// Crew: Update own profile (name, phone, position)
// Both: Toggle availability

// History:
- Log availability changes
- Track position updates
```

#### DELETE Crew (Admin)

```typescript
// Soft delete:
- Mark as inactive
- Keep historical assignments

// Validation:
- Cannot delete jika punya ongoing assignments
```

### 6.3 Equipment CRUD & Business Logic

#### CREATE Equipment (Admin)

```typescript
// Input:
- Name: required
- Category: required, enum (Lighting, Effects, Display, etc)
- Quantity: required, > 0
- Unit: required (piece, set, etc)
- Price per day: optional
- Location: optional

// Validation:
- Quantity must be positive integer
- Unique name per category

// Initial:
- quantity_available = quantity_total (belum dialokasi)
```

#### READ Equipment

```typescript
// Admin: View all equipment dengan availability status
// Filters:
- By category
- By location
- By availability status
- Search by name

// Show:
- Quantity total vs available
- Visual progress bar untuk availability
```

#### UPDATE Equipment (Admin)

```typescript
// Dapat update:
- Name
- Category
- Unit
- Price
- Location
- Quantity (if available)
- Condition status

// Validation:
- quantity_available tidak boleh > quantity_total
```

#### DELETE Equipment (Admin)

```typescript
// Soft delete:
- Mark as inactive
- Keep history

// Hard delete:
- Only jika tidak ada di event_equipment
```

### 6.4 Payment CRUD & Business Logic

#### CREATE Payment (Auto)

```typescript
// Auto-create saat event dibuat:
- amount = event.price
- status = 'belum_lunas'
- payment_date = null
// Admin dapat manually create jika diperlukan
```

#### READ Payment

```typescript
// Admin: View all payments
// Client: View payment untuk own events
// Filters:
- By status (lunas, belum_lunas, pending)
- By date range
- By event

// Calculation:
- Aggregate: total revenue, overdue payments, etc
```

#### UPDATE Payment (Admin)

```typescript
// Update:
- Status (lunas / belum_lunas)
- Payment date
- Payment method
- Bank account
- Upload proof image

// Validation:
- Jika status = lunas, harus ada bukti pembayaran
- Update timestamp terbaru
```

### 6.5 Business Logic & Calculations

#### Revenue Calculation

```typescript
// Total Revenue = SUM(events WHERE status IN ['deal', 'running', 'selesai'])
// Pending Revenue = SUM(events WHERE status = 'deal')
// Monthly Revenue = SUM(events WHERE month = current AND status >= 'deal')
```

#### Availability Calculation

```typescript
// Equipment available = quantity_total - SUM(event_equipment quantities WHERE event.status IN ['survey', 'deal', 'running'])
// Crew available = COUNT(crew WHERE availability = 'tersedia' AND NOT assigned to today's events)
```

#### Status Workflow Validation

```typescript
// Valid transitions:
- pending → survey (by admin request approval)
- survey → deal (by admin price confirmation)
- deal → running (by admin event activation)
- running → selesai (by admin mark completion)
- ANY → cancel (by admin any time)

// Cannot go backward (pending → survey → pending) ❌
```

---

## 7. DASHBOARD

### 7.1 Admin Dashboard (/admin)

#### Statistics Cards (Top Row)

```
┌─────────────────┬─────────────────┬─────────────────┐
│  Total Events   │   Today Events  │  Total Revenue  │
│      128        │        5        │   $45,250.00    │
│   ↑ +12% MTD    │   Real-time     │   ↑ +8% MTD     │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┐
│  Equipment      │   Crew          │
│  Availability   │   Availability  │
│   420/520       │     28/35       │
│   80.8% ready   │   80% ready     │
└─────────────────┴─────────────────┘
```

**Metrics:**
- Total Events: COUNT(events)
- Today Events: COUNT(events WHERE date = TODAY)
- Total Revenue: SUM(price WHERE status IN ['deal', 'running', 'selesai'])
- Equipment Availability: SUM(quantity_available) / SUM(quantity_total)
- Crew Availability: COUNT(crew WHERE availability='tersedia') / COUNT(crew)

#### Charts Section

**Monthly Revenue Chart (12 Months)**
- Type: Area Chart
- X-axis: Month names (Jan-Dec)
- Y-axis: Revenue amount
- Year selector: 2024, 2025, 2026
- Interactive: Hover untuk detail

**Status Distribution Pie Chart**
- Pending: 12%
- Survey: 15%
- Deal: 25%
- Running: 20%
- Selesai: 25%
- Cancel: 3%

#### Tables & Lists

**Recent Events Table**
- Columns: Event Name, Client, Date, Price, Status
- Rows: 5 most recent
- Actions: View detail, Edit, Delete
- Sortable: By date, by price

**Upcoming Events**
- Next 5 scheduled events
- Show: Name, Date, Time, Location
- Status badge

**Top Equipment**
- 5 most allocated equipment
- Show: Name, Category, Times Used
- Allocation trend

**Crew Overview**
- First 6 crew members
- Show: Name, Position, Availability

### 7.2 Client Dashboard (/client)

**Status Overview**
- Total bookings: X
- Pending approvals: X
- Confirmed events: X
- Completed events: X

**Next Event Card**
- Show nearest upcoming event
- Quick action buttons

**Event List Tabs**
- All / Survey / Deal / Running / Completed
- Quick view dengan status

### 7.3 Crew Dashboard (/crew)

**Today's Tasks**
- Filter: Today, Tomorrow, This Week
- Show: Event name, Time, Location, Activity details
- Quick action: Mark complete

**Assignment Info**
- Position
- Contact info
- Event details
- Time details

---

## 8. API & INTEGRASI

### 8.1 REST API Endpoints

#### Events API

```
GET    /api/events              - List events
GET    /api/events/[id]         - Get event detail
POST   /api/events              - Create event
PUT    /api/events/[id]         - Update event
DELETE /api/events/[id]         - Delete event
PATCH  /api/events/[id]/status  - Update status
```

#### Crew API

```
GET    /api/crew                - List crew
GET    /api/crew/[id]           - Get crew detail
POST   /api/crew                - Create crew
PUT    /api/crew/[id]           - Update crew
DELETE /api/crew/[id]           - Delete crew
PATCH  /api/crew/[id]/availability - Toggle availability
```

#### Equipment API

```
GET    /api/equipment           - List equipment
GET    /api/equipment/[id]      - Get equipment detail
POST   /api/equipment           - Create equipment
PUT    /api/equipment/[id]      - Update equipment
DELETE /api/equipment/[id]      - Delete equipment
```

#### Payment API

```
GET    /api/payments            - List payments
POST   /api/payments            - Create payment
PATCH  /api/payments/[id]       - Update payment status
```

### 8.2 API Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "eventName": "Wedding Ceremony",
    "status": "pending",
    ...
  },
  "message": "Event created successfully"
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "eventName",
      "message": "Event name must be at least 3 characters"
    }
  ]
}
```

### 8.3 Authentication Header

```
Authorization: Bearer {JWT_TOKEN}
```

### 8.4 Optional: External Integrations

#### Email Notifications (Planned)

```typescript
// Trigger points:
- New booking received → Send to Admin
- Booking approved → Send to Client
- Crew assigned → Send to Crew
- Payment received → Send to Client
- Event completed → Send to Client

// Provider: SendGrid / Mailgun
```

#### SMS Notifications (Planned)

```typescript
// Alert event starting in 24 hours
// Prompt crew to mark availability
// Payment reminders for unpaid events

// Provider: Twilio
```

#### File Storage (Implemented)

```typescript
// Payment proof images stored in Supabase Storage
// Event photos (future enhancement)

// Provider: Supabase Storage
```

---

## 9. DEVOPS

### 9.1 Version Control (Git & GitHub)

#### Repository Information

```
Repository: Ediswar03/FND_Production
Owner: Ediswar03
Current Branch: main (production)
Default Branch: main
Hosting: GitHub
```

#### Git Workflow

```
Feature Development:
1. Create feature branch: git checkout -b feature/event-booking
2. Make changes & commit: git commit -m "Add event booking form"
3. Push to remote: git push origin feature/event-booking
4. Create Pull Request untuk code review
5. Merge ke main setelah approval
6. Auto-deploy ke production (via Vercel)

Commit Message Convention:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance

Example: feat: add crew assignment to events
```

#### Branch Strategy

```
main (production)
  ↑
  └── feature branches
      ├── feature/event-management
      ├── feature/crew-assignment
      ├── feature/payment-tracking
      └── ...

Hotfix branches (if needed):
  ├── hotfix/auth-bug
  └── hotfix/deployment-issue
```

### 9.2 Deployment Setup

#### Environment

```
Development: Local machine
Staging: Vercel preview deployments
Production: Vercel production
```

#### Environment Variables

```
.env.local (development)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

Production (Vercel):
SUPABASE_URL (server-only)
SUPABASE_ANON_KEY (public)
```

#### Build & Deploy Process

```
1. Push code ke GitHub (main branch)
2. Vercel webhook triggered
3. Build: npm run build
4. Test: (optional) npm run lint
5. Deploy to: https://fnd-production.vercel.app
6. Analytics: Track deployment via Vercel Analytics

Current Deployment:
- Framework: Next.js
- Hosting: Vercel
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
```

### 9.3 Performance Monitoring

```
Vercel Analytics:
- Page load time
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

Monitoring via:
- Vercel Dashboard
- Real User Monitoring (RUM)
```

### 9.4 Commit History Best Practices

```
✅ Good commit messages:
- feat: implement event status workflow
- fix: resolve hydration mismatch on root layout
- docs: add API documentation
- refactor: extract event creation logic to service

❌ Bad commit messages:
- update
- fix bug
- changes
- wip (work in progress)

Ideal frequency: 1-2 commits per completed feature
Include: What changed, Why it changed, How it impacts system
```

### 9.5 Current Git Status

```
Repository State: main branch (up to date)
Recent Changes:
- lib/supabase/middleware.ts (fixed Supabase credentials validation)
- app/layout.tsx (added suppressHydrationWarning)

Next Steps for Team:
1. Feature: Event calendar view
2. Feature: Crew skill matching
3. Feature: Automated SMS notifications
4. Optimization: Add form field validations
5. Testing: Add E2E tests for critical flows
```

---

## KESIMPULAN

### 10.1 Fitur-Fitur Implementasi

**Tercapai:**
- ✅ Multi-portal architecture (Admin, Client, Crew)
- ✅ Role-based authentication dengan Supabase Auth
- ✅ Comprehensive database schema dengan 8 tables
- ✅ Event management dengan status workflow
- ✅ Equipment inventory tracking
- ✅ Crew assignment system
- ✅ Payment management
- ✅ Real-time dashboard dengan analytics
- ✅ REST API endpoints untuk semua resources
- ✅ Responsive design (Desktop admin, Mobile clients)
- ✅ Version control dengan Git & GitHub
- ✅ Hosted di Vercel dengan CI/CD integration

### 10.2 Technology Achievement

- **Frontend:** Next.js 16.2.4 dengan 40+ UI components
- **Backend:** Supabase PostgreSQL dengan advanced schema
- **Authentication:** Secure email/password auth dengan JWT
- **Styling:** Tailwind CSS utility-first approach
- **Deployment:** Production-ready Vercel setup

### 10.3 Business Value

- **User Count Support:** 50+ clients, 35+ crew, unlimited admin users
- **Data Capacity:** Manage 128+ events, 520+ equipment, scalable
- **Revenue Tracking:** Comprehensive payment & finance dashboard
- **Operational Efficiency:** Automated status workflows, crew assignments, equipment allocation

### 10.4 Rekomendasi Pengembangan Lanjutan

1. **Phase 2 Enhancements:**
   - Real-time notifications (WebSocket)
   - Email/SMS integration
   - Advanced reporting & export
   - Mobile app (React Native)

2. **Security Improvements:**
   - Add 2FA (Two-Factor Authentication)
   - Image verification untuk payments
   - Audit logging
   - Rate limiting on APIs

3. **Performance Optimization:**
   - Add database query caching
   - Implement image optimization
   - Service worker for offline support

### 10.5 File Project Structure Summary

```
Total Files: ~150+
Frontend Components: 40+
Backend API Routes: 10+
Database Tables: 8
Responsive Breakpoints: 3
Auth Roles: 3
Event Status States: 6
```

---

**Dokumentasi Project Selesai**

*Generated: 2 Mei 2026*

*Untuk informasi lebih lanjut, referensikan ke source code di GitHub repository: https://github.com/Ediswar03/FND_Production*
