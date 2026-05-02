# 🎬 FND PRODUCTION - Event Lighting Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Professional event lighting company management platform. Manage events, crew assignments, equipment inventory, and financial tracking in one unified system.

## 🎯 Project Overview

**FND Production** adalah aplikasi web fullstack yang dirancang untuk mengelola operasional perusahaan penyedia layanan event lighting. Platform ini memungkinkan admin mengelola events, equipment, crew, dan keuangan; clients untuk booking dan tracking status; serta crew untuk viewing assignments dan managing availability.

### Key Statistics

- **Events:** 128+ events managed
- **Equipment:** 520+ items tracked
- **Crew:** 35+ team members
- **Clients:** 50+ active clients
- **Tech Stack:** Next.js + Supabase + Tailwind CSS

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│       Frontend Layer (Next.js + React)  │
│  Admin Portal | Client Portal | Crew    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    API Layer (Next.js API Routes)       │
│  /api/events | /api/crew | /api/...    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Backend Layer (Supabase PostgreSQL)   │
│  8 Tables with Relations & Constraints  │
└─────────────────────────────────────────┘
```

**Tech Stack Breakdown:**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | Server and Client Components |
| **Styling** | Tailwind CSS + shadcn/ui | 40+ Pre-built Components |
| **Backend** | Next.js API Routes | RESTful API |
| **Database** | Supabase PostgreSQL | 8 Relational Tables |
| **Auth** | Supabase Auth | JWT + Email/Password |
| **Charts** | Recharts | Real-time Analytics |

## ✨ Features

### 👨‍💼 Admin Dashboard

- **Event Management:** Create, edit, delete events dengan full control status workflow
- **Equipment Inventory:** Manage 520+ items dengan real-time availability tracking
- **Crew Assignments:** Assign crew ke events dengan smart availability checking
- **Finance Dashboard:** Track payments (lunas/belum lunas) dan revenue analytics
- **Real-time Analytics:**
  - Monthly revenue chart (12 months)
  - Event status distribution
  - Equipment availability percentage
  - Crew availability status
- **Request Queue:** Approve/reject pending bookings dari clients

### 👥 Client Portal

- **Event Booking:** 3-step wizard untuk create event request
- **Status Tracking:** Real-time status dari pending hingga selesai
- **Event History:** View semua past dan ongoing events
- **Profile Management:** Update contact info

### 👷 Crew Portal

- **Today's Assignments:** View today's tasks detail
- **Weekly Schedule:** See coming assignments
- **Availability Toggle:** Mark tersedia/on_job
- **Profile Management:** View dan update personal info

### 🔐 Security Features

- **Role-Based Access Control:** 3 roles (Admin, Client, Crew)
- **JWT Authentication:** Secure token-based auth
- **Supabase Auth:** Email/password dengan session management
- **Protected Routes:** Middleware validation pada setiap request
- **Database Constraints:** Foreign keys, unique constraints, NOT NULL

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (atau npm)
- Supabase account (free tier available)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Ediswar03/FND_Production.git
cd FND_Production

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local dan add Supabase credentials

# 4. Start development server
pnpm dev

# 5. Open browser
open http://localhost:3000
```

## 🧩 Monorepo Usage

### Root commands
- `npm install` — install dependencies for the entire workspace
- `npm run dev` — start the frontend workspace
- `npm run dev:backend` — start the backend service
- `npm run build` — build the frontend workspace
- `npm run lint` — run frontend ESLint from the root workspace

### Workspace folders
- `frontend/` — Next.js app, UI, and frontend assets
- `backend/` — Express backend server, routes, controllers, and config

**Detailed setup guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📁 Project Structure

```
FND_Production/
├── /app                          # Next.js App Router
│   ├── /admin                    # Admin portal routes
│   ├── /client                   # Client portal routes
│   ├── /crew                     # Crew portal routes
│   ├── /auth                     # Auth pages
│   └── layout.tsx                # Root layout
├── /components                   # React components
│   ├── /admin                    # Admin-specific components
│   └── /ui                       # shadcn/ui components
├── /lib                          # Utilities
│   ├── /supabase                 # Supabase clients
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper functions
├── /public                       # Static assets
├── middleware.ts                 # Auth middleware
├── next.config.mjs               # Next.js config
└── package.json                  # Dependencies
```

## 🗄️ Database Schema

8 Tables dengan relational constraints:

1. **profiles** - User accounts dengan roles
2. **events** - Event/booking records
3. **equipment** - Inventory items
4. **event_equipment** - Event-Equipment mapping (M:N)
5. **event_crew** - Event-Crew assignments (M:N)
6. **payments** - Payment tracking
7. **event_schedules** - Event timelines
8. **event_status_history** - Audit trail

**View full ERD:** [DOKUMENTASI_PROJECT.md - Section 3](./DOKUMENTASI_PROJECT.md#3-desain-database)

## 🔄 Event Status Workflow

```
pending ──→ survey ──→ deal ──→ running ──→ selesai ✅
  ↑                                             
  └──────────────────── cancel ❌ (anytime)
```

Status transitions tercatat di `event_status_history` untuk audit trail.

## 📊 Dashboard Analytics

### Key Metrics

- **Total Events:** COUNT(events)
- **Today Events:** Events pada hari ini
- **Total Revenue:** SUM(event.price WHERE status >= 'deal')
- **Equipment Availability:** Available inventory / total inventory
- **Crew Availability:** Ready crew / total crew

### Charts

- **Monthly Revenue Chart:** 12 months area chart dengan year selector
- **Status Distribution:** Pie chart breakdown
- **Recent Events:** Table dengan latest 5 events
- **Top Equipment:** Most allocated items

## 🔌 API Endpoints

### Events

```
GET    /api/events              # List events
GET    /api/events/{id}         # Get event detail
POST   /api/events              # Create event
PUT    /api/events/{id}         # Update event
DELETE /api/events/{id}         # Delete event
PATCH  /api/events/{id}/status  # Update status
```

### Crew

```
GET    /api/crew                # List crew
GET    /api/crew/{id}           # Get crew profile
POST   /api/crew                # Create crew
PUT    /api/crew/{id}           # Update crew
PATCH  /api/crew/{id}/availability  # Toggle availability
```

### Equipment & Payments

```
GET/POST/PUT/DELETE /api/equipment      # Equipment CRUD
GET/POST/PATCH      /api/payments       # Payment management
```

**Full API docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fnd.com | password123 |
| Client | client@fnd.com | password123 |
| Crew | crew@fnd.com | password123 |

*Create these users via Supabase Auth first*

### Test Workflows

1. **Client Booking Flow:**
   - Login as client
   - Create event booking
   - Track status changes
   - View assigned crew/equipment

2. **Admin Approval Flow:**
   - Login as admin
   - View pending requests
   - Approve/reject bookings
   - Assign equipment & crew
   - Track payments

3. **Crew Assignment Flow:**
   - Login as crew
   - View today's assignments
   - Toggle availability
   - View event details

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# Or manually via: https://vercel.com
```

**Production URL:** https://fnd-production.vercel.app

**Environment Setup:**
- Add Supabase credentials pada Vercel project settings
- Database auto-created dalam Supabase

### Docker (Optional)

```bash
docker build -t fnd-production .
docker run -p 3000:3000 fnd-production
```

## 📚 Documentation

- **[DOKUMENTASI_PROJECT.md](./DOKUMENTASI_PROJECT.md)** - Full technical documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Installation & setup guide  
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference

## 🛠️ Development

### Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

### Code Style

- **Language:** TypeScript (strict mode)
- **Formatting:** Prettier
- **Linting:** ESLint
- **Components:** React Functional Components + Hooks

### Component Library

- **UI:** shadcn/ui (40+ components)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner

## 🔒 Security

- ✅ JWT token-based authentication
- ✅ Middleware session validation
- ✅ Role-based access control (RBAC)
- ✅ Database constraints enforcement
- ✅ Input validation (Zod schemas)
- ✅ HTTPS enforced in production
- ✅ Secure password hashing (Supabase)
- ✅ CORS configured

## 📈 Performance

- **Framework:** Next.js dengan Turbopack
- **Build Time:** ~2 seconds
- **API Response:** < 200ms average
- **Database Queries:** Indexed for performance
- **Frontend:** Optimized bundle with code splitting
- **Analytics:** Vercel Analytics integration

## 🐛 Troubleshooting

### Common Issues

**Q: "Supabase credentials not configured"**
- A: Check `.env.local` file dengan Supabase credentials

**Q: "Port 3000 already in use"**
- A: Kill existing process: `lsof -ti:3000 | xargs kill -9`

**Q: Database connection error**
- A: Verify internet, check Supabase project active, verify API keys

**Q: Build error**
- A: Clear cache: `rm -rf .next node_modules && pnpm install`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: add feature description"`
3. Push to remote: `git push origin feature/your-feature`
4. Create Pull Request

**Commit convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 👨‍💻 Author

**Ediswar03**
- GitHub: https://github.com/Ediswar03
- Repository: https://github.com/Ediswar03/FND_Production

## 📞 Support

- 📖 Read [documentation](./DOKUMENTASI_PROJECT.md)
- 🐞 Open GitHub issue untuk bugs
- 💬 Suggest features via GitHub discussions

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)

---

<div align="center">

### Made with ❤️ for professional event management

**[⬆ back to top](#-fnd-production---event-lighting-management-system)**

</div>
