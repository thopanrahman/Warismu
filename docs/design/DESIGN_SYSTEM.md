# WarisMu — Master Design System Specification

> **Source of Truth:** Seluruh halaman dan komponen WarisMu mengacu pada dokumen ini.
> Disusun berdasarkan prinsip Modern Islamic Editorial, Human-Centered Information Design, dan bebas dari AI Slop.

---

**Brand:** WarisMu — Islamic Inheritance Companion  
**Visual Direction:** Refined Editorial, Humane, Trustworthy, Modern Islamic, Tranquil  
**Design Dials:** Energy 3 / Rhythm 3 / Motion 2  

---

## 1. Color Palette Tokens

WarisMu berakar pada warna **HIJAU** sebagai simbol kehidupan, kedamaian, dan keadilan syariat, dipadukan dengan latar kertas hangat (*warm linen/parchment*) dan tipografi charcoal pekat (*forest ink*).

| Role | Token / CSS Var | Hex Value | Semantic Purpose |
|------|-----------------|-----------|------------------|
| **Brand Primary (Deep Forest)** | `--color-forest-900` | `#0f3b29` | Identitas utama, navbar active, tombol utama |
| **Primary Hover** | `--color-forest-800` | `#16533b` | State hover tombol utama |
| **Forest Night (Surface Dark)** | `--color-forest-950` | `#082117` | Footer, banner hero pekat, kontras tinggi |
| **Sage Laurel (Secondary)** | `--color-sage-600` | `#2d7a56` | Sub-heading, aksen pembagian waris |
| **Sage Light (Tint)** | `--color-sage-100` | `#e4efe8` | Background badge, highlight tabel baris |
| **Sage Surface** | `--color-sage-50` | `#f0f6f2` | Card latar lembut, section pembeda |
| **Canvas Background** | `--color-bg-canvas` | `#fbfdfa` | Background halaman utama (hangat, bukan putih steril) |
| **Card Surface** | `--color-surface` | `#ffffff` | Background kartu, container konten |
| **Ink Headings** | `--color-ink-900` | `#0d1e16` | Judul, angka nominal, kontras teks AAA |
| **Ink Body** | `--color-ink-700` | `#2c3f35` | Teks paragraf, rincian penjelasan (WCAG AA > 7:1) |
| **Ink Muted** | `--color-ink-500` | `#586e62` | Label sekunder, metadata tanggal/waktu baca |
| **Border Refined** | `--color-border-subtle` | `rgba(15, 59, 41, 0.12)` | Border pemisah halus, elegan |
| **Border Focused** | `--color-border-focus` | `#0f3b29` | Focus state input dan navigasi |
| **Dalil Ochre (Accent)** | `--color-dalil-amber` | `#b8860b` | Aksen ayat Qur'an, catatan wasiat, bukan dekorasi liar |
| **Dalil Surface** | `--color-dalil-bg` | `#fbf8f0` | Kotak kutipan dalil dan disclaimer syariat |
| **Error / Alert** | `--color-danger` | `#b91c1c` | Validasi gagal, error koneksi |
| **Error Surface** | `--color-danger-bg` | `#fef2f2` | Banner notifikasi error |

---

## 2. Typography Hierarchy

Paduan tipografi: **Fraunces** (Editorial Display Serif berbobot hangat dan terpercaya) untuk judul dan identitas, berpasangan dengan **Plus Jakarta Sans / Public Sans** untuk antarmuka, kalkulator angka, dan teks panjang.

- **Display 1 (Hero Title):** `font-display`, `text-4xl sm:text-5xl lg:text-6xl`, tracking `-0.02em`, leading `1.08`.
- **H2 (Section Heading):** `font-display`, `text-2xl sm:text-3xl lg:text-4xl`, tracking `-0.015em`, leading `1.2`.
- **H3 (Sub-heading / Card Title):** `font-sans`, font-bold, `text-lg sm:text-xl`, tracking `-0.01em`.
- **Data Figures (Nominal Uang / Porsi):** `font-mono` atau `font-sans` tabular-nums, font-extrabold.
- **Body Text:** `font-sans`, `text-base` (16px) atau `text-sm` (14px), leading `1.65`, warna `text-ink-700`.
- **Arabic Quranic Text:** `font-serif`, `text-2xl sm:text-3xl`, dir `rtl`, line-height `2.2`.

---

## 3. Spacing & Grid System

- **Gutter & Container:** max-width 72rem (1152px) untuk halaman luas, 48rem (768px) untuk formulir kalkulator dan artikel bacaan.
- **Rhythm:** Menggunakan kelipatan 4px / 8px:
  - Tight: 4px, 8px, 12px
  - Form & Component: 16px, 20px, 24px
  - Section Spacing: 64px (mobile), 96px (desktop)
- **Komposisi Layout:**
  - Tidak semua section menggunakan 3 grid card identik.
  - Kombinasi layout: Asymmetric Split (Editorial Story + Quick Action), Horizontal Step Progression, Interactive Calculator Matrix, Rich Result Ratio View.

---

## 4. Component Rules

### Buttons
- **Primary:** Background forest-900, teks putih, rounded 10px-12px (bukan full pill generik), padding horizontal proporsional, tactile hover (`hover:bg-forest-800 active:scale-[0.98]`).
- **Secondary:** Border border-forest-900/25, background transparan atau putih, hover background forest-50.
- **Ghost:** Tanpa border, hover text forest-900 hover background forest-100/50.
- **Accessibility:** Semua button memiliki focus-visible ring 2px forest-900 dengan offset 2px.

### Inputs & Form Fields
- Label teks jelas di atas input (bukan sekadar placeholder).
- Border subtle, rounded 10px, background putih bersih.
- State focus: border forest-900 dengan ring soft (bukan glow neon).
- Pesan validasi inline di bawah input dengan ikon dan teks jelas.

### Calculator & Result Visualization
- Pengelompokan logis:
  1. Identitas Pewaris (Jenis kelamin, status perkawinan)
  2. Harta & Pengurang (Harta kotor, hutang, wasiat, biaya jenazah -> Harta Bersih Tirkah)
  3. Ahli Waris Utama (Pasangan, Anak, Orang Tua)
  4. Ahli Waris Tambahan / Sekunder (Kakek, Nenek, Saudara)
- Visualisasi Hasil:
  - Ringkasan Harta Bersih.
  - Diagram / Bar Proporsi Pembagian Waris interaktif (tiap ahli waris mendapat segmen warna yang jelas sesuai porsi faraidnya: 1/2, 1/4, 1/8, 2/3, ashabah, dll).
  - Rincian penerima waris: Nama ahli waris, status bagian hukum (ashabul furudh / ashabah), jumlah penerima, nominal per orang, dan total.
  - Penjelasan dalil rujukan (Al-Qur'an & KHI) yang mendasari pembagian tersebut.
  - Tombol aksi praktis: "Salin Rincian", "Cetak / Simpan Ringkasan", "Konsultasikan ke AI".

### Chat Consultation
- Sapaan yang berempati dan menenangkan.
- Starter cards / inspirasi skenario kasus nyata keluarga (misal: "Ayah wafat, ada ibu, 1 anak laki-laki dan 2 anak perempuan").
- Bubble chat yang bersih: User bubble hijau forest gelap di kanan, AI bubble sage muda elegan di kiri.
- Kartu hasil perhitungan di dalam chat dirender dengan komponen hasil yang sama megah dan informatifnya.

---

## 5. Anti-Slop Enforcement (Strict)
- ❌ Tidak ada em dash (`—`) dalam teks UI; gunakan titik, koma, titik dua, atau kurung (R-02).
- ❌ Tidak ada angka atau statistik fiktif ("10,000+ pengguna puas", "99.9% akurasi").
- ❌ Tidak ada review / testimonial palsu berfoto AI.
- ❌ Tidak ada dekorasi geometris atau bulan sabit tempelan tanpa fungsi.
- ❌ Tidak ada tombol mati atau link navbar kosong.
- ❌ Tidak ada layout monoton (hero 2 tombol -> 3 card -> 3 step -> footer).
