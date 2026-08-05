# Strategi SEO

Dokumen ini merinci strategi optimasi mesin pencari (SEO) untuk Sobat Sabtu (`sobatsabtu.runminders.com`). Fokus pada kata kunci long-tail lokal dengan target utama Bandung — perluasan ke Jakarta direncanakan sebagai fase lanjutan. Semua optimasi diterapkan pada halaman yang sudah ada (homepage + halaman detail event), tanpa membuat halaman konten atau artikel baru.

## Target kata kunci

Mengingat volume dan persaingan yang realistis, target dibagi menjadi tiga tingkatan:

| Tingkat | Kata kunci | Volume (estimasi) | Persaingan |
|---|---|---|---|
| **Primer** | `komunitas lari bandung`, `komunitas olahraga bandung`, `komunitas lari sabtu bandung` | Menengah | Rendah — Menengah |
| **Sekunder** | `event lari bandung`, `lari sabtu bandung`, `komunitas lari anak muda bandung`, `running community bandung` | Rendah — Menengah | Rendah |
| **Tersier** | `komunitas badminton bandung`, `sports community bandung`, `saturday run bandung` | Rendah | Rendah |

Kata kunci tunggal seperti `lari` atau `bandung` **tidak ditarget** karena persaingan sangat berat dan tidak realistis untuk situs skala ini. Fokus long-tail memungkinkan peringkat 10 besar dalam jangka waktu 3–6 bulan.

## Ringkasan temuan audit (2026-08)

Audit dilakukan terhadap codebase Next.js (`src/app/`, `src/components/`), domain produksi `sobatsabtu.runminders.com`, dan struktur halaman publik.

### Yang sudah baik

| Aspek | Detail |
|---|---|
| Metadata root | `title`, `description`, `keywords`, `openGraph`, `twitter`, `alternates.canonical`, `metadataBase` (`layout.tsx:16-47`) |
| Metadata event | `generateMetadata()` di `event/[id]/page.tsx:12-34` — title, description, OG image |
| `lang` | `html lang="id"` (`layout.tsx:49`) |
| Manifest | `src/app/manifest.json` — name, icons, theme_color |
| Favicon/icon | File konvensi (`favicon.ico`, `icon0.svg`, `icon1.png`, `apple-icon.png`) auto-dideteksi Next.js |
| Halaman event | 100% Server Component — konten dapat di-crawl oleh mesin pencari |

### Celah yang harus diperbaiki

| Celah | Dampak |
|---|---|
| **Tidak ada `sitemap.xml`** | Mesin pencari tidak tahu halaman mana yang ada; crawler hanya menemukan halaman melalui tautan internal (yang sangat minim di situs ini) |
| **Tidak ada `robots.txt`** | Kontrol crawl tidak ada; tidak bisa menunjuk sitemap ke mesin pencari |
| **Tidak ada `not-found.tsx` global** | Halaman 404 tidak memberikan sinyal yang baik ke pengguna maupun crawler |
| **Tidak ada JSON-LD / structured data** | Hasil pencarian tidak memiliki rich snippets (logo organisasi, informasi event, tanggal, lokasi) — kehilangan keunggulan visual di SERP |
| **`h1` homepage dinamis** | `Hero.tsx` menampilkan nama brand event ("Hello Kept", "Share Your Distance") sebagai `h1` yang berubah setiap 7,5 detik — tidak ada `h1` stabil yang mengandung kata kunci "lari" atau "Bandung" |
| **Kegiatan homepage client-side** | `Activities.tsx` memuat daftar event via `useEffect` → daftar event tidak ada di HTML awal → konten tidak dapat di-crawl oleh mesin pencari |
| **Tanpa canonical per event** | `generateMetadata` event tidak mencantumkan `alternates.canonical` — URL slug/UUID riskan duplikat |

## Rencana implementasi

Implementasi dibagi menjadi empat fase yang dapat dikerjakan secara bertahap. Fase 5 (off-page) berada di luar lingkup kode.

### Fase 1 — Fondasi indexability

Membangun infrastruktur agar mesin pencari dapat menemukan, membaca, dan mengindeks seluruh halaman publik dengan benar.

#### 1a. Sitemap dinamis

Buat `src/app/sitemap.ts` dengan rute App Router:

- Homepage (`/`) — `priority: 1.0`, `changeFrequency: 'daily'`
- Semua event publik (`/event/<slug>`) — `priority: 0.8`, `changeFrequency: 'weekly'`, `lastModified` dari `updated_at`
- Halaman dashboard/admin **tidak** dimasukkan

Sitemap memerlukan fungsi baru `getAllEvents()` di `src/lib/events.ts` yang mengambil slug dan `updated_at` untuk semua event `is_active=true` dari Supabase.

**File**: `src/app/sitemap.ts` (baru), `src/lib/events.ts` (tambah `getAllEvents`)

#### 1b. Robots.txt

Buat `src/app/robots.ts`:

```
User-agent: *
Allow: /
Sitemap: https://sobatsabtu.runminders.com/sitemap.xml
```

Next.js App Router otomatis menyajikan ini di `/robots.txt`.

**File**: `src/app/robots.ts` (baru)

#### 1c. Halaman 404 global

Buat `src/app/not-found.tsx` yang menampilkan pesan ramah, tautan kembali ke homepage, dan CTA — berbeda dengan `event/[id]/not-found.tsx` yang sudah ada dan khusus untuk event.

**File**: `src/app/not-found.tsx` (baru)

#### 1d. Metadata root — field tambahan

Lengkapi objek `metadata` di `src/app/layout.tsx` dengan field yang belum ada:

- `icons`: `{ icon: '/icon0.svg', apple: '/apple-icon.png' }`
- `manifest`: `'/manifest.json'`
- `robots`: `{ index: true, follow: true }`

**File**: `src/app/layout.tsx`

### Fase 2 — On-page homepage

#### 2a. `h1` statis ber-kata kunci

Ubah struktur `Hero.tsx`:

- `h1` menjadi heading statis, misalnya **"Komunitas Lari & Olahraga Anak Muda Bandung"**
- Animasi slideshow yang semula di `h1` dipindahkan ke elemen `h2` atau tagline di bawah `h1`
- Slideshow tetap berjalan normal — hanya perubahan markup, bukan fungsionalitas

**Alasan**: mesin pencari memberi bobot tinggi pada teks `h1`. `h1` dinamis yang berisi nama brand event tidak membawa nilai SEO.

**File**: `src/components/sections/Hero.tsx`

#### 2b. Perkaya copy section

Tambahkan frasa kunci secara alami di heading dan teks:

- `About.tsx` h2 "More Than Just / A Sports Community" → tambah "Bandung" di subjudul
- Pastikan kata "komunitas", "lari", dan "olahraga" muncul di teks paragraf

**File**: `src/components/sections/About.tsx`

#### 2c. Metadata homepage eksplisit

Pertimbangkan `metadata` eksplisit di `src/app/page.tsx` jika perlu judul/deskripsi yang lebih spesifik dari root layout (saat ini homepage mewarisi root metadata — sudah cukup baik; override hanya jika ingin title berbeda).

### Fase 3 — Halaman event

#### 3a. Daftar event homepage via SSR

`Activities.tsx` saat ini memuat daftar event melalui `fetch('/api/events?...')` di `useEffect`. Ubah pola menjadi server fetch → props, mengikuti pola yang sudah ada di `event/[id]`:

1. `src/app/page.tsx` memanggil `getAllEvents()` (fungsi yang sama dari Fase 1a) sebagai Server Component
2. Data event diteruskan sebagai props ke komponen client `Activities`
3. `Activities.tsx` menghapus `useEffect` fetch dan menggunakan data dari props

**Hasil**: daftar event muncul di HTML awal homepage — konten dapat di-crawl, sinyal relevansi lebih kuat.

**File**: `src/app/page.tsx`, `src/components/sections/Activities.tsx`

#### 3b. Canonical per event

Tambahkan `alternates.canonical` di `generateMetadata` event (`src/app/event/[id]/page.tsx`) menggunakan URL berbasis slug:

```
/event/<slug>
```

Konsisten dengan `ActivityCard.tsx` yang sudah menggunakan slug untuk link publik. Mencegah duplikat indeks antara URL `/event/<uuid>` dan `/event/<slug>`.

**File**: `src/app/event/[id]/page.tsx`

### Fase 4 — Structured data (JSON-LD)

JSON-LD memberikan mesin pencari data terstruktur yang digunakan untuk rich snippets — elemen visual tambahan di hasil pencarian (logo, rating, tanggal event, lokasi).

#### 4a. Organization di homepage

Tambahkan `<script type="application/ld+json">` di root layout atau homepage dengan skema [`Organization`](https://schema.org/Organization) / [`SportsClub`](https://schema.org/SportsClub):

- `name`: "Sobat Sabtu"
- `url`: "https://sobatsabtu.runminders.com"
- `logo`: "/images/sobatsabtu.jpg"
- `areaServed`: "Bandung, Indonesia"
- `sameAs`: tautan ke Instagram, WhatsApp, Spotify, Strava (dari env `NEXT_PUBLIC_*`)
- `description`: sama dengan metadata description

#### 4b. SportsEvent per halaman event

Tambahkan `<script type="application/ld+json">` di `src/app/event/[id]/page.tsx` (Server Component) dengan skema [`SportsEvent`](https://schema.org/SportsEvent) / [`Event`](https://schema.org/Event):

| Field JSON-LD | Sumber dari kolom |
|---|---|
| `name` | `event.name` |
| `startDate` | `event.date` + `event.time` (format ISO 8601) |
| `location.name` | `event.location` |
| `location.url` | `event.location_url` (jika ada) |
| `image` | `event.image_url` |
| `description` | `event.descriptions` |
| `url` | `/event/<slug>` (canonical) |
| `organizer` | referensi ke Organization di atas |
| `eventAttendanceMode` | `OfflineEventAttendanceMode` |
| `maximumAttendeeCapacity` | `event.max_participants` (jika > 0) |

Untuk komponen JSON-LD yang reusable, buat `src/components/ui/JsonLd.tsx` — menerima objek data dan merender `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`.

**File**: `src/app/layout.tsx`, `src/app/event/[id]/page.tsx`, `src/components/ui/JsonLd.tsx` (baru)

### Fase 5 — Off-page & Search Console

Fase ini tidak melibatkan perubahan kode. Dilakukan secara manual:

| Langkah | Detail |
|---|---|
| **Google Search Console** | Daftarkan `sobatsabtu.runminders.com` sebagai properti; verifikasi via DNS TXT (tidak perlu perubahan kode); submit sitemap setelah Fase 1 selesai |
| **Bing Webmaster Tools** | Daftarkan untuk cakupan pencarian tambahan (~5% pangsa pasar Indonesia) |
| **Google Business Profile** | Buat profil bisnis Sobat Sabtu dengan NAP konsisten (nama, alamat Bandung, nomor kontak) — meningkatkan sinyal lokal |
| **Backlink** | Tautan dari profil Instagram (yang sudah ada), direktori komunitas lari/olahraga, kolaborasi brand (Kept, Dyno, Huricane), artikel influencer lokal Bandung |
| **Internal linking** | Pastikan setiap halaman publik tertaut dari halaman lain — homepage → semua event aktif (sudah ada via `Activities`/`ActivityCard`) |

## Verifikasi

### Build & typecheck

```bash
npm run build
```

Pastikan tidak ada error — `sitemap.ts` dan `robots.ts` harus dikenali oleh Next.js App Router.

### Sitemap & robots

Kunjungi `https://sobatsabtu.runminders.com/sitemap.xml` — harus berisi:

- `<url>` untuk `/` (priority 1.0)
- `<url>` untuk `/event/<slug>` untuk setiap event aktif (priority 0.8)

Kunjungi `https://sobatsabtu.runminders.com/robots.txt` — harus menunjuk ke sitemap.

### HTML awal (view-source)

Buka `view-source:https://sobatsabtu.runminders.com` — pastikan:

- Ada 1 `<h1>` statis dengan kata kunci
- Daftar event muncul sebagai teks/tautan di HTML (bukan hanya di-load via JS)
- `<script type="application/ld+json">` ada dengan konten Organization

### JSON-LD

Validasi URL homepage dan halaman event di [Google Rich Results Test](https://search.google.com/test/rich-results-tester). Tidak boleh ada error atau warning.

### Lighthouse

Jalankan Lighthouse audit (desktop + mobile) pada homepage dan halaman event — target skor SEO ≥ 90.

### Search Console

- Submit sitemap di Google Search Console
- Gunakan URL Inspection untuk meminta indeks homepage + 1-2 event
- Pantau "URL is on Google" dalam beberapa jam/hari

## Dokumen terkait

- [project-overview.md](./project-overview.md) — ikhtisar proyek, tumpukan teknologi, model auth
- [database.md](./database.md) — schema, migrasi, RLS
- [performance-audit.md](./performance-audit.md) — audit performa 2026-07 dan perbaikannya
