# Project Context & Architecture — WarisMu

## 1. High-Level Purpose
**WarisMu** adalah platform edukasi dan simulasi pembagian waris Islam (faraid) berbasis web untuk keluarga Muslim Indonesia yang menggabungkan **Kalkulator Faraid Deterministik** dengan **Konsultasi AI Berbasis Percakapan**, berlandaskan Al-Qur'an (QS. An-Nisa: 7, 11, 12, 176) dan Kompilasi Hukum Islam (KHI) Buku II.

---

## 2. Core Business Logic & Architectural Invariants (WAJIB DIPATUHI)

1. **Perhitungan Faraid 100% Deterministik (Bukan Dihitung oleh AI):**
   - LLM **DILARANG** menghitung porsi waris, menentukan pecahan bagian, atau mengarang angka nominal pembagian.
   - Pada alur `/api/chat`, LLM hanya memiliki 3 peran:
     1. **Ekstraksi Fakta (`ekstrakData`)**: Mengubah cerita bahasa alami pengguna menjadi JSON terstruktur (`ahli_waris` 23 variabel, `harta_total`, `harta_bersama`, `hutang`, `wasiat`, `data_cukup`).
     2. **Penjelasan Naratif (`jelaskanHasil`)**: Menyusun narasi dalil dan penjelasan yang ramah dari angka hasil perhitungan mesin faraid deterministik tanpa mengubah satu angka pun.
     3. **Tanya Jawab Edukasi Fikih (`jawabQnA`)**: Menjawab pertanyaan konsep/definisi hukum waris tanpa memaksa pengguna memulai simulasi baru.
2. **Urutan Penyelesaian Harta Sebelum Waris (Tirkah):**
   - Pisahkan **Harta Bersama (Gono-gini)** terlebih dahulu bila ada (1/2 untuk pasangan hidup, 1/2 masuk harta pewaris — KHI Pasal 85–97).
   - Kurangi dengan **Biaya Pengurusan Jenazah** dan **Hutang Pewaris**.
   - Kurangi dengan **Wasiat**, yang dibatasi maksimal **1/3 (sepertiga)** dari harta setelah hutang dan biaya jenazah.
   - Sisa bersih (**Tirkah**) adalah nominal yang didistribusikan ke mesin hitung faraid.
3. **Ketersediaan Tinggi (Zero-Crash Demo Guarantee):**
   - Apabila seluruh penyedia LLM gagal/timeout atau environment variable belum diisi, `/api/chat` wajib tetap mengembalikan HTTP 200 dengan `mockResponse()` / `mockQnAResponse()` (`dipakaiMock: true`) agar aplikasi tidak pernah rusak di hadapan pengguna.

---

## 3. Directory Structure

```text
/ (Root)
├── .ai/
│   └── CONTEXT.md                         # Dokumen konteks arsitektur ini
├── api/                                   # Vercel Serverless Functions (Node.js ESM)
│   ├── auth/
│   │   ├── login.js                       # POST /api/auth/login (verifikasi bcrypt + terbitkan JWT 7 hari)
│   │   └── register.js                    # POST /api/auth/register (validasi + hash bcrypt + insert users)
│   ├── lib/
│   │   ├── auth.js                        # Helper verifikasi header Authorization: Bearer <JWT>
│   │   ├── db.js                          # Singleton pg.Pool ke PostgreSQL Supabase (port 6543 pooler)
│   │   ├── faraidh.js                     # Normalisasi 23 field ahli waris & wrapper hitungFaraid()
│   │   ├── faraidhLokal.js                # Mesin hitung faraid deterministik backend (port Faraidh-API)
│   │   └── llmRouter.js                   # Router multi-LLM dengan fallback berantai & timeout budget
│   ├── chat.js                            # POST /api/chat (orkestrator hybrid QnA / Ekstraksi -> Faraidh -> Narasi)
│   ├── laporan.js                         # POST /api/laporan (simpan laporan jawaban AI ke tabel reports)
│   └── riwayat.js                         # GET/POST/DELETE /api/riwayat (CRUD sesi chat di tabel sessions)
├── db/
│   └── schema.sql                         # Skema PostgreSQL D1-D5 (users, sessions, consultations, reports, prompts)
├── docs/
│   ├── design/DESIGN_SYSTEM.md            # Spesifikasi sistem desain Modern Islamic Editorial
│   ├── maintenance/                       # Laporan audit struktur repository & migration manifest
│   ├── references/                        # Ringkasan struktur bab buku Fikih Faraidh (Dr. Khairuddin, M.Ag)
│   └── CHANGELOG.md                       # Log perubahan dan hasil peer testing
├── public/
│   ├── images/panduan/                    # 15 gambar cover artikel panduan (01 s/d 15)
│   ├── _redirects                         # Aturan SPA fallback static hosting
│   └── favicon.png                        # Favicon aplikasi
├── src/                                   # Frontend SPA (Vue 3 Composition API)
│   ├── assets/logo-waris-mu.png           # Aset logo utama
│   ├── components/                        # 13 komponen UI aktif
│   ├── data/panduan.js                    # Konten 15 artikel Pustaka Faraid
│   ├── lib/
│   │   ├── akun.js                        # State token/user localStorage, panggilApi(), migrasiSesiTamu()
│   │   └── faraidhCalculator.js           # Mesin hitung kalkulator interaktif sisi klien
│   ├── pages/                             # 9 komponen halaman rute
│   ├── router/index.js                    # Konfigurasi Vue Router (createWebHashHistory)
│   ├── styles/main.css                    # Entrypoint Tailwind CSS, font classes, grain overlay, print CSS
│   ├── App.vue                            # Layout utama (Navbar + RouterView + conditional Footer)
│   └── main.js                            # Bootstrap Vue App
├── archive/quarantine/                    # Lokasi karantina sementara aset/komponen lama
├── index.html                             # Entrypoint HTML Vite + Google Fonts preconnect
├── tailwind.config.js                     # Definisi token warna forest/waris/sage/ink/dalil/danger & font
├── vercel.json                            # Konfigurasi maxDuration 60s untuk api/chat.js & rewrite SPA
└── vite.config.js                         # Konfigurasi Vite + plugin dev middleware apiLokalDev()
```

---

## 4. Technology Stack & Configuration

- **Frontend:** Vue `^3.5.42`, Vue Router `^4.6.4` (Hash History mode `#/...` untuk kompatibilitas static hosting & subfolder), Vite `^8.3.0` (`base: './'`).
- **Styling:** Tailwind CSS `^3.4.19`, PostCSS, Autoprefixer, `@fortawesome/fontawesome-free` `^7.3.1`.
- **Backend Serverless:** Node.js ESM di folder `api/`. Saat menjalankan `npm run dev`, plugin `apiLokalDev()` di `vite.config.js` menyuntikkan `.env.local` ke `process.env` dan mengeksekusi handler di `api/` secara langsung tanpa memerlukan `vercel dev`.
- **Database:** Supabase PostgreSQL menggunakan paket `pg` (`^8.23.1`) melalui connection pooler (`port 6543`, `?pgbouncer=true`, `max: 5` koneksi per instance serverless).
- **Authentication:** Stateless JWT (`jsonwebtoken` `^9.0.3`) dan hashing password `bcryptjs` (`^3.0.3`). Token disimpan di browser pada `localStorage` (`warismu_token` dan `warismu_user`).

---

## 5. Multi-Provider AI Integration (`api/lib/llmRouter.js`)

Urutan fallback default (`LLM_PROVIDER_ORDER=gemini,deepseek,openrouter,nvidia`):
1. **Gemini (Utama):** `gemini-3.5-flash-lite` → fallback internal ke `gemini-flash-lite-latest` (`GEMINI_TIMEOUT_MS=12000`).
2. **DeepSeek via Zro / MoonMath.ai:** `deepseek-v4.1-flash` pada endpoint OpenAI-compatible `https://zro.moonmath.ai/v1/chat/completions` (`DEEPSEEK_TIMEOUT_MS=30000`).
3. **OpenRouter:** `openai/gpt-4o-mini` pada endpoint OpenAI-compatible `https://openrouter.ai/api/v1/chat/completions` (`OPENROUTER_TIMEOUT_MS=15000`).
4. **NVIDIA NIM (Cadangan Terakhir sebelum Mock):** `minimaxai/minimax-m3.1-flash`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`, `deepseek-ai/deepseek-v4.1-flash` dengan mekanisme **fail-fast** (`NVIDIA_TIMEOUT_MS=12000`, langsung keluar dari grup NVIDIA bila satu model gagal/timeout).
5. **OpenAI (Direct - Opsional):** `gpt-4o-mini` pada `https://api.openai.com/v1/chat/completions` bila `OPENAI_API_KEY` dikonfigurasi.
6. **Mock Fallback:** `mockResponse()` atau `mockQnAResponse()` bila seluruh provider gagal atau pagu total `LLM_TOTAL_TIMEOUT_MS=60000` habis.

---

## 6. Developer Constraints
1. **Jangan memindahkan atau mengubah nama folder `api/`, `public/`, `src/pages/`, atau `src/router/`** karena terikat langsung dengan konvensi Vercel Serverless, Vite, dan routing aplikasi.
2. **Jangan pernah meng-commit `.env` atau `.env.local`**. Gunakan `.env.example` untuk mendokumentasikan kunci konfigurasi baru.
3. **Jaga konsistensi mesin hitung faraid** antara `api/lib/faraidhLokal.js` dan `src/lib/faraidhCalculator.js`.
4. **Perbarui dokumen `.ai/CONTEXT.md` ini** setiap kali ada perubahan pada arsitektur, skema database, rute, atau urutan provider LLM.
