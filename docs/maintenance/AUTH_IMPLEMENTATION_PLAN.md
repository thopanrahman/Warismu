# Rencana Implementasi Bertahap Sistem Autentikasi WarisMu

- **Proyek:** WarisMu — Asisten Edukasi & Simulasi Waris Islam (Faraid)
- **Prinsip Pelaksanaan:** Bertahap (*Incremental*), Non-Destruktif, Zero Extra Paid Dependencies, dan Mempertahankan Fitur Eksisting (Kalkulator Faraid, Konsultasi AI, Mode Tamu, dan Riwayat Konsultasi).

---

## 1. Evaluasi Dependensi Tambahan

Berdasarkan hasil audit `package.json`:
- **`bcryptjs` (`^3.0.3`)**: Sudah terinstal.
- **`jsonwebtoken` (`^9.0.3`)**: Sudah terinstal.
- **`pg` (`^8.23.1`)**: Sudah terinstal.
- **Modul Kriptografi Token & Hashing SHA-256:** Menggunakan modul bawaan Node.js **`node:crypto`** (`crypto.randomBytes`, `crypto.createHash`, `crypto.randomUUID`) — **0 paket npm baru**.
- **Pengiriman Email Transaksional:** Menggunakan **`fetch` bawaan Node.js** ke REST API Brevo / Resend — **0 paket npm baru**.
- **Parsing & Serialisasi Cookie `HttpOnly`:** Ditulis sebagai helper murni (~35 baris) di `api/lib/cookies.js` — **0 paket npm baru**.

> **Kesimpulan Dependensi:** Implementasi ini **tidak memerlukan instalasi paket npm baru**, sehingga ukuran bundle tetap ramping dan bebas dari risiko *supply-chain vulnerability* paket pihak ketiga tambahan.

---

## 2. Daftar File yang Akan Dibuat atau Diubah

### A. Database & Konfigurasi Environment
| File | Status | Deskripsi Perubahan |
|---|---|---|
| `db/schema.sql` | **Diubah** | Menambahkan kolom verifikasi pada `users` serta definisi tabel `auth_sessions`, `auth_tokens`, dan `auth_rate_limits`. |
| `db/migrations/001_auth_enhancement.sql` | **Baru** | Skrip migrasi SQL idempotent (`IF NOT EXISTS`) yang siap dijalankan di Supabase SQL Editor pada database yang sudah berjalan. |
| `.env.example` | **Diubah** | Menambahkan dokumentasi variabel konfigurasi TTL token, `APP_BASE_URL`, dan konfigurasi provider email (`EMAIL_PROVIDER`, `BREVO_API_KEY`, `RESEND_API_KEY`). |

### B. Backend Serverless (`api/`)
| File | Status | Deskripsi Perubahan |
|---|---|---|
| `api/lib/auth.js` | **Diubah** | Menambahkan fungsi pembuatan Access Token (15 menit), Refresh Token (7 hari), hashing SHA-256 (`hashToken`), normalisasi email (`normalisasiEmail`), validasi password (8–72 karakter), dan eksplisit `algorithms: ['HS256']`. |
| `api/lib/cookies.js` | **Baru** | Helper pembacaan header `Cookie` (`ambilCookie`) dan pembuatan header `Set-Cookie` (`buatCookieRefresh`, `hapusCookieRefresh`) dengan atribut `HttpOnly; Secure; SameSite=Lax; Path=/api/auth`. |
| `api/lib/rateLimit.js` | **Baru** | Helper *sliding-window rate limiter* berbasis tabel PostgreSQL `auth_rate_limits` untuk melindungi endpoint login, register, resend verification, dan forgot password. |
| `api/lib/mailer.js` | **Baru** | Adapter pengiriman email transaksional (mendukung `brevo`, `resend`, dan fallback `console` untuk development lokal) beserta template HTML email Verifikasi Akun & Reset Password bergaya editorial WarisMu. |
| `api/auth/register.js` | **Diubah** | Validasi `confirmPassword`, normalisasi email `.trim().toLowerCase()`, simpan user dengan `status = 'pending_verification'`, buat token verifikasi 24 jam di `auth_tokens`, dan kirim email verifikasi (tanpa langsung menerbitkan token login). |
| `api/auth/verify-email.js` | **Baru** | Handler `POST /api/auth/verify-email`: verifikasi hash token sekali pakai, cek kedaluwarsa 24 jam, dan aktifkan akun (`status = 'active'`, `email_verified_at = now()`). |
| `api/auth/resend-verification.js` | **Baru** | Handler `POST /api/auth/resend-verification`: rate limit 60 detik / 3x per 15 menit, batalkan token verifikasi lama, terbitkan token baru, dan kirim ulang email. |
| `api/auth/login.js` | **Diubah** | Rate limit 5x gagal / 15 menit, *dummy bcrypt compare* saat email tidak ditemukan, blokir akun yang belum verifikasi email (`403 EMAIL_NOT_VERIFIED`), simpan sesi perangkat di `auth_sessions`, set cookie `HttpOnly` `warismu_rt`, dan kembalikan Access Token 15 menit. |
| `api/auth/refresh.js` | **Baru** | Handler `POST /api/auth/refresh`: validasi cookie `warismu_rt`, deteksi *token reuse* (cabut seluruh sesi satu `family_id` bila token lama dipakai ulang), rotasi refresh token baru, dan terbitkan Access Token 15 menit baru. |
| `api/auth/logout.js` | **Baru** | Handler `POST /api/auth/logout`: cabut sesi aktif di `auth_sessions` (`revoked_at = now()`, `revoke_reason = 'logout'`) dan hapus cookie `warismu_rt`. |
| `api/auth/forgot-password.js` | **Baru** | Handler `POST /api/auth/forgot-password`: rate limit, respons anti-enumerasi, batalkan token reset lama, buat token reset 45 menit di `auth_tokens`, dan kirim email tautan reset. |
| `api/auth/reset-password.js` | **Baru** | Handler `POST /api/auth/reset-password`: verifikasi token reset sekali pakai (< 45 menit), hash password baru dengan bcrypt, tandai token terpakai, dan **cabut seluruh sesi aktif pengguna di `auth_sessions`**. |
| `vite.config.js` | **Diubah (Minor)** | Memastikan objek `tiruanRes(res)` pada plugin dev `apiLokalDev()` meneruskan header `Set-Cookie` dan mendukung seluruh sub-rute `/api/auth/*` secara mulus saat `npm run dev`. |

### C. Frontend Vue 3 (`src/`)
| File | Status | Deskripsi Perubahan |
|---|---|---|
| `src/lib/akun.js` | **Diubah** | Menyimpan `accessToken` di memori (bukan `localStorage`), menambahkan ` muatSesiAwal()` (silent refresh saat aplikasi dimuat), memperbarui `panggilApi()` agar otomatis melakukan 1x silent refresh ke `/api/auth/refresh` saat menerima `401`, dan memperbarui `keluarAkun()` agar memanggil `POST /api/auth/logout`. |
| `src/pages/RegisterPage.vue` | **Diubah** | Menambahkan field **Konfirmasi Password** dan tampilan layar instruksi **"Cek Email Anda untuk Verifikasi"** (beserta tombol Kirim Ulang) setelah registrasi berhasil. |
| `src/pages/LoginPage.vue` | **Diubah** | Menambahkan tautan **"Lupa password?"**, penanganan status `403 EMAIL_NOT_VERIFIED` (tombol kirim ulang verifikasi langsung), dan pesan sukses setelah verifikasi/reset password. |
| `src/pages/VerifyEmailPage.vue` | **Baru** | Halaman `/#/verifikasi-email` untuk memproses token verifikasi dari tautan email dan menyediakan form kirim ulang bila token kedaluwarsa. |
| `src/pages/ForgotPasswordPage.vue` | **Baru** | Halaman `/#/lupa-password` untuk meminta pengiriman tautan reset password via email. |
| `src/pages/ResetPasswordPage.vue` | **Baru** | Halaman `/#/reset-password` untuk mengatur password baru menggunakan token dari email, lalu mengarahkan pengguna kembali ke `/#/masuk`. |
| `src/router/index.js` | **Diubah** | Mendaftarkan 3 rute baru: `/verifikasi-email`, `/lupa-password`, dan `/reset-password`. |
| `src/components/Navbar.vue` & `src/components/ChatSidebar.vue` | **Diubah (Minor)** | Memastikan fungsi tombol `keluar()` menunggu (`await`) `keluarAkun()` selesai mencabut sesi di server sebelum mengarahkan pengguna. |

---

## 3. Urutan Tahap Implementasi (6 Fase)

### Fase 1: Migrasi Skema Database & Helper Inti Backend
1. Buat file `db/migrations/001_auth_enhancement.sql` dan perbarui `db/schema.sql`.
2. Buat `api/lib/cookies.js`, `api/lib/rateLimit.js`, dan `api/lib/mailer.js`.
3. Perbarui `api/lib/auth.js` (normalisasi email, generator token SHA-256, pembatasan algoritma JWT HS256, dan helper transaksi koneksi `dapatkanPool()`).

### Fase 2: Endpoint Verifikasi Email & Registrasi Baru
1. Perbarui `api/auth/register.js`.
2. Buat `api/auth/verify-email.js` dan `api/auth/resend-verification.js`.
3. Uji alur registrasi → verifikasi email → tolak token terpakai/kedaluwarsa.

### Fase 3: Endpoint Login, Refresh Token Rotation, dan Logout
1. Perbarui `api/auth/login.js` (cek `email_verified_at`, *rate limit*, *dummy bcrypt*, dan penerbitan cookie `warismu_rt`).
2. Buat `api/auth/refresh.js` (rotasi token & deteksi *token reuse*).
3. Buat `api/auth/logout.js`.

### Fase 4: Endpoint Lupa Password & Reset Password + Pencabutan Sesi
1. Buat `api/auth/forgot-password.js`.
2. Buat `api/auth/reset-password.js` (update password + `UPDATE auth_sessions SET revoked_at = now() WHERE user_id = $1`).

### Fase 5: Pembaruan State Frontend (`src/lib/akun.js`) & Halaman UI
1. Perbarui `src/lib/akun.js` (in-memory access token + interceptor auto-refresh `panggilApi()`).
2. Perbarui `src/router/index.js`, `src/pages/RegisterPage.vue`, dan `src/pages/LoginPage.vue`.
3. Buat `src/pages/VerifyEmailPage.vue`, `src/pages/ForgotPasswordPage.vue`, dan `src/pages/ResetPasswordPage.vue`.

### Fase 6: Pengujian White Box & Black Box + Pembaruan `.ai/CONTEXT.md`
1. Jalankan seluruh skenario pada `docs/testing/AUTH_TEST_PLAN.md`.
2. Jalankan `npm run build` untuk memastikan build produksi bersih tanpa error.
3. Perbarui `.ai/CONTEXT.md` untuk mencatat arsitektur autentikasi baru.

---

## 4. Strategi Migrasi Database & Penanganan Akun Lama

Agar akun pengguna yang sudah terdaftar di Supabase sebelum pembaruan ini **tidak terkunci** setelah kolom `email_verified_at` ditambahkan:

1. Jalankan `ALTER TABLE users ADD COLUMN IF NOT EXISTS ...`.
2. Jalankan perintah backfill satu kali untuk akun lama yang sudah ada sebelum migrasi:
   ```sql
   UPDATE users
   SET status = 'active',
       email_verified_at = created_at
   WHERE email_verified_at IS NULL;
   ```
3. Setelah backfill selesai, seluruh pendaftaran baru melalui `POST /api/auth/register` akan secara eksplisit memasukkan `status = 'pending_verification'` dan `email_verified_at = NULL`.

---

## 5. Risiko, Mitigasi, serta Strategi Deployment & Rollback

### 5.1. Matriks Risiko & Mitigasi

| ID | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| **RISK-01** | Batas jumlah fungsi Serverless pada Vercel Hobby Plan (maks 12 fungsi per deployment) | Deployment Vercel gagal jika jumlah file `.js` yang diekspor sebagai endpoint di `api/` (di luar `api/lib/`) melebihi 12 file. | **SANGAT PENTING:** Saat ini ada 5 endpoint (`api/chat.js`, `api/riwayat.js`, `api/laporan.js`, `api/auth/login.js`, `api/auth/register.js`). Jika kita menambah 6 file baru di `api/auth/`, totalnya menjadi **11 fungsi** (masih di bawah batas 12 fungsi Vercel Hobby). Untuk keamanan ekstra terhadap batas Vercel Hobby, kita juga dapat menggunakan satu router `api/auth/[action].js` (hanya dihitung **1 fungsi serverless** oleh Vercel untuk seluruh `/api/auth/*`!) dan mendukungnya di `vite.config.js`. |
| **RISK-02** | Email verifikasi masuk ke folder Spam atau tertahan karena domain belum terverifikasi | Pengguna baru tidak bisa login karena menunggu email verifikasi. | Gunakan Brevo dengan *Verified Single Sender* atau Resend dengan domain terverifikasi; sediakan fitur **Kirim Ulang Email Verifikasi** langsung di halaman Register dan Login; serta dukung mode `EMAIL_PROVIDER=console` saat pengujian lokal. |
| **RISK-03** | Pengguna me-refresh tab browser (`F5`) saat sedang berada di `/#/chat` | Karena `accessToken` disimpan di memori (bukan `localStorage`), state token memori kosong sesaat saat halaman dimuat ulang. | Fungsi `muatSesiAwal()` di `src/lib/akun.js` otomatis memanggil `POST /api/auth/refresh` saat bootstrap aplikasi (`main.js` / `ChatPage.vue`) untuk memulihkan `accessToken` dari cookie `HttpOnly` tanpa membuat pengguna ter-logout. |

### 5.2. Strategi Deployment & Rollback
1. **Urutan Deployment:**
   - **Langkah 1:** Jalankan migrasi SQL (`001_auth_enhancement.sql`) di Supabase SQL Editor. Karena migrasi ini hanya menambahkan kolom dan tabel baru (`ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`) tanpa menghapus kolom lama, kode produksi yang sedang berjalan saat ini **tetap berfungsi normal 100%** selama jeda deployment.
   - **Langkah 2:** Tambahkan variabel environment baru (`APP_BASE_URL`, `EMAIL_PROVIDER`, `BREVO_API_KEY` / `RESEND_API_KEY`) di Dashboard Vercel.
   - **Langkah 3:** Deploy commit kode baru ke Vercel.
2. **Prosedur Rollback (Bila Terjadi Kendala di Produksi):**
   - Lakukan *Instant Rollback* ke deployment sebelumnya di Dashboard Vercel.
   - Database **tidak perlu di-rollback** (kolom dan tabel tambahan bersifat *backward-compatible* dan memiliki nilai default `DEFAULT 'pending_verification'`).
