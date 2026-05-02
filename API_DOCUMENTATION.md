# FND PRODUCTION - API DOCUMENTATION

## Base URL

**Development:** `http://localhost:3000/api`
**Production:** `https://fnd-production.vercel.app/api`

## Authentication

Semua endpoints (kecuali `/auth/login` dan `/auth/signup`) memerlukan JWT token di header:

```
Authorization: Bearer {JWT_TOKEN}
```

## Response Format

### Success Response (200-201)

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "eventName": "Wedding Ceremony",
    "status": "pending",
    ...
  },
  "message": "Operation successful"
}
```

### Error Response (400-500)

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [
    {
      "field": "eventName",
      "message": "Field validation error"
    }
  ]
}
```

---

## AUTHENTICATION ENDPOINTS

### POST /auth/login

Login dengan email dan password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "admin"
    },
    "session": {
      "accessToken": "jwt_token_here",
      "expiresIn": 3600
    }
  }
}
```

**Error Responses:**
- `400` - Invalid email/password format
- `401` - Invalid credentials
- `500` - Server error

---

### POST /auth/signup

Register pengguna baru (hanya client).

**Request:**
```json
{
  "email": "newclient@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "newclient@example.com"
  }
}
```

---

### POST /auth/logout

Logout pengguna (invalidate token).

**Request:** (no body needed)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## EVENTS ENDPOINTS

### GET /events

Fetch daftar events dengan filtering.

**Query Parameters:**
```
status=pending          (Optional: filter by status)
clientId={uuid}         (Optional: filter by client)
sortBy=date             (Optional: date, price, status)
page=1                  (Optional: default 1)
limit=10                (Optional: default 10)
```

**Example Request:**
```
GET /api/events?status=pending&limit=10
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event-uuid",
        "eventName": "Wedding Ceremony",
        "eventType": "wedding",
        "date": "2026-06-15",
        "startTime": "10:00",
        "endTime": "18:00",
        "location": "Jakarta Convention Center",
        "status": "pending",
        "price": 5000,
        "clientId": "client-uuid",
        "createdAt": "2026-05-02T10:00:00Z"
      }
    ],
    "total": 128,
    "page": 1,
    "pageSize": 10
  }
}
```

**Authorization:**
- `Admin` → Get all events
- `Client` → Get own events
- `Crew` → Get assigned events (read-only)

---

### GET /events/{id}

Get event details dengan crew, equipment, dan payments.

**Example Request:**
```
GET /api/events/event-uuid
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "event-uuid",
      "eventName": "Wedding Ceremony",
      "status": "survey",
      "price": 5000,
      ...
    },
    "equipment": [
      {
        "equipmentId": "equip-uuid",
        "name": "LED Lighting Kit",
        "category": "lighting",
        "quantity": 5,
        "pricePerDay": 800
      }
    ],
    "crew": [
      {
        "crewId": "crew-uuid",
        "fullName": "John Operator",
        "position": "operator",
        "phone": "081234567890"
      }
    ],
    "payments": [
      {
        "id": "payment-uuid",
        "amount": 5000,
        "status": "belum_lunas",
        "paymentDate": null
      }
    ],
    "schedules": [
      {
        "id": "schedule-uuid",
        "activityName": "Setup",
        "scheduledTime": "2026-06-15T09:00:00Z"
      }
    ]
  }
}
```

---

### POST /events

Create event baru (Admin & Client).

**Request:**
```json
{
  "eventName": "Wedding Ceremony",
  "eventType": "wedding",
  "date": "2026-06-15",
  "startTime": "10:00",
  "endTime": "18:00",
  "location": "Jakarta Convention Center",
  "city": "Jakarta",
  "price": 5000,
  "notes": "Outdoor event",
  "equipment": [
    {
      "equipmentId": "equip-uuid",
      "quantity": 5
    }
  ]
}
```

**Validation:**
- `eventName`: 3-100 characters
- `date`: Tidak boleh di masa lalu
- `startTime` < `endTime` ✓
- `price`: > 0

**Response (201):**
```json
{
  "success": true,
  "data": {
    "eventId": "new-event-uuid",
    "status": "pending",
    "createdAt": "2026-05-02T10:00:00Z"
  }
}
```

**Authorization:**
- `Admin` → Create event untuk client manapun
- `Client` → Create event untuk diri sendiri
- `Crew` → Tidak bisa create ❌

---

### PUT /events/{id}

Update event details.

**Request:**
```json
{
  "eventName": "Updated Name",
  "price": 6000,
  "notes": "Updated notes",
  "equipment": [
    {
      "equipmentId": "equip-uuid",
      "quantity": 3
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "event-uuid",
    "eventName": "Updated Name",
    "updatedAt": "2026-05-02T11:00:00Z"
  }
}
```

**Authorization:** Admin only

---

### DELETE /events/{id}

Soft delete event (set status to 'cancel').

**Response (200):**
```json
{
  "success": true,
  "message": "Event cancelled successfully"
}
```

**Authorization:** Admin only

---

### PATCH /events/{id}/status

Update event status.

**Request:**
```json
{
  "newStatus": "survey",
  "reason": "Admin approval - site visit scheduled"
}
```

**Valid Transitions:**
```
pending → survey ✓
survey → deal ✓
deal → running ✓
running → selesai ✓
* → cancel ✓ (anytime)
```

**Invalid Transitions:**
```
survey → pending ❌
deal → survey ❌
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": "event-uuid",
    "oldStatus": "pending",
    "newStatus": "survey",
    "changedAt": "2026-05-02T11:30:00Z"
  }
}
```

**Authorization:** Admin only

---

## CREW ENDPOINTS

### GET /crew

Fetch daftar crew members.

**Query Parameters:**
```
availability=tersedia   (Optional: tersedia or on_job)
position=operator       (Optional: filter by position)
limit=20                (Optional: default 20)
```

**Example Request:**
```
GET /api/crew?availability=tersedia
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "crew": [
      {
        "id": "crew-uuid",
        "fullName": "John Operator",
        "email": "john@fnd.com",
        "phone": "081234567890",
        "position": "operator",
        "availability": "tersedia"
      }
    ],
    "total": 35
  }
}
```

**Authorization:**
- `Admin` → Get all crew
- `Crew` → Get own profile only
- `Client` → Not allowed ❌

---

### GET /crew/{id}

Get crew member profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "crew-uuid",
    "fullName": "John Operator",
    "email": "john@fnd.com",
    "phone": "081234567890",
    "position": "operator",
    "availability": "tersedia",
    "assignedEvents": [
      {
        "eventId": "event-uuid",
        "eventName": "Wedding",
        "date": "2026-06-15"
      }
    ]
  }
}
```

---

### POST /crew

Create crew member (Admin only).

**Request:**
```json
{
  "fullName": "John Operator",
  "email": "john@fnd.com",
  "phone": "081234567890",
  "position": "operator"
}
```

**Positions:**
- `operator`
- `technician`
- `helper`
- `rigger`
- `dmx_programmer`
- `director`
- `other`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "crewId": "new-crew-uuid",
    "email": "john@fnd.com",
    "invitationSent": true
  }
}
```

**Authorization:** Admin only

---

### PUT /crew/{id}

Update crew profile.

**Request:**
```json
{
  "fullName": "Updated Name",
  "phone": "089876543210",
  "position": "technician"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "crew-uuid",
    "fullName": "Updated Name",
    "position": "technician"
  }
}
```

**Authorization:**
- `Admin` → Update any crew
- `Crew` → Update own profile

---

### PATCH /crew/{id}/availability

Toggle crew availability.

**Request:**
```json
{
  "availability": "on_job"
}
```

**Enum:** `tersedia` | `on_job`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "crewId": "crew-uuid",
    "availability": "on_job",
    "updatedAt": "2026-05-02T12:00:00Z"
  }
}
```

**Authorization:**
- `Admin` → Update any crew
- `Crew` → Update own availability

---

## EQUIPMENT ENDPOINTS

### GET /equipment

Fetch daftar equipment.

**Query Parameters:**
```
category=lighting       (Optional: filter by category)
search=LED              (Optional: search by name)
limit=20
```

**Categories:**
- `lighting`
- `effects`
- `display`
- `rigging`
- `control`
- `audio`
- `other`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "equipment": [
      {
        "id": "equip-uuid",
        "name": "LED Lighting Kit",
        "category": "lighting",
        "quantityTotal": 10,
        "quantityAvailable": 8,
        "unit": "piece",
        "pricePerDay": 800,
        "location": "Warehouse A"
      }
    ],
    "total": 520
  }
}
```

**Authorization:** Admin only

---

### GET /equipment/{id}

Get equipment details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "equip-uuid",
    "name": "LED Lighting Kit",
    "allocatedTo": [
      {
        "eventId": "event-uuid",
        "eventName": "Wedding",
        "quantity": 2
      }
    ]
  }
}
```

---

### POST /equipment

Create equipment (Admin only).

**Request:**
```json
{
  "name": "Moving Head Light",
  "category": "lighting",
  "quantityTotal": 15,
  "unit": "piece",
  "pricePerDay": 1200,
  "location": "Warehouse A"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "equipmentId": "new-equip-uuid"
  }
}
```

---

### PUT /equipment/{id}

Update equipment (Admin only).

**Request:**
```json
{
  "name": "Updated Name",
  "quantityTotal": 20,
  "condition": "good"
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## PAYMENT ENDPOINTS

### GET /payments

Fetch daftar pembayaran.

**Query Parameters:**
```
status=belum_lunas      (Optional: lunas or belum_lunas)
eventId={uuid}          (Optional: filter by event)
limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment-uuid",
        "eventId": "event-uuid",
        "eventName": "Wedding",
        "amount": 5000,
        "status": "belum_lunas",
        "createdAt": "2026-05-02T10:00:00Z"
      }
    ],
    "total": 128,
    "totalAmount": 450250
  }
}
```

**Authorization:** Admin only

---

### POST /payments

Create payment record (Admin only).

**Request:**
```json
{
  "eventId": "event-uuid",
  "amount": 5000,
  "paymentMethod": "bank_transfer",
  "bankAccount": "BCA 123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "paymentId": "new-payment-uuid"
  }
}
```

---

### PATCH /payments/{id}

Update payment status (Admin only).

**Request:**
```json
{
  "status": "lunas",
  "paymentDate": "2026-05-02",
  "proofImageUrl": "https://..."
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## ERROR CODES

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Tidak ada authorization header |
| `FORBIDDEN` | 403 | Tidak punya permission untuk action |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `VALIDATION_ERROR` | 400 | Input validation gagal |
| `CONFLICT` | 409 | Data conflict (e.g., duplicate email) |
| `INTERNAL_ERROR` | 500 | Server error |

---

## RATE LIMITING

- **Default:** 100 requests per minute per IP
- **Auth endpoints:** 10 requests per minute per IP
- **Headers returned:**
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1234567890
  ```

---

## PAGINATION

Semua list endpoints support pagination:

```
Query params:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 100)
- sortBy: Sort field
- order: asc or desc

Response includes:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 128,
    "totalPages": 13
  }
}
```

---

## TESTING ENDPOINTS

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fnd.com",
    "password": "password123"
  }'

# Get Events
curl -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer {token}"

# Create Event
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "New Event",
    "eventType": "wedding",
    "date": "2026-06-15",
    ...
  }'
```

### Using Postman

1. Import collection dari `/docs/postman-collection.json`
2. Set environment variables untuk base URL dan token
3. Run requests

---

**API Documentation v1.0 - Last Updated: 2 Mei 2026**
