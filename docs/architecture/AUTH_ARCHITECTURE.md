# Rancangan Arsitektur Autentikasi WarisMu

- **Proyek:** WarisMu — Asisten Edukasi & Simulasi Waris Islam (Faraid)
- **Target Stack:** Vue 3 + Vite (SPA Hash Router), Node.js ESM Serverless Functions (Vercel), Supabase PostgreSQL (`pg` Pooler Port 6543)
- **Status Dokumen:** Rancangan Arsitektur Final (Menunggu Persetujuan Implementasi)

---

## 1. Prinsip Desain & Kepatuhan terhadap Arsitektur WarisMu

Rancangan ini disusun dengan mematuhi seluruh batasan proyek WarisMu:
1. **Tidak Mengubah Fitur Inti yang Sudah Berjalan:**
   - Tabel `sessions` (D2) tetap digunakan eksklusif untuk **riwayat sesi konsultasi chat** (`api/riwayat.js`).
   - Endpoint `POST /api/chat` dan `KalkulatorPage.vue` tetap dapat diakses tanpa login (**Mode Tamu / Guest Mode**).
   - Fitur migrasi sesi chat tamu (`migrasiSesiTamu()` di `src/lib/akun.js`) tetap dipertahankan dan disesuaikan agar berjalan saat pengguna berhasil login pertama kali setelah verifikasi email.
2. **Keamanan Standar Industri (Zero Trust Token Management):**
   -Seluruh token sensitif sekali pakai (verifikasi email, reset password) dan refresh token **tidak pernah disimpan dalam bentuk plaintext di database**, melainkan di-hash menggunakan **SHA-256 (`crypto.createHash('sha256')`)**.
   - **Access Token (JWT, 15 menit)** disimpan di memori aplikasi frontend (variabel reaktif di `src/lib/akun.js`, bukan di `localStorage`) atau disegarkan otomatis saat tab dimuat ulang (*silent refresh*).
   - **Refresh Token (Opaque 256-bit token, 7 hari)** disimpan di cookie browser dengan atribut **`HttpOnly; Secure; SameSite=Lax; Path=/api/auth`**.
3. **Biaya Operasional Nol / Sangat Rendah (Zero Extra Infrastructure Cost):**
   - Tidak memerlukan Redis berbayar untuk *session store* maupun *rate limiting*; seluruh pengelolaan sesi, rotasi refresh token, dan *sliding-window rate limiting* memanfaatkan **Supabase PostgreSQL** yang sudah digunakan proyek.
   - Pengiriman email menggunakan panggilan HTTP `fetch` murni (tanpa SDK berat) ke layanan transactional email gratis/hemat biaya (Resend REST API atau SMTP Brevo/Gmail App Password fallback).

---

## 2. Strategi Token, Sesi, Cookie, CSRF, dan CORS

### 2.1. Evaluasi Masa Berlaku Token (TTL)

| Jenis Token | Usulan Awal | Rekomendasi Final | Alasan Teknis & Evaluasi Kondisi Aplikasi WarisMu |
|---|---|---|---|
| **Access Token (JWT)** | 15 menit | **15 menit (`900s`)** | Sangat ideal. Sesi konsultasi faraid rata-rata berlangsung 5–20 menit. Jika akun dicabut/reset password, jendela akses maksimum token lama hanya 15 menit, sementara pengguna aktif tidak terganggu karena `panggilApi()` melakukan *silent refresh* otomatis. |
| **Refresh Token** | 7 hari | **7 hari (`604800s`)** | Seimbang antara kenyamanan keluarga yang kembali berkonsultasi di akhir pekan berikutnya dan keamanan perangkat bersama. Setiap kali dipakai, token dirotasi (*Refresh Token Rotation*). |
| **Token Verifikasi Email** | 24 jam | **24 jam (`86400s`)** | Memberi waktu cukup bagi pengguna yang tidak langsung membuka kotak masuk email, sambil membatasi umur tautan yang belum terpakai. |
| **Token Reset Password** | 30–60 menit | **45 menit (`2700s`)** | Titik tengah optimal dari rentang 30–60 menit: cukup longgar bila ada jeda pengiriman email 1–3 menit, namun cukup singkat untuk meminimalkan risiko penyalahgunaan tautan reset. |

### 2.2. Penyimpanan Token & Keamanan Cookie
1. **Access Token (JWT HS256):**
   - Payload: `{ sub: user.id, uid: user.id, email: user.email, sid: session.id, iat, exp }`.
   - Disimpan di **memori JavaScript (`let accessTokenMemori = ''` di `src/lib/akun.js`)**, **BUKAN di `localStorage`**.
   - Saat halaman di-refresh (`F5`), frontend memanggil `POST /api/auth/refresh` (yang otomatis menyertakan cookie `HttpOnly` refresh token) untuk mendapatkan access token baru dan data profil `user`.
2. **Refresh Token (Opaque 32-byte random hex / base64url):**
   - Dikirim oleh server melalui header `Set-Cookie`:
     ```http
     Set-Cookie: warismu_rt=<RAW_TOKEN>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800
     ```
   - *Catatan Development Lokal (`http://localhost:5173`):* Atribut `Secure` diaktifkan otomatis saat `process.env.NODE_ENV === 'production'` atau `req.headers['x-forwarded-proto'] === 'https'`, sehingga tetap bekerja saat pengujian di `vite dev` (`http://localhost`).
   - Pembatasan `Path=/api/auth` memastikan browser **hanya** mengirimkan cookie refresh token saat memanggil `/api/auth/refresh` atau `/api/auth/logout`, dan tidak membebani request `/api/chat` atau `/api/riwayat`.

### 2.3. Perlindungan CSRF dan CORS
- Karena frontend Vue 3 dan backend `api/` di-deploy pada **satu origin yang sama di Vercel** (misalnya `https://warismu.vercel.app` dan `/api/...`):
  1. **CORS:** Tidak perlu membuka `Access-Control-Allow-Origin: *` pada endpoint `/api/auth/*`. Semua request adalah *Same-Origin*.
  2. **CSRF:**
     - Seluruh endpoint `/api/auth/*` yang mengubah state hanya menerima metode `POST` dengan header `Content-Type: application/json`. Browser secara native memblokir pengiriman lintas-situs (`cross-origin`) dengan `Content-Type: application/json` tanpa *preflight* CORS.
     - Cookie menggunakan `SameSite=Lax` (atau `Strict`).
     - Tambahan lapisan keamanan (*Defense-in-Depth*): Middleware memeriksa header `Origin` / `Referer` pada setiap request `POST /api/auth/refresh` dan `POST /api/auth/logout` agar sesuai dengan host aplikasi (`APP_BASE_URL` atau `req.headers.host`).

---

## 3. Rancangan Perubahan Struktur Database (PostgreSQL)

Untuk menjaga kompatibilitas 100% dengan `db/schema.sql` saat ini (tabel D1–D5), kita menambahkan kolom baru pada `users` secara non-destruktif (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`) dan menambahkan 3 tabel khusus autentikasi (`auth_sessions`, `auth_tokens`, `auth_rate_limits`).

### 3.1. Diagram Entity-Relationship (ERD)

```mermaid
erDiagram
    users ||--o{ sessions : "memiliki riwayat chat (D2)"
    users ||--o{ reports : "melaporkan jawaban AI (D4)"
    users ||--o{ auth_sessions : "memiliki sesi perangkat login"
    users ||--o{ auth_tokens : "memiliki token verifikasi & reset"

    users {
        uuid id PK
        text email UK "Normalized: trim() + toLowerCase()"
        text password_hash "bcrypt cost 10"
        text nama
        text role "default: user"
        text status "pending_verification | active | suspended"
        timestamptz email_verified_at "NULL jika belum verifikasi"
        timestamptz password_changed_at
        timestamptz created_at
        timestamptz updated_at
    }

    auth_sessions {
        uuid id PK
        uuid user_id FK "ON DELETE CASCADE"
        uuid family_id "Deteksi rotasi & token reuse"
        text token_hash UK "SHA-256 hash dari refresh token"
        text user_agent "Informasi browser/perangkat"
        text ip_address "IP saat login/refresh"
        timestamptz expires_at "now() + 7 days"
        timestamptz revoked_at "NULL jika masih aktif"
        text revoke_reason "logout | rotation | reuse_detected | password_reset"
        uuid replaced_by_id FK "Merujuk ke auth_sessions(id) hasil rotasi"
        timestamptz created_at
        timestamptz last_used_at
    }

    auth_tokens {
        uuid id PK
        uuid user_id FK "ON DELETE CASCADE"
        text purpose "email_verification | password_reset"
        text token_hash UK "SHA-256 hash dari raw token di URL email"
        timestamptz expires_at "24h (verifikasi) / 45m (reset)"
        timestamptz used_at "NULL jika belum dipakai (single-use)"
        text created_ip
        timestamptz created_at
    }

    auth_rate_limits {
        text key PK "Contoh: login:ip:1.2.3.4 atau resend:email:user@mail.com"
        int count "Jumlah percobaan dalam jendela aktif"
        timestamptz window_start "Awal jendela perhitungan"
        timestamptz locked_until "NULL atau waktu berakhir blokir"
    }
```

### 3.2. Spesifikasi DDL SQL Baru

```sql
-- ============================================================================
-- MIGRASI AUTENTIKASI WARISMU (NON-DESTRUCTIVE)
-- ============================================================================

-- 1. Perluasan Tabel D1: users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_verification',
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

-- Catatan Migrasi Akun Lama:
-- Akun yang sudah terdaftar sebelum fitur verifikasi email diterapkan dapat ditandai
-- aktif agar pengguna lama tidak terkunci (opsional, lihat AUTH_IMPLEMENTATION_PLAN.md).

CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

-- 2. Tabel Sesi Perangkat & Refresh Token (auth_sessions)
CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL DEFAULT gen_random_uuid(),
  token_hash TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  replaced_by_id UUID REFERENCES auth_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_family_id ON auth_sessions (family_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions (expires_at);

-- 3. Tabel Token Sekali Pakai: Verifikasi Email & Reset Password (auth_tokens)
CREATE TABLE IF NOT EXISTS auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('email_verification', 'password_reset')),
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_purpose ON auth_tokens (user_id, purpose);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_tokens (expires_at);

-- 4. Tabel Rate Limiting Serverless (auth_rate_limits)
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_window ON auth_rate_limits (window_start);
```

### 3.3. Kebijakan Penyimpanan, Pembatalan, dan Penghapusan Token (Housekeeping)
1. **Penyimpanan Hanya Hash:** Token mentah (`rawToken = crypto.randomBytes(32).toString('hex')`) hanya dikirim ke email pengguna atau cookie `HttpOnly`. Database hanya menyimpan `crypto.createHash('sha256').update(rawToken).digest('hex')`.
2. **Invalidasi Token Lama Saat Terbit Baru:**
   - Saat pengguna meminta kirim ulang email verifikasi, seluruh token `email_verification` milik `user_id` tersebut yang belum terpakai (`used_at IS NULL`) langsung di-update menjadi `used_at = now()` sebelum token baru dibuat.
   - Saat pengguna meminta reset password baru, seluruh token `password_reset` milik `user_id` tersebut yang belum terpakai langsung di-update menjadi `used_at = now()`.
3. **Opportunistic Cleanup (Pembersihan Otomatis Tanpa Cron Berbayar):**
   - Pada operasi tulis autentikasi, server dapat menjalankan kueri pembersihan ringan secara asinkron (*fire-and-forget*):
     - Menghapus baris `auth_tokens` yang sudah kedaluwarsa lebih dari 7 hari (`expires_at < now() - interval '7 days'`).
     - Menghapus baris `auth_sessions` yang sudah kedaluwarsa atau dicabut lebih dari 30 hari.
     - Menghapus baris `auth_rate_limits` yang `window_start < now() - interval '1 day'`.

---

## 4. Diagram Alur 12 Proses Autentikasi

### 4.1. Alur 1: Registrasi (`POST /api/auth/register`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as RegisterPage.vue
    participant API as POST /api/auth/register
    participant DB as Supabase PostgreSQL
    participant Mail as Layanan Email

    User->>UI: Isi Nama, Email, Password, Konfirmasi Password
    UI->>UI: Validasi kecocokan password & kekuatan sandi
    UI->>API: POST { nama, email, password, confirmPassword }
    API->>DB: Cek Rate Limit IP (maks 5 registrasi / 15 menit)
    API->>API: Normalisasi email: email.trim().toLowerCase()
    API->>API: Validasi input & panjang password (8-72 karakter)
    API->>DB: SELECT id, status, email_verified_at FROM users WHERE email = $1
    alt Email sudah terdaftar & terverifikasi
        API-->>UI: 409 Conflict ("Email sudah terdaftar, silakan masuk.")
    else Email sudah terdaftar tapi belum terverifikasi
        API-->>UI: 409 Conflict (code: EMAIL_NOT_VERIFIED, tawarkan kirim ulang verifikasi)
    else Email baru
        API->>API: bcrypt.hash(password, 10)
        API->>DB: INSERT INTO users (status='pending_verification', email_verified_at=NULL)
        API->>API: Generate 32-byte rawToken & SHA-256 tokenHash
        API->>DB: INSERT INTO auth_tokens (purpose='email_verification', expires=24h)
        API->>Mail: Kirim email tautan /#/verifikasi-email?token=<rawToken>
        alt Email berhasil dikirim
            API-->>UI: 201 Created { message, requiresVerification: true, email }
            UI-->>User: Tampilkan layar "Cek Email Anda untuk Verifikasi"
        else Pengiriman email gagal
            API-->>UI: 201 Created { message, requiresVerification: true, emailSent: false }
            UI-->>User: Akun tercatat, tampilkan tombol "Kirim Ulang Email Verifikasi"
        end
    end
```

### 4.2. Alur 2: Verifikasi Email (`POST /api/auth/verify-email`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as VerifyEmailPage.vue
    participant API as POST /api/auth/verify-email
    participant DB as Supabase PostgreSQL

    User->>UI: Klik tautan di email (/#/verifikasi-email?token=RAW_TOKEN)
    UI->>API: POST { token: RAW_TOKEN }
    API->>API: Hitung tokenHash = SHA256(RAW_TOKEN)
    API->>DB: SELECT token & user WHERE token_hash = $1 AND purpose = 'email_verification'
    alt Token tidak ditemukan
        API-->>UI: 400 Bad Request (code: INVALID_TOKEN)
    else Token sudah pernah digunakan (used_at IS NOT NULL)
        API-->>UI: 400 Bad Request (code: TOKEN_ALREADY_USED)
    else Token sudah kedaluwarsa (expires_at < now())
        API-->>UI: 410 Gone (code: TOKEN_EXPIRED)
    else Token valid
        API->>DB: BEGIN TRANSACTION
        API->>DB: UPDATE auth_tokens SET used_at = now() WHERE id = $1
        API->>DB: UPDATE users SET status = 'active', email_verified_at = now(), updated_at = now() WHERE id = $2
        API->>DB: COMMIT
        API-->>UI: 200 OK { message: "Email berhasil diverifikasi. Silakan masuk." }
        UI-->>User: Tampilkan pesan sukses & tombol/redirect ke /#/masuk
    end
```

### 4.3. Alur 3: Pengiriman Ulang Verifikasi (`POST /api/auth/resend-verification`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as VerifyEmailPage / LoginPage
    participant API as POST /api/auth/resend-verification
    participant DB as Supabase PostgreSQL
    participant Mail as Layanan Email

    User->>UI: Masukkan email & klik "Kirim Ulang Email Verifikasi"
    UI->>API: POST { email }
    API->>API: Normalisasi email.trim().toLowerCase()
    API->>DB: Cek Rate Limit (maks 1x per 60 detik & 3x per 15 menit per email/IP)
    alt Melewati batas Rate Limit
        API-->>UI: 429 Too Many Requests (sertakan retryAfterSeconds)
    else Dalam batas aman
        API->>DB: SELECT id, nama, status, email_verified_at FROM users WHERE email = $1
        alt Email tidak ditemukan ATAU sudah terverifikasi
            API-->>UI: 200 OK (Pesan generik anti-enumerasi: "Jika akun belum terverifikasi, tautan baru telah dikirim.")
        else Akun ada & belum terverifikasi
            API->>DB: UPDATE auth_tokens SET used_at = now() WHERE user_id = $1 AND purpose = 'email_verification' AND used_at IS NULL
            API->>API: Generate rawToken baru & SHA-256 tokenHash
            API->>DB: INSERT INTO auth_tokens (purpose='email_verification', expires=24h)
            API->>Mail: Kirim email verifikasi baru
            API-->>UI: 200 OK ("Jika akun belum terverifikasi, tautan baru telah dikirim.")
        end
    end
```

### 4.4. Alur 4: Login (`POST /api/auth/login`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as LoginPage.vue
    participant API as POST /api/auth/login
    participant DB as Supabase PostgreSQL

    User->>UI: Isi Email & Password
    UI->>API: POST { email, password }
    API->>API: Normalisasi email.trim().toLowerCase()
    API->>DB: Cek Rate Limit (maks 5 gagal / 15 menit per IP + Email)
    alt Terkunci Rate Limit
        API-->>UI: 429 Too Many Requests ("Terlalu banyak percobaan. Coba lagi dalam X menit.")
    else Boleh lanjut
        API->>DB: SELECT id, nama, email, password_hash, status, email_verified_at FROM users WHERE email = $1
        alt User tidak ditemukan
            API->>API: bcrypt.compare(password, DUMMY_HASH) (Cegah timing attack)
            API->>DB: Catat kegagalan pada auth_rate_limits
            API-->>UI: 401 Unauthorized ("Email atau password salah")
        else Password tidak cocok
            API->>DB: Catat kegagalan pada auth_rate_limits
            API-->>UI: 401 Unauthorized ("Email atau password salah")
        else Password cocok NAMUN email_verified_at IS NULL
            API-->>UI: 403 Forbidden { code: "EMAIL_NOT_VERIFIED", error: "Email Anda belum diverifikasi." }
            UI-->>User: Tampilkan tombol "Kirim Ulang Email Verifikasi"
        else Password cocok & Akun aktif
            API->>DB: Reset counter gagal login di auth_rate_limits
            API->>API: Buat Refresh Token (32-byte) + SHA-256 hash
            API->>DB: INSERT INTO auth_sessions (user_id, family_id, token_hash, expires=7d, user_agent, ip)
            API->>API: Buat Access Token JWT (expires=15m, payload: { uid, email, sid })
            API-->>UI: 200 OK + Set-Cookie: warismu_rt (HttpOnly, Secure, SameSite=Lax) + Body { accessToken, user }
            UI->>UI: Simpan accessToken di memori & migrasiSesiTamu()
            UI-->>User: Redirect ke /#/chat
        end
    end
```

### 4.5. Alur 5: Logout (`POST /api/auth/logout`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as Navbar / ChatSidebar
    participant API as POST /api/auth/logout
    participant DB as Supabase PostgreSQL

    User->>UI: Klik tombol "Keluar"
    UI->>API: POST /api/auth/logout (Cookie warismu_rt terkirim otomatis)
    API->>API: Baca cookie warismu_rt & hitung SHA-256 tokenHash
    alt Cookie ada
        API->>DB: UPDATE auth_sessions SET revoked_at = now(), revoke_reason = 'logout' WHERE token_hash = $1
    end
    API-->>UI: 200 OK + Set-Cookie: warismu_rt=; Max-Age=0 (Hapus cookie)
    UI->>UI: Bersihkan accessToken di memori & profil pengguna
    UI-->>User: Kembali ke Beranda (/#/)
```

### 4.6. Alur 6 & 7: Refresh Access Token & Rotasi Refresh Token (`POST /api/auth/refresh`)

```mermaid
sequenceDiagram
    participant UI as src/lib/akun.js (panggilApi / initAuth)
    participant API as POST /api/auth/refresh
    participant DB as Supabase PostgreSQL

    UI->>API: POST /api/auth/refresh (Cookie HttpOnly warismu_rt)
    API->>API: Ekstrak warismu_rt & hitung tokenHash = SHA256(warismu_rt)
    API->>DB: SELECT session & user FROM auth_sessions JOIN users WHERE token_hash = $1
    alt Token tidak ditemukan di DB
        API-->>UI: 401 Unauthorized + Hapus Cookie
    else Token SUDAH PERNAH DICABUT / DIROTASI (revoked_at IS NOT NULL)
        Note over API,DB: DETEKSI TOKEN REUSE (Indikasi pencurian refresh token!)
        API->>DB: UPDATE auth_sessions SET revoked_at = now(), revoke_reason = 'reuse_detected' WHERE family_id = session.family_id
        API-->>UI: 401 Unauthorized + Hapus Cookie
    else Token sudah kedaluwarsa (expires_at < now()) atau user tidak aktif
        API->>DB: UPDATE auth_sessions SET revoked_at = now(), revoke_reason = 'expired' WHERE id = session.id
        API-->>UI: 401 Unauthorized + Hapus Cookie
    else Token Valid & Aktif
        API->>API: Generate Refresh Token Baru (newRawToken, newTokenHash)
        API->>DB: BEGIN TRANSACTION
        API->>DB: INSERT INTO auth_sessions (user_id, family_id=session.family_id, token_hash=newTokenHash, expires=7d) RETURNING id
        API->>DB: UPDATE auth_sessions SET revoked_at = now(), revoke_reason = 'rotation', replaced_by_id = newId WHERE id = session.id
        API->>DB: COMMIT
        API->>API: Sign Access Token JWT baru (15 menit)
        API-->>UI: 200 OK + Set-Cookie: warismu_rt=newRawToken + Body { accessToken, user }
    end
```

### 4.7. Alur 8: Lupa Password (`POST /api/auth/forgot-password`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as ForgotPasswordPage.vue
    participant API as POST /api/auth/forgot-password
    participant DB as Supabase PostgreSQL
    participant Mail as Layanan Email

    User->>UI: Masukkan alamat email & klik "Kirim Tautan Reset"
    UI->>API: POST { email }
    API->>API: Normalisasi email.trim().toLowerCase()
    API->>DB: Cek Rate Limit (maks 3 permintaan / 15 menit per IP & email)
    alt Terkena Rate Limit
        API-->>UI: 429 Too Many Requests
    else Dalam batas aman
        API->>DB: SELECT id, nama, email FROM users WHERE email = $1
        alt Email TIDAK terdaftar
            Note over API,UI: Anti-Enumerasi: Jangan bocorkan bahwa email tidak terdaftar
            API-->>UI: 200 OK ("Jika email terdaftar, tautan reset password telah dikirim.")
        else Email terdaftar
            API->>DB: UPDATE auth_tokens SET used_at = now() WHERE user_id = $1 AND purpose = 'password_reset' AND used_at IS NULL
            API->>API: Generate 32-byte rawToken & SHA-256 tokenHash
            API->>DB: INSERT INTO auth_tokens (purpose='password_reset', expires=now()+45m)
            API->>Mail: Kirim email tautan /#/reset-password?token=<rawToken>
            API-->>UI: 200 OK ("Jika email terdaftar, tautan reset password telah dikirim.")
        end
    end
```

### 4.8. Alur 9 & 10: Reset Password & Pencabutan Seluruh Sesi (`POST /api/auth/reset-password`)

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as ResetPasswordPage.vue
    participant API as POST /api/auth/reset-password
    participant DB as Supabase PostgreSQL

    User->>UI: Buka /#/reset-password?token=RAW_TOKEN, isi Password Baru & Konfirmasi
    UI->>API: POST { token, password, confirmPassword }
    API->>API: Validasi kekuatan password (8-72 karakter, huruf+angka) & kecocokan konfirmasi
    API->>API: Hitung tokenHash = SHA256(token)
    API->>DB: SELECT id, user_id, expires_at, used_at FROM auth_tokens WHERE token_hash = $1 AND purpose = 'password_reset'
    alt Token tidak valid / sudah dipakai / kedaluwarsa
        API-->>UI: 400 / 410 Error ("Tautan reset tidak valid atau sudah kedaluwarsa.")
    else Token valid
        API->>API: newHash = bcrypt.hash(password, 10)
        API->>DB: BEGIN TRANSACTION
        API->>DB: UPDATE auth_tokens SET used_at = now() WHERE user_id = $1 AND purpose = 'password_reset' AND used_at IS NULL
        API->>DB: UPDATE users SET password_hash = newHash, password_changed_at = now(), status = 'active', email_verified_at = COALESCE(email_verified_at, now()), updated_at = now() WHERE id = $1
        Note over API,DB: CABUT SELURUH SESI AKTIF DI SEMUA PERANGKAT
        API->>DB: UPDATE auth_sessions SET revoked_at = now(), revoke_reason = 'password_reset' WHERE user_id = $1 AND revoked_at IS NULL
        API->>DB: COMMIT
        API-->>UI: 200 OK + Hapus cookie warismu_rt (Tanpa auto-login!)
        UI-->>User: Tampilkan notifikasi sukses & arahkan ke /#/masuk untuk login ulang
    end
```

### 4.9. Alur 11: Perlindungan Endpoint API (`/api/riwayat` & `/api/laporan`)

```mermaid
flowchart TD
    A["Request ke /api/riwayat atau /api/laporan"] --> B{"Header Authorization: Bearer <JWT> ada?"}
    B -- Tidak --> C["HTTP 401 Unauthorized"]
    B -- Ya --> D{"jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) valid?"}
    D -- Tidak / Expired --> C
    D -- Ya --> E["Ekstrak { uid, email, sid }"]
    E --> F["Jalankan Handler dengan filter user_id = uid"]
    C --> G["Frontend panggilApi() menangkap 401"]
    G --> H{"Sudah mencoba silent refresh?"}
    H -- Belum --> I["Panggil POST /api/auth/refresh"]
    I -- Berhasil 200 --> J["Simpan accessToken baru & Ulangi Request Asli"]
    I -- Gagal 401 --> K["Jalankan sesiHabis() & Arahkan ke Mode Tamu / Login"]
    H -- Sudah --> K
```

---

## 5. Rancangan Integrasi Layanan Email Transaksional

### 5.1. Evaluasi & Rekomendasi Provider Email untuk WarisMu

Karena WarisMu di-deploy di **Vercel Serverless Functions**, layanan pengiriman email harus:
- Dapat dipanggil melalui **HTTPS REST API (`fetch` murni)** tanpa bergantung pada koneksi TCP SMTP port 25/465 yang sering diblokir atau lambat (*cold-start*) di lingkungan serverless.
- Memiliki paket gratis (*free tier*) yang memadai untuk kebutuhan akademik, demo, dan produksi skala awal.

| Kriteria | **Opsi 1: Resend (DIREKOMENDASIKAN UTAMA)** | **Opsi 2: Brevo (Sendinblue) HTTP API (REKOMENDASI ALTERNATIF)** |
|---|---|---|
| **Kuota Gratis** | **3.000 email / bulan** (100 email / hari) — Gratis selamanya | **300 email / hari** (~9.000 email / bulan) — Gratis selamanya |
| **Metode Integrasi** | `fetch('https://api.resend.com/emails', ...)` — **0 dependensi npm tambahan** | `fetch('https://api.brevo.com/v3/smtp/email', ...)` — **0 dependensi npm tambahan** |
| **Kesesuaian Vercel** | Sangat tinggi (dirancang khusus untuk serverless, respons < 300 ms) | Tinggi (REST API JSON standar) |
| **Syarat Domain** | Memerlukan verifikasi DNS domain kustom untuk kirim ke sembarang email; tanpa domain kustom hanya bisa mengirim ke email pemilik akun. | **Dapat mengirim ke alamat email mana pun** (Gmail/Yahoo/Outlook pengguna) hanya dengan memverifikasi 1 alamat email pengirim (*Single Sender Verification*), tanpa wajib membeli domain kustom! |

> **Rekomendasi Arsitektur Adapter (`api/lib/mailer.js`):**
> Gunakan pola *provider-agnostic HTTP mailer* di `api/lib/mailer.js` yang mendukung:
> 1. **`EMAIL_PROVIDER=brevo`** (Sangat cocok jika WarisMu masih menggunakan domain `.vercel.app` dan belum membeli domain kustom, karena Brevo mengizinkan pengiriman ke email pengguna mana pun dengan *verified sender email* gratis).
> 2. **`EMAIL_PROVIDER=resend`** (Sangat cocok jika WarisMu sudah memiliki domain kustom yang diverifikasi DNS-nya).
> 3. **`EMAIL_PROVIDER=console` (Dev Mode Fallback):** Saat berjalan di lokal (`npm run dev`) dan API key email belum diisi, tautan verifikasi/reset dicetak dengan jelas di terminal server lokal agar pengembang tetap dapat menguji alur end-to-end tanpa hambatan.

### 5.2. Konfigurasi Environment Variable Baru (`.env.example`)

Tambahkan variabel berikut ke `.env.example` (tanpa menyertakan secret asli):
```dotenv
# ---- Konfigurasi Autentikasi & Sesi ----
JWT_SECRET=ganti-dengan-string-acak-minimal-32-karakter
JWT_ACCESS_EXPIRES_IN=15m
REFRESH_TOKEN_TTL_DAYS=7
EMAIL_VERIFY_TTL_HOURS=24
PASSWORD_RESET_TTL_MINUTES=45

# URL publik aplikasi untuk menyusun tautan di dalam email (tanpa garis miring di akhir)
APP_BASE_URL=http://localhost:5173

# ---- Layanan Email Transaksional (pilih: brevo | resend | console) ----
EMAIL_PROVIDER=brevo
EMAIL_FROM_NAME=WarisMu — Asisten Waris Islam
EMAIL_FROM_ADDRESS=no-reply@domain-anda.com

# Jika memakai Brevo (https://app.brevo.com/settings/keys/api)
BREVO_API_KEY=

# Jika memakai Resend (https://resend.com/api-keys)
RESEND_API_KEY=
```

### 5.3. Format URL di Dalam Email (Kompatibilitas Vue Router Hash History)
Karena `src/router/index.js` menggunakan `createWebHashHistory()`, seluruh tautan yang dikirim ke email pengguna **wajib menggunakan prefix `/#/`**:
- **Tautan Verifikasi Email:** `${APP_BASE_URL}/#/verifikasi-email?token=${encodeURIComponent(rawToken)}`
- **Tautan Reset Password:** `${APP_BASE_URL}/#/reset-password?token=${encodeURIComponent(rawToken)}`

### 5.4. Penanganan Kegagalan Pengiriman Email (Graceful Error Handling)
1. **Saat Registrasi (`POST /api/auth/register`):**
   - Jika `INSERT INTO users` dan `INSERT INTO auth_tokens` sudah berhasil tetapi panggilan HTTP ke provider email gagal/timeout (mis. gangguan jaringan eksternal):
   - Akun **tetap tersimpan** dengan status `pending_verification` (tidak membuat akun gagal terdaftar atau inkonsisten).
   - API mengembalikan HTTP `201 Created` dengan flag `emailSent: false` dan pesan: *"Akun berhasil dibuat, namun pengiriman email verifikasi mengalami kendala. Silakan klik tombol Kirim Ulang Email Verifikasi."*
2. **Saat Pengiriman Ulang Verifikasi / Lupa Password:**
   - Jika provider email gagal merespons dalam batas timeout (8 detik), kembalikan HTTP `503 Service Unavailable` dengan pesan ramah: *"Layanan pengiriman email sedang sibuk. Silakan coba lagi dalam beberapa saat."* tanpa membocorkan detail teknis atau stack trace.
