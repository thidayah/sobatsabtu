# Database

Sobat Sabtu menggunakan Supabase (Postgres). Proyek Supabase ("Share Your Distance", ref `biyurtytnwlmxuninybb`) **dipakai bersama dengan aplikasi lain yang tidak terkait** — per 2026-07-20 database live memiliki 16 tabel di `public`, tetapi hanya 4 tabel yang didokumentasikan di bawah ini (berawalan `ss_`) yang merupakan milik proyek ini. Migrasi di repo ini hanya menyentuh tabel `ss_*`; tabel lainnya berada di luar lingkup dan tidak boleh dirujuk dari codebase ini.

Semua akses dilakukan melalui klien `supabaseServer` di `src/lib/supabase.ts`, yang diautentikasi dengan kunci `service_role`, hanya dari kode sisi server (rute API, Server Components). Browser tidak pernah berkomunikasi langsung dengan Supabase.

## Schema

### `ss_events`

Satu baris per event (lari hari Sabtu, sesi basket, dll.).

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid, PK | `gen_random_uuid()` |
| `name` | varchar(255) | |
| `descriptions` | text | default `''` |
| `slug` | varchar(255) | unik — event dapat diakses melalui slug atau id (lihat `checkUUID` di `src/lib/utils.ts` / `src/lib/events.ts`) |
| `image_url` | text | URL Supabase Storage (bucket `ss_images`) |
| `date` | date | |
| `time` | time | |
| `location`, `location_url` | text | |
| `current_participants`, `max_participants` | integer | `current_participants` didenormalisasi — dinaikkan saat registrasi, lihat `POST /api/registrations` |
| `type` | varchar(100) | mis. `ASMR`, bentuk bebas |
| `is_active` | boolean | default true |
| `external_url` | text | tautan registrasi eksternal opsional |
| `created_at`, `updated_at` | timestamptz | |

Index: `date`, `(date, is_active)`, `is_active`, `slug` (juga unik), `type`.

### `ss_members`

Satu baris per orang yang pernah mendaftar event (bukan akun pengguna — tidak ada login).

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid, PK | |
| `full_name` | varchar(255) | |
| `email` | varchar(255) | unik |
| `ig_username` | varchar(100) | nullable |
| `gender` | varchar(20) | nullable |
| `emergency_contact_name`, `emergency_contact_phone` | varchar | wajib diisi |
| `medical_notes` | text | nullable |
| `is_active` | boolean | default true — di beberapa komentar API disebut secara internal sebagai status "untalented"; diubah oleh staf, tidak terkait dengan status registrasi event |
| `created_at`, `updated_at` | timestamptz | |

Index: `email` (juga unik), `full_name`, `ig_username`, `is_active`.

### `ss_registrations`

Tabel join antara member dan event, satu baris per registrasi.

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid, PK | |
| `event_id` | uuid, FK → `ss_events(id)` | `ON DELETE CASCADE` |
| `member_id` | uuid, FK → `ss_members(id)` | `ON DELETE CASCADE` |
| `code` | varchar(50) | kode registrasi unik, dikirim melalui email ke member |
| `status` | varchar(50) | `pending` \| `confirmed` \| `cancelled` \| `waiting` (dijamin oleh constraint CHECK) |
| `is_attendance` | boolean | default false — diatur melalui pemindai QR di dashboard atau toggle manual |
| `created_at`, `updated_at` | timestamptz | |

Index: `code`, `event_id`, `member_id`, `status`, `(event_id, status)`, dan **index unik parsial** pada `(event_id, member_id)` yang difilter ke `status IN ('pending', 'confirmed')` — ini memberlakukan "satu registrasi aktif per member per event" di tingkat database, terlepas dari pengecekan duplikat di tingkat aplikasi di `POST /api/registrations`.

### `ss_users`

Akun admin/staf untuk dashboard (lihat [Model Auth](./project-overview.md#model-auth) di dokumen overview).

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid, PK | |
| `name`, `email` | varchar(255) | email unik |
| `password` | varchar(255) | hash bcrypt |
| `is_active` | boolean | default true |
| `last_login` | timestamptz | nullable, diperbarui saat login |
| `created_at`, `updated_at` | timestamptz | |

Index: `email` (juga unik), `is_active`.

### Relasi antar entitas

```
ss_members ──< ss_registrations >── ss_events

ss_users (berdiri sendiri — hanya untuk auth dashboard, tidak ada FK ke tabel di atas)
```

## Row Level Security

Keempat tabel memiliki **RLS aktif tanpa policy apa pun yang terpasang**. Dengan RLS aktif dan tanpa policy, Postgres menolak semua akses untuk setiap role kecuali role yang melewati RLS — yang persis seperti kunci `service_role` yang digunakan aplikasi ini di mana-mana. Dengan kata lain: bahkan jika kunci anon/public Supabase bocor ke kode klien, tabel-tabel ini akan sepenuhnya tidak bisa dibaca dan ditulis melalui kunci tersebut. Hal ini telah diverifikasi terhadap proyek live, bukan sekadar asumsi.

Tidak ada trigger pada keempat tabel (beberapa aplikasi *lain* yang berbagi database ini memiliki trigger `update_updated_at_column()`; tabel `ss_*` tidak — `updated_at` diatur secara eksplisit oleh kode aplikasi di setiap rute API).

## Migrasi

Schema berada di `supabase/migrations/*.sql`, dikelola oleh [Supabase CLI](https://supabase.com/docs/guides/cli).

- `20260720063537_baseline_schema.sql` — baseline awal, direkayasa ulang dari database live melalui `pg_dump` (lihat [Cara baseline ini dibuat](#cara-baseline-ini-dibuat) di bawah) dan dibatasi hanya untuk 4 tabel `ss_*`.

### Setup lokal

```bash
supabase login                                    # satu kali, membuka browser
supabase link --project-ref biyurtytnwlmxuninybb  # satu kali per mesin
```

### Melakukan perubahan schema ke depannya

1. `supabase migration new <description>` untuk membuat file migrasi kosong baru, atau buat perubahannya langsung di SQL editor Supabase lalu tarik ke bawah (lihat catatan penting di bawah).
2. Tulis perubahan SQL, hanya dibatasi untuk tabel `ss_*`.
3. Uji — lihat pola yang digunakan di bawah (jalankan pada schema sementara di database yang *sama*, jangan pernah langsung terhadap `public`, karena ini adalah database bersama dan tidak ada proyek staging terpisah).
4. `supabase db push` untuk menerapkannya ke proyek live, atau terapkan secara manual lalu `supabase migration repair --status applied <version>` jika Anda menerapkannya di luar jalur (out-of-band).

### Catatan penting: `supabase db pull` / `db dump` membutuhkan Docker

Kedua perintah menggunakan kontainer Docker lokal (sebuah "shadow database") untuk membandingkan schema dengan aman. **Docker Desktop belum diatur di lingkungan ini per 2026-07-20**, sehingga migrasi baseline dibuat secara manual sebagai gantinya:

```bash
PGPASSWORD='<password db>' pg_dump \
  --schema-only --schema=public --no-owner --no-privileges \
  -h aws-1-ap-southeast-1.pooler.supabase.com -p 6543 \
  -U postgres.biyurtytnwlmxuninybb -d postgres \
  -f schema-dump.sql
```

Host koneksi langsung (`db.<ref>.supabase.co`) hanya IPv6 dan gagal di-resolve di lingkungan ini; host **session pooler** (ditemukan melalui tombol "Connect" di dashboard → tab Session pooler) yang berhasil digunakan. Jika Docker diinstal nanti, lebih baik gunakan `supabase db pull` ke depannya — perintah ini menangani kebisingan database multi-aplikasi dan schema internal Supabase dengan lebih bersih daripada `pg_dump` manual.

### Cara baseline ini dibuat

Dump manual di atas mencakup semua 16 tabel di `public` (4 tabel aplikasi ini ditambah 12 milik aplikasi lain di database yang sama). File migrasi dipangkas secara manual hanya untuk tabel `ss_*`, lalu divalidasi dengan menjalankannya terhadap schema Postgres sementara di *database live yang sama* (`CREATE SCHEMA _migration_test; ...; DROP SCHEMA _migration_test CASCADE;`) untuk memastikan setiap statement berhasil tanpa masalah urutan dependensi, tanpa menyentuh data asli. Migrasi tersebut kemudian didaftarkan sebagai sudah diterapkan melalui `supabase migration repair --status applied 20260720063537`, karena tabel-tabelnya sudah ada di `public` — migrasi ini mendokumentasikan schema yang sudah ada, bukan membuatnya dari nol.
