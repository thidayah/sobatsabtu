# Performance Audit (2026-07)

A full performance audit of sobatsabtu, covering bundle size, asset/rendering strategy, API/database query patterns, and Core Web Vitals. 14 findings, 13 fixed across 8 PRs, 1 explicitly skipped pending an infrastructure decision.

## Results

Measured with Lighthouse (desktop preset) against a production build of the homepage (`/`):

| Metric | Before | After |
|---|---|---|
| Performance score | 66 | **98** |
| LCP (Largest Contentful Paint) | 7.5s | **1.1s** |
| TTI (Time to Interactive) | 7.7s | 1.3s |
| Speed Index | 4.1s | 0.8s |
| Total Blocking Time | 40ms | 0ms |
| Total page weight | 34.7MB | **1.4MB** |

## Methodology

- **Bundle size**: `@next/bundle-analyzer` (devDependency, `ANALYZE=true npx next build --webpack` — Turbopack builds don't support the analyzer).
- **Core Web Vitals**: `npx lighthouse` against `npm start` (a real production build; `next dev` isn't representative).
- **API/DB**: manual read-through of every route handler, plus direct read-only queries against the live Supabase project to verify assumptions (e.g. whether aggregate functions were available — see finding #6) rather than guessing.
- Every fix was verified before merging: build + typecheck, a direct before/after comparison of actual API responses where a response shape changed, and manual testing in a browser.

## Findings & fixes

### 1. `recharts` + `html5-qrcode` loaded on every route, including the homepage

`src/app/dashboard/page.tsx` statically imported both libraries. Next's shared-chunk optimization put them in a chunk loaded by **every page**, not just the dashboard pages that use them — confirmed via bundle analysis and Lighthouse showing 37-52% unused JS in the homepage's chunks.

**Fix**: extracted the chart JSX into `src/components/dashboard/DashboardCharts.tsx` and loaded both it and `QRScannerModal` via `next/dynamic({ ssr: false })`. Verified afterward that neither library's code appears anywhere in the homepage's JS payload.
PR: [#47](https://github.com/thidayah/sobatsabtu/pull/47)

### 2. Homepage autoplayed ~35MB of video on page load

`src/components/sections/About.tsx`'s gallery had 4 raw `.MP4` files (~35MB combined) with `autoPlay`, downloading immediately regardless of whether the user ever scrolled to that section. This was the dominant contributor to the original 7.5s LCP.

**Fix**: the section already tracked visibility via framer-motion's `useInView` for its entrance animation — reused that same signal to gate mounting the `<video>` element, so it only starts downloading/playing once scrolled into view.
PR: [#49](https://github.com/thidayah/sobatsabtu/pull/49)

### 3. `next/image` unused everywhere + unoptimized remote images

0 of 7 `<img>` usages used `next/image`; several images were hotlinked from `images.unsplash.com`/`i.ibb.co.com` at full resolution. Investigation during the fix also surfaced `Hero.tsx`'s full-viewport background slideshow (a CSS `background-image`, not an `<img>` tag, so outside the original 7) as the single largest contributor to page weight (~2MB) — it sits directly behind the LCP element, so it was included in the same fix with explicit sign-off.

**Fix**: migrated every image (Hero background, About gallery, Navbar/Footer logos, Collaboration background, ActivityCard, event detail page, dashboard EventModal preview) to `next/image`, and added `images.remotePatterns` in `next.config.ts` for Supabase Storage / Unsplash / ibb.co. The admin `EventModal` preview uses `unoptimized` since staff can paste an arbitrary image URL there, which a remote-pattern allowlist can't accommodate.
PR: [#50](https://github.com/thidayah/sobatsabtu/pull/50)

**This was the single biggest win of the audit** — combined with #2, it took LCP from 3.6s to 1.3s and page weight from 12MB to 4.7MB in isolation; combined with every other fix, the homepage's final total page weight is 1.4MB.

### 4. All dashboard pages are Client Components with a client-side fetch waterfall

`/dashboard*`, `/admin`, and `/event/[id]` were all `'use client'`, fetching data via `useEffect` after mount (blank shell → JS parse → fetch → render) instead of having data present in the initial HTML.

**This finding was rescoped after investigation.** The admin dashboard's auth session lives in `localStorage` (see [project-overview.md](./project-overview.md#auth-model)), which a Server Component cannot read — converting `/dashboard*` to SSR would require migrating to a cookie-based session first, which is a real architecture decision (affects the login flow, needs middleware for route protection) and out of scope for a performance-only pass. `/event/[id]` has no auth requirement, so it was converted to a genuine Server Component instead: the Supabase lookup was extracted to `src/lib/events.ts` (shared with the API route), `generateMetadata()` was added for per-event Open Graph/Twitter tags, and the interactive/animated JSX was moved into a client child component (`EventDetailClient.tsx`) that receives server-fetched data as props. `loading.tsx`/`not-found.tsx` replaced the old client-side loading/error state.

A latent, pre-existing CSS bug was found and fixed while testing this (confirmed identical in `develop` before the change, so not a regression from the SSR conversion): the event image column relied on `aspect-ratio` + `max-width` with no definite width, and its only content was `position:absolute` elements that don't contribute to parent sizing, so the box could collapse to 0×0. Fixed with an explicit `md:w-[400px] md:shrink-0`.

PR: [#54](https://github.com/thidayah/sobatsabtu/pull/54)

### 5. `/api/members` fetched the entire filtered table, paginated in JS

No `.range()` call — pagination happened in-memory after fetching every row matching the filter, growing unbounded with table size.

**Fix**: when sorting by `created_at` (the default, a native column), filtering/sorting/pagination all happen at the database level via `.order()`/`.range()`, and registrations are only fetched for the members on that page. Sorting by `total_events` (a value computed from a join, not a column) still requires fetching the full filtered set — see finding #6 for why this can't be pushed to the database either, and this is documented in a code comment.
PR: [#51](https://github.com/thidayah/sobatsabtu/pull/51)

### 6. `/api/dashboard/active-members` — explicitly skipped

Pulls every `confirmed` registration in the selected date range (joined with member columns) to compute a top-5 leaderboard in JS. Properly fixing this means pushing a `GROUP BY`/count aggregation into Postgres.

**Investigated, not fixed.** Tested directly against the live Supabase project (a read-only `SELECT`) and confirmed PostgREST aggregate functions are disabled for this project (`PGRST123: Use of aggregate functions is not allowed`) — this requires either a Supabase project setting change (`db-aggregates-enabled`) or a hand-written Postgres RPC function, neither of which is a pure application-code change. Deferred: the endpoint is already bounded by its date-range filter, which keeps it reasonably efficient at current data volumes.

### 7. `/api/dashboard/stats` ran 4 independent count queries sequentially

Quadrupling round-trip latency for no reason — the 4 queries don't depend on each other.

**Fix**: `Promise.all([...])`.
PR: [#47](https://github.com/thidayah/sobatsabtu/pull/47)

### 8. `/api/registrations` POST re-fetched data already in memory

After creating a registration, the handler re-queried the database (with full `event`/`member` joins) for data it already had from earlier in the same request.

**Fix**: assemble the response from the already-fetched `registration`, `event`, and `memberData` objects instead of an extra round trip.

Two real bugs were found only by comparing actual before/after JSON responses against real test data (not by build/typecheck), which is worth remembering as a pattern for this kind of refactor: `event.updated_at` and `event_remaining_slots` both silently drifted from what a fresh DB read would have returned, because they depend on a DB-side update (`current_participants`/`updated_at`) that the in-memory objects hadn't been refreshed with. Fixed by re-deriving both from the `update().select().single()` return value rather than hand-computing them. It's also worth checking whether the frontend consumer even reads the fields in question before deciding how much correctness effort a response shape deserves — `RegistrationForm.tsx` turned out to only ever read `success`/`message`/`error` from this endpoint's response, ignoring `data` entirely.
PR: [#47](https://github.com/thidayah/sobatsabtu/pull/47)

### 9. Dashboard chart endpoints re-queried and re-aggregated on every request

`events-chart`, `popular-events`, and `members-chart` serve historical/aggregate data that rarely changes intra-day, but hit Supabase and re-aggregated in JS on every single request.

**Fix**: wrapped each route's data-fetching logic with `unstable_cache` (`revalidate: 300`), keyed automatically by the request's `year`/`month`/`limit` params. `registrations-chart` was left untouched — it's dead code, not called from anywhere in the frontend (only a commented-out `fetch` in `dashboard/page.tsx`). Verified: repeat requests for the same params dropped from ~90-900ms to ~12-15ms; different params correctly miss the cache instead of returning stale data.
PR: [#53](https://github.com/thidayah/sobatsabtu/pull/53)

### 10. Over-fetching columns (`select('*')`)

`/api/auth/login` selected every column on `ss_users` just to check credentials; `/api/registrations` GET selected every column (plus full nested joins) for a paginated list view.

**Fix**: scoped both to the columns actually consumed — `id, email, name, password, is_active` for login (the frontend's `getAuth()` only ever reads `.name`/`.email`), and the specific fields rendered by `dashboard/registrations/page.tsx` and `ParticipantsTable.tsx` for the registrations list.
PR: [#48](https://github.com/thidayah/sobatsabtu/pull/48)

### 11-14. Confirmed via measurement, not independently fixed

These were secondary findings that Lighthouse surfaced as evidence for the fixes above, rather than separate work items:

- **LCP render delay (7.4s, 98% of LCP time)** on the original homepage was caused by network contention from findings #1 and #2 combined, not JS execution time (main-thread work measured only 1.6s) — resolved as a side effect of fixing those two.
- **Unoptimized/hotlinked remote images** — same root cause as #3, resolved by the same fix.
- **Iconify runtime API calls**: `@iconify/react` fetched icon SVG data from `api.iconify.design`/`api.simplesvg.com` on every page load (3+ requests on the homepage alone). Fixed by extracting the 59 icons actually used app-wide into a ~17KB static JSON (`scripts/generate-icons.mjs` → `src/lib/iconify-offline-data.json`) and registering them once via `addCollection()` — zero runtime icon API calls afterward. (This one *was* independently fixed, PR [#52](https://github.com/thidayah/sobatsabtu/pull/52), included here as it was a lower-priority item alongside the others.)
- **Unused JS in shared chunks** on the homepage (37-52%) — same root cause as #1, resolved by the same fix.

## What's left

Nothing performance-critical. If revisited:
- Finding #6 needs a decision on enabling Supabase's `db-aggregates-enabled` setting or writing a Postgres RPC.
- Full dashboard SSR (beyond `/event/[id]`) needs a cookie-based session migration first.
