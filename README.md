# 🕌 WarisMu — Asisten Edukasi & Simulasi Waris Islam

> Platform edukasi kewarisan Islam (faraid) berbasis web dengan pendekatan *conversational chatbot*.
> Pengguna bercerita dalam bahasa natural → sistem mengekstraksi data keluarga → menanyakan yang kurang → menghitung → menampilkan hasil (rincian bagian + dalil + *disclaimer*).

**Tugas Proyek — Informatika.** Repo ini berisi **Frontend Vue 3** + **API Serverless** (`api/`). Mesin AI memakai rantai *fallback* **Gemini → DeepSeek → OpenAI**; bila ketiganya tidak bisa dihubungi atau database belum diisi, chatbot otomatis jatuh ke **mode mock** sehingga demo perkuliahan tidak pernah mati.

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

## 🎨 Arah Desain (Modern Islamic & Anti-Slop)

Sistem desain dibangun untuk menghindari tampilan antarmuka AI yang generik.
- **Warna Brand:** `waris-900` `#1d8757` (Primary) + ramp `waris-50…950`.
- **Netral:** `paper` `#F7FBF8` (Latar), `cream` `#FEFEFA` (Panel), `ink` `#122A20` (Teks).
- **Tipografi:** **Fraunces** (Serif) untuk judul/heading + **Nunito** (Sans-serif) untuk body.
- **Aturan Ketat:** Layout wajib menggunakan *Flexbox/Grid Tailwind* (TIDAK menggunakan `<table>` untuk layout utama). 

---

## ✨ Fitur Utama (Progress IPPL & Desain Web)

- **Chatbot Konsultasi (`/chat`)**: Fitur inti. Antarmuka percakapan dengan *sidebar* riwayat, *bubble* chat interaktif, indikator *typing*, dan *fallback* mode offline (mock) jika API limit.
- **Ekstraksi Data AI**: Rantai LLM multi-provider (`api/lib/llmRouter.js`) — Gemini `gemini-3.5-flash` → `gemini-3.5-flash-lite` → DeepSeek `deepseek-chat` → OpenAI `gpt-4o-mini` — mengekstrak cerita user menjadi JSON terstruktur.
- **Kalkulasi Faraid**: Menampilkan hasil perhitungan waris lengkap dengan dalil dan *disclaimer*. Perhitungan dijalankan mesin hitung lokal di `api/lib/faraidhLokal.js` — lihat [Kredit & Atribusi](#-kredit--atribusi).
- **Autentikasi (Login & Register)**: Terintegrasi dengan database Supabase (PostgreSQL) menggunakan *bcrypt* dan JWT.
- **Navigasi Responsif**: Navbar dengan *hamburger menu* di perangkat mobile.
- **UI Interaktif**: Modal edukasi "Apa itu Faraid?", filter pencarian artikel di halaman Panduan, dan validasi form.
- **Halaman Lengkap (7 Rute)**: Beranda, Chat, Tentang, Panduan, Detail Panduan, Kontak, dan Daftar/Masuk.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Frontend** | Vue 3 (Composition API), Vue Router (Hash Mode), Vite |
| **Styling** | Tailwind CSS (via npm), PostCSS |
| **Backend / API** | Vercel Serverless Functions (Node.js) |
| **Database** | PostgreSQL (Supabase) via `pg` (node-postgres) |
| **AI Engine** | Gemini → DeepSeek → OpenAI (fallback berantai, REST Fetch) |
| **Autentikasi** | JWT (JSON Web Token) & `bcryptjs` |

---

## 🙏 Kredit & Atribusi

**Algoritma pembagian waris pada WarisMu bukan karya penulis.** Mesin hitung di
`api/lib/faraidhLokal.js` adalah port JavaScript dari proyek open source berikut:

- **Faraidh-API** oleh [alamrumambi](https://github.com/alamrumambi)
  — [github.com/alamrumambi/Faraidh-API](https://github.com/alamrumambi/Faraidh-API)
  Berkas sumber yang diadaptasi: `Models/solvingModel.js`, `Models/beneficiaryModel.js`,
  `helpers/dataIndex.js`, dan `helpers/kpk.js`.

Repo aslinya **tidak menyertakan berkas lisensi**. Atribusi ini ditulis sebagai bentuk
penghargaan dan kejujuran akademik. Bila proyek ini dipublikasikan atau dinilai secara
formal, harap konfirmasi lebih dulu ke pemilik repo atau cantumkan sumbernya secara
eksplisit di laporan.

Perubahan yang dilakukan saat porting (tidak mengubah hasil pembagian):

1. Diubah ke ESM dan `console.log` dihapus.
2. `haveDaughterAndGrand()` memakai penyebut cucu perempuan (`cP`). Sumber asli memakai
   `aP` sehingga melempar `TypeError` saat kasus hanya punya cucu perempuan tanpa anak
   perempuan.
3. Penerima tanpa jumlah orang (`dzawil_arhaam`) memakai `1` agar `dana_per_orang`
   tidak bernilai `NaN`.

Kredit aset dan tipografi:

- Gambar pada halaman Panduan berasal dari [Unsplash](https://unsplash.com) dan dipakai
  sesuai [Unsplash License](https://unsplash.com/license).
- Tipografi **Fraunces** dan **Nunito** dari [Google Fonts](https://fonts.google.com),
  dilisensikan di bawah SIL Open Font License.

---
