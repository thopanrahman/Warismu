# Migration Manifest & Rencana Perapian Repository WarisMu

- **Dokumen Kontrak Perubahan:** Mengacu pada `docs/maintenance/REPOSITORY_AUDIT.md`
- **Status Saat Ini:** **DRAFT — MENUNGGU PERSETUJUAN USER (NO CHANGES APPLIED)**
- **Prinsip Eksekusi:**
  1. Seluruh pemindahan file tracked wajib menggunakan `git mv` untuk menjaga histori Git (`repo-maintainer`).
  2. Tidak ada perubahan yang boleh dijalankan sebelum pengguna memilih opsi pada daftar keputusan di bawah (`codebase-cleanup`).
  3. Seluruh *immovable constraints* (`api/`, `src/pages/`, `src/router/`, `public/`, `vite.config.js`, `vercel.json`, `.env*`) dijaga tetap stabil (`project-folder-structure`).

---

## 1. Batasan yang Tidak Akan Disentuh (Immovable Constraints)

Sesuai aturan `project-folder-structure` dan Bagian 4 spesifikasi tugas, elemen berikut **TIDAK AKAN DIPINDAHKAN ATAU DIUBAH**:
- Struktur endpoint serverless di `api/chat.js`, `api/riwayat.js`, `api/laporan.js`, `api/auth/login.js`, `api/auth/register.js`.
- Modul backend di `api/lib/auth.js`, `api/lib/db.js`, `api/lib/faraidh.js`, `api/lib/faraidhLokal.js`, `api/lib/llmRouter.js`.
- Skema database `db/schema.sql`.
- Konfigurasi routing `src/router/index.js` (seluruh 9 rute URL hash `#/...` tetap identik).
- Konfigurasi deployment & build: `vercel.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `package.json`, `package-lock.json`, `index.html`.
- File environment variable `.env.local` dan `.env.example`.

---

## 2. Rencana Pemindahan File (Move Plan)

Batch pemindahan ini berfokus pada konsolidasi dokumentasi dan pemisahan file referensi non-kode dari `src/`:

| ID | Lokasi Awal | Lokasi Tujuan yang Direkomendasikan | Metode | Alasan Perubahan | Dampak terhadap Import, Routing, Konfigurasi & Deployment | Risiko & Cara Mitigasi |
|---|---|---|---|---|---|---|
| **M-01** | `CHANGE_LOG.md` | `docs/CHANGELOG.md` | `git mv` | Merapikan root directory agar hanya menyisakan `README.md` sebagai pintu masuk utama sesuai standar `repo-maintainer`. | **Tidak ada dampak** pada import, routing, Vite build, maupun Vercel deployment. | **Risiko: Sangat Rendah.** Mitigasi: Perbarui tautan jika ada dokumen laporan yang merujuk ke `CHANGE_LOG.md`. |
| **M-02** | `design-system/warismu/MASTER.md` | `docs/design/DESIGN_SYSTEM.md` | `Move-Item` (karena belum tracked di Git) lalu hapus folder kosong `design-system/` | Menyatukan spesifikasi desain ke dalam folder `docs/design/` dan menghilangkan folder kosong `design-system/warismu/pages/`. | **Tidak ada dampak** pada kode runtime, build, maupun deployment. | **Risiko: Sangat Rendah.** Mitigasi: Pastikan seluruh isi `MASTER.md` tersalin utuh sebelum menghapus direktori kosong `design-system/`. |
| **M-03** | `src/data/fikih_faraidh_struktur.json` | `docs/references/fikih_faraidh_struktur.json` | `git mv` | File ini berisi metadata struktur bab buku cetak referensi (bukan data yang di-import aplikasi). Memindahkannya keluar dari `src/data/` memperjelas bahwa hanya `src/data/panduan.js` yang merupakan data runtime aplikasi. | **Tidak ada dampak** pada import, routing, maupun bundle Vite (sudah diverifikasi 0 import di seluruh repo). | **Risiko: Sangat Rendah.** Mitigasi: Jalankan `npm run build` setelah `git mv` untuk memverifikasi bundle tetap sukses. |

---

## 3. Rencana Penghapusan / Karantina File Yatim (Cleanup Files Plan)

Sesuai prosedur wajib `cleanup-files`, setiap file yang diusulkan untuk dihapus memiliki bukti pencarian dan menunggu keputusan Anda (`delete` | `archive` ke `archive/quarantine/` | `keep`):

| ID | Lokasi Awal | Lokasi Tujuan (Jika Archive) / Aksi | Bukti Pemeriksaan | Dampak terhadap Import, Routing, Konfigurasi & Deployment | Risiko & Cara Mitigasi | Pilihan User |
|---|---|---|---|---|---|---|
| **D-01** | `src/components/FeatureCard.vue` | Hapus (`git rm`) atau arsip ke `archive/quarantine/FeatureCard.vue` | 0 referensi di seluruh file `.vue`, `.js`, `.html`. | **Tidak ada dampak.** Komponen tidak terhubung ke halaman mana pun. | **Risiko: Sangat Rendah.** Mitigasi: Gunakan `git rm` setelah baseline commit agar tetap tercatat di riwayat Git. | `[ ] delete` `[ ] archive` `[ ] keep` |
| **D-02** | `src/assets/about-quran.jpg` | Hapus (`git rm`) atau arsip ke `archive/quarantine/assets/about-quran.jpg` | 0 referensi di seluruh repo. | **Tidak ada dampak** pada build (`dist/`) maupun UI `AboutPage.vue`. Menghemat 348 KB di repo. | **Risiko: Sangat Rendah.** Mitigasi: Tersimpan di Git history commit sebelumnya. | `[ ] delete` `[ ] archive` `[ ] keep` |
| **D-03** | `src/assets/hero-keluarga.jpg` | Hapus (`git rm`) atau arsip ke `archive/quarantine/assets/hero-keluarga.jpg` | 0 referensi di seluruh repo. | **Tidak ada dampak** pada `HeroSection.vue`. Menghemat 114 KB di repo. | **Risiko: Sangat Rendah.** Mitigasi: Tersimpan di Git history. | `[ ] delete` `[ ] archive` `[ ] keep` |
| **D-04** | `src/assets/hero.png` | Hapus (`git rm`) atau arsip ke `archive/quarantine/assets/hero.png` | 0 referensi di seluruh repo. | **Tidak ada dampak.** Menghemat 13 KB di repo. | **Risiko: Sangat Rendah.** Mitigasi: Tersimpan di Git history. | `[ ] delete` `[ ] archive` `[ ] keep` |
| **D-05** | `src/assets/panduan/02-ahli-waris.jpg` s/d `08-chatbot.jpg` (7 file) | Hapus (`git rm -r src/assets/panduan`) atau arsip ke `archive/quarantine/assets/panduan/` | 0 referensi di seluruh repo. Seluruh 15 artikel di `src/data/panduan.js` memuat gambar dari `/images/panduan/01-dasar-hukum.jpg` s/d `15-suasana-tenang.jpg` yang berada di `public/images/panduan/`. | **Tidak ada dampak** pada halaman `/panduan` maupun `/panduan/:id`. Menghemat ~773 KB di repo dan menghilangkan kebingungan antara `src/assets/panduan/` dan `public/images/panduan/`. | **Risiko: Sangat Rendah.** Mitigasi: Pastikan `public/images/panduan/` (15 file) **tidak disentuh**. | `[ ] delete` `[ ] archive` `[ ] keep` |

---

## 4. Rencana Perapian Internal File (In-File Tidy & Docs Sync Plan)

Sesuai `cleanup-tidy`, perubahan di bawah ini adalah perapian di dalam file tanpa menghapus file tersebut:

| ID | Target File | Rencana Perubahan | Alasan Perubahan | Dampak terhadap Aplikasi | Risiko & Cara Mitigasi | Pilihan User |
|---|---|---|---|---|---|---|
| **T-01** | `src/components/ChatBubble.vue` | Menghapus `import HasilPerhitungan from './HasilPerhitungan.vue'` (baris 4) dan `const hasilTerformat = computed(...)` (baris 51–90), serta mengganti `v-if="hasilTerformat && hasilTerformat.daftarPenerima.length"` (baris 126) menjadi `v-if="Array.isArray(bubble.hasil.bagian) && bubble.hasil.bagian.length"`. *(Alternatif: gunakan `<HasilPerhitungan :hasil="hasilTerformat" mode="compact" />` jika ingin menampilkan visual bar di dalam chat)*. | `HasilPerhitungan` di-import namun tidak pernah dirender di template `ChatBubble.vue`, meninggalkan 45 baris kode mati. | Menjaga tampilan hasil di dalam bubble chat tetap sama persis sambil menghilangkan dead code dan ketergantungan import yang tidak perlu. | **Risiko: Rendah.** Mitigasi: Uji tampilan bubble hasil simulasi di `/chat` setelah perubahan. | `[ ] hapus dead import` `[ ] pakai komponen HasilPerhitungan` `[ ] keep as-is` |
| **T-02** | `src/styles/main.css` | Menghapus baris 1 (`@import url('https://fonts.googleapis.com/css2?...');`). | Font yang sama persis sudah dimuat melalui `<link rel="stylesheet">` dengan `preconnect` di `index.html` (baris 14–19). | Menghilangkan request CSS font ganda saat halaman dimuat. | **Risiko: Sangat Rendah.** Mitigasi: Pastikan `<link>` di `index.html` tetap utuh. | `[ ] tidy` `[ ] keep` |
| **T-03** | `src/data/panduan.js` | Menghapus `export const daftarKategori` (baris 396–403). | Export tersebut tidak pernah di-import di file mana pun (`PanduanPage.vue` menghitung daftar kategori secara dinamis dari `daftarPanduan`). | Tidak ada dampak runtime. | **Risiko: Sangat Rendah.** | `[ ] tidy` `[ ] keep` |
| **T-04** | `README.md` | Memperbarui informasi jumlah rute (7 → 9 rute termasuk `/kalkulator`), urutan LLM fallback (`Gemini → DeepSeek/Zro → OpenAI → NVIDIA`), dan spesifikasi token warna/font agar sinkron dengan kode terbaru. | Mencegah disinformasi bagi penguji Black Box / White Box saat membaca dokumentasi utama. | Hanya perubahan dokumentasi teks. | **Risiko: Nol (0).** | `[ ] update` `[ ] keep` |
| **T-05** | `.ai/CONTEXT.md` (File Baru) | Membuat file `.ai/CONTEXT.md` berdasarkan template `repo-maintainer`. | Menyediakan peta konteks eksplisit bagi AI/pengembang tentang arsitektur hybrid WarisMu dan aturan bahwa LLM dilarang menghitung faraid secara langsung. | Hanya menambah 1 file markdown dokumentasi arsitektur. | **Risiko: Nol (0).** | `[ ] create` `[ ] skip` |

---

## 5. Rencana Evaluasi Konsistensi Logika Faraid (`NEEDS VERIFICATION` / Keputusan Arsitektur)

> **PERINGATAN:** Bagian ini menyentuh logika perhitungan faraid dan **TIDAK AKAN DIUBAH** kecuali Anda secara eksplisit meminta penyelarasan sebelum pengujian White Box.

| ID | Komponen yang Terlibat | Temuan Audit | Opsi Tindakan | Risiko & Mitigasi |
|---|---|---|---|---|
| **L-01** | `api/lib/faraidhLokal.js` (Backend Chat) vs `src/lib/faraidhCalculator.js` (Frontend Kalkulator) | Terdapat dua implementasi mesin hitung faraid yang berbeda di repository. Pada kasus **Gharrawain** (Pasangan + Ibu + Ayah) dan **Radd dengan pasangan**, kedua file menghasilkan perhitungan yang berbeda. | **Opsi A (Keep Separate):** Biarkan sebagaimana adanya saat ini jika perbedaan tersebut disengaja untuk pengujian.<br>**Opsi B (Unify Engine):** Gunakan algoritma `AhliWaris.solving()` dari `faraidhLokal.js` di dalam `src/lib/faraidhCalculator.js` agar perhitungan di `/kalkulator` dan `/chat` 100% identik di semua 23 variabel ahli waris. | **Risiko: Tinggi** bila diubah tanpa unit test. Mitigasi: Buat skrip pengujian White Box terlebih dahulu untuk membandingkan output kedua mesin pada seluruh skenario standar KHI & buku Dr. Khairuddin. |

---

## 6. Urutan Eksekusi Aman (Setelah Disetujui)

Jika Anda menyetujui rencana di atas, eksekusi akan dilakukan dalam tahapan kecil yang terverifikasi (*smallest safe batches*):

1. **Tahap 1 — Checkpoint Git:** Commit perubahan fitur yang saat ini masih *uncommitted* di working tree.
2. **Tahap 2 — Konsolidasi Dokumentasi (`M-01`, `M-02`, `M-03`, `T-04`, `T-05`):** Pindahkan dokumen ke `docs/` dengan `git mv` dan buat `.ai/CONTEXT.md`.
3. **Tahap 3 — Pembersihan Aset & Komponen Yatim (`D-01` s/d `D-05`):** Hapus atau arsipkan file orphan sesuai pilihan Anda.
4. **Tahap 4 — Perapian Kode Internal (`T-01`, `T-02`, `T-03`):** Rapikan dead import di `ChatBubble.vue`, duplikat font di `main.css`, dan unused export di `panduan.js`.
5. **Tahap 5 — Verifikasi Akhir:** Jalankan `npm run build`, pencarian path lama, dan `git status` / `git diff --stat`.
