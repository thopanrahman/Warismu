# Laporan Audit Menyeluruh Sistem Autentikasi WarisMu

- **Proyek:** WarisMu — Asisten Edukasi & Simulasi Waris Islam (Faraid)
- **Lingkup Audit:** Frontend Auth State & UI (`src/`), Backend Serverless API (`api/`), Skema Database PostgreSQL Supabase (`db/schema.sql`), Pengelolaan Token JWT, dan Integrasi Email Transaksional
- **Metodologi & Standar Acuan:** `repo-maintainer`, `codebase-cleanup` (`cleanup-secrets`, `cleanup-deps`, `cleanup-a11y`), SRS/SDD WarisMu (`FR-20` s/d `FR-34`, `NFR-15` s/d `NFR-21`), dan OWASP Authentication Cheat Sheet
- **Sifat Pekerjaan:** 100% Read-Only Audit & Perancangan (Tidak ada perubahan kode aplikasi maupun migrasi database pada tahap ini)

---

## 1. Ringkasan Eksekutif & Status Git

Audit ini mengevaluasi implementasi sistem autentikasi WarisMu saat ini terhadap keputusan arsitektur target:
1. **Pendaftaran Email + Password** (dengan Konfirmasi Password & Normalisasi Email).
2. **Verifikasi Email Wajib Sebelum Login** (Token 24 jam, *single-use*, disimpan sebagai hash, *resend* dengan *rate limit*).
3. **Lupa Password Berbasis Email Reset Link** (Bukan OTP, token 30–60 menit, *anti-enumeration*, pencabutan seluruh sesi lama setelah reset).
4. **Redirect ke Login Setelah Reset Password** (Tanpa *auto-login*).
5. **Pengelolaan Sesi Berbasis Short-Lived Access Token (JWT 15 menit) + Long-Lived Refresh Token (7 hari)** dalam Cookie `HttpOnly; Secure; SameSite=Lax`, mendukung multi-perangkat, rotasi token, deteksi *token reuse*, dan pencabutan sesi saat logout/reset password.

### Kondisi Git Sebelum Audit Dimulai
Pemeriksaan `git status -s` pada direktori `warismu/` menunjukkan tidak ada perubahan yang belum tersimpan pada modul autentikasi (`src/pages/LoginPage.vue`, `src/pages/RegisterPage.vue`, `src/lib/akun.js`, `api/auth/login.js`, `api/auth/register.js`, `api/lib/auth.js`, `db/schema.sql` semuanya bersih terhadap modifikasi).

---

## 2. Daftar File yang Diperiksa

| No | File | Peran dalam Sistem Autentikasi | Status Pemeriksaan |
|---|---|---|---|
| 1 | `src/pages/RegisterPage.vue` | Formulir pendaftaran pengguna baru (`/daftar`) | Diperiksa penuh (baris 1–180) |
| 2 | `src/pages/LoginPage.vue` | Formulir masuk akun (`/masuk`) | Diperiksa penuh (baris 1–142) |
| 3 | `src/lib/akun.js` | Penyimpanan token/profil di `localStorage`, helper `panggilApi()`, dan `migrasiSesiTamu()` | Diperiksa penuh (baris 1–96) |
| 4 | `src/components/Navbar.vue` | Navigasi global, indikator nama pengguna aktif, dan tombol Keluar (desktop & mobile) | Diperiksa penuh (baris 1–208) |
| 5 | `src/components/ChatSidebar.vue` | Sidebar riwayat konsultasi, indikator akun/tamu, dan tombol Keluar | Diperiksa penuh (baris 1–255) |
| 6 | `src/pages/ChatPage.vue` | Konsumsi `panggilApi('/api/riwayat')`, penanganan HTTP 401 (`sesiHabis()`), dan penyimpanan `migrasi_chat` di `sessionStorage` | Diperiksa penuh (baris 1–650) |
| 7 | `src/router/index.js` | Konfigurasi rute Vue Router (`createWebHashHistory`, rute `/masuk` dan `/daftar`) | Diperiksa penuh (baris 1–44) |
| 8 | `api/auth/register.js` | Serverless handler `POST /api/auth/register` | Diperiksa penuh (baris 1–46) |
| 9 | `api/auth/login.js` | Serverless handler `POST /api/auth/login` | Diperiksa penuh (baris 1–46) |
| 10 | `api/lib/auth.js` | Middleware/helper verifikasi `Authorization: Bearer <JWT>` (`penggunaDariPermintaan`) | Diperiksa penuh (baris 1–24) |
| 11 | `api/lib/db.js` | Singleton `pg.Pool` untuk koneksi Supabase PostgreSQL (port 6543 pooler) | Diperiksa penuh (baris 1–24) |
| 12 | `api/riwayat.js` | Endpoint terproteksi `GET/POST/DELETE /api/riwayat` (akses tabel `sessions`) | Diperiksa penuh (baris 1–138) |
| 13 | `api/laporan.js` | Endpoint terproteksi `POST /api/laporan` (akses tabel `reports`) | Diperiksa penuh (baris 1–26) |
| 14 | `api/chat.js` | Endpoint publik `POST /api/chat` (tanpa autentikasi wajib untuk mendukung Mode Tamu) | Diperiksa penuh (baris 1–430) |
| 15 | `db/schema.sql` | Definisi DDL PostgreSQL untuk tabel `users`, `sessions`, `consultations`, `reports`, `prompts` | Diperiksa penuh (baris 1–58) |
| 16 | `vite.config.js` | Plugin dev server `apiLokalDev()` yang mengeksekusi `api/**/*.js` secara lokal | Diperiksa penuh (baris 1–138) |
| 17 | `vercel.json` | Konfigurasi fungsi serverless & SPA rewrite di Vercel | Diperiksa penuh (baris 1–7) |
| 18 | `package.json` | Daftar dependensi runtime (`bcryptjs`, `jsonwebtoken`, `pg`) dan build tools | Diperiksa penuh (baris 1–26) |
| 19 | `.env.example` | Template variabel lingkungan (`DATABASE_URL`, `JWT_SECRET`, kunci API LLM) | Diperiksa penuh (baris 1–68) |
| 20 | `.ai/CONTEXT.md` | Dokumentasi arsitektur & invariant proyek WarisMu | Diperiksa penuh (baris 1–103) |

---

## 3. Hasil Audit 12 Aspek Autentikasi Saat Ini

### 3.1. Bagaimana Proses Registrasi Berjalan Saat Ini
- **Frontend (`src/pages/RegisterPage.vue`):**
  - Pengguna hanya mengisi 3 field: `nama` (baris 95–102), `email` (baris 109–116), dan `password` (baris 124–136).
  - **Belum ada field Konfirmasi Password** di UI (`RegisterPage.vue`).
  - Validasi client-side memeriksa `nama.value.trim()` tidak kosong, regex email sederhana `/.+@.+\..+/`, dan regex kekuatan password `/^(?=.*[A-Za-z])(?=.*\d).{8,}$/` (baris 17–32).
  - Mengirim `POST /api/auth/register` dengan timeout 10 detik via `AbortController` (baris 35–44).
  - Saat menerima HTTP 201 `{ token, user }`, frontend **langsung meloginkan pengguna** dengan memanggil `simpanLogin(data.token, data.user)`, menjalankan `migrasiSesiTamu(data.token)`, dan mengarahkan ke `/chat` (baris 59–61).
- **Backend (`api/auth/register.js`):**
  - Menerima `{ nama, email, password }` dari `req.body` (baris 15).
  - Menormalisasi nama dengan `String(nama).trim()` (baris 16), namun normalisasi email **hanya menggunakan `String(email).toLowerCase()` tanpa `.trim()`** (baris 17).
  - Memvalidasi format email dengan `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` dan password dengan `/^(?=.*[A-Za-z])(?=.*\d).{8,}$/` (baris 7–9, 19–25). Tidak ada batas panjang maksimum password (risiko DoS bcrypt bila string > 72 byte dikirim).
  - Memeriksa duplikasi email melalui `SELECT id FROM users WHERE email = $1` (baris 27) dan mengembalikan HTTP 409 `'Email sudah terdaftar, silakan login'` bila ditemukan (baris 28).
  - Menyimpan baris baru ke tabel `users (nama, email, password_hash)` (baris 31–34).
  - **Langsung menerbitkan JWT berlaku 7 hari** (`expiresIn: '7d'`) tanpa proses verifikasi email (baris 36–37).

### 3.2. Bagaimana Proses Login Berjalan Saat Ini
- **Frontend (`src/pages/LoginPage.vue`):**
  - Pengguna mengisi `email` dan `password` (baris 79–101), tanpa tautan "Lupa Password?".
  - Mengirim `POST /api/auth/login` dengan `{ email: email.value.trim(), password: password.value }` (baris 29–34).
  - Jika berhasil (HTTP 200 `{ token, user }`), memanggil `simpanLogin(data.token, data.user)`, memigrasikan riwayat chat tamu bila ada (`migrasiSesiTamu(data.token)`), lalu `router.push('/chat')` (baris 49–51).
- **Backend (`api/auth/login.js`):**
  - Memvalidasi keberadaan email & password (baris 15–17).
  - Normalisasi email di backend lagi-lagi hanya `String(email).toLowerCase()` tanpa `.trim()` (baris 21).
  - Mengambil `SELECT id, nama, email, password_hash FROM users WHERE email = $1` (baris 19–22).
  - Menggunakan pesan error identik `'Email atau password salah'` (HTTP 401) untuk email tidak ditemukan maupun password tidak cocok (baris 25, 29) guna mencegah enumerasi email pada endpoint login.
  - Tidak memeriksa status verifikasi email karena kolom verifikasi belum ada di tabel `users`.
  - Menerbitkan JWT tunggal dengan masa berlaku **7 hari** (`expiresIn: '7d'`) yang berisi payload `{ uid: user.id, email: user.email }` (baris 31–33).

### 3.3. Bagaimana Password Disimpan dan Diverifikasi
- Menggunakan pustaka **`bcryptjs` (`^3.0.3`)** (`package.json` baris 13).
- Saat registrasi (`api/auth/register.js` baris 30): `await bcrypt.hash(String(password), 10)` (cost factor = 10, memenuhi standar minimum `NFR-17`).
- Saat login (`api/auth/login.js` baris 28): `await bcrypt.compare(String(password), user.password_hash)`.
- **Temuan Celah:**
  1. Tidak ada pembatasan panjang maksimum password (misalnya maks 72 karakter) sebelum dikirim ke `bcrypt.hash()`. Algoritma bcrypt memotong input setelah 72 byte dan input ribuan karakter dapat membebani CPU serverless function.
  2. Ketika email tidak ditemukan di `api/auth/login.js` (baris 25), handler langsung mengembalikan HTTP 401 tanpa menjalankan *dummy bcrypt comparison*, sehingga memungkinkan *timing side-channel attack* untuk membedakan email terdaftar vs tidak terdaftar.

### 3.4. Apakah Verifikasi Email Sudah Tersedia
- **Status: BELUM TERSEDIA (0%).**
- Tidak ada kolom `email_verified_at` atau `status` pada tabel `users` di `db/schema.sql` (baris 5–13).
- Tidak ada tabel untuk menyimpan token verifikasi email.
- Tidak ada endpoint untuk memverifikasi token maupun mengirim ulang email verifikasi.
- Tidak ada halaman UI verifikasi email di `src/pages/` maupun rute di `src/router/index.js`.

### 3.5. Apakah Fitur Lupa Password Sudah Tersedia
- **Status: BELUM TERSEDIA (0%).**
- Tidak ada tautan "Lupa Password?" pada `src/pages/LoginPage.vue` (baris 89–111).
- Tidak ada halaman `ForgotPasswordPage.vue` atau `ResetPasswordPage.vue` di `src/pages/`.
- Tidak ada endpoint `/api/auth/forgot-password` atau `/api/auth/reset-password` di `api/auth/`.
- Tidak ada tabel token reset password di `db/schema.sql`.

### 3.6. Apakah JWT Sudah Digunakan dan Bagaimana Proses Validasinya
- **Status: SUDAH DIGUNAKAN (Namun masih Single Long-Lived JWT 7 Hari).**
- Menggunakan pustaka `jsonwebtoken` (`^9.0.3`).
- Penandatanganan dilakukan di `api/auth/login.js` (baris 31) dan `api/auth/register.js` (baris 36) menggunakan `process.env.JWT_SECRET` dengan opsi `{ expiresIn: '7d' }` (default algoritma HS256).
- Validasi dilakukan di `api/lib/auth.js` (baris 6–19) melalui fungsi `penggunaDariPermintaan(req)`:
  - Membaca header `req.headers.authorization` atau `req.headers.Authorization` (baris 7).
  - Mengekstrak token dengan regex `/^Bearer\s+(.+)$/i` (baris 8).
  - Memanggil `jwt.verify(cocok[1], rahasia)` tanpa membatasi `algorithms: ['HS256']` secara eksplisit (baris 13).
  - Memastikan `isi?.uid` ada, lalu mengembalikan `{ id: isi.uid, email: isi.email ?? null }` (baris 14–15).
  - **Catatan Keamanan Penting:** `penggunaDariPermintaan(req)` murni *stateless*; ia tidak memiliki mekanisme untuk mengetahui apakah akun pengguna telah dinonaktifkan, dihapus, atau baru saja melakukan reset password selama masa berlaku 7 hari belum habis.

### 3.7. Apakah Refresh Token Sudah Tersedia
- **Status: BELUM TERSEDIA (0%).**
- Sistem saat ini hanya menerbitkan satu token JWT berumur 7 hari yang berfungsi sekaligus sebagai access token.
- Tidak ada tabel sesi autentikasi / refresh token di database (tabel `sessions` di `db/schema.sql` baris 16–25 saat ini dipakai khusus untuk menyimpan riwayat percakapan chat `data_json`, bukan sesi login perangkat!).
- Tidak ada penanganan `Set-Cookie` maupun pembacaan `req.headers.cookie` di backend maupun di simulator dev `vite.config.js`.

### 3.8. Bagaimana Proses Logout Bekerja
- **Status: MURNI CLIENT-SIDE (Tidak mencabut sesi di server).**
- Fungsi `keluarAkun()` di `src/lib/akun.js` (baris 32–39) hanya menghapus `localStorage.removeItem('warismu_token')` dan `localStorage.removeItem('warismu_user')`.
- Dipanggil dari:
  1. `src/components/Navbar.vue` (baris 21–26): memanggil `keluarAkun()`, mengosongkan state `pengguna`, dan `router.push('/')`.
  2. `src/components/ChatSidebar.vue` (baris 23–26): memanggil `keluarAkun()` lalu `location.reload()`.
  3. `src/pages/ChatPage.vue` (baris 46–52, `sesiHabis()`): dipanggil otomatis saat API `/api/riwayat` atau `/api/laporan` merespons HTTP 401.
- Karena belum ada refresh token di database maupun endpoint `POST /api/auth/logout`, token JWT yang lama tetap valid hingga 7 hari sejak diterbitkan jika disalin sebelum logout.

### 3.9. Bagaimana Frontend Mempertahankan Status Login
- Seluruh state autentikasi frontend dikelola oleh `src/lib/akun.js`:
  - Token JWT disimpan secara persisten di **`localStorage`** dengan kunci `'warismu_token'` (baris 3, 25).
  - Data profil `{ id, nama, email }` disimpan di **`localStorage`** dengan kunci `'warismu_user'` (baris 4, 26).
- **Kerentanan XSS:** Menyimpan token berumur panjang (7 hari) di `localStorage` membuat token terekspos sepenuhnya apabila terjadi serangan Cross-Site Scripting (XSS).
- **Sinkronisasi State Antar-Komponen:**
  - `Navbar.vue` (baris 12–19) membaca `ambilPengguna()` saat mount dan memperbaruinya melalui `watch(() => route.fullPath)`.
  - `ChatPage.vue` (baris 23) membaca `ambilPengguna()` saat halaman dimuat.
  - `panggilApi()` di `src/lib/akun.js` (baris 48–60) menyisipkan header `Authorization: Bearer <token>` tetapi **belum memiliki mekanisme auto-refresh** ketika menerima respons HTTP 401.

### 3.10. Bagaimana API Melindungi Endpoint yang Memerlukan Autentikasi
- Terdapat 5 endpoint di folder `api/`:
  1. `POST /api/chat` (`api/chat.js`): **Publik** (tidak memanggil `penggunaDariPermintaan`), karena fitur konsultasi AI dapat digunakan dalam Mode Tamu (`FR-20`).
  2. `POST /api/auth/register` (`api/auth/register.js`): **Publik**.
  3. `POST /api/auth/login` (`api/auth/login.js`): **Publik**.
  4. `GET/POST/DELETE /api/riwayat` (`api/riwayat.js` baris 58–62): **Terproteksi**. Memeriksa `konfigurasiKurang()` (HTTP 500) lalu `penggunaDariPermintaan(req)` (HTTP 401 jika null). Semua query SQL menyertakan filter `WHERE user_id = $1` atau `WHERE id = $1 AND user_id = $2` (baris 80, 88, 103, 117, 136) untuk menjamin isolasi data antar-pengguna (`NFR-18`).
  5. `POST /api/laporan` (`api/laporan.js` baris 9–13): **Terproteksi**. Memeriksa `konfigurasiKurang()` dan `penggunaDariPermintaan(req)` sebelum melakukan `INSERT INTO reports (user_id, reason)`.

### 3.11. Bagaimana Pengguna dan Sesi Disimpan di Database
Berdasarkan `db/schema.sql`:
- **Tabel `users` (D1, baris 5–13):**
  - Menyimpan `id (UUID)`, `email (TEXT UNIQUE)`, `password_hash (TEXT)`, `nama (TEXT)`, `role (TEXT DEFAULT 'user')`, `created_at`, `updated_at`.
- **Tabel `sessions` (D2, baris 16–25):**
  - **PENTING — Ambiguitas Penamaan Tabel:** Meskipun bernama `sessions` dan memiliki kolom `session_token TEXT UNIQUE NOT NULL`, tabel ini di `api/riwayat.js` (baris 75–137) digunakan untuk menyimpan **sesi percakapan chat (riwayat konsultasi)** beserta `data_json JSONB`, **BUKAN sesi autentikasi login/perangkat**.
  - Pada `api/riwayat.js` baris 127–128, `session_token` diisi dengan hash acak `md5(random()::text || clock_timestamp()::text || $1::text)` semata-mata untuk memenuhi constraint `NOT NULL UNIQUE` saat menyimpan riwayat chat baru.
  - Oleh karena itu, **tabel `sessions` tidak boleh ditimpa atau dialihfungsikan menjadi tabel refresh token**, melainkan kita harus membuat tabel khusus autentikasi (misalnya `auth_sessions`) agar fitur riwayat chat yang sudah berjalan tidak rusak!

### 3.12. Apakah Ada Mekanisme Pembatasan Percobaan Login atau Permintaan Email (Rate Limiting)
- **Status: BELUM TERSEDIA (0%).**
- Walaupun SRS `FR-26` dan `NFR-21` mensyaratkan *"Rate limiting login (max 5x/15 menit)"*, saat ini tidak ada implementasi *rate limiting* sama sekali di `api/auth/login.js` maupun `api/auth/register.js`.
- Penyerang dapat melakukan *brute-force* password atau melakukan *flooding* pendaftaran akun tanpa batas.

---

## 4. Audit Keamanan & Daftar Temuan Masalah

| ID | Tingkat Keparahan | Temuan Masalah | Lokasi Kode | Dampak Risiko |
|---|---|---|---|---|
| **SEC-01** | **Tinggi (High)** | Tidak ada verifikasi email saat registrasi; akun langsung aktif dan menerima JWT 7 hari. | `api/auth/register.js:31-37`, `src/pages/RegisterPage.vue:59-61` | Pendaftaran menggunakan alamat email milik orang lain (*account squatting / impersonation*) dan spam akun palsu. |
| **SEC-02** | **Tinggi (High)** | Token JWT berumur panjang (7 hari) disimpan di `localStorage` tanpa mekanisme pencabutan (*revocation*). | `api/auth/login.js:31-33`, `src/lib/akun.js:3,23-30` | Bila terjadi XSS, token dicuri dan aktif selama 7 hari penuh. Saat pengguna logout atau ganti password, token lama tetap bisa dipakai mengakses `/api/riwayat`. |
| **SEC-03** | **Tinggi (High)** | Tidak ada fitur Lupa Password & Reset Password maupun mekanisme pencabutan seluruh sesi aktif. | `src/pages/LoginPage.vue`, `api/auth/` | Pengguna yang lupa password kehilangan akses permanen ke riwayat konsultasi; pengguna yang akunnya bocor tidak dapat memutus sesi perangkat lain. |
| **SEC-04** | **Tinggi (High)** | Tidak ada *Rate Limiting* pada endpoint autentikasi (`login`, `register`). | `api/auth/login.js`, `api/auth/register.js` | Rentan terhadap serangan *credential stuffing*, *brute-force* password, dan *registration flooding* (melanggar `FR-26` / `NFR-21`). |
| **SEC-05** | **Sedang (Medium)** | Normalisasi email di backend tidak memanggil `.trim()` sebelum `.toLowerCase()` dan validasi regex. | `api/auth/login.js:15,21`, `api/auth/register.js:17` | Input email dengan spasi di awal/akhir dari klien non-standar dapat gagal validasi atau menimbulkan ketidakkonsistenan pencocokan. |
| **SEC-06** | **Sedang (Medium)** | Tidak ada batas maksimum panjang input `password` (72 byte limit bcrypt) dan `nama` di backend. | `api/auth/register.js:16-25`, `api/auth/login.js:15-28` | Potensi *Denial of Service* (CPU exhaustion) jika penyerang mengirim string password berukuran megabyte ke `bcrypt.hash` / `bcrypt.compare`, serta pemotongan diam-diam karakter ke-73+. |
| **SEC-07** | **Sedang (Medium)** | *Timing attack* pada `POST /api/auth/login` ketika email tidak ditemukan di database. | `api/auth/login.js:25-28` | Jika email tidak terdaftar, server merespons dalam ~5–15 ms (tanpa bcrypt). Jika email terdaftar tetapi password salah, server merespons dalam ~80–150 ms (eksekusi bcrypt cost 10). |
| **SEC-08** | **Sedang (Medium)** | `POST /api/auth/register` mengembalikan HTTP 409 `'Email sudah terdaftar, silakan login'` secara eksplisit, serta belum menangani *race condition* Postgres Unique Violation (`code === '23505'`). | `api/auth/register.js:27-34` | Jika dua request identik masuk bersamaan, `INSERT` kedua akan melempar error Postgres `23505` dan jatuh ke blok `catch` sebagai HTTP 500 `'Gagal mendaftar, coba lagi'`. |
| **SEC-09** | **Rendah (Low)** | `jwt.verify()` di `api/lib/auth.js` tidak menentukan parameter `algorithms: ['HS256']` secara eksplisit. | `api/lib/auth.js:13` | Praktik terbaik keamanan JWT mewajibkan deklarasi algoritma eksplisit saat verifikasi untuk mencegah *algorithm confusion*. |
| **SEC-10** | **Rendah (Low)** | Simulator API lokal di `vite.config.js` (`tiruanRes`) belum sepenuhnya mendukung pembacaan/penulisan multi-header `Set-Cookie` apabila `setHeader('Set-Cookie', [...])` dipanggil beberapa kali. | `vite.config.js:58-75` | Perlu dipastikan `res.setHeader('Set-Cookie', ...)` bekerja identik antara `vite dev` lokal dan runtime Vercel Serverless. |

---

## 5. Audit Struktur Database Saat Ini (`db/schema.sql`)

Pemeriksaan terhadap `db/schema.sql` menghasilkan pemetaan berikut:

| Kebutuhan Data Autentikasi | Tabel Saat Ini di `db/schema.sql` | Status Ketersediaan | Evaluasi Kecukupan |
|---|---|---|---|
| **Data Pengguna Dasar** (`id`, `email`, `password_hash`, `nama`, `role`) | `users` (baris 5–13) | **Tersedia** | **Belum Cukup** — Kurang kolom status verifikasi (`email_verified_at`), status akun (`status`), dan waktu perubahan password (`password_changed_at`). |
| **Status Verifikasi Email** | — | **Belum Tersedia** | Perlu kolom `email_verified_at TIMESTAMPTZ` pada tabel `users`. |
| **Token Verifikasi Email** | — | **Belum Tersedia** | Perlu tabel baru (`auth_tokens` atau `email_verification_tokens`) yang menyimpan hash token (SHA-256), `expires_at`, dan `used_at`. |
| **Token Reset Password** | — | **Belum Tersedia** | Perlu tabel baru (`auth_tokens` atau `password_reset_tokens`) yang menyimpan hash token (SHA-256), `expires_at`, dan `used_at`. |
| **Refresh Token & Sesi Perangkat** | — *(Tabel `sessions` yang ada dipakai oleh fitur Riwayat Chat!)* | **Belum Tersedia** | Perlu tabel baru **`auth_sessions`** untuk menyimpan `token_hash`, `family_id` (deteksi *reuse*), `user_agent`, `ip_address`, `expires_at`, `revoked_at`, `replaced_by_id`. |
| **Pembatasan Permintaan (Rate Limiting)** | — | **Belum Tersedia** | Karena Vercel Serverless bersifat *stateless* (memori lokal tidak konsisten antar-instance), *rate limiting* tanpa biaya tambahan paling tepat disimpan di tabel PostgreSQL ringan **`auth_rate_limits`**. |

> **Catatan Verifikasi Produksi (`NEEDS VERIFICATION`):**
> - Karena lingkungan sandbox tidak terhubung langsung ke instance produksi Supabase, struktur aktual di database Supabase produksi belum dapat diinspeksi melalui kueri `information_schema.columns`.
> - **Cara Memastikan:** Jalankan kueri berikut di Supabase SQL Editor sebelum menerapkan migrasi:
>   ```sql
>   SELECT table_name, column_name, data_type, is_nullable
>   FROM information_schema.columns
>   WHERE table_schema = 'public'
>   ORDER BY table_name, ordinal_position;
>   ```

---

## 6. Audit Integrasi Email Saat Ini

Pemeriksaan menyeluruh terhadap `package.json`, `.env.example`, `api/`, dan `src/` menunjukkan:
1. **Provider Email yang Digunakan:** **BELUM ADA.** Tidak ada SDK email (`resend`, `nodemailer`, `@sendgrid/mail`, `postmark`) di `package.json`, dan tidak ada pemanggilan REST API pengiriman email di seluruh folder `api/`.
2. **Konfigurasi Environment Variable:** **BELUM ADA.** `.env.example` hanya memuat `DATABASE_URL`, konfigurasi 5 penyedia LLM, `JWT_SECRET`, dan `FARAIDH_API_URL`.
3. **Mekanisme Pengiriman Email dari Backend:** **BELUM ADA.** Bahkan `ContactForm.vue` (baris 46–52) hanya mengubah state `terkirim.value = true` di browser tanpa memanggil backend maupun mengirim email.
4. **Template Email:** **BELUM ADA.**
5. **Penanganan Kegagalan Email & Kesesuaian Vercel:** **BELUM ADA.**

*(Rekomendasi lengkap layanan transactional email yang hemat biaya dan kompatibel dengan Vercel Serverless tanpa dependensi berat disajikan pada dokumen `docs/architecture/AUTH_ARCHITECTURE.md` Bagian 6).*
