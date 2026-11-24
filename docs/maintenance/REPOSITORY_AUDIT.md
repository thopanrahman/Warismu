# Laporan Audit Menyeluruh Struktur Repository WarisMu

- **Proyek:** WarisMu — Asisten Edukasi & Simulasi Waris Islam (Faraid)
- **Tahap:** Evaluasi Pra-Pengujian Black Box & White Box (Read-Only Audit)
- **Standar Acuan Audit:** `project-folder-structure`, `repo-maintainer`, `codebase-cleanup` (`cleanup-files`, `cleanup-deps`, `cleanup-tidy`, `cleanup-lint`, `cleanup-secrets`, `cleanup-a11y`)
- **Status Repository:** Tidak ada perubahan pada file aplikasi selama audit (100% Read-Only terhadap aplikasi).

---

## 1. Ringkasan Kondisi Repository

Secara arsitektural, **WarisMu** adalah aplikasi web *hybrid* berbasis **Vue 3 + Vite + Tailwind CSS** di sisi frontend dan **Vercel Serverless Functions (Node.js ESM)** di sisi backend (`api/`), dengan database **PostgreSQL (Supabase)** (`db/schema.sql`) serta orkestrasi multi-LLM (`api/lib/llmRouter.js`: Gemini → DeepSeek/Zro → OpenAI → NVIDIA → Mock fallback).

### Metodologi & Penerapan Skills
1. **`project-folder-structure`**:
   - Mengidentifikasi *immovable constraints* (jalur kerangka kerja wajib seperti `api/` untuk Vercel Serverless, `public/` dan `index.html` untuk Vite, `src/main.js`, serta `vercel.json` dan `vite.config.js`).
   - Memetakan *organizing axis* saat ini (kombinasi *toolchain/layer* di `src/components`, `src/pages`, `src/lib`, `src/data`, `api/lib`, `api/auth`) dan mendeteksi area *mixed-lifecycle* (bercampurnya aset legacy tidak terpakai di `src/assets/` dengan aset aktif di `public/images/`, serta dokumen desain/changelog yang tersebar di root dan `design-system/`).
2. **`repo-maintainer`**:
   - Mengidentifikasi *Hot Zones* (area kode yang aktif berubah di `src/`, `api/`) vs *Cold/Stale Zones* (aset gambar warisan desain lama di `src/assets/panduan/`, komponen `FeatureCard.vue`, dan artefak ekstraksi buku `src/data/fikih_faraidh_struktur.json`).
   - Merancang penataan dokumentasi ke dalam `docs/` dan menyiapkan konteks arsitektur pada `.ai/CONTEXT.md` menggunakan pendekatan non-destruktif berbasis **Migration Manifest** (`git mv` dan karantina sebelum penghapusan).
3. **`codebase-cleanup`** (6 sub-skill dengan prinsip *Default = Keep*):
   - **`cleanup-files`**: Menemukan 1 komponen Vue yatim (`src/components/FeatureCard.vue`), 1 file JSON referensi yang tidak di-import (`src/data/fikih_faraidh_struktur.json`), 10 gambar tidak terpakai di `src/assets/` (~1,15 MB), serta 6 *unused internal exports*.
   - **`cleanup-deps`**: Memverifikasi seluruh 6 `dependencies` dan 5 `devDependencies` di `package.json`. **100% terpakai** (0 paket yatim), namun terdapat catatan penempatan `pg`, `bcryptjs`, dan `jsonwebtoken` yang hanya dipakai oleh `api/`.
   - **`cleanup-tidy`**: Menemukan *unused import* `HasilPerhitungan` beserta `computed` `hasilTerformat` (45 baris dead code) di `src/components/ChatBubble.vue`, serta duplikasi `@import` Google Fonts antara `index.html` dan `src/styles/main.css`.
   - **`cleanup-lint`**: Mendeteksi ketiadaan *script* `lint`, `format`, maupun `test` di `package.json` menjelang pengujian White Box.
   - **`cleanup-secrets`**: Memastikan `.env.local` (berisi kredensial lokal) sudah diabaikan oleh `.gitignore` (`!! .env.local`) dan tidak pernah masuk indeks Git, sedangkan `.env.example` bersih dari kunci rahasia asli.
   - **`cleanup-a11y`**: Memeriksa higienitas semantik HTML pada komponen UI (penggunaan `<button type="button">`, `aria-label`, `aria-expanded`, `role="dialog"`, dan `<label for="...">` sudah sangat baik, dengan sedikit catatan minor pada tombol stepper kalkulator).

---

## 2. Struktur Folder Aktual

Berikut adalah peta struktur direktori aktual di workspace `D:\Kuliah\SEMESTER 5\PROJECT\warismu` (tidak termasuk isi `node_modules/` dan `.git/`):

```text
warismu/
├── .vercel/                                # [IGNORED] Metadata deployment lokal Vercel CLI
│   ├── project.json
│   └── README.txt
├── .vscode/                                # Konfigurasi rekomendasi ekstensi editor
│   └── extensions.json
├── api/                                    # [IMMOVABLE] Vercel Serverless Functions (Backend)
│   ├── auth/
│   │   ├── login.js                        # POST /api/auth/login (JWT + bcrypt)
│   │   └── register.js                     # POST /api/auth/register (Validasi + insert users)
│   ├── lib/
│   │   ├── auth.js                         # Helper verifikasi Bearer JWT
│   │   ├── db.js                           # Pool koneksi PostgreSQL (Supabase port 6543)
│   │   ├── faraidh.js                      # Klien & normalisasi payload 23 field ahli waris
│   │   ├── faraidhLokal.js                 # Mesin hitung deterministik backend (1.081 baris)
│   │   └── llmRouter.js                    # Router multi-LLM & fallback berantai (760 baris)
│   ├── chat.js                             # POST /api/chat (Orkestrator hybrid: QnA/Ekstraksi -> Faraidh -> Penjelasan)
│   ├── laporan.js                          # POST /api/laporan (Insert laporan jawaban AI ke tabel reports)
│   └── riwayat.js                          # GET/POST/DELETE /api/riwayat (CRUD sesi di tabel sessions)
├── db/                                     # Skema database
│   └── schema.sql                          # DDL PostgreSQL D1-D5 (users, sessions, consultations, reports, prompts)
├── design-system/                          # [UNTRACKED] Spesifikasi desain sistem baru
│   └── warismu/
│       ├── pages/                          # Direktori kosong (0 file)
│       └── MASTER.md                       # Dokumen acuan desain Modern Islamic Editorial
├── dist/                                   # [IGNORED] Hasil build statis Vite (`npm run build`)
│   ├── assets/
│   ├── images/panduan/
│   ├── _redirects
│   ├── favicon.png
│   └── index.html
├── public/                                 # [IMMOVABLE] Aset statis publik Vite (disalin ke root build)
│   ├── images/
│   │   └── panduan/                        # 15 gambar cover artikel panduan (01 s/d 15) — AKTIF DIPAKAI
│   │       ├── 01-dasar-hukum.jpg
│   │       ├── 02-rukun-waris.jpg
│   │       ├── 03-ahli-waris.jpg
│   │       ├── 04-hijab.jpg
│   │       ├── 05-asal-masalah.jpg
│   │       ├── 06-aul.jpg
│   │       ├── 07-radd.jpg
│   │       ├── 08-gharrawain.jpg
│   │       ├── 09-musytarakah.jpg
│   │       ├── 10-munasakhat.jpg
│   │       ├── 11-kakek-saudara.jpg
│   │       ├── 12-kewarisan-khusus.jpg
│   │       ├── 13-harta-bersama.jpg
│   │       ├── 14-wasiat.jpg
│   │       └── 15-suasana-tenang.jpg
│   ├── _redirects                          # Konfigurasi SPA fallback untuk Netlify/Cloudflare Pages
│   └── favicon.png                         # Ikon tab browser
├── src/                                    # [IMMOVABLE] Kode sumber utama Frontend Vue 3
│   ├── assets/                             # Aset yang diproses bundler Vite
│   │   ├── panduan/                        # 7 gambar panduan versi lama (02 s/d 08) — TIDAK TERPAKAI
│   │   │   ├── 02-ahli-waris.jpg
│   │   │   ├── 03-bagian-anak.jpg
│   │   │   ├── 04-pasangan.jpg
│   │   │   ├── 05-urutan-pembagian.jpg
│   │   │   ├── 06-harta-bersama.jpg
│   │   │   ├── 07-hijab.jpg
│   │   │   └── 08-chatbot.jpg
│   │   ├── about-quran.jpg                 # Gambar halaman tentang versi lama — TIDAK TERPAKAI
│   │   ├── hero-keluarga.jpg               # Gambar hero versi lama — TIDAK TERPAKAI
│   │   ├── hero.png                        # Gambar hero versi awal — TIDAK TERPAKAI
│   │   └── logo-waris-mu.png               # Logo utama WarisMu — AKTIF DIPAKAI (BrandLogo.vue)
│   ├── components/                         # Komponen UI Vue
│   │   ├── ArticleCard.vue                 # Kartu artikel Pustaka Faraid
│   │   ├── BrandLogo.vue                   # Pembungkus gambar logo WarisMu
│   │   ├── ChatBubble.vue                  # Gelembung pesan user & AI di halaman Chat
│   │   ├── ChatSidebar.vue                 # Drawer & sidebar riwayat konsultasi
│   │   ├── ContactForm.vue                 # Formulir kontak dengan validasi client-side
│   │   ├── FeatureCard.vue                 # Komponen kartu fitur lama — TIDAK TERPAKAI (Orphan)
│   │   ├── Footer.vue                      # Footer global aplikasi
│   │   ├── HasilPerhitungan.vue            # [UNTRACKED] Visualisasi hasil kalkulator faraid
│   │   ├── HeroSection.vue                 # Hero halaman utama dengan mini-preview interaktif
│   │   ├── HowItWorks.vue                  # Section 3 langkah metodologi WarisMu
│   │   ├── InfoModal.vue                   # Modal edukasi "Mengenal Ilmu Faraid"
│   │   ├── KalkulatorFaraid.vue            # [UNTRACKED] Form interaktif kalkulator faraid
│   │   ├── Navbar.vue                      # Navigasi utama responsif
│   │   └── PanelIcon.vue                   # Ikon SVG buka/tutup panel sidebar
│   ├── data/                               # Data statis frontend
│   │   ├── fikih_faraidh_struktur.json     # Ringkasan bab buku referensi — TIDAK DI-IMPORT
│   │   └── panduan.js                      # Data 15 artikel Pustaka Faraid — AKTIF DIPAKAI
│   ├── lib/                                # Utilitas & logika domain frontend
│   │   ├── akun.js                         # Manajemen JWT localStorage, fetch auth, migrasi sesi tamu
│   │   └── faraidhCalculator.js            # [UNTRACKED] Mesin kalkulator faraid sisi klien (724 baris)
│   ├── pages/                              # Halaman rute Vue Router (9 halaman)
│   │   ├── AboutPage.vue                   # Rute /tentang
│   │   ├── ChatPage.vue                    # Rute /chat
│   │   ├── ContactPage.vue                 # Rute /kontak
│   │   ├── HomePage.vue                    # Rute /
│   │   ├── KalkulatorPage.vue              # [UNTRACKED] Rute /kalkulator
│   │   ├── LoginPage.vue                   # Rute /masuk
│   │   ├── PanduanDetailPage.vue           # Rute /panduan/:id
│   │   ├── PanduanPage.vue                 # Rute /panduan
│   │   └── RegisterPage.vue                # Rute /daftar
│   ├── router/
│   │   └── index.js                        # Konfigurasi Vue Router (Hash History, 9 rute + wildcard)
│   ├── styles/
│   │   └── main.css                        # Entrypoint Tailwind CSS, font, tekstur grain, print styles
│   ├── App.vue                             # Root component Vue
│   └── main.js                             # Entrypoint aplikasi Vue
├── .env.example                            # Template variabel lingkungan
├── .env.local                              # [IGNORED] Variabel lingkungan lokal (tidak terlacak Git)
├── .gitignore                              # Aturan pengabaian Git
├── CHANGE_LOG.md                           # Catatan perbaikan peer testing IPPL
├── index.html                              # Entrypoint HTML Vite
├── package-lock.json                       # Lockfile dependensi npm
├── package.json                            # Manifest proyek & dependensi
├── postcss.config.js                       # Konfigurasi PostCSS (Tailwind + Autoprefixer)
├── README.md                               # Dokumentasi utama repository
├── tailwind.config.js                      # Konfigurasi token desain Tailwind CSS
├── vercel.json                             # Konfigurasi deployment & rewrite Vercel
└── vite.config.js                          # Konfigurasi Vite + plugin middleware `apiLokalDev()`
```

---

## 3. Temuan Berdasarkan Kategori (9 Area Pemeriksaan)

### 3.1. Struktur Direktori dan Konsistensi Penamaan
- **Pencampuran Bahasa Penamaan File & Simbol:**
  - Halaman (`src/pages/`) mencampur bahasa Inggris dan Indonesia: `HomePage.vue`, `AboutPage.vue`, `ContactPage.vue`, `LoginPage.vue`, `RegisterPage.vue`, `ChatPage.vue` (Inggris) vs `KalkulatorPage.vue`, `PanduanPage.vue`, `PanduanDetailPage.vue` (Indonesia).
  - Komponen (`src/components/`) juga mencampur bahasa: `ArticleCard.vue`, `BrandLogo.vue`, `ChatBubble.vue`, `ChatSidebar.vue`, `ContactForm.vue`, `FeatureCard.vue`, `Footer.vue`, `HeroSection.vue`, `HowItWorks.vue`, `InfoModal.vue`, `Navbar.vue`, `PanelIcon.vue` (Inggris) vs `KalkulatorFaraid.vue`, `HasilPerhitungan.vue` (Indonesia).
  - *Catatan:* Meskipun penamaan campur bahasa, seluruh import sudah sinkron dengan nama file (case-sensitive aman). Mengubah nama komponen yang sudah berjalan tidak disarankan kecuali benar-benar diperlukan karena berisiko membuat *git diff* besar menjelang pengujian.
- **Direktori Kosong:**
  - `design-system/warismu/pages/` adalah folder kosong tanpa satu pun file di dalamnya.
- **Folder Top-Level Non-Standar:**
  - `design-system/warismu/MASTER.md` berada di root sebagai folder baru yang belum dilacak Git (`?? design-system/`), sementara file `CHANGE_LOG.md` berada di root. Keduanya lebih tepat dikonsolidasikan di bawah `docs/`.

### 3.2. File Duplikat atau Aset yang Berpotensi Ganda
1. **Duplikasi Mesin Hitung Faraid (Backend vs Frontend) — *CRITICAL FINDING UNTUK WHITE BOX TESTING*:**
   - **Backend:** [faraidhLokal.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/api/lib/faraidhLokal.js) (1.081 baris, metode statis `AhliWaris.solving()` berbasis percabangan kasus `haveSon`, `haveGrandSon`, `haveDaughterAndGrand`, `haveFatherAndGrand`, `haveSiblings`, `haveAnother`). Dipakai oleh endpoint `/api/chat`.
   - **Frontend:** [faraidhCalculator.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/lib/faraidhCalculator.js) (724 baris, kelas `AhliWaris` berbasis metode `checkAshabulFurud()` dan `distribusiAshabah()`). Dipakai oleh halaman baru `/kalkulator` (`KalkulatorFaraid.vue`).
   - **Perbedaan Perilaku (Divergensi Logika) yang Ditemukan:**
     - **Kasus Gharrawain (Suami/Istri + Ibu + Ayah, tanpa anak/saudara):** `api/lib/faraidhLokal.js` (baris 717–723) menerapkan *Gharrawain* (Ibu mendapat **1/3 dari sisa** setelah diambil pasangan). Sebaliknya, `src/lib/faraidhCalculator.js` (baris 117–126) memberi Ibu **1/3 penuh dari harta bersih**, bukan 1/3 sisa.
     - **Kasus Radd dengan Pasangan (Suami/Istri + Ashabul Furudh Nasab tanpa Ashabah, mis. Istri + 1 Anak Perempuan):** `api/lib/faraidhLokal.js` menaikkan/menurunkan pembilang secara langsung pada `haveDaughterAndGrand()`, sedangkan `src/lib/faraidhCalculator.js` (baris 303–317) hanya mengeksekusi blok `if (!adaPasangan)`; ketika ada pasangan dan tidak ada ashabah, sisa harta tidak dibagikan (*unallocated remainder* masuk ke `sisaTidakTerbagi`). Also pada HeroSection (`src/components/HeroSection.vue` baris 24–29), skenario "Ibu wafat: 1 Suami, 1 Anak Perempuan Tunggal" menampilkan `Baitul Mal / Asal Masalah: Sisa (1/4)`.
     - **Kasus Saudara/i Seayah Bersama Saudari Kandung (Ashabah Ma'al Ghair / Pelengkap 2/3):** Penanganan di `api/lib/faraidhLokal.js` dan `src/lib/faraidhCalculator.js` ditulis dengan struktur algoritma berbeda yang berpotensi menghasilkan output berbeda saat diuji pada *White Box Testing*.
2. **Duplikasi Pemanggilan Google Fonts:**
   - [index.html](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/index.html#L16-L19) memuat `<link href="https://fonts.googleapis.com/css2?family=Amiri...&family=Fraunces...&family=Plus+Jakarta+Sans...&family=Nunito..." rel="stylesheet" />`.
   - [src/styles/main.css](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/styles/main.css#L1) memuat `@import url('https://fonts.googleapis.com/css2?family=Amiri...&family=Fraunces...&family=Plus+Jakarta+Sans...&family=Nunito...');` dengan URL yang persis sama.
3. **Duplikasi Folder Gambar Panduan (`src/assets/panduan/` vs `public/images/panduan/`):**
   - `public/images/panduan/` berisi 15 gambar (`01-dasar-hukum.jpg` s/d `15-suasana-tenang.jpg`) yang **aktif dipakai** oleh `src/data/panduan.js`.
   - `src/assets/panduan/` berisi 7 gambar lama (`02-ahli-waris.jpg` s/d `08-chatbot.jpg`) dengan hash SHA-256 berbeda dari `public/images/panduan/`, merupakan sisa iterasi desain lama yang **sama sekali tidak dipakai lagi**.

### 3.3. File yang Tidak Digunakan atau Orphan Files
Berdasarkan pelacakan menyeluruh pada seluruh `import`, `RouterLink`, atribut `src`, `url()`, dan konfigurasi:

| No | Path File | Ukuran | Bukti Pemeriksaan | Status |
|---|---|---|---|---|
| 1 | `src/components/FeatureCard.vue` | 1.176 B | Pencarian `FeatureCard` di seluruh `src/`, `api/`, `index.html` menghasilkan **0 referensi**. Halaman `HomePage.vue` sudah menggunakan markup kartu langsung. | **ORPHAN (Tidak Terpakai)** |
| 2 | `src/assets/about-quran.jpg` | 356.739 B | Pencarian `about-quran` di seluruh repo menghasilkan **0 referensi**. | **ORPHAN (Aset Lama)** |
| 3 | `src/assets/hero-keluarga.jpg` | 116.640 B | Pencarian `hero-keluarga` di seluruh repo menghasilkan **0 referensi**. | **ORPHAN (Aset Lama)** |
| 4 | `src/assets/hero.png` | 13.057 B | Pencarian `hero.png` di seluruh repo menghasilkan **0 referensi**. | **ORPHAN (Aset Lama)** |
| 5 | `src/assets/panduan/02-ahli-waris.jpg` | 112.410 B | `panduan.js` menggunakan `/images/panduan/03-ahli-waris.jpg` dari `public/`. **0 referensi** ke `src/assets/panduan/`. | **ORPHAN (Aset Lama)** |
| 6 | `src/assets/panduan/03-bagian-anak.jpg` | 340.054 B | **0 referensi** di seluruh kode. | **ORPHAN (Aset Lama)** |
| 7 | `src/assets/panduan/04-pasangan.jpg` | 70.015 B | **0 referensi** di seluruh kode. | **ORPHAN (Aset Lama)** |
| 8 | `src/assets/panduan/05-urutan-pembagian.jpg` | 57.222 B | **0 referensi** di seluruh kode. | **ORPHAN (Aset Lama)** |
| 9 | `src/assets/panduan/06-harta-bersama.jpg` | 66.589 B | **0 referensi** di seluruh kode. | **ORPHAN (Aset Lama)** |
| 10 | `src/assets/panduan/07-hijab.jpg` | 83.686 B | **0 referensi** di seluruh kode. | **ORPHAN (Aset Lama)** |
| 11 | `src/assets/panduan/08-chatbot.jpg` | 61.985 B | **0 referensi** di seluruh kode. | **ORPHAN (Aset Lama)** |
| 12 | `src/data/fikih_faraidh_struktur.json` | 14.037 B | **0 referensi import** di kode runtime. Merupakan ringkasan struktur bab buku Dr. Khairuddin, M.Ag yang menjadi bahan penulisan `src/data/panduan.js`. | **DOKUMEN REFERENSI (Bukan Kode Runtime)** |

*Total ukuran aset gambar orphan di `src/assets/`: **1.278.397 bytes (~1,22 MB)**.*

### 3.4. Komponen, Modul, Fungsi, dan Export yang Berpotensi Tidak Terpakai

1. **Unused Import & Dead Computed di [src/components/ChatBubble.vue](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/components/ChatBubble.vue):**
   - **Baris 4:** `import HasilPerhitungan from './HasilPerhitungan.vue'` di-import tetapi **tidak pernah dipanggil** sebagai `<HasilPerhitungan />` di dalam `<template>`.
   - **Baris 51–90:** `const hasilTerformat = computed(...)` dibuat untuk mengadaptasi data ke `HasilPerhitungan`, namun di `<template>` (baris 126–153), `hasilTerformat` hanya dipakai sebagai pengecekan `v-if="hasilTerformat && hasilTerformat.daftarPenerima.length"`, lalu di dalamnya tetap me-render `v-for="b in bubble.hasil.bagian"` secara manual.
2. **Unused Exports (Ekspor Modul yang Hanya Dipakai Internal atau Tidak Di-import Modul Lain):**
   - `export const daftarKategori` di [src/data/panduan.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/data/panduan.js#L396-L403) — tidak pernah di-import oleh `PanduanPage.vue` (karena `PanduanPage.vue` menghitung `kategoriList` secara dinamis dengan `new Set(daftarPanduan.map((a) => a.kategori))`).
   - `export const balasanMock = mockResponse` di [api/lib/llmRouter.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/api/lib/llmRouter.js#L725) — alias backward-compatibility yang tidak lagi di-import di mana pun (`api/chat.js` sudah meng-import `mockResponse`).
   - `export const INFO_AHLI_WARIS` dan `export function bersihkanAngka` di [src/lib/faraidhCalculator.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/lib/faraidhCalculator.js#L410) — hanya dipakai di dalam file `faraidhCalculator.js` sendiri, tidak di-import oleh komponen lain (meski bermanfaat jika nanti diuji langsung pada *White Box unit test*).
   - `export function normalisasiAhliWaris` dan `export function buatPayloadFaraid` di [api/lib/faraidh.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/api/lib/faraidh.js#L60-L73) — hanya dipakai internal di `api/lib/faraidh.js` (namun sangat berguna sebagai *test seam* untuk *White Box unit testing*).
   - `export function dapatkanPool` di [api/lib/db.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/api/lib/db.js#L10) — hanya dipanggil oleh `tanya()` di dalam `db.js`.
3. **State/Variabel yang Diisi tetapi Tidak Ditampilkan di Template [src/pages/ChatPage.vue](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/pages/ChatPage.vue):**
   - `memuatRiwayat` (baris 31) dan `galatRiwayat` (baris 32) diubah nilainya pada fungsi `muatRiwayatServer()`, `simpanSesiSekarang()`, `laporkan()`, dan `hapusSemua()`, tetapi **tidak pernah dirender** di dalam `<template>` `ChatPage.vue`. Akibatnya, jika penyimpanan/pemuatan riwayat atau pengiriman laporan gagal, pesan `galatRiwayat` tidak terlihat oleh pengguna.
4. **Tabel Database di [db/schema.sql](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/db/schema.sql) yang Belum Diakses oleh Endpoint `api/`:**
   - Tabel `users` (D1), `sessions` (D2), dan `reports` (D4) **aktif digunakan** oleh `api/auth/*`, `api/riwayat.js`, dan `api/laporan.js`.
   - Tabel `consultations` (D3) dan `prompts` (D5) didefinisikan di `db/schema.sql` untuk kesesuaian spesifikasi D1–D5 (SRS/SDD), namun saat ini belum ada query `SELECT`/`INSERT` di `api/` yang mengakses kedua tabel tersebut (riwayat konsultasi disimpan sebagai JSONB di `sessions.data_json`, dan prompt disimpan sebagai konstanta di `api/lib/llmRouter.js`).

### 3.5. Dependensi yang Berpotensi Tidak Diperlukan
Evaluasi seluruh paket pada [package.json](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/package.json):

| Nama Paket | Kategori | Status Penggunaan | Bukti Lokasi Penggunaan | Rekomendasi |
|---|---|---|---|---|
| `vue` (`^3.5.42`) | `dependencies` | **Aktif (Frontend Core)** | `src/main.js`, seluruh `.vue` | **PERTAHANKAN** |
| `vue-router` (`^4.6.4`) | `dependencies` | **Aktif (Frontend Routing)** | `src/router/index.js`, `src/App.vue`, halaman & komponen | **PERTAHANKAN** |
| `@fortawesome/fontawesome-free` (`^7.3.1`) | `dependencies` | **Aktif (Frontend Icons)** | `src/main.js` (`css/all.min.css`), seluruh `<i class="fa-...">` | **PERTAHANKAN** |
| `bcryptjs` (`^3.0.3`) | `dependencies` | **Aktif (Backend Auth)** | `api/auth/login.js`, `api/auth/register.js` | **PERTAHANKAN** (Wajib di `dependencies` agar di-bundle oleh Vercel Serverless runtime) |
| `jsonwebtoken` (`^9.0.3`) | `dependencies` | **Aktif (Backend Auth)** | `api/auth/login.js`, `api/auth/register.js`, `api/lib/auth.js` | **PERTAHANKAN** (Wajib di `dependencies` untuk Vercel Serverless) |
| `pg` (`^8.23.1`) | `dependencies` | **Aktif (Backend DB)** | `api/lib/db.js` | **PERTAHANKAN** (Wajib di `dependencies` untuk Vercel Serverless) |
| `@vitejs/plugin-vue` (`^6.0.8`) | `devDependencies` | **Aktif (Build Tool)** | `vite.config.js` | **PERTAHANKAN** |
| `vite` (`^8.3.0`) | `devDependencies` | **Aktif (Build Tool)** | `package.json` scripts, `vite.config.js` | **PERTAHANKAN** |
| `tailwindcss` (`^3.4.19`) | `devDependencies` | **Aktif (Styling)** | `postcss.config.js`, `tailwind.config.js`, `src/styles/main.css` | **PERTAHANKAN** |
| `postcss` (`^8.5.29`) | `devDependencies` | **Aktif (Styling)** | `postcss.config.js` | **PERTAHANKAN** |
| `autoprefixer` (`^10.6.1`) | `devDependencies` | **Aktif (Styling)** | `postcss.config.js` | **PERTAHANKAN** |

> **Kesimpulan Dependensi:** Tidak ada dependensi sampah/tidak terpakai (`0 unused packages`). Namun, belum ada *test runner* (seperti `vitest` atau Node built-in test runner `node --test`) yang terdaftar di `package.json` `scripts` untuk mendukung otomatisasi *White Box Testing*.

### 3.6. Dokumentasi yang Tersebar, Duplikat, atau Tidak Konsisten
1. **Lokasi Dokumentasi Tersebar:**
   - `README.md` di root.
   - `CHANGE_LOG.md` di root.
   - `design-system/warismu/MASTER.md` di folder `design-system/` (untracked).
   - `src/data/fikih_faraidh_struktur.json` (metadata ringkasan buku referensi) di dalam folder source `src/data/`.
2. **Referensi ke File `DESIGN.md` yang Tidak Ada:**
   - `CHANGE_LOG.md` baris 21 menyebut: *"Warna utama UI tetap memakai `waris-900` sesuai `DESIGN.md`."* Namun tidak ada file `DESIGN.md` di repository; dokumen desain yang ada saat ini adalah `design-system/warismu/MASTER.md`.
3. **Ketidaksinkronan Isi `README.md` dengan Kode Aktual:**
   - **Jumlah Rute:** `README.md` (baris 41) menulis *"Halaman Lengkap (7 Rute): Beranda, Chat, Tentang, Panduan, Detail Panduan, Kontak, dan Daftar/Masuk"*, padahal di `src/router/index.js` saat ini terdapat **9 rute** (ditambah `/kalkulator`, serta `/daftar` dan `/masuk` sebagai 2 rute terpisah).
   - **Urutan & Model Fallback LLM:**
     - `README.md` (baris 6 & 36) menulis urutan: `Gemini → NVIDIA (minimax/deepseek/openai/gpt-oss-20b) → DeepSeek (deepseek-chat) → OpenAI (gpt-4o-mini)`.
     - Sedangkan `.env.example` dan `api/lib/llmRouter.js` sudah diperbarui menjadi: `1. Gemini (gemini-3.5-flash-lite) → 2. DeepSeek via Zro (deepseek-v4.1-flash) → 3. OpenAI (gpt-4o-mini) → 4. NVIDIA (minimax/nemotron/deepseek; gpt-oss-20b sudah dihapus karena HTTP 410)`.
   - **Token Warna & Font di `README.md` vs `tailwind.config.js` & `MASTER.md`:**
     - `README.md` (baris 26–28) menulis `waris-900` `#1d8757` dan font body `Nunito`.
     - `tailwind.config.js` saat ini mendefinisikan `forest-900` / `waris-900` sebagai `#1d3e32` dan font sans utama `"Plus Jakarta Sans", Nunito`.
     - Sementara itu, `design-system/warismu/MASTER.md` mendefinisikan `--color-forest-900` sebagai `#0f3b29` (sedikit berbeda dari `#1d3e32` di `tailwind.config.js`).

### 3.7. Konfigurasi Frontend, Backend, Database, dan Deployment
1. **`vercel.json` vs `public/_redirects`:**
   - `vercel.json` menangani routing SPA (`rewrites` selain `/api/` ke `/index.html`) dan `maxDuration: 60` untuk `api/chat.js`.
   - `public/_redirects` berisi `/* /index.html 200` (format Netlify / Cloudflare Pages). File ini tidak mengganggu Vercel, tetapi jika proyek hanya di-deploy di Vercel, fungsinya redundan sebagai cadangan static host.
2. **`vite.config.js` (`base: './'`):**
   - Menggunakan `base: './'` dan Vue Router `createWebHashHistory()`. Kombinasi ini sangat aman dan sengaja dipilih agar aset tidak 404 di environment hosting mana pun.
   - Plugin custom `apiLokalDev()` di `vite.config.js` menjalankan semua handler di `api/` secara dinamis saat `npm run dev`. Komentar di baris 19–20 hanya menyebut `POST /api/chat` dan `POST /api/auth/register`, padahal kode baris 123 dan resolver-nya sudah mendukung seluruh `/api/chat`, `/api/auth/*`, `/api/riwayat`, dan `/api/laporan`.
3. **Konfigurasi Timeout LLM vs Vercel Hobby Plan Limit (PENTING):**
   - Di `vercel.json`, `"api/chat.js": { "maxDuration": 60 }`.
   - Di `.env.example` dan `api/lib/llmRouter.js`, `LLM_TOTAL_TIMEOUT_MS=60000` (60 detik).
   - Dalam satu request `/api/chat` untuk perhitungan waris, `api/chat.js` memanggil LLM **dua kali** secara berurutan: (1) `ekstrakData()` lalu (2) `jelaskanHasil()`. Jika panggilan pertama menghabiskan waktu fallback yang panjang, total durasi `api/chat.js` dapat mendekati atau melampaui batas 60 detik fungsi Vercel.

### 3.8. File Sementara, Hasil Build, Cache, dan File Gitignore
- **Status `.gitignore`:** Sudah dikonfigurasi dengan baik.
  - `.env.local` berstatus **Ignored (`!!`)** dan **tidak pernah di-commit** ke Git history.
  - `.vercel/`, `dist/`, dan `node_modules/` berstatus **Ignored (`!!`)**.
- **Working Tree Git yang Belum Di-commit:**
  - Terdapat **30 file tracked yang dimodifikasi (`M`)** dan **5 item untracked (`??`)** (`design-system/`, `src/components/HasilPerhitungan.vue`, `src/components/KalkulatorFaraid.vue`, `src/lib/faraidhCalculator.js`, `src/pages/KalkulatorPage.vue`).
  - Sebelum memulai perapian struktur atau pengujian Black Box / White Box, *working tree* yang berisi fitur Kalkulator Faraid dan pembaruan UI ini sebaiknya di-commit sebagai *baseline checkpoint* agar riwayat Git tidak bercampur antara penambahan fitur dan refactoring struktur folder.

### 3.9. Konsistensi Pemisahan Tanggung Jawab Antar-Direktori (Separation of Concerns)
- **`api/` vs `src/`:** Pemisahan antara backend serverless (`api/`) dan frontend SPA (`src/`) sudah jelas. Tidak ada file di `src/` yang meng-import kode dari `api/`, dan tidak ada file di `api/` yang meng-import dari `src/`.
- **Masalah Silo Logika Domain Faraid:**
  - Karena `src/` dan `api/` terpisah secara fisik, pengembang membuat ulang mesin hitung faraid di `src/lib/faraidhCalculator.js` alih-alih berbagi satu modul perhitungan yang sama dengan `api/lib/faraidhLokal.js`.
  - Hal ini melanggar prinsip *Single Source of Truth* untuk logika bisnis yang paling kritis (perhitungan waris deterministik).
- **Komponen UI di `src/components/`:**
  - Semua komponen (14 file) diletakkan rata (*flat*) di dalam `src/components/` tanpa pengelompokan (misalnya komponen layout `Navbar`, `Footer`, `BrandLogo` bercampur dengan komponen spesifik fitur `ChatBubble`, `ChatSidebar`, `KalkulatorFaraid`, `HasilPerhitungan`). Untuk ukuran proyek saat ini (14 komponen), struktur flat masih mudah dinavigasi sesuai prinsip `project-folder-structure` (*jangan memecah folder kecil secara berlebihan*), namun `FeatureCard.vue` yang sudah mati harus dibersihkan.

---

## 4. Daftar File/Folder yang Direkomendasikan untuk Dipertahankan (KEEP)

Seluruh file berikut adalah bagian dari **Bagian yang Wajib Dilindungi** atau memiliki fungsi aktif yang terverifikasi:

### A. Konfigurasi Utama & Entrypoints (Immovable Constraints)
- `package.json` & `package-lock.json` — Manifest & lockfile npm.
- `vite.config.js` — Konfigurasi bundler Vite + dev server middleware `apiLokalDev()`.
- `vercel.json` — Konfigurasi fungsi serverless & SPA rewrite Vercel.
- `tailwind.config.js` & `postcss.config.js` — Konfigurasi desain & styling Tailwind CSS.
- `.gitignore` & `.env.example` — Pengaturan keamanan Git dan template environment variable.
- `.vscode/extensions.json` — Rekomendasi ekstensi Volar.
- `index.html` — Entrypoint HTML aplikasi.
- `README.md` — Peta utama dokumentasi repository (dipertahankan di root, hanya perlu pembaruan isi teks nanti).

### B. Backend Serverless & Integrasi AI/Database (`api/` & `db/`)
- `api/chat.js` — Endpoint utama orkestrator konsultasi AI & kalkulasi faraid.
- `api/riwayat.js` — Endpoint CRUD riwayat sesi konsultasi Supabase.
- `api/laporan.js` — Endpoint pelaporan jawaban AI.
- `api/auth/login.js` & `api/auth/register.js` — Endpoint autentikasi JWT + bcrypt.
- `api/lib/auth.js` — Middleware verifikasi JWT.
- `api/lib/db.js` — Koneksi pool PostgreSQL Supabase.
- `api/lib/faraidh.js` — Normalisasi 23 field ahli waris & pembungkus mesin hitung.
- `api/lib/faraidhLokal.js` — Mesin hitung faraid deterministik utama (port Faraidh-API).
- `api/lib/llmRouter.js` — Router fallback multi-provider LLM (Gemini, DeepSeek/Zro, OpenAI, NVIDIA, Mock).
- `db/schema.sql` — Skema tabel D1–D5 PostgreSQL Supabase.

### C. Frontend Core, Routing, Pages, Components & Data (`src/` & `public/`)
- `src/main.js`, `src/App.vue`, `src/router/index.js`, `src/styles/main.css`.
- `src/lib/akun.js` — Manajemen sesi autentikasi browser & migrasi sesi tamu.
- `src/lib/faraidhCalculator.js` — Mesin hitung kalkulator interaktif sisi klien.
- `src/data/panduan.js` — Data 15 artikel Pustaka Faraid.
- Seluruh 9 file di `src/pages/` (`HomePage.vue`, `KalkulatorPage.vue`, `ChatPage.vue`, `AboutPage.vue`, `PanduanPage.vue`, `PanduanDetailPage.vue`, `ContactPage.vue`, `LoginPage.vue`, `RegisterPage.vue`).
- 13 komponen aktif di `src/components/` (`ArticleCard.vue`, `BrandLogo.vue`, `ChatBubble.vue`, `ChatSidebar.vue`, `ContactForm.vue`, `Footer.vue`, `HasilPerhitungan.vue`, `HeroSection.vue`, `HowItWorks.vue`, `InfoModal.vue`, `KalkulatorFaraid.vue`, `Navbar.vue`, `PanelIcon.vue`).
- `src/assets/logo-waris-mu.png` — Aset logo yang di-import oleh `BrandLogo.vue`.
- `public/favicon.png`, `public/_redirects`, dan seluruh 15 gambar di `public/images/panduan/01-dasar-hukum.jpg` s/d `15-suasana-tenang.jpg`.

---

## 5. Daftar File/Folder yang Berpotensi Dipindahkan (MOVE / ARCHIVE)

Mengikuti panduan `repo-maintainer` dan `project-folder-structure`, file dokumentasi dan referensi yang tersebar di root atau di dalam `src/` direkomendasikan untuk dikonsolidasikan ke dalam `docs/`:

| No | Lokasi Awal | Lokasi Tujuan Rekomendasi | Alasan Pemindahan | Status |
|---|---|---|---|---|
| 1 | `CHANGE_LOG.md` | `docs/CHANGELOG.md` | Mengurangi polusi file markdown di root repository dan menyatukan dokumentasi riwayat pengujian di `docs/`. | **RECOMMENDED MOVE** |
| 2 | `design-system/warismu/MASTER.md` | `docs/design/DESIGN_SYSTEM.md` | Menghilangkan folder top-level `design-system/warismu/` yang hanya berisi 1 file markdown dan 1 subfolder kosong (`pages/`), sekaligus menjawab referensi `DESIGN.md` yang disebut di changelog. | **RECOMMENDED MOVE** |
| 3 | `src/data/fikih_faraidh_struktur.json` | `docs/references/fikih_faraidh_struktur.json` | File ini tidak pernah di-import oleh kode runtime frontend maupun backend. Memindahkannya ke `docs/references/` memisahkan dokumen pengetahuan (knowledge base) dari kode sumber (`src/`). | **RECOMMENDED MOVE** |

---

## 6. Daftar File/Folder yang Berpotensi Dihapus Beserta Bukti dan Alasannya

> **Catatan Sesuai `repo-maintainer` & `codebase-cleanup`:** Sebelum dihapus permanen (`git rm`), pengguna dapat memilih untuk langsung menghapus (**Delete**), memindahkan ke folder karantina `archive/quarantine/` (**Archive**), atau mempertahankan (**Keep**).

| No | Path File / Folder | Ukuran | Bukti Pemeriksaan (Search Evidence) | Alasan Rekomendasi Hapus | Pilihan (`cleanup-files`) |
|---|---|---|---|---|---|
| 1 | `src/components/FeatureCard.vue` | 1,15 KB | `Select-String -Pattern "FeatureCard"` pada `src/**/*`, `index.html` → **0 hasil**. | Komponen sisa desain lama; `HomePage.vue` sudah menulis kartu prinsip secara langsung. | `delete` \| `archive` \| `keep` |
| 2 | `src/assets/about-quran.jpg` | 348,38 KB | `Select-String -Pattern "about-quran"` → **0 hasil**. | Gambar halaman Tentang versi lama yang tidak lagi dipakai di `AboutPage.vue`. | `delete` \| `archive` \| `keep` |
| 3 | `src/assets/hero-keluarga.jpg` | 113,91 KB | `Select-String -Pattern "hero-keluarga"` → **0 hasil**. | Gambar Hero lama; `HeroSection.vue` kini memakai komponen *Live Interactive Mini-Preview* berbasis kode. | `delete` \| `archive` \| `keep` |
| 4 | `src/assets/hero.png` | 12,75 KB | `Select-String -Pattern "hero\.png"` → **0 hasil**. | Gambar Hero prototipe awal yang sudah digantikan. | `delete` \| `archive` \| `keep` |
| 5 | `src/assets/panduan/02-ahli-waris.jpg` | 109,78 KB | `Select-String -Pattern "assets/panduan"` → **0 hasil**. | Digantikan oleh `public/images/panduan/03-ahli-waris.jpg`. | `delete` \| `archive` \| `keep` |
| 6 | `src/assets/panduan/03-bagian-anak.jpg` | 332,08 KB | `Select-String -Pattern "03-bagian-anak"` → **0 hasil**. | Aset panduan generasi lama (8 artikel) sebelum dirombak menjadi 15 artikel di `public/images/panduan/`. | `delete` \| `archive` \| `keep` |
| 7 | `src/assets/panduan/04-pasangan.jpg` | 68,37 KB | `Select-String -Pattern "04-pasangan"` → **0 hasil**. | Aset panduan generasi lama yang tidak direferensikan di `src/data/panduan.js`. | `delete` \| `archive` \| `keep` |
| 8 | `src/assets/panduan/05-urutan-pembagian.jpg` | 55,88 KB | `Select-String -Pattern "05-urutan-pembagian"` → **0 hasil**. | Aset panduan generasi lama yang tidak direferensikan. | `delete` \| `archive` \| `keep` |
| 9 | `src/assets/panduan/06-harta-bersama.jpg` | 65,03 KB | `Select-String -Pattern "assets/panduan"` → **0 hasil**. | Digantikan oleh `public/images/panduan/13-harta-bersama.jpg`. | `delete` \| `archive` \| `keep` |
| 10 | `src/assets/panduan/07-hijab.jpg` | 81,72 KB | `Select-String -Pattern "assets/panduan"` → **0 hasil**. | Digantikan oleh `public/images/panduan/04-hijab.jpg`. | `delete` \| `archive` \| `keep` |
| 11 | `src/assets/panduan/08-chatbot.jpg` | 60,53 KB | `Select-String -Pattern "08-chatbot"` → **0 hasil**. | Aset panduan generasi lama yang tidak direferensikan. | `delete` \| `archive` \| `keep` |
| 12 | `design-system/warismu/pages/` | 0 B | `Get-ChildItem design-system -Recurse` → direktori kosong. | Subdirektori kosong tanpa file; otomatis hilang bila `design-system/` dipindahkan ke `docs/design/`. | `delete` |

---

## 7. Dependensi yang Perlu Dievaluasi

1. **Dependensi Saat Ini (`package.json`):**
   - Semua 11 paket (`6 dependencies` + `5 devDependencies`) **terbukti aktif digunakan**. Tidak ada paket yang direkomendasikan untuk di-uninstall.
2. **Evaluasi Kebutuhan Alat Pengujian (Menjelang White Box & Black Box Testing):**
   - Saat ini `package.json` hanya memiliki script `"dev"`, `"build"`, dan `"preview"`.
   - Untuk **White Box Testing** (pengujian jalur logika algoritma faraid di `api/lib/faraidhLokal.js`, `src/lib/faraidhCalculator.js`, normalisasi di `api/lib/faraidh.js`, dan ekstraksi/fallback di `api/lib/llmRouter.js`), Anda dapat menggunakan **Node.js Built-in Test Runner (`node --test`)** tanpa perlu menginstal dependensi baru, atau menambahkan `vitest` di `devDependencies` bila ingin menguji komponen `.vue`.

---

## 8. Risiko Setiap Rekomendasi

| ID | Rekomendasi | Tingkat Risiko | Analisis Dampak & Mitigasi |
|---|---|---|---|
| **R-01** | Menghapus / mengarsipkan 10 gambar orphan di `src/assets/` dan `src/components/FeatureCard.vue` | **Sangat Rendah (Low)** | Tidak ada satu pun file yang meng-import aset/komponen tersebut. Build Vite (`dist/`) tidak menyertakan file-file ini. Mitigasi: Gunakan `git rm` setelah commit baseline, dan jalankan `npm run build` untuk memastikan 0 error. |
| **R-02** | Memindahkan `CHANGE_LOG.md`, `design-system/warismu/MASTER.md`, dan `src/data/fikih_faraidh_struktur.json` ke `docs/` | **Sangat Rendah (Low)** | Ketiga file ini adalah dokumen statis/referensi yang tidak di-import oleh kode JavaScript/Vue maupun konfigurasi deployment Vercel. |
| **R-03** | Merapikan *unused import* `HasilPerhitungan` & `hasilTerformat` di `src/components/ChatBubble.vue` | **Rendah–Sedang (Low-Med)** | Saat ini `hasilTerformat` hanya dipakai di `v-if="hasilTerformat && hasilTerformat.daftarPenerima.length"`. Jika dihapus, `v-if` harus diganti menjadi `v-if="Array.isArray(bubble.hasil.bagian) && bubble.hasil.bagian.length"` agar tampilan hasil di bubble chat tetap identik 100%. |
| **R-04** | Menghapus `@import url(...)` Google Fonts yang duplikat di `src/styles/main.css` | **Rendah (Low)** | `index.html` sudah memuat font yang sama persis dengan `<link rel="preconnect">` yang lebih cepat. Menghapus `@import` di CSS mempercepat *render-blocking*, namun pastikan `index.html` tetap menjadi satu-satunya entrypoint. |
| **R-05** | Menyelaraskan logika perhitungan `src/lib/faraidhCalculator.js` dengan `api/lib/faraidhLokal.js` | **Tinggi (High — Menyentuh Business Logic)** | Menyentuh perhitungan faraid. **Wajib dikonsultasikan terlebih dahulu:** apakah `src/lib/faraidhCalculator.js` sebaiknya memanggil fungsi `hitungFaraidLokal()` yang sama dengan backend agar hasil Kalkulator dan hasil Chat AI 100% konsisten pada kasus *Gharrawain* dan *Radd*? |

---

## 9. Usulan Struktur Folder Baru

Menggabungkan prinsip **Constraint-First** (`project-folder-structure`) dan **LLM-First Architecture** (`repo-maintainer`) tanpa merusak jalur wajib Vite dan Vercel:

```text
warismu/
├── .ai/                                    # [BARU - repo-maintainer] Konteks arsitektur khusus LLM/Agent
│   └── CONTEXT.md                          # Ringkasan arsitektur hybrid, aturan deterministik faraid & invariants
├── .vscode/
│   └── extensions.json
├── api/                                    # [TETAP - Vercel Constraint] Serverless Functions Backend
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
│   ├── lib/
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── faraidh.js
│   │   ├── faraidhLokal.js
│   │   └── llmRouter.js
│   ├── chat.js
│   ├── laporan.js
│   └── riwayat.js
├── db/                                     # [TETAP] Skema Database Supabase
│   └── schema.sql
├── docs/                                   # [DIKONSOLIDASI] Pusat dokumentasi manusia & laporan pengujian
│   ├── design/
│   │   └── DESIGN_SYSTEM.md                # Dipindahkan dari design-system/warismu/MASTER.md
│   ├── maintenance/
│   │   ├── REPOSITORY_AUDIT.md             # Laporan audit ini
│   │   └── MIGRATION_MANIFEST.md           # Kontrak rencana migrasi
│   ├── references/
│   │   └── fikih_faraidh_struktur.json     # Dipindahkan dari src/data/fikih_faraidh_struktur.json
│   └── CHANGELOG.md                        # Dipindahkan dari CHANGE_LOG.md
├── public/                                 # [TETAP - Vite Constraint] Aset statis publik
│   ├── images/
│   │   └── panduan/                        # 15 gambar artikel panduan aktif (01 s/d 15)
│   ├── _redirects
│   └── favicon.png
├── src/                                    # [TETAP - Vite Constraint] Kode sumber Frontend Vue 3
│   ├── assets/
│   │   └── logo-waris-mu.png               # Hanya menyimpan aset yang benar-benar di-bundle (10 gambar orphan dihapus)
│   ├── components/                         # 13 komponen aktif (FeatureCard.vue dihapus)
│   │   ├── ArticleCard.vue
│   │   ├── BrandLogo.vue
│   │   ├── ChatBubble.vue
│   │   ├── ChatSidebar.vue
│   │   ├── ContactForm.vue
│   │   ├── Footer.vue
│   │   ├── HasilPerhitungan.vue
│   │   ├── HeroSection.vue
│   │   ├── HowItWorks.vue
│   │   ├── InfoModal.vue
│   │   ├── KalkulatorFaraid.vue
│   │   ├── Navbar.vue
│   │   └── PanelIcon.vue
│   ├── data/
│   │   └── panduan.js                      # Data runtime artikel panduan
│   ├── lib/
│   │   ├── akun.js
│   │   └── faraidhCalculator.js
│   ├── pages/                              # 9 halaman rute aktif
│   │   ├── AboutPage.vue
│   │   ├── ChatPage.vue
│   │   ├── ContactPage.vue
│   │   ├── HomePage.vue
│   │   ├── KalkulatorPage.vue
│   │   ├── LoginPage.vue
│   │   ├── PanduanDetailPage.vue
│   │   ├── PanduanPage.vue
│   │   └── RegisterPage.vue
│   ├── router/
│   │   └── index.js
│   ├── styles/
│   │   └── main.css
│   ├── App.vue
│   └── main.js
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 10. Prioritas Perbaikan (Roadmap Menuju Pengujian Black Box & White Box)

### Prioritas 0 (Pra-Syarat Wajib Sebelum Cleanup)
1. **Commit Baseline Working Tree Saat Ini:** Simpan 30 file modifikasi dan 4 file untracked fitur Kalkulator (`KalkulatorPage.vue`, `KalkulatorFaraid.vue`, `HasilPerhitungan.vue`, `faraidhCalculator.js`) ke dalam commit fitur tersendiri agar dapat di-*revert* dengan aman bila diperlukan.

### Prioritas 1 (Pembersihan File & Aset Yatim — Risiko Sangat Rendah)
1. Hapus atau arsipkan 10 file gambar tidak terpakai di `src/assets/` (`about-quran.jpg`, `hero-keluarga.jpg`, `hero.png`, dan 7 file di `src/assets/panduan/`).
2. Hapus atau arsipkan komponen yatim `src/components/FeatureCard.vue`.

### Prioritas 2 (Konsolidasi Dokumentasi & Konteks AI — Risiko Sangat Rendah)
1. Pindahkan `CHANGE_LOG.md` → `docs/CHANGELOG.md`.
2. Pindahkan `design-system/warismu/MASTER.md` → `docs/design/DESIGN_SYSTEM.md` dan hapus folder kosong `design-system/`.
3. Pindahkan `src/data/fikih_faraidh_struktur.json` → `docs/references/fikih_faraidh_struktur.json`.
4. Buat `.ai/CONTEXT.md` untuk mendokumentasikan arsitektur hybrid dan batasan deterministik faraid.
5. Perbarui `README.md` agar jumlah rute (9 rute), urutan provider LLM (`Gemini → DeepSeek/Zro → OpenAI → NVIDIA`), dan palet warna sesuai dengan kondisi kode aktual.

### Prioritas 3 (In-File Tidy — Risiko Rendah)
1. Bersihkan unused import `HasilPerhitungan` dan dead computed `hasilTerformat` di `src/components/ChatBubble.vue` (atau gunakan `HasilPerhitungan mode="compact"` jika memang diinginkan secara desain).
2. Hapus duplikasi `@import url(...)` Google Fonts di baris pertama `src/styles/main.css`.
3. Hapus unused export `daftarKategori` di `src/data/panduan.js`.

### Prioritas 4 (Evaluasi Konsistensi Mesin Faraid untuk White Box Testing)
1. Putuskan apakah `src/lib/faraidhCalculator.js` (kalkulator frontend) harus diselaraskan algoritmanya dengan `api/lib/faraidhLokal.js` (mesin hitung backend) khususnya pada kasus **Gharrawain** dan **Radd dengan pasangan**, agar pengujian White Box dan Black Box tidak menemukan ketidaksesuaian angka antara halaman `/kalkulator` dan `/chat`.

---

## 11. Item dengan Status `NEEDS VERIFICATION`

1. **`NEEDS VERIFICATION` — Koneksi & Skema Aktif di Instance Supabase Produksi/Dev:**
   - Karena audit bersifat *read-only* dan dijalankan di dalam sandbox tanpa membaca isi `.env.local` maupun melakukan koneksi jaringan ke Supabase, kesesuaian antara tabel aktual di server Supabase dengan `db/schema.sql` (D1–D5) belum diverifikasi secara langsung.
2. **`NEEDS VERIFICATION` — Status Tabel `consultations` (D3) dan `prompts` (D5):**
   - Kedua tabel ini ada di `db/schema.sql`, tetapi tidak ada kode di `api/` yang melakukan query ke sana. Perlu konfirmasi apakah tabel ini sengaja dipertahankan untuk pelaporan akademik (kesesuaian dokumen perancangan D1–D5) atau akan digunakan pada fitur mendatang.
3. **`NEEDS VERIFICATION` — Rencana Penggunaan `<HasilPerhitungan mode="compact" />` di `ChatBubble.vue`:**
   - `ChatBubble.vue` sudah meng-import `HasilPerhitungan.vue` dan menyiapkan adaptor `hasilTerformat`, tetapi di `<template>` masih menggunakan perulangan manual `v-for="b in bubble.hasil.bagian"`. Perlu konfirmasi apakah `HasilPerhitungan` memang batal dipakai di dalam bubble chat (sehingga import & computed-nya boleh dihapus) atau belum selesai diintegrasikan.
4. **`NEEDS VERIFICATION` — Eksekusi Build/Test via CLI di Sandbox:**
   - Pada sesi shell sandbox saat audit ini dijalankan, binary `node` / `npm` tidak berada di `PATH` default PowerShell sandbox, sehingga verifikasi dilakukan melalui analisis statis menyeluruh terhadap seluruh 59 file sumber dan pemeriksaan hasil build terakhir di `dist/` beserta `CHANGE_LOG.md`.
