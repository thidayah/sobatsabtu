# Project Overview — Sobat Sabtu

Sobat Sabtu is a sports community platform (Bandung, Indonesia) for organizing weekend group activities — running, basketball, mini soccer, and similar. The site handles public event discovery and registration, plus an internal dashboard for staff to manage events, members, and attendance.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Database/Backend**: Supabase (Postgres), accessed exclusively through the `service_role` key from server-side code — see [database.md](./database.md)
- **Auth**: Custom JWT-based auth for the admin dashboard (`bcryptjs` + `jsonwebtoken`), token stored client-side in `localStorage` (not cookies) — see [Auth model](#auth-model) below
- **Email**: Resend, with React Email templates
- **Icons**: `@iconify/react`, bundled offline (see `scripts/generate-icons.mjs`) rather than fetched at runtime
- **Charts**: Recharts (dashboard only, dynamically imported)
- **QR codes**: `qrcode` (generation) and `html5-qrcode` (scanning, dashboard only, dynamically imported)

## Project structure

```
src/
  app/
    page.tsx                    Public homepage (hero, activities, about, collaboration)
    event/[id]/                 Public event detail + registration (Server Component, see below)
    admin/page.tsx               Admin login page
    dashboard/                   Staff dashboard (all client-rendered, requires auth)
      page.tsx                   Overview: stats, charts, QR attendance scanner
      events/                    Event CRUD
      members/                   Member list
      registrations/             Registration list + attendance toggle
    api/                         Route handlers — see table below
  components/
    sections/                    Homepage sections (Hero, About, Activities, Collaboration, SocialMedia)
    layout/                      Navbar, Footer
    dashboard/                   Dashboard-only components (charts)
    ui/                          Shared UI primitives + feature components (RegistrationForm, ParticipantsTable, QRScannerModal, etc.)
    emails/                      React Email templates
  lib/                           Supabase client, auth helpers, events data-fetching, email sending, utils
scripts/
  generate-icons.mjs             Regenerates src/lib/iconify-offline-data.json — rerun after adding a new icon usage
supabase/
  config.toml                   Supabase CLI project config
  migrations/                    Schema migrations — see database.md
docs/                            This documentation
```

### API routes

| Route | Purpose |
|---|---|
| `POST /api/auth/login` | Admin login, returns JWT |
| `POST /api/auth/register` | Create an admin (`ss_users`) account |
| `GET/POST /api/events`, `GET/PUT/DELETE /api/events/[identifier]` | Event CRUD (`identifier` accepts UUID or slug) |
| `GET/POST /api/members`, `GET/PUT/DELETE /api/members/[id]`, `GET /api/members/search` | Member management |
| `GET/POST /api/registrations`, `GET/PUT /api/registrations/[identifier]`, `PUT .../attendance-status` | Registration + attendance |
| `GET /api/dashboard/stats` | Dashboard summary counts |
| `GET /api/dashboard/{events,members,registrations}-chart` | Monthly chart data (cached 5 min — see performance-audit.md) |
| `GET /api/dashboard/popular-events`, `/active-members` | Dashboard leaderboards (cached / query-scoped — see performance-audit.md) |
| `POST /api/images` | Uploads event images to Supabase Storage (`ss_images` bucket) |

## Auth model

There are two, deliberately different, auth surfaces:

1. **Public site** (`/`, `/event/[id]`) — no auth. Anyone can view events and register.
2. **Admin dashboard** (`/admin`, `/dashboard/*`) — custom auth: `POST /api/auth/login` checks credentials against `ss_users` and returns a JWT; the client encrypts it (via `crypto-js`) and stores it in `localStorage` (`src/lib/auth.ts`: `saveAuth`/`getAuth`/`isAuthenticated`). Every dashboard page checks `isAuthenticated()` client-side on mount and redirects to `/admin` if it fails.

**Important implication**: because the session lives in `localStorage`, none of the dashboard pages can be Server Components (a Server Component has no access to the browser's `localStorage`). This is why every `/dashboard*` page is `'use client'` and fetches its data via `useEffect` rather than at render time on the server — see [performance-audit.md](./performance-audit.md) for the full reasoning and what would be required to change it (a cookie/session migration, not just a code change).

`/event/[id]` has no such constraint (no auth needed), which is why it's the one page that was converted to a real Server Component.

## Environment variables

Set in `.env.local` (never committed):

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Base URL for metadata (`metadataBase`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only, bypasses RLS) |
| `JWT_SECRET` | Signs the admin auth JWT |
| `NEXT_PUBLIC_AUTH_SECRET` | Encrypts the JWT before storing it in `localStorage` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME` | Registration confirmation emails |
| `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_TWITTER`, `NEXT_PUBLIC_TIKTOK`, `NEXT_PUBLIC_STRAVA`, `NEXT_PUBLIC_SPOTIFY` | Contact/social links shown in the UI |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run generate-icons` | Regenerate `src/lib/iconify-offline-data.json` after adding a new `<Icon icon="...">` usage |

## Related docs

- [database.md](./database.md) — schema, migrations, RLS
- [performance-audit.md](./performance-audit.md) — the 2026-07 performance audit: findings, fixes, results
