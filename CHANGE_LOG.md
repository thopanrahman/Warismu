# Change Log — Perbaikan Hasil Peer Testing (IPPL)

Tanggal: 27 Oktober 2026
Status build: `npm run build` berhasil (48 modules transformed, tanpa error).

| ID | Masalah | Status Perbaikan | File yang Diubah |
|---|---|---|---|
| B-01 | Tombol Enter tidak mengirim pesan chat | Selesai — `@keydown.enter.exact.prevent` memanggil `kirimPesan()`; Shift+Enter tetap membuat baris baru | `src/pages/ChatPage.vue` |
| B-02 | Loading login/register berputar tanpa batas saat database/API mati | Selesai — `AbortController` dengan timeout 10 detik, `finally` selalu mematikan loading, error koneksi ditampilkan merah | `src/pages/LoginPage.vue`, `src/pages/RegisterPage.vue` |
| B-03 | Teks jawaban AI tidak bisa disalin | Selesai — tombol copy di kanan bawah bubble AI memakai `navigator.clipboard.writeText()`, ikon berubah menjadi centang selama 2 detik | `src/components/ChatBubble.vue` |
| V-01 | Pesan chat kosong/hanya spasi bisa dikirim | Selesai — validasi `trim()` sebelum pesan diproses | `src/pages/ChatPage.vue` |
| V-02 | Password lemah (contoh: `123`) bisa dipakai registrasi | Selesai — validasi frontend + backend: minimal 8 karakter, wajib huruf dan angka; pesan error tampil di bawah input | `src/pages/RegisterPage.vue`, `api/auth/register.js` |
| V-03 | Tombol kirim bisa diklik berulang saat AI membalas | Selesai — tombol kirim `disabled` saat `sedangMengetik`, dengan `opacity-50` dan `cursor-not-allowed` | `src/pages/ChatPage.vue` |
| U-01 | Tamu tidak mendapat penanda bahwa riwayat tidak disimpan | Selesai — badge `text-waris-500`: “Mode Tamu — Riwayat tidak disimpan otomatis” di bawah profil tamu | `src/components/ChatSidebar.vue` |
| U-02 | Menu navbar berdesakan di layar tablet (768px) | Terverifikasi — menu teks sudah `hidden lg:flex` dan hamburger `lg:hidden`; ditambah `aria-controls`, label aksesibel, serta drawer yang bisa di-scroll | `src/components/Navbar.vue` |

## Catatan

- Logika API lokal di `vite.config.js` tidak diubah.
- Skema database Supabase tidak diubah.
- Warna utama UI tetap memakai `waris-900` sesuai `DESIGN.md`.
