# 🕌 WarisMu — Asisten Edukasi & Simulasi Waris Islam

> Platform edukasi kewarisan Islam (faraid) berbasis web dengan pendekatan **Kalkulator Faraid Interaktif** dan **Konsultasi AI Berbasis Percakapan**.
> Pengguna dapat menghitung bagian waris secara langsung melalui formulir terstruktur atau bercerita dalam bahasa natural → sistem mengekstraksi data keluarga → menanyakan yang kurang → menghitung secara deterministik → menampilkan hasil (rincian bagian + visualisasi proporsi + dalil + *disclaimer*).

**Tugas Proyek — Informatika.** Repo ini berisi **Frontend Vue 3** (`src/`) + **API Serverless** (`api/`). Mesin AI memakai rantai *fallback* **Gemini → DeepSeek (Zro) → OpenRouter → NVIDIA**; bila semuanya tidak bisa dihubungi atau database belum diisi, chatbot otomatis jatuh ke **mode mock** sehingga demo perkuliahan tidak pernah mati.

---

## 👨‍💻 Developer
- **Nama:** Thopan Rahman Hakim
- **NIM:** 11241084
- **Program Studi:** Informatika

---

## 🔗 Live Demo & Repository
- **Website (Vercel):** [https://warismu.vercel.app](https://warismu.vercel.app)
- **GitHub Repo:** [https://github.com/thopanrahman/Warismu](https://github.com/thopanrahman/Warismu)

---

## 🎨 Arah Desain (Modern Islamic Editorial & Anti-Slop)

Sistem desain dibangun mengacu pada spesifikasi [docs/design/DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) untuk menghindari tampilan antarmuka AI yang generik:
- **Warna Brand:** Palet `forest-50…950` (dengan alias kompatibilitas `waris-50…950`, primary `forest-900` `#1d3e32`) dan aksen sekunder `sage-50…900`.
- **Netral & Latar:** `canvas` `#fbfcf9` (Latar utama), `paper` `#f7faf7`, `cream` `#fdfdfb`, `surface` `#ffffff`, `ink` `#13251c` (Teks utama), serta aksen `dalil` `#b47a18` untuk kutipan ayat/syariat.
- **Tipografi:** **Fraunces** (Editorial Serif) untuk judul/heading, **Plus Jakarta Sans** & **Nunito** (Sans-serif) untuk antarmuka/body, serta **Amiri** (Serif) untuk teks ayat Al-Qur'an.
- **Aturan Ketat:** Layout wajib menggunakan *Flexbox/Grid Tailwind* (tidak menggunakan `<table>` untuk layout halaman).

---

## ✨ Fitur Utama

- **Kalkulator Faraid Interaktif (`/kalkulator`)**: Simulasi perhitungan waris instan di sisi klien dengan preset kasus nyata, pengurang harta (hutang, pemakaman, wasiat maks 1/3), visualisasi bar proporsi pembagian, tombol salin/cetak laporan, dan integrasi langsung ke Chat AI.
- **Chatbot Konsultasi AI (`/chat`)**: Antarmuka percakapan dengan *sidebar* riwayat, pencarian sesi, *starter cards*, *bubble* chat interaktif, mode tanya-jawab fikih (Q&A), indikator *typing*, pelaporan jawaban AI, dan *fallback* mode offline (mock).
- **Ekstraksi & Penjelasan AI Multi-Provider**: Rantai LLM di `api/lib/llmRouter.js` — **1. Gemini** (`gemini-3.5-flash-lite` → `gemini-flash-lite-latest`) → **2. DeepSeek via Zro** (`deepseek-v4.1-flash`) → **3. OpenRouter** (`openai/gpt-4o-mini`) → **4. NVIDIA** (`minimaxai/minimax-m3.1-flash`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`, `deepseek-ai/deepseek-v4.1-flash`) — hanya bertugas mengekstrak cerita user menjadi JSON dan menyusun narasi penjelasan dalil.
- **Kalkulasi Faraid Deterministik**: Perhitungan pembagian waris tidak pernah diserahkan ke AI, melainkan dijalankan oleh mesin hitung deterministik di `api/lib/faraidhLokal.js` (backend) dan `src/lib/faraidhCalculator.js` (frontend) — lihat [Kredit & Atribusi](#-kredit--atribusi).
- **Autentikasi & Migrasi Sesi Tamu (`/masuk`, `/daftar`)**: Terintegrasi dengan database Supabase (PostgreSQL) menggunakan `bcryptjs` dan JWT, lengkap dengan migrasi otomatis riwayat chat dari sesi tamu setelah login/registrasi.
- **Pustaka Faraid (`/panduan`, `/panduan/:id`)**: 15 artikel edukasi fikih faraid dan KHI dengan filter kategori, kutipan dalil Arab, dan poin rangkuman.
- **Halaman Lengkap (9 Rute)**: Beranda (`/`), Kalkulator Faraid (`/kalkulator`), Chat Konsultasi (`/chat`), Pustaka Panduan (`/panduan`), Detail Panduan (`/panduan/:id`), Tentang (`/tentang`), Kontak (`/kontak`), Daftar Akun (`/daftar`), dan Masuk (`/masuk`).

---

## 📁 Struktur Direktori

```text
warismu/
├── .ai/                          # Konteks arsitektur khusus LLM (.ai/CONTEXT.md)
├── api/                          # Vercel Serverless Functions (Backend API)
│   ├── auth/                     # Endpoint POST /api/auth/login & /api/auth/register
│   ├── lib/                      # Modul db, auth JWT, faraidh, faraidhLokal, llmRouter
│   ├── chat.js                   # Orkestrator hybrid POST /api/chat
│   ├── laporan.js                # Endpoint POST /api/laporan
│   └── riwayat.js                # Endpoint GET/POST/DELETE /api/riwayat
├── db/                           # Skema database PostgreSQL Supabase (db/schema.sql)
├── docs/                         # Dokumentasi proyek, desain, referensi & audit
│   ├── design/DESIGN_SYSTEM.md   # Spesifikasi sistem desain utama
│   ├── maintenance/              # Laporan audit repository & migration manifest
│   ├── references/               # Struktur bab buku referensi Fikih Faraidh
│   └── CHANGELOG.md              # Catatan perubahan & perbaikan peer testing
├── public/                       # Aset statis publik (favicon, gambar artikel panduan)
├── src/                          # Kode sumber Frontend Vue 3
│   ├── assets/                   # Aset ter-bundle (logo-waris-mu.png)
│   ├── components/               # Komponen UI Vue (13 komponen aktif)
│   ├── data/                     # Data artikel Pustaka Faraid (panduan.js)
│   ├── lib/                      # Utilitas auth klien (akun.js) & kalkulator (faraidhCalculator.js)
│   ├── pages/                    # 9 halaman rute Vue Router
│   ├── router/                   # Konfigurasi Vue Router (Hash Mode)
│   └── styles/                   # Styling utama Tailwind CSS (main.css)
├── index.html                    # Entrypoint HTML aplikasi
├── tailwind.config.js            # Konfigurasi token warna & tipografi Tailwind
├── vercel.json                   # Konfigurasi Vercel Serverless & SPA rewrite
└── vite.config.js                # Konfigurasi Vite + plugin middleware API lokal dev
```

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Frontend** | Vue 3 (Composition API), Vue Router (Hash Mode), Vite |
| **Styling** | Tailwind CSS, PostCSS, Font Awesome Free |
| **Backend / API** | Vercel Serverless Functions (Node.js ESM) + Vite Local Dev Middleware |
| **Database** | PostgreSQL (Supabase Transaction Pooler) via `pg` (`node-postgres`) |
| **AI Engine** | Gemini → DeepSeek (Zro) → OpenRouter → NVIDIA (fallback berantai, REST Fetch) |
| **Autentikasi** | JWT (`jsonwebtoken`) & `bcryptjs` |

---

## 🙏 Kredit & Atribusi

**Algoritma pembagian waris pada WarisMu bukan karya penulis.** Mesin hitung di
`api/lib/faraidhLokal.js` (dan adaptasi klien di `src/lib/faraidhCalculator.js`) adalah port JavaScript dari proyek open source berikut:

- **Faraidh-API** oleh [alamrumambi](https://github.com/alamrumambi)
  — [github.com/alamrumambi/Faraidh-API](https://github.com/alamrumambi/Faraidh-API)
  Berkas sumber yang diadaptasi: `Models/solvingModel.js`, `Models/beneficiaryModel.js`,
  `helpers/dataIndex.js`, dan `helpers/kpk.js`.

Repo aslinya **tidak menyertakan berkas lisensi**. Atribusi ini ditulis sebagai bentuk
penghargaan dan kejujuran akademik. Bila proyek ini dipublikasikan atau dinilai secara
formal, harap konfirmasi lebih dulu ke pemilik repo atau cantumkan sumbernya secara
eksplisit di laporan.

Perubahan yang dilakukan saat porting pada `api/lib/faraidhLokal.js` (tidak mengubah hasil pembagian):

1. Diubah ke ESM dan `console.log` dihapus.
2. `haveDaughterAndGrand()` memakai penyebut cucu perempuan (`cP`). Sumber asli memakai
   `aP` sehingga melempar `TypeError` saat kasus hanya punya cucu perempuan tanpa anak
   perempuan.
3. Penerima tanpa jumlah orang (`dzawil_arhaam`) memakai `1` agar `dana_per_orang`
   tidak bernilai `NaN`.

Kredit materi, aset, dan tipografi:

- Materi artikel pada Pustaka Faraid diringkas dari buku *"Fikih Faraidh: Teknik Penyelesaian Kasus Waris"* karya **Dr. Khairuddin, M.Ag** (Sahifah, 2020) dan dilengkapi rujukan Kompilasi Hukum Islam (KHI).
- Gambar pada halaman Panduan berasal dari [Unsplash](https://unsplash.com) dan dipakai
  sesuai [Unsplash License](https://unsplash.com/license).
- Tipografi **Fraunces**, **Plus Jakarta Sans**, **Nunito**, dan **Amiri** dari [Google Fonts](https://fonts.google.com),
  dilisensikan di bawah SIL Open Font License.
