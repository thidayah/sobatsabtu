# Audit Performa (2026-07)

Audit performa menyeluruh untuk sobatsabtu, mencakup ukuran bundle, strategi aset/rendering, pola kueri API/database, dan Core Web Vitals. 14 temuan, 13 diperbaiki dalam 8 PR, 1 sengaja dilewati sambil menunggu keputusan infrastruktur.

## Hasil

Diukur dengan Lighthouse (preset desktop) terhadap build produksi dari halaman beranda (`/`):

| Metrik | Sebelum | Sesudah |
|---|---|---|
| Skor performa | 66 | **98** |
| LCP (Largest Contentful Paint) | 7.5s | **1.1s** |
| TTI (Time to Interactive) | 7.7s | 1.3s |
| Speed Index | 4.1s | 0.8s |
| Total Blocking Time | 40ms | 0ms |
| Total berat halaman | 34.7MB | **1.4MB** |

## Metodologi

- **Ukuran bundle**: `@next/bundle-analyzer` (devDependency, `ANALYZE=true npx next build --webpack` — build Turbopack tidak mendukung analyzer).
- **Core Web Vitals**: `npx lighthouse` terhadap `npm start` (build produksi sungguhan; `next dev` tidak representatif).
- **API/DB**: pembacaan manual pada setiap route handler, ditambah kueri langsung read-only terhadap proyek Supabase live untuk memverifikasi asumsi (mis. apakah fungsi agregat tersedia — lihat temuan #6) alih-alih menebak.
- Setiap perbaikan diverifikasi sebelum di-merge: build + typecheck, perbandingan langsung sebelum/sesudah terhadap respons API yang sebenarnya jika bentuk respons berubah, serta pengujian manual di browser.

## Temuan & perbaikan

### 1. `recharts` + `html5-qrcode` dimuat di setiap rute, termasuk halaman beranda

`src/app/dashboard/page.tsx` mengimpor kedua pustaka secara statis. Optimasi shared-chunk Next.js menempatkannya dalam chunk yang dimuat oleh **setiap halaman**, bukan hanya halaman dashboard yang menggunakannya — dikonfirmasi melalui analisis bundle dan Lighthouse yang menunjukkan 37-52% JS tidak terpakai di chunk halaman beranda.

**Perbaikan**: JSX grafik diekstrak ke `src/components/dashboard/DashboardCharts.tsx` dan keduanya beserta `QRScannerModal` dimuat melalui `next/dynamic({ ssr: false })`. Setelah itu diverifikasi bahwa kode kedua pustaka tersebut tidak muncul di mana pun dalam payload JS halaman beranda.
PR: [#47](https://github.com/thidayah/sobatsabtu/pull/47)

### 2. Beranda mengautoplay ~35MB video saat halaman dimuat

Galeri `src/components/sections/About.tsx` memiliki 4 file `.MP4` mentah (~35MB total) dengan `autoPlay`, yang langsung terunduh terlepas dari apakah pengguna pernah menggulir ke bagian tersebut. Ini adalah kontributor dominan terhadap LCP 7.5s semula.

**Perbaikan**: bagian tersebut sudah melacak visibilitas melalui `useInView` dari framer-motion untuk animasi masuknya — sinyal yang sama digunakan kembali untuk menggerbang pemasangan elemen `<video>`, sehingga video baru mulai mengunduh/berputar setelah digulir ke tampilan.
PR: [#49](https://github.com/thidayah/sobatsabtu/pull/49)

### 3. `next/image` tidak digunakan sama sekali + gambar remote yang tidak dioptimalkan

0 dari 7 penggunaan `<img>` menggunakan `next/image`; beberapa gambar di-hotlink dari `images.unsplash.com`/`i.ibb.co.com` pada resolusi penuh. Investigasi selama perbaikan juga menemukan slideshow latar belakang layar penuh di `Hero.tsx` (sebuah `background-image` CSS, bukan tag `<img>`, jadi di luar 7 yang semula) sebagai kontributor terbesar berat halaman (~2MB) — ia berada tepat di belakang elemen LCP, sehingga disertakan dalam perbaikan yang sama dengan persetujuan eksplisit.

**Perbaikan**: semua gambar (latar Hero, galeri About, logo Navbar/Footer, latar Collaboration, ActivityCard, halaman detail event, pratinjau EventModal dashboard) dimigrasikan ke `next/image`, dan `images.remotePatterns` ditambahkan di `next.config.ts` untuk Supabase Storage / Unsplash / ibb.co. Pratinjau `EventModal` admin menggunakan `unoptimized` karena staf dapat menempelkan URL gambar arbitrer di sana, yang tidak dapat ditampung oleh allowlist remote-pattern.

PR: [#50](https://github.com/thidayah/sobatsabtu/pull/50)

**Ini adalah kemenangan tunggal terbesar dari audit ini** — jika digabungkan dengan #2, LCP turun dari 3.6s menjadi 1.3s dan berat halaman dari 12MB menjadi 4.7MB secara terpisah; jika digabungkan dengan semua perbaikan lainnya, berat total halaman beranda akhir adalah 1.4MB.

### 4. Semua halaman dashboard adalah Client Component dengan waterfall fetch sisi klien

`/dashboard*`, `/admin`, dan `/event/[id]` semuanya `'use client'`, mengambil data melalui `useEffect` setelah mount (shell kosong → parse JS → fetch → render) alih-alih memiliki data yang tersedia di HTML awal.

**Temuan ini diubah cakupannya setelah investigasi.** Sesi auth dashboard admin berada di `localStorage` (lihat [project-overview.md](./project-overview.md#model-auth)), yang tidak dapat dibaca oleh Server Component — mengonversi `/dashboard*` ke SSR akan memerlukan migrasi ke sesi berbasis cookie terlebih dahulu, yang merupakan keputusan arsitektur nyata (memengaruhi alur login, memerlukan middleware untuk proteksi rute) dan di luar cakupan untuk proses khusus performa. `/event/[id]` tidak memiliki persyaratan auth, sehingga dikonversi menjadi Server Component sungguhan sebagai gantinya: pencarian Supabase diekstrak ke `src/lib/events.ts` (dipakai bersama dengan rute API), `generateMetadata()` ditambahkan untuk tag Open Graph/Twitter per event, dan JSX interaktif/animasi dipindahkan ke komponen anak sisi klien (`EventDetailClient.tsx`) yang menerima data hasil fetch server sebagai props. `loading.tsx`/`not-found.tsx` menggantikan state loading/error sisi klien yang lama.

Bug CSS laten yang sudah ada sebelumnya ditemukan dan diperbaiki saat menguji ini (dikonfirmasi identik di `develop` sebelum perubahan, jadi bukan regresi dari konversi SSR): kolom gambar event mengandalkan `aspect-ratio` + `max-width` tanpa lebar pasti, dan kontennya hanya elemen `position:absolute` yang tidak berkontribusi pada ukuran induk, sehingga kotak bisa menciut menjadi 0×0. Diperbaiki dengan `md:w-[400px] md:shrink-0` yang eksplisit.

PR: [#54](https://github.com/thidayah/sobatsabtu/pull/54)

### 5. `/api/members` mengambil seluruh tabel yang difilter, dipaginasi di JS

Tidak ada pemanggilan `.range()` — paginasi terjadi di memori setelah mengambil setiap baris yang cocok dengan filter, tumbuh tanpa batas seiring ukuran tabel.

**Perbaikan**: saat mengurutkan berdasarkan `created_at` (default, kolom native), filter/urutkan/paginasi semuanya terjadi di tingkat database melalui `.order()`/`.range()`, dan registrasi hanya diambil untuk member di halaman tersebut. Pengurutan berdasarkan `total_events` (nilai yang dihitung dari join, bukan kolom) masih memerlukan pengambilan seluruh set yang difilter — lihat temuan #6 untuk alasan mengapa ini juga tidak bisa didorong ke database, dan ini didokumentasikan dalam komentar kode.
PR: [#51](https://github.com/thidayah/sobatsabtu/pull/51)

### 6. `/api/dashboard/active-members` — sengaja dilewati

Mengambil setiap registrasi `confirmed` dalam rentang tanggal yang dipilih (di-join dengan kolom member) untuk menghitung papan peringkat top-5 di JS. Perbaikan yang tepat berarti mendorong agregasi `GROUP BY`/count ke Postgres.

**Diinvestigasi, tidak diperbaiki.** Diuji langsung terhadap proyek Supabase live (sebuah `SELECT` read-only) dan dikonfirmasi bahwa fungsi agregat PostgREST dinonaktifkan untuk proyek ini (`PGRST123: Use of aggregate functions is not allowed`) — ini memerlukan perubahan pengaturan proyek Supabase (`db-aggregates-enabled`) atau fungsi RPC Postgres yang ditulis tangan, keduanya bukan murni perubahan kode aplikasi. Ditunda: endpoint sudah dibatasi oleh filter rentang tanggalnya, yang membuatnya tetap cukup efisien pada volume data saat ini.

### 7. `/api/dashboard/stats` menjalankan 4 kueri count terpisah secara berurutan

Melipatgandakan latensi round-trip tanpa alasan — 4 kueri tersebut tidak saling bergantung.

**Perbaikan**: `Promise.all([...])`.
PR: [#47](https://github.com/thidayah/sobatsabtu/pull/47)

### 8. POST `/api/registrations` mengambil ulang data yang sudah ada di memori

Setelah membuat registrasi, handler menanyakan ulang ke database (dengan join `event`/`member` penuh) untuk data yang sudah dimilikinya dari awal permintaan yang sama.

**Perbaikan**: susun respons dari objek `registration`, `event`, dan `memberData` yang sudah diambil alih-alih melakukan round trip tambahan.

Dua bug nyata hanya ditemukan dengan membandingkan respons JSON sebelum/sesudah yang sebenarnya terhadap data uji nyata (bukan oleh build/typecheck), yang layak diingat sebagai pola untuk jenis refactor ini: `event.updated_at` dan `event_remaining_slots` keduanya menyimpang secara diam-diam dari yang akan dikembalikan oleh pembacaan DB baru, karena keduanya bergantung pada pembaruan sisi DB (`current_participants`/`updated_at`) yang belum disegarkan ke objek di memori. Diperbaiki dengan menurunkan ulang keduanya dari nilai balik `update().select().single()` alih-alih menghitungnya secara manual. Juga perlu diperiksa apakah konsumen frontend benar-benar membaca field yang dimaksud sebelum memutuskan seberapa besar usaha korektif yang layak diberikan pada bentuk respons — ternyata `RegistrationForm.tsx` hanya membaca `success`/`message`/`error` dari respons endpoint ini, dan mengabaikan `data` sepenuhnya.
PR: [#47](https://github.com/thidayah/sobatsabtu/pull/47)

### 9. Endpoint grafik dashboard menanyakan ulang dan mengagregasi ulang setiap permintaan

`events-chart`, `popular-events`, dan `members-chart` menyajikan data historis/agregat yang jarang berubah dalam satu hari, tetapi tetap memukul Supabase dan mengagregasi ulang di JS pada setiap permintaan.

**Perbaikan**: logika pengambilan data setiap rute dibungkus dengan `unstable_cache` (`revalidate: 300`), dengan kunci yang dihasilkan otomatis dari param `year`/`month`/`limit` permintaan. `registrations-chart` dibiarkan tidak tersentuh — itu kode mati, tidak dipanggil dari mana pun di frontend (hanya `fetch` yang dikomentari di `dashboard/page.tsx`). Terverifikasi: permintaan berulang untuk param yang sama turun dari ~90-900ms menjadi ~12-15ms; param berbeda dengan benar meleset dari cache alih-alih mengembalikan data basi.
PR: [#53](https://github.com/thidayah/sobatsabtu/pull/53)

### 10. Over-fetching kolom (`select('*')`)

`/api/auth/login` memilih semua kolom `ss_users` hanya untuk memeriksa kredensial; GET `/api/registrations` memilih semua kolom (plus join bertingkat penuh) untuk tampilan daftar yang dipaginasi.

**Perbaikan**: keduanya dibatasi ke kolom yang benar-benar dikonsumsi — `id, email, name, password, is_active` untuk login (frontend `getAuth()` hanya membaca `.name`/`.email`), dan field spesifik yang dirender oleh `dashboard/registrations/page.tsx` dan `ParticipantsTable.tsx` untuk daftar registrasi.
PR: [#48](https://github.com/thidayah/sobatsabtu/pull/48)

### 11-14. Dikonfirmasi melalui pengukuran, tidak diperbaiki secara terpisah

Ini adalah temuan sekunder yang dimunculkan Lighthouse sebagai bukti untuk perbaikan di atas, bukan item kerja terpisah:

- **Keterlambatan render LCP (7.4s, 98% dari waktu LCP)** pada beranda semula disebabkan oleh kontensi jaringan dari temuan #1 dan #2 secara gabungan, bukan waktu eksekusi JS (kerja main-thread hanya terukur 1.6s) — terselesaikan sebagai efek samping dari perbaikan keduanya.
- **Gambar remote yang tidak dioptimalkan/hotlinked** — akar masalah yang sama dengan #3, terselesaikan oleh perbaikan yang sama.
- **Panggilan runtime API Iconify**: `@iconify/react` mengambil data SVG ikon dari `api.iconify.design`/`api.simplesvg.com` di setiap muat halaman (3+ permintaan di beranda saja). Diperbaiki dengan mengekstrak 59 ikon yang benar-benar digunakan di seluruh aplikasi ke dalam JSON statis ~17KB (`scripts/generate-icons.mjs` → `src/lib/iconify-offline-data.json`) dan mendaftarkannya sekali melalui `addCollection()` — nol panggilan API ikon saat runtime setelahnya. (Yang ini *memang* diperbaiki secara terpisah, PR [#52](https://github.com/thidayah/sobatsabtu/pull/52), disertakan di sini karena ini item prioritas lebih rendah di samping yang lain.)
- **JS tidak terpakai di shared chunk** pada beranda (37-52%) — akar masalah yang sama dengan #1, terselesaikan oleh perbaikan yang sama.

## Yang tersisa

Tidak ada yang kritis terhadap performa. Jika ditinjau ulang:
- Temuan #6 memerlukan keputusan untuk mengaktifkan pengaturan `db-aggregates-enabled` Supabase atau menulis RPC Postgres.
- SSR dashboard penuh (di luar `/event/[id]`) memerlukan migrasi sesi berbasis cookie terlebih dahulu.
