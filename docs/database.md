# Database

Sobat Sabtu uses Supabase (Postgres). The Supabase project ("Share Your Distance", ref `biyurtytnwlmxuninybb`) is **shared with other, unrelated apps** — as of 2026-07-20 the live database has 16 tables in `public`, but only the 4 documented below (prefixed `ss_`) belong to this project. Migrations in this repo only ever touch `ss_*` tables; the other tables are out of scope and should never be referenced from this codebase.

All access goes through `src/lib/supabase.ts`'s `supabaseServer` client, authenticated with the `service_role` key, from server-side code only (API routes, Server Components). The browser never talks to Supabase directly.

## Schema

### `ss_events`

One row per event (a Saturday run, a basketball session, etc.).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | `gen_random_uuid()` |
| `name` | varchar(255) | |
| `descriptions` | text | default `''` |
| `slug` | varchar(255) | unique — events are addressable by slug or id (see `checkUUID` in `src/lib/utils.ts` / `src/lib/events.ts`) |
| `image_url` | text | Supabase Storage URL (`ss_images` bucket) |
| `date` | date | |
| `time` | time | |
| `location`, `location_url` | text | |
| `current_participants`, `max_participants` | integer | `current_participants` is denormalized — incremented on registration, see `POST /api/registrations` |
| `type` | varchar(100) | e.g. `ASMR`, freeform |
| `is_active` | boolean | default true |
| `external_url` | text | optional external registration link |
| `created_at`, `updated_at` | timestamptz | |

Indexes: `date`, `(date, is_active)`, `is_active`, `slug` (also unique), `type`.

### `ss_members`

One row per person who has ever registered for an event (not a user account — no login).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `full_name` | varchar(255) | |
| `email` | varchar(255) | unique |
| `ig_username` | varchar(100) | nullable |
| `gender` | varchar(20) | nullable |
| `emergency_contact_name`, `emergency_contact_phone` | varchar | required |
| `medical_notes` | text | nullable |
| `is_active` | boolean | default true — internally referred to as "untalented" status in some API comments; toggled by staff, unrelated to event registration status |
| `created_at`, `updated_at` | timestamptz | |

Indexes: `email` (also unique), `full_name`, `ig_username`, `is_active`.

### `ss_registrations`

Join table between a member and an event, one row per registration.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `event_id` | uuid, FK → `ss_events(id)` | `ON DELETE CASCADE` |
| `member_id` | uuid, FK → `ss_members(id)` | `ON DELETE CASCADE` |
| `code` | varchar(50) | unique registration code, emailed to the member |
| `status` | varchar(50) | `pending` \| `confirmed` \| `cancelled` \| `waiting` (enforced by a CHECK constraint) |
| `is_attendance` | boolean | default false — set via the dashboard's QR scanner or manual toggle |
| `created_at`, `updated_at` | timestamptz | |

Indexes: `code`, `event_id`, `member_id`, `status`, `(event_id, status)`, and a **partial unique index** on `(event_id, member_id)` filtered to `status IN ('pending', 'confirmed')` — this enforces "one active registration per member per event" at the database level, independent of the application-level duplicate check in `POST /api/registrations`.

### `ss_users`

Admin/staff accounts for the dashboard (see [Auth model](./project-overview.md#auth-model) in the overview doc).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `name`, `email` | varchar(255) | email unique |
| `password` | varchar(255) | bcrypt hash |
| `is_active` | boolean | default true |
| `last_login` | timestamptz | nullable, updated on login |
| `created_at`, `updated_at` | timestamptz | |

Indexes: `email` (also unique), `is_active`.

### Entity relationship

```
ss_members ──< ss_registrations >── ss_events

ss_users (standalone — dashboard auth only, no FK to the above)
```

## Row Level Security

All four tables have **RLS enabled with zero policies attached**. With RLS on and no policies, Postgres denies all access to every role except one that bypasses RLS — which is exactly the `service_role` key this app uses everywhere. In other words: even if the Supabase anon/public key were ever exposed in client code, these tables would be completely unreadable and unwritable through it. This was verified against the live project, not assumed.

No triggers exist on any of the four tables (some of the *other* apps sharing this database have an `update_updated_at_column()` trigger; `ss_*` tables don't — `updated_at` is set explicitly by application code in each API route).

## Migrations

Schema lives in `supabase/migrations/*.sql`, managed by the [Supabase CLI](https://supabase.com/docs/guides/cli).

- `20260720063537_baseline_schema.sql` — the initial baseline, reverse-engineered from the live database via `pg_dump` (see [How this baseline was created](#how-this-baseline-was-created) below) and scoped to only the 4 `ss_*` tables.

### Local setup

```bash
supabase login                                    # one-time, opens a browser
supabase link --project-ref biyurtytnwlmxuninybb  # one-time per machine
```

### Making a schema change going forward

1. `supabase migration new <description>` to create a new empty migration file, or make the change directly in the Supabase SQL editor and pull it down (see caveat below).
2. Write the SQL change, scoped to `ss_*` tables only.
3. Test it — see the pattern used below (run against a throwaway schema on the *same* database, never against `public` directly, since this is a shared database and there's no separate staging project).
4. `supabase db push` to apply it to the live project, or apply it manually and then `supabase migration repair --status applied <version>` if you applied it out-of-band.

### Caveat: `supabase db pull` / `db dump` require Docker

Both commands use a local Docker container (a "shadow database") to safely diff schemas. **Docker Desktop is not set up in this environment as of 2026-07-20**, so the baseline migration was created manually instead:

```bash
PGPASSWORD='<db password>' pg_dump \
  --schema-only --schema=public --no-owner --no-privileges \
  -h aws-1-ap-southeast-1.pooler.supabase.com -p 6543 \
  -U postgres.biyurtytnwlmxuninybb -d postgres \
  -f schema-dump.sql
```

The direct connection host (`db.<ref>.supabase.co`) is IPv6-only and failed to resolve in this environment; the **session pooler** host (found via the dashboard's "Connect" button → Session pooler tab) worked instead. If Docker gets installed later, prefer `supabase db pull` going forward — it handles multi-app database noise and Supabase-internal schemas more cleanly than a manual `pg_dump`.

### How this baseline was created

The manual dump above included all 16 tables in `public` (this app's 4 plus 12 belonging to other apps on the same database). The migration file was hand-trimmed to only the `ss_*` tables, then validated by running it against a temporary Postgres schema on the *same live database* (`CREATE SCHEMA _migration_test; ...; DROP SCHEMA _migration_test CASCADE;`) to confirm every statement succeeds with no dependency-order issues, without touching real data. It was then registered as already-applied via `supabase migration repair --status applied 20260720063537`, since the tables already existed in `public` — this migration documents the existing schema, it doesn't create it from scratch.
