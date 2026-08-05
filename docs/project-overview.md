# Ikhtisar Proyek — Sobat Sabtu

Sobat Sabtu adalah platform komunitas olahraga (Bandung, Indonesia) untuk menyelenggarakan kegiatan kelompok di akhir pekan — lari, basket, mini soccer, dan sejenisnya. Situs ini menangani penemuan dan registrasi event publik, ditambah dashboard internal untuk staf mengelola event, member, dan kehadiran (attendance).

## Tumpukan Teknologi

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Styling**: Tailwind CSS v4
- **Animasi**: Framer Motion
- **Database/Backend**: Supabase (Postgres), diakses secara eksklusif melalui kunci `service_role` dari kode sisi server — lihat [database.md](./database.md)
- **Auth**: Auth berbasis JWT kustom untuk dashboard admin (`bcryptjs` + `jsonwebtoken`), token disimpan di sisi klien dalam `localStorage` (bukan cookies) — lihat [Model Auth](#model-auth) di bawah
- **Email**: Resend, dengan template React Email
- **Ikon**: `@iconify/react`, dibundel offline (lihat `scripts/generate-icons.mjs`) alih-alih diambil saat runtime
- **Grafik**: Recharts (khusus dashboard, diimpor secara dinamis)
- **Kode QR**: `qrcode` (pembuatan) dan `html5-qrcode` (pemindaian, khusus dashboard, diimpor secara dinamis)

## Struktur proyek

```
src/
  app/
    page.tsx                    Beranda publik (hero, kegiatan, tentang, kolaborasi)
    event/[id]/                 Detail event publik + registrasi (Server Component, lihat di bawah)
    admin/page.tsx              Halaman login admin
    dashboard/                  Dashboard staf (semua dirender di klien, memerlukan auth)
      page.tsx                  Ringkasan: statistik, grafik, pemindai QR kehadiran
      events/                   CRUD event
      members/                  Daftar member
      registrations/            Daftar registrasi + toggle kehadiran
    api/                        Route handler — lihat tabel di bawah
  components/
    sections/                   Bagian beranda (Hero, About, Activities, Collaboration, SocialMedia)
    layout/                     Navbar, Footer
    dashboard/                  Komponen khusus dashboard (grafik)
    ui/                         Primitive UI bersama + komponen fitur (RegistrationForm, ParticipantsTable, QRScannerModal, dll.)
    emails/                     Template React Email
  lib/                          Klien Supabase, helper auth, pengambilan data event, pengiriman email, utils
scripts/
  generate-icons.mjs            Regenerasi src/lib/iconify-offline-data.json — jalankan ulang setelah menambahkan penggunaan ikon baru
supabase/
  config.toml                   Konfigurasi proyek Supabase CLI
  migrations/                   Migrasi schema — lihat database.md
docs/                           Dokumentasi ini
```

### Rute API

| Rute | Tujuan |
|---|---|
| `POST /api/auth/login` | Login admin, mengembalikan JWT |
| `POST /api/auth/register` | Membuat akun admin (`ss_users`) |
| `GET/POST /api/events`, `GET/PUT/DELETE /api/events/[identifier]` | CRUD event (`identifier` menerima UUID atau slug) |
| `GET/POST /api/members`, `GET/PUT/DELETE /api/members/[id]`, `GET /api/members/search` | Manajemen member |
| `GET/POST /api/registrations`, `GET/PUT /api/registrations/[identifier]`, `PUT .../attendance-status` | Registrasi + kehadiran |
| `GET /api/dashboard/stats` | Ringkasan jumlah di dashboard |
| `GET /api/dashboard/{events,members,registrations}-chart` | Data grafik bulanan (cache 5 menit — lihat performance-audit.md) |
| `GET /api/dashboard/popular-events`, `/active-members` | Papan peringkat dashboard (cache / scoped query — lihat performance-audit.md) |
| `POST /api/images` | Mengunggah gambar event ke Supabase Storage (bucket `ss_images`) |

## Model Auth

Ada dua permukaan auth yang sengaja dibuat berbeda:

1. **Situs publik** (`/`, `/event/[id]`) — tanpa auth. Siapa pun dapat melihat event dan mendaftar.
2. **Dashboard admin** (`/admin`, `/dashboard/*`) — auth kustom: `POST /api/auth/login` memeriksa kredensial terhadap `ss_users` dan mengembalikan JWT; klien mengenkripsinya (melalui `crypto-js`) dan menyimpannya di `localStorage` (`src/lib/auth.ts`: `saveAuth`/`getAuth`/`isAuthenticated`). Setiap halaman dashboard memeriksa `isAuthenticated()` di sisi klien saat mount dan mengarahkan kembali ke `/admin` jika gagal.

**Implikasi penting**: karena sesi berada di `localStorage`, tidak ada halaman dashboard yang dapat menjadi Server Component (Server Component tidak memiliki akses ke `localStorage` browser). Inilah sebabnya setiap halaman `/dashboard*` adalah `'use client'` dan mengambil datanya melalui `useEffect` alih-alih saat render di server — lihat [performance-audit.md](./performance-audit.md) untuk alasan lengkapnya dan apa yang diperlukan untuk mengubahnya (migrasi cookie/sesi, bukan sekadar perubahan kode).

`/event/[id]` tidak memiliki kendala seperti itu (tidak memerlukan auth), itulah mengapa halaman tersebut menjadi satu-satunya yang dikonversi menjadi Server Component sungguhan.

## Variabel lingkungan

Diatur di `.env.local` (tidak pernah di-commit):

| Variabel | Digunakan untuk |
|---|---|
| `NEXT_PUBLIC_APP_URL` | URL dasar untuk metadata (`metadataBase`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role Supabase (khusus sisi server, melewati RLS) |
| `JWT_SECRET` | Menandatangani JWT auth admin |
| `NEXT_PUBLIC_AUTH_SECRET` | Mengenkripsi JWT sebelum disimpan di `localStorage` |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME` | Email konfirmasi registrasi |
| `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_TWITTER`, `NEXT_PUBLIC_TIKTOK`, `NEXT_PUBLIC_STRAVA`, `NEXT_PUBLIC_SPOTIFY` | Tautan kontak/sosial yang ditampilkan di UI |

## Skrip

| Perintah | Tujuan |
|---|---|
| `npm run dev` | Menjalankan server dev (Turbopack) |
| `npm run build` | Build produksi |
| `npm start` | Menyajikan build produksi |
| `npm run lint` | ESLint |
| `npm run generate-icons` | Regenerasi `src/lib/iconify-offline-data.json` setelah menambahkan penggunaan `<Icon icon="...">` baru |

## Dokumen terkait

- [database.md](./database.md) — schema, migrasi, RLS
- [performance-audit.md](./performance-audit.md) — audit performa 2026-07: temuan, perbaikan, hasil
