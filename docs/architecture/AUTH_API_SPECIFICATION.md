# Spesifikasi Endpoint API & Alur Antarmuka Autentikasi WarisMu

- **Proyek:** WarisMu — Asisten Edukasi & Simulasi Waris Islam (Faraid)
- **Format Pertukaran Data:** `application/json; charset=utf-8`
- **Konvensi Serverless Vercel:** Setiap endpoint dipetakan ke satu file di dalam `api/auth/*.js` (atau digabungkan secara modular di bawah `api/auth/`).

---

## 1. Ringkasan Daftar Endpoint Autentikasi

Tidak ada duplikasi dengan endpoint bisnis yang sudah ada (`/api/chat`, `/api/riwayat`, `/api/laporan`). Dua endpoint lama (`register.js` dan `login.js`) disempurnakan kontraknya, dan enam endpoint siklus sesi/email ditambahkan:

| No | Method | URL | File Handler | Status | Autentikasi | Rate Limit |
|---|---|---|---|---|---|---|
| 1 | `POST` | `/api/auth/register` | `api/auth/register.js` | **Diperbarui** | Publik | Maks 5 req / 15 menit per IP |
| 2 | `POST` | `/api/auth/verify-email` | `api/auth/verify-email.js` | **Baru** | Publik (Token) | Maks 10 req / 15 menit per IP |
| 3 | `POST` | `/api/auth/resend-verification` | `api/auth/resend-verification.js` | **Baru** | Publik | Maks 1 req / 60 detik & 3 req / 15 menit per Email/IP |
| 4 | `POST` | `/api/auth/login` | `api/auth/login.js` | **Diperbarui** | Publik | Maks 5 gagal / 15 menit per IP + Email (`FR-26`) |
| 5 | `POST` | `/api/auth/refresh` | `api/auth/refresh.js` | **Baru** | Cookie `warismu_rt` | Maks 30 req / 15 menit per IP |
| 6 | `POST` | `/api/auth/logout` | `api/auth/logout.js` | **Baru** | Cookie `warismu_rt` (Opsional Bearer) | Maks 20 req / 15 menit per IP |
| 7 | `POST` | `/api/auth/forgot-password` | `api/auth/forgot-password.js` | **Baru** | Publik | Maks 1 req / 60 detik & 3 req / 15 menit per Email/IP |
| 8 | `POST` | `/api/auth/reset-password` | `api/auth/reset-password.js` | **Baru** | Publik (Token) | Maks 5 req / 15 menit per IP |

---

## 2. Spesifikasi Detail Setiap Endpoint

### 2.1. `POST /api/auth/register`
- **Tujuan:** Mendaftarkan akun pengguna baru dengan status `pending_verification` dan mengirimkan tautan verifikasi ke email pengguna (tanpa meloginkan pengguna sebelum verifikasi).
- **Persyaratan Autentikasi:** Publik.
- **Pembatasan Permintaan (Rate Limit):** Maksimal 5 permintaan per 15 menit per alamat IP (`register:ip:<ip>`).
- **Validasi Input:**
  - `nama`: Wajib, string setelah `.trim()` minimal 2 karakter dan maksimal 100 karakter.
  - `email`: Wajib, dinormalisasi dengan `String(email).trim().toLowerCase()`, maksimal 254 karakter, cocok dengan regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (mendukung Gmail, Outlook, Yahoo, domain kampus/kantor).
  - `password`: Wajib, string 8 s/d 72 karakter, wajib mengandung minimal 1 huruf (`[A-Za-z]`) dan 1 angka (`\d`).
  - `confirmPassword`: Wajib, harus sama persis (`===`) dengan `password`.
- **Request Body:**
  ```json
  {
    "nama": "Muhammad Ilham",
    "email": "Ilham@Gmail.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }
  ```
- **Response Sukses (`201 Created`):**
  ```json
  {
    "ok": true,
    "requiresVerification": true,
    "emailSent": true,
    "email": "ilham@gmail.com",
    "message": "Pendaftaran berhasil. Silakan periksa kotak masuk email Anda untuk memverifikasi akun sebelum masuk."
  }
  ```
- **Response Sukses namun Pengiriman Email Gagal (`201 Created`):**
  ```json
  {
    "ok": true,
    "requiresVerification": true,
    "emailSent": false,
    "email": "ilham@gmail.com",
    "message": "Akun berhasil dibuat, namun pengiriman email verifikasi terkendala. Silakan gunakan tombol Kirim Ulang Email Verifikasi."
  }
  ```
- **Kemungkinan HTTP Status Code:**
  - `201 Created`: Akun baru berhasil dibuat.
  - `400 Bad Request`: Validasi gagal (`{ "code": "VALIDATION_ERROR", "error": "Konfirmasi password tidak cocok." }`).
  - `405 Method Not Allowed`: Metode selain `POST`.
  - `409 Conflict`:
    - Jika email sudah terdaftar dan sudah terverifikasi: `{ "code": "EMAIL_TAKEN", "error": "Email sudah terdaftar, silakan masuk." }`
    - Jika email sudah terdaftar tetapi belum terverifikasi: `{ "code": "EMAIL_NOT_VERIFIED", "error": "Email ini sudah terdaftar namun belum diverifikasi. Silakan periksa email Anda atau kirim ulang tautan verifikasi." }`
  - `429 Too Many Requests`: `{ "code": "RATE_LIMITED", "error": "Terlalu banyak percobaan pendaftaran. Silakan tunggu 15 menit.", "retryAfterSeconds": 900 }`.
  - `500 Internal Server Error`: Kesalahan database/konfigurasi server.

---

### 2.2. `POST /api/auth/verify-email`
- **Tujuan:** Memverifikasi token dari tautan email, mengaktifkan akun (`status = 'active'`, `email_verified_at = now()`), dan menandai token telah dipakai (`used_at = now()`).
- **Persyaratan Autentikasi:** Publik (menggunakan token satu kali pakai).
- **Pembatasan Permintaan (Rate Limit):** Maksimal 10 permintaan per 15 menit per IP.
- **Validasi Input:**
  - `token`: Wajib, string heksadesimal 64 karakter (`/^[a-f0-9]{64}$/i`).
- **Request Body:**
  ```json
  {
    "token": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  }
  ```
- **Response Sukses (`200 OK`):**
  ```json
  {
    "ok": true,
    "message": "Email Anda berhasil diverifikasi. Silakan masuk ke akun WarisMu."
  }
  ```
- **Kemungkinan HTTP Status Code:**
  - `200 OK`: Verifikasi berhasil.
  - `400 Bad Request`:
    - Format token salah / tidak ditemukan: `{ "code": "INVALID_TOKEN", "error": "Tautan verifikasi tidak valid." }`
    - Token sudah pernah digunakan: `{ "code": "TOKEN_ALREADY_USED", "error": "Tautan verifikasi ini sudah pernah digunakan. Silakan langsung masuk ke akun Anda." }`
  - `410 Gone`: Token melewati masa berlaku 24 jam (`{ "code": "TOKEN_EXPIRED", "error": "Tautan verifikasi telah kedaluwarsa. Silakan minta pengiriman ulang email verifikasi." }`).
  - `429 Too Many Requests`: Melewati batas percobaan per IP.
  - `500 Internal Server Error`: Kesalahan database.

---

### 2.3. `POST /api/auth/resend-verification`
- **Tujuan:** Mengirimkan tautan verifikasi baru ke alamat email akun yang masih berstatus `pending_verification` serta membatalkan token verifikasi lama.
- **Persyaratan Autentikasi:** Publik.
- **Pembatasan Permintaan (Rate Limit):**
  - Cooldown antar-permintaan: **1 kali per 60 detik** untuk email yang sama.
  - Kuota jendela: **Maksimal 3 kali per 15 menit** per email dan per IP.
- **Validasi Input:**
  - `email`: Wajib, dinormalisasi `trim().toLowerCase()`, format email valid.
- **Request Body:**
  ```json
  {
    "email": "ilham@gmail.com"
  }
  ```
- **Response Sukses (`200 OK` — Anti-Enumerasi):**
  ```json
  {
    "ok": true,
    "cooldownSeconds": 60,
    "message": "Jika alamat email tersebut terdaftar dan belum terverifikasi, tautan verifikasi baru telah dikirim."
  }
  ```
- **Kemungkinan HTTP Status Code:**
  - `200 OK`: Permintaan diterima (respons identik baik email belum terverifikasi, sudah terverifikasi, maupun tidak terdaftar).
  - `400 Bad Request`: Format email tidak valid.
  - `429 Too Many Requests`: `{ "code": "RATE_LIMITED", "error": "Mohon tunggu 60 detik sebelum meminta kirim ulang email verifikasi.", "retryAfterSeconds": 45 }`.
  - `503 Service Unavailable`: Layanan penyedia email gagal dihubungi (`{ "code": "EMAIL_SERVICE_UNAVAILABLE", "error": "Layanan pengiriman email sedang mengalami gangguan. Silakan coba beberapa saat lagi." }`).

---

### 2.4. `POST /api/auth/login`
- **Tujuan:** Mengautentikasi email & password pengguna yang sudah terverifikasi, menerbitkan Access Token JWT (15 menit) di JSON body, dan menyetel Refresh Token (7 hari) di cookie `HttpOnly`.
- **Persyaratan Autentikasi:** Publik.
- **Pembatasan Permintaan (Rate Limit):** Maksimal **5 kali gagal dalam 15 menit** per kombinasi IP dan Email (`FR-26`, `NFR-21`). Jika berhasil login sebelum mencapai 5 kali gagal, penghitung kegagalan di-reset.
- **Validasi Input:**
  - `email`: Wajib, dinormalisasi `trim().toLowerCase()`, format email valid.
  - `password`: Wajib, string 1–72 karakter.
- **Request Body:**
  ```json
  {
    "email": "ilham@gmail.com",
    "password": "Password123"
  }
  ```
- **Response Header (`200 OK`):**
  ```http
  Set-Cookie: warismu_rt=<64_CHAR_HEX_TOKEN>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800
  ```
- **Response Body (`200 OK`):**
  ```json
  {
    "ok": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama": "Muhammad Ilham",
      "email": "ilham@gmail.com"
    }
  }
  ```
  *(Catatan Kompatibilitas: properti `token` disertakan sebagai alias dari `accessToken` agar pemanggil di `src/lib/akun.js` tetap kompatibel 100%).*
- **Kemungkinan HTTP Status Code:**
  - `200 OK`: Login berhasil.
  - `400 Bad Request`: Email atau password kosong / format tidak valid.
  - `401 Unauthorized`: Email tidak ditemukan atau password salah (`{ "code": "INVALID_CREDENTIALS", "error": "Email atau password salah." }`).
  - `403 Forbidden`: Password benar, namun akun belum diverifikasi (`{ "code": "EMAIL_NOT_VERIFIED", "email": "ilham@gmail.com", "error": "Akun Anda belum diverifikasi. Silakan cek kotak masuk email Anda atau kirim ulang email verifikasi." }`).
  - `429 Too Many Requests`: Melewati 5 percobaan gagal dalam 15 menit (`{ "code": "RATE_LIMITED", "error": "Terlalu banyak percobaan login yang gagal. Demi keamanan akun, silakan coba lagi dalam 15 menit.", "retryAfterSeconds": 900 }`).
  - `500 Internal Server Error`: Kesalahan database/konfigurasi.

---

### 2.5. `POST /api/auth/refresh`
- **Tujuan:** Memvalidasi Refresh Token dari cookie `HttpOnly` (`warismu_rt`), melakukan **rotasi refresh token** (mencabut refresh token lama dan menerbitkan refresh token baru dalam `family_id` yang sama), serta menerbitkan Access Token JWT baru (15 menit).
- **Persyaratan Autentikasi:** Cookie `warismu_rt` wajib ada dan valid, serta header `Origin`/`Referer` harus berasal dari origin aplikasi.
- **Pembatasan Permintaan (Rate Limit):** Maksimal 30 permintaan per 15 menit per IP.
- **Request Body:** `{}` (Kosong; kredensial diambil dari cookie `HttpOnly`).
- **Response Header (`200 OK`):**
  ```http
  Set-Cookie: warismu_rt=<NEW_64_CHAR_HEX_TOKEN>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800
  ```
- **Response Body (`200 OK`):**
  ```json
  {
    "ok": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama": "Muhammad Ilham",
      "email": "ilham@gmail.com"
    }
  }
  ```
- **Kemungkinan HTTP Status Code:**
  - `200 OK`: Rotasi refresh token & penerbitan access token berhasil.
  - `401 Unauthorized`: Cookie tidak ada, token kedaluwarsa, sesi telah dicabut, atau **terdeteksi penggunaan ulang token yang sudah dirotasi (*token reuse detected* — seluruh sesi dalam `family_id` tersebut langsung dicabut)** (`{ "code": "SESSION_EXPIRED", "error": "Sesi login telah berakhir, silakan masuk kembali." }` disertai header `Set-Cookie: warismu_rt=; Max-Age=0`).

---

### 2.6. `POST /api/auth/logout`
- **Tujuan:** Mencabut sesi refresh token perangkat saat ini di tabel `auth_sessions` (`revoked_at = now()`, `revoke_reason = 'logout'`) dan menghapus cookie `warismu_rt` dari browser.
- **Persyaratan Autentikasi:** Membaca cookie `warismu_rt` (atau `sid` dari Bearer JWT jika ada). Selalu idempotent (tetap mengembalikan `200 OK` meskipun cookie sudah kosong).
- **Request Body:** `{}`
- **Response Header (`200 OK`):**
  ```http
  Set-Cookie: warismu_rt=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=0
  ```
- **Response Body (`200 OK`):**
  ```json
  {
    "ok": true,
    "message": "Berhasil keluar dari akun."
  }
  ```

---

### 2.7. `POST /api/auth/forgot-password`
- **Tujuan:** Menerima alamat email pengguna yang lupa password, menerbitkan token reset password satu kali pakai (berlaku 45 menit, disimpan sebagai hash SHA-256), dan mengirimkan tautan reset password ke email tersebut.
- **Persyaratan Autentikasi:** Publik.
- **Pembatasan Permintaan (Rate Limit):** Maksimal 1 permintaan per 60 detik dan 3 permintaan per 15 menit per Email dan per IP.
- **Validasi Input:**
  - `email`: Wajib, dinormalisasi `trim().toLowerCase()`, format email valid.
- **Request Body:**
  ```json
  {
    "email": "ilham@gmail.com"
  }
  ```
- **Response Sukses (`200 OK` — Anti-Enumerasi Ketat):**
  ```json
  {
    "ok": true,
    "cooldownSeconds": 60,
    "message": "Jika alamat email tersebut terdaftar di WarisMu, kami telah mengirimkan tautan untuk mengatur ulang password Anda."
  }
  ```
- **Kemungkinan HTTP Status Code:**
  - `200 OK`: Selalu dikembalikan baik email terdaftar maupun tidak terdaftar (mencegah *account enumeration*).
  - `400 Bad Request`: Format email tidak valid.
  - `429 Too Many Requests`: Melewati batas permintaan (`retryAfterSeconds`).
  - `503 Service Unavailable`: Layanan pengiriman email eksternal gagal dihubungi.

---

### 2.8. `POST /api/auth/reset-password`
- **Tujuan:** Memvalidasi token reset password, memperbarui `password_hash` pengguna dengan bcrypt cost 10, menandai token telah digunakan, dan **mencabut seluruh sesi aktif pengguna di semua perangkat** (`UPDATE auth_sessions SET revoked_at = now(), revoke_reason = 'password_reset' WHERE user_id = $1 AND revoked_at IS NULL`). Tidak menerbitkan token login baru.
- **Persyaratan Autentikasi:** Publik (menggunakan token reset).
- **Pembatasan Permintaan (Rate Limit):** Maksimal 5 permintaan per 15 menit per IP.
- **Validasi Input:**
  - `token`: Wajib, string hex 64 karakter.
  - `password`: Wajib, 8–72 karakter, kombinasi huruf dan angka.
  - `confirmPassword`: Wajib, harus sama persis dengan `password`.
- **Request Body:**
  ```json
  {
    "token": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    "password": "PasswordBaru2026",
    "confirmPassword": "PasswordBaru2026"
  }
  ```
- **Response Header (`200 OK`):**
  ```http
  Set-Cookie: warismu_rt=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=0
  ```
- **Response Body (`200 OK`):**
  ```json
  {
    "ok": true,
    "message": "Password berhasil diperbarui dan seluruh sesi lama telah dikeluarkan. Silakan masuk dengan password baru Anda."
  }
  ```
- **Kemungkinan HTTP Status Code:**
  - `200 OK`: Password berhasil di-reset dan seluruh sesi dicabut.
  - `400 Bad Request`:
    - Password lemah / konfirmasi tidak cocok (`VALIDATION_ERROR`).
    - Token tidak ditemukan (`INVALID_TOKEN`).
    - Token sudah pernah dipakai (`TOKEN_ALREADY_USED`).
  - `410 Gone`: Token reset telah melewati batas waktu 45 menit (`TOKEN_EXPIRED`).
  - `429 Too Many Requests`: Terlalu banyak percobaan per IP.

---

## 3. Rancangan Tampilan & Pengalaman Pengguna Frontend (Tahap Keenam)

Seluruh halaman autentikasi mempertahankan identitas visual **Modern Islamic Editorial WarisMu** (`bg-canvas`, kartu `bg-white border border-forest-900/10 rounded-3xl shadow-card p-6 sm:p-8`, tipografi judul `font-display text-forest-950`, tombol utama `bg-forest-900 text-white rounded-xl`).

### 3.1. Evaluasi & Rancangan 5 Halaman Autentikasi

| Halaman | Rute Vue Router | File Komponen | Perubahan / Elemen UI Utama |
|---|---|---|---|
| **1. Halaman Register** | `/#/daftar` | `src/pages/RegisterPage.vue` | Menambahkan input **Konfirmasi Password** (dengan tombol lihat/sembunyikan sandi dan indikator kecocokan real-time). Setelah submit berhasil (`201`), tampilan beralih ke kartu **"Verifikasi Email Anda"** (tidak langsung redirect ke `/chat`). |
| **2. Halaman Login** | `/#/masuk` | `src/pages/LoginPage.vue` | Menambahkan tautan **"Lupa password?"** di sebelah label Password yang mengarah ke `/#/lupa-password`. Menambahkan banner notifikasi kontekstual bila diarahkan dari halaman Verifikasi Email atau Reset Password, serta tombol **"Kirim Ulang Email Verifikasi"** bila login gagal karena `EMAIL_NOT_VERIFIED` (`403`). |
| **3. Halaman Verifikasi Email** | `/#/verifikasi-email` | `src/pages/VerifyEmailPage.vue` *(Baru)* | Membaca query `?token=...` dari hash route (`route.query.token`). Menampilkan state *Memverifikasi...* saat mount, state *Berhasil Diverifikasi* (dengan tombol **"Masuk ke Akun"**), atau state *Tautan Kedaluwarsa / Tidak Valid* (dengan form input email + tombol **"Kirim Ulang Tautan Verifikasi"**). |
| **4. Halaman Lupa Password** | `/#/lupa-password` | `src/pages/ForgotPasswordPage.vue` *(Baru)* | Kartu bersih berisi input **Alamat Email** dan tombol **"Kirim Tautan Reset Password"**, disertai tautan kembali ke `/#/masuk`. Setelah dikirim, menampilkan konfirmasi ramah dan penghitung waktu mundur (*cooldown* 60 detik) jika ingin mengirim ulang. |
| **5. Halaman Reset Password** | `/#/reset-password` | `src/pages/ResetPasswordPage.vue` *(Baru)* | Membaca `?token=...` dari `route.query.token`. Berisi input **Password Baru** dan **Konfirmasi Password Baru** beserta indikator validasi minimal 8 karakter (huruf + angka). Setelah berhasil (`200`), menampilkan pesan sukses selama 2 detik atau tombol langsung menuju `/#/masuk?reset=sukses`. |

### 3.2. Penanganan 10 Kondisi Pengalaman Pengguna (UX States)

1. **Registrasi Berhasil (`201 Created`):**
   - Form pendaftaran digantikan oleh panel konfirmasi di dalam kartu: ikon amplop hijau (`bg-forest-100 text-forest-900`), pesan *"Kami telah mengirimkan tautan verifikasi ke **nama@email.com**. Silakan klik tautan tersebut dalam 24 jam untuk mengaktifkan akun Anda."*, tombol **"Kirim Ulang Email (60d)"**, dan tautan **"Sudah verifikasi? Masuk di sini"**.
2. **Email Sudah Terdaftar (`409 Conflict`):**
   - Jika akun sudah aktif (`EMAIL_TAKEN`): tampilkan alert merah lembut (`bg-danger-soft text-danger-DEFAULT`) dengan tautan langsung: *"Email sudah terdaftar. Silakan **Masuk di sini** atau gunakan **Lupa Password**."*
   - Jika akun belum terverifikasi (`EMAIL_NOT_VERIFIED`): tampilkan alert kuning/amber (`bg-dalil-50 border-dalil-200 text-ink-800`) dengan tombol langsung **"Kirim Ulang Email Verifikasi"**.
3. **Email Belum Diverifikasi Saat Mencoba Login (`403 Forbidden`):**
   - Pada `LoginPage.vue`, muncul kotak peringatan ramah dengan tombol aksi langsung **"Kirim Ulang Tautan Verifikasi ke [email]"** tanpa memaksa pengguna mengetik ulang emailnya.
4. **Tautan Verifikasi Kedaluwarsa (`410 Gone`):**
   - Pada `VerifyEmailPage.vue`, tampilkan pesan *"Tautan verifikasi ini telah melewati batas waktu 24 jam."* disertai kolom input email dan tombol **"Kirim Tautan Verifikasi Baru"**.
5. **Pengiriman Email Gagal (`201 emailSent: false` atau `503`):**
   - Pengguna diberi tahu secara jujur bahwa akun sudah tercatat namun pengiriman email mengalami kendala jaringan, disertai tombol **"Coba Kirim Ulang Email"** yang dapat langsung diklik.
6. **Password Salah Saat Login (`401 Unauthorized`):**
   - Tampilkan pesan *"Email atau password yang Anda masukkan salah."* tanpa menyebutkan apakah emailnya yang salah atau passwordnya yang salah. Fokuskan kembali ke field password.
7. **Login Berhasil (`200 OK`):**
   - Simpan `accessToken` di memori aplikasi (`src/lib/akun.js`), simpan profil dasar pengguna, jalankan `migrasiSesiTamu()` bila ada riwayat percakapan tamu di `sessionStorage`, dan arahkan ke `/#/chat`.
8. **Reset Password Berhasil (`200 OK`):**
   - Tampilkan pesan sukses: *"Password Anda berhasil diperbarui dan seluruh sesi perangkat lama telah dikeluarkan."* Arahkan pengguna ke `/#/masuk` dengan banner hijau *"Password baru telah aktif. Silakan masuk."* (tanpa login otomatis).
9. **Tautan Reset Tidak Valid atau Kedaluwarsa (`400` / `410`):**
   - Pada `ResetPasswordPage.vue`, sembunyikan form password baru dan tampilkan pesan *"Tautan reset password tidak valid, sudah pernah digunakan, atau telah kedaluwarsa (lebih dari 45 menit)."* beserta tombol **"Minta Tautan Reset Baru"** yang mengarah ke `/#/lupa-password`.
10. **Pengiriman Ulang Email atau Login Dibatasi (`429 Too Many Requests`):**
    - Tombol kirim dinonaktifkan sementara dengan penghitung mundur visual (`"Tunggu 45 detik..."`) berdasarkan nilai `retryAfterSeconds` dari respons API.
