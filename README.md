# 🕌 WarisMu — Asisten Edukasi & Simulasi Waris Islam

> Platform edukasi kewarisan Islam (faraid) berbasis web dengan pendekatan *conversational chatbot*.
> User bercerita dalam bahasa natural → sistem mengekstraksi data keluarga → menanyakan yang kurang →
> menghitung → menampilkan hasil (rincian bagian + dalil + disclaimer).
>
> **Tugas Proyek — Informatika.** Repo ini berisi **frontend Vue 3** + **API serverless opsional** (`api/`).
> Bila `GEMINI_API_KEY` / database belum diisi, chatbot otomatis jatuh ke **mode mock** sehingga
> demo tidak pernah mati.

---

## 🎨 Arah Desain (mengacu `DESIGN.md`)

Arah: **Modern Islamic, Minimal, Professional, Anti-Slop**.

| Aspek | Ketentuan yang dipakai |
|---|---|
| Warna brand | `waris-900` `#1d8757` (primary) + ramp tint `waris-50…950` (`950` = `#0e3d27` untuk panel gelap) |
| Netral | `paper` `#F7FBF8` (latar halaman), `cream` `#FEFEFA` (panel), `ink` `#122A20` (teks) |
| Status | keluarga `danger` `#A85448`, `danger-light`, `danger-soft` — satu-satunya keluarga di luar hijau |
| Font | **Fraunces** (serif) untuk judul/heading & logo + **Nunito** (sans-serif) untuk body — dimuat dari Google Fonts di `src/styles/main.css`, token di `tailwind.config.js` (`font-display` / `font-sans`) |
| Radius | `rounded-lg` (kartu, input, tombol teks), `rounded-xl` (panel/section besar, modal, CTA), `rounded-full` (avatar, badge, titik indikator) |
| Spacing | kelipatan 4px (`py-3`, `gap-3`, `mt-4`, …) |
| Bayangan | `shadow-soft` & `shadow-float` — tint hijau `rgba(29,135,87,…)`, bukan hitam |
| Tekstur | grain kertas global 3,5% (`body::before`, `mix-blend-mode: multiply`) |
| Dilarang | blob/ilustrasi dekoratif tanpa makna, gradien SaaS generik, kartu aksen `border-l-4`, `<table>` untuk layout utama, emoji sebagai ikon UI |

Semua nilai warna, font, dan bayangan dikelola sebagai **token** di `tailwind.config.js` —
komponen `.vue` tidak memuat hex lepas.

## ✨ Fitur

- **Chatbot konsultasi `/chat`** (fitur inti) — sidebar riwayat, bubble user/AI, indikator mengetik,
  chip pertanyaan lanjutan, kartu hasil simulasi faraid, daftar sumber, disclaimer, dan error state
  berborder merah; ada fallback offline bila `/api/chat` tak terjangkau
- **Hero + CTA "Mulai Konsultasi"** di Beranda
- **Modal "Apa itu Faraid?"** — popup edukasi (interaktif #1)
- **Perpustakaan panduan** — 8 artikel via `v-for` + pencarian & filter kategori via `computed` (interaktif #2)
- **Detail artikel** — dynamic route `/panduan/:id` + artikel terkait
- **Form kontak bervalidasi** — nama, email, pesan + state sukses (interaktif #3)
- **Form registrasi akun** — `/daftar` → `POST /api/auth/register` (bcrypt + JWT)
- **Navbar responsif** — Flexbox + menu hamburger di mobile (interaktif #4), menu "Daftar Akun"
  sebagai tombol primary `bg-waris-900`, link aktif ter-highlight
- **Transisi fade** antar halaman (hash router + `<transition>`), animasi modal, hover state pada kartu
- **Footer disembunyikan di `/chat`** agar ruang percakapan penuh

## 🛠️ Teknologi

| Teknologi | Versi / Keterangan |
|---|---|
| Vue 3 Composition API (`<script setup>`) | ^3.5.42 |
| Vue Router | ^4.6.4 — hash history (`/#/tentang`) |
| Tailwind CSS | ^3.4.19 (npm + PostCSS, bukan CDN) |
| Font Awesome | ^7.3.1 (free, ikon garis) |
| Vite | ^8.3.0 |
| Backend (opsional) | Serverless function Vercel: `@google/generative-ai` via REST, `bcryptjs`, `jsonwebtoken`, `pg` (PostgreSQL/Supabase) |
| Gambar artikel | Unsplash (hotlink) — butuh internet saat demo |

## 📂 Struktur Folder

```
warismu/
├── index.html
├── tailwind.config.js        # token warna/font/shadow (§2 Design System)
├── postcss.config.js
├── vite.config.js            # base: './' → aman di sub-folder
├── vercel.json               # rewrite SPA, kecuali /api/*
├── .env.example              # contoh GEMINI_API_KEY, DATABASE_URL, JWT_SECRET
├── api/                      # serverless function (opsional)
│   ├── chat.js               #   POST /api/chat
│   ├── auth/register.js      #   POST /api/auth/register
│   └── lib/
│       ├── gemini.js         #   prompt sistem + fallback mock
│       └── db.js             #   pool PostgreSQL (pg)
├── db/
│   └── schema.sql            # users, sessions, consultations, reports, prompts
├── public/
│   ├── favicon.svg
│   └── _redirects            # fallback SPA untuk Netlify
└── src/
    ├── main.js               # entry: Vue + Router + FontAwesome + CSS
    ├── App.vue               # layout: Navbar + router-view (fade) + Footer
    ├── assets/
    ├── components/           # 10 komponen terpisah ✅
    │   ├── Navbar.vue        # header Flexbox + menu mobile + tombol Daftar Akun
    │   ├── Footer.vue        # footer + disclaimer
    │   ├── HeroSection.vue   # hero Beranda (CTA → /chat)
    │   ├── FeatureCard.vue   # kartu fitur (props)
    │   ├── HowItWorks.vue    # 3 langkah cara kerja + konektor SVG
    │   ├── ArticleCard.vue   # kartu artikel (props)
    │   ├── ContactForm.vue   # form + validasi + state sukses
    │   ├── InfoModal.vue     # modal "Apa itu Faraid?"
    │   ├── ChatBubble.vue    # bubble user/AI + kartu hasil + sumber + disclaimer
    │   └── ChatSidebar.vue   # sidebar riwayat + kartu user
    ├── pages/                # 7 halaman ✅
    │   ├── HomePage.vue          # /
    │   ├── ChatPage.vue          # /chat (fitur inti)
    │   ├── AboutPage.vue         # /tentang
    │   ├── PanduanPage.vue       # /panduan (list + search + filter)
    │   ├── PanduanDetailPage.vue # /panduan/:id
    │   ├── ContactPage.vue       # /kontak
    │   └── RegisterPage.vue      # /daftar
    ├── router/
    │   └── index.js          # 7 rute + redirect catch-all + judul tab dinamis
    ├── data/
    │   └── panduan.js        # 8 artikel mock + 6 kategori
    └── styles/
        └── main.css          # Tailwind + font + grain + transisi fade/modal
```

## 🗺️ Daftar Rute

| Rute | Halaman | Keterangan |
|---|---|---|
| `/` | HomePage | Hero + statistik + 3 fitur (komposisi asimetris 5/4/3) + cara kerja + artikel unggulan + CTA |
| `/chat` | ChatPage | Chatbot: sidebar + bubble + indikator mengetik + chip + kartu hasil + sumber + disclaimer |
| `/tentang` | AboutPage | Profil, visi, misi, latar belakang, tipe user, batasan produk |
| `/panduan` | PanduanPage | Galeri artikel (`v-for`) + pencarian + filter kategori |
| `/panduan/:id` | PanduanDetailPage | Detail artikel + poin penting + sumber + disclaimer + artikel terkait |
| `/kontak` | ContactPage | Info kanal + form bervalidasi |
| `/daftar` | RegisterPage | Form registrasi akun → `POST /api/auth/register` |
| `/:pathMatch(.*)*` | — | Redirect ke `/` |

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js LTS ≥ 20** — [nodejs.org](https://nodejs.org/) (centang "Add to PATH" saat instalasi)
- Cek instalasi: `node --version` dan `npm --version`

### 1. Jalankan mode development
```bash
cd warismu
npm install        # cukup sekali / setelah pull baru
npm run dev
```
Buka URL yang tampil di terminal (biasanya **http://localhost:5173**).
Tanpa `.env.local`, chatbot otomatis memakai mode mock — halaman tetap bisa diuji semua.

### 2. Build produksi
```bash
npm run build      # hasil ke dist/
npm run preview    # pratinjau hasil build di http://localhost:4173
```

## 🔌 API Opsional (serverless)

Fitur ini **tidak wajib** untuk menjalankan frontend.

| Endpoint | Handler | Keterangan |
|---|---|---|
| `POST /api/chat` | `api/chat.js` → `api/lib/gemini.js` | Body `{ pesan, riwayat, sesiId? }`. Tanpa `GEMINI_API_KEY` otomatis mengembalikan balasan mock (`dipakaiMock: true`) |
| `POST /api/auth/register` | `api/auth/register.js` | Body `{ nama, email, password }` → `201 { token, user }`. Perlu `DATABASE_URL` + `JWT_SECRET`; tanpa itu membalas 500 "Konfigurasi server belum lengkap" |

Skema tabel (`users`, `sessions`, `consultations`, `reports`, `prompts`) ada di `db/schema.sql`.
Variabel lingkungan: `GEMINI_API_KEY`, `DATABASE_URL`, `JWT_SECRET` (contoh di `.env.example`).

## ☁️ Deploy

| Hosting | Cara |
|---|---|
| Netlify | Drag & drop folder `dist`, atau hubungkan repo (build `npm run build`, publish `dist`). `public/_redirects` otomatis menangani refresh rute. |
| Vercel | Import repo, framework preset **Vite**. `vercel.json` menangani rewrite SPA dan mengecualikan `/api/*`, sehingga serverless function ikut ter-deploy. |
| GitHub Pages | Upload isi `dist` ke branch `gh-pages`. Router memakai hash (`/#/tentang`) sehingga refresh tetap aman. |
| Hosting kampus / cPanel | Upload **isi** `dist` (index.html + folder `assets`) ke `public_html`. Karena `base: './'`, aman walau di sub-folder. |

> Router memakai **hash mode** agar tidak 404 saat refresh di hosting statis tanpa konfigurasi server.
> Gambar Unsplash butuh koneksi internet saat demo — pastikan laptop presentasi online.

## 📸 Screenshot (placeholder — ganti dengan hasil `npm run dev` milikmu)

```
docs/
├── screenshot-home.png      # ← Beranda (hero + fitur + cara kerja)
├── screenshot-chat.png      # ← Chat (bubble + kartu hasil)
├── screenshot-panduan.png   # ← Daftar artikel + pencarian
└── screenshot-kontak.png    # ← Form kontak + pesan sukses
```

Cara mengambil: jalankan `npm run dev`, buka tiap halaman di browser
(uji juga lebar **360px / 768px / 1280px / 1920px** via DevTools → device toolbar),
lalu simpan screenshot ke `docs/`.

## ⚠️ Catatan Penting

- **Layout memakai Flexbox/Grid Tailwind — TIDAK ada `<table>` untuk layout.** Hasil faraid
  dirender sebagai grid `div`.
- WarisMu adalah media **edukasi, bukan pengganti ahli faraid / ulama / notaris**.
- Gambar artikel memakai hotlink Unsplash — butuh internet saat demo.
- Mode mock dipakai sengaja agar demo perkuliahan tidak pernah gagal karena backend/kuota LLM.
