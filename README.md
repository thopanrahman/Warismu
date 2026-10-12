# 🕌 WarisMu — AI-Powered Islamic Inheritance Simulation & Education Assistant (Frontend)

> Platform edukasi kewarisan Islam (faraid) berbasis web dengan pendekatan *conversational chatbot*.
> User bercerita dalam bahasa natural → sistem mengekstraksi data → menanyakan yang kurang →
> menghitung → menampilkan hasil (tabel + dalil + disclaimer).
>
> **Tugas Proyek Desain Web — Informatika.** Repo ini adalah **FRONTEND saja** (Vue 3).
> Backend (LLM + kalkulasi) menyusul. Semua data saat ini **hardcode/mock**.

---

## ✨ Fitur

- **Hero + CTA** — pengantar konsep WarisMu di Beranda
- **Modal "Apa itu Faraid?"** — popup edukasi (interaktif #1)
- **Perpustakaan panduan faraid** — 8 artikel via `v-for` + **pencarian & filter kategori** (interaktif #2, `computed`)
- **Detail artikel** — dynamic route `/panduan/:id` + artikel terkait
- **Form kontak bervalidasi** — nama, email, pesan + state sukses (interaktif #3)
- **Navbar responsif** — menu hamburger di mobile (interaktif #4)
- **Transisi fade** antar halaman + animasi modal

## 🛠️ Teknologi

| Teknologi | Versi / Keterangan |
|---|---|
| Vue 3 Composition API (`<script setup>`) | ^3.5 |
| Vue Router | ^4 (5 rute) |
| Tailwind CSS | ^3 (CDN tidak dipakai — via npm + PostCSS) |
| Font Awesome | free (ikon `fa-scale-balanced` dkk.) |
| Gambar | Unsplash (hotlink) |
| Build tool | Vite ^8 |

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js LTS ≥ 20** — unduh di [nodejs.org](https://nodejs.org/) (centang "Add to PATH" saat instalasi)
- Cek instalasi:
  ```bash
  node --version
  npm --version
  ```

### 1. Buat proyek dari nol (jika belum ada — langkah ini SUDAH dilakukan di repo ini)
```bash
npm create vite@latest warismu -- --template vue
cd warismu
npm install
npm install vue-router
npm install -D tailwindcss@3 postcss autoprefixer
npm install @fortawesome/fontawesome-free
```

### 2. Jalankan mode development
```bash
cd warismu
npm install        # cukup sekali / setelah pull baru
npm run dev
```
Buka URL yang tampil di terminal (biasanya **http://localhost:5173**).

### 3. Build produksi (untuk verifikasi / deploy)
```bash
npm run build
npm run preview   # pratinjau hasil build di http://localhost:4173
```

### 4. Cara live / deploy (PENTING — biar tidak rusak/error)

Upload **isi folder `dist/`** (hasil `npm run build`), BUKAN folder source:

| Hosting | Cara |
|---|---|
| Netlify | Drag & drop folder `dist` ke Netlify Drop, atau hubungkan repo (build command `npm run build`, publish dir `dist`). File `public/_redirects` otomatis menangani refresh rute. |
| Vercel | Import repo, framework preset "Vite". File `vercel.json` otomatis menangani refresh rute. |
| GitHub Pages | Upload isi `dist` ke branch `gh-pages` (atau pakai extension VS Code "GitHub Pages"). Router memakai hash (`/#/tentang`) jadi refresh tetap aman. |
| Hosting kampus / cPanel | Upload **isi** `dist` (index.html + folder assets) ke `public_html`. Karena `base: './'`, aman walau di sub-folder. |

> Router sengaja memakai **hash mode** (URL jadi `/#/tentang`) agar tidak 404
> saat refresh di hosting statis tanpa setting server. Gambar Unsplash butuh
> internet saat demo — pastikan laptop presentasi online.

## 📂 Struktur Folder (sesuai ketentuan tugas)

```
warismu/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.js                  # entry: Vue + Router + FontAwesome + CSS
    ├── App.vue                  # layout: Navbar + router-view (fade) + Footer
    ├── assets/                  # aset gambar lokal (opsional)
    ├── components/              # 8 komponen terpisah ✅
    │   ├── Navbar.vue           # header + menu mobile toggle
    │   ├── Footer.vue           # footer + disclaimer
    │   ├── HeroSection.vue      # hero Beranda
    │   ├── FeatureCard.vue      # kartu fitur (props)
    │   ├── HowItWorks.vue       # 3 langkah cara kerja
    │   ├── ArticleCard.vue      # kartu artikel (props)
    │   ├── ContactForm.vue      # form + validasi + state sukses
    │   └── InfoModal.vue        # modal "Apa itu Faraid?"
    ├── pages/                   # 5 halaman (routes) ✅
    │   ├── HomePage.vue         # /
    │   ├── AboutPage.vue        # /tentang
    │   ├── PanduanPage.vue      # /panduan (list + search + filter)
    │   ├── PanduanDetailPage.vue# /panduan/:id (dynamic route)
    │   └── ContactPage.vue      # /kontak (form)
    ├── router/
    │   └── index.js             # definisi 5 rute + judul tab dinamis
    ├── data/
    │   └── panduan.js           # mock 8 artikel + daftar kategori
    └── styles/
        └── main.css              # Tailwind + font + transisi fade/modal
```

## 🗺️ Daftar Rute

| Rute | Halaman | Keterangan |
|---|---|---|
| `/` | HomePage | Hero + statistik + fitur + cara kerja + artikel unggulan + CTA |
| `/tentang` | AboutPage | Profil, visi, misi, latar belakang, tipe user, batasan produk |
| `/panduan` | PanduanPage | Galeri artikel (`v-for`) + search + filter kategori |
| `/panduan/:id` | PanduanDetailPage | Detail artikel + poin penting + sumber + disclaimer |
| `/kontak` | ContactPage | Info kanal + form bervalidasi |

## 📸 Screenshot (placeholder — ganti dengan hasil `npm run dev` milikmu)

```
docs/
├── screenshot-home.png      # ← tambahkan: Beranda (hero + fitur)
├── screenshot-panduan.png   # ← tambahkan: daftar artikel + pencarian
├── screenshot-detail.png    # ← tambahkan: detail artikel
└── screenshot-kontak.png    # ← tambahkan: form kontak + pesan sukses
```

Cara mengambil: jalankan `npm run dev`, buka tiap halaman di browser
(uji juga lebar **360px / 768px / 1280px** via DevTools → device toolbar),
lalu screenshot dan simpan ke `docs/`.

## ⚠️ Catatan Penting

- **Layout memakai flex/grid Tailwind — TIDAK ada `<table>` untuk layout** (tabel hanya
  dipakai backend nanti untuk *data* hasil simulasi, bukan layout).
- WarisMu adalah media **edukasi, bukan pengganti ahli faraid / ulama / notaris**.
- Gambar artikel memakai hotlink Unsplash — butuh internet saat demo.
