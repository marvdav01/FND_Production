# FND PRODUCTION - SETUP & INSTALLATION GUIDE

## Prerequisites

Sebelum memulai, pastikan sudah terinstall:

- **Node.js** >= 18.0.0 (Check: `node -v`)
- **npm** atau **pnpm** >= 8.0.0 (Check: `pnpm -v`)
- **Git** (Check: `git -v`)
- **Supabase Account** (Free tier available at https://supabase.com)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/Ediswar03/FND_Production.git
cd FND_Production
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Set Up Environment Variables

Buat file `.env.local` di root project:

```bash
# .env.local

# Supabase Configuration (Get from https://app.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: Server-side only
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Cara mendapatkan credentials:**
1. Go to https://app.supabase.com
2. Create new project atau select existing
3. Go to Settings → API
4. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Setup Supabase Database

Database akan auto-created by Supabase. Pastikan tables sudah ada:

```sql
-- Run these in Supabase SQL Editor untuk setup schema

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client', 'crew')),
  full_name TEXT,
  phone TEXT,
  availability TEXT DEFAULT 'tersedia',
  position TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- [Lihat DOKUMENTASI_PROJECT.md untuk full SQL schema]
```

### 5. Create First Admin User

```bash
# Via Supabase Dashboard:
1. Go to Auth → Users
2. Click "Invite"
3. Enter email and send
4. Accept invitation link dari email
5. Set password

# Update role ke admin:
1. Go to SQL Editor
2. Run:
   UPDATE profiles SET role = 'admin' WHERE email = 'your_email@example.com';
```

## Development

### Start Dev Server

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

### Run Linter

```bash
pnpm lint
```

## Project Structure

```
/app                  - Next.js App Router pages
  /admin             - Admin portal
  /client            - Client portal
  /crew              - Crew portal
  /auth              - Authentication pages

/components          - React components
  /admin             - Admin-specific components
  /ui                - shadcn/ui components

/lib                 - Utility & helper functions
  /supabase          - Supabase clients & auth

/public              - Static assets

middleware.ts        - Auth middleware
```

## Testing Features

### Login with Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fnd.com | password123 |
| Client | client@fnd.com | password123 |
| Crew | crew@fnd.com | password123 |

*Note: Create these users manually via Supabase Auth first*

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Or manually via Vercel Dashboard
```

## Troubleshooting

### Error: "Supabase credentials not configured"
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server: `pnpm dev`

### Error: "Hydration mismatch"
- Already fixed in current version
- Clear browser cache and reload

### Database Connection Issues
- Verify Supabase project is active
- Check internet connection
- Verify API keys are correct

## Next Steps

1. Read: DOKUMENTASI_PROJECT.md (Full technical documentation)
2. Setup: Create test users via Supabase Auth
3. Test: Login to each portal and test features
4. Develop: Start with features in /app directory
5. Deploy: Push to GitHub for Vercel deployment

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- GitHub Issues: Create issue for bugs/feature requests
