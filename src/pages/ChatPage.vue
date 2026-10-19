<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import PanelIcon from '../components/PanelIcon.vue'

// ============ STATE ============
// Mulai kosongan ala DeepSeek/ChatGPT: tidak ada sapaan bot, tidak ada mock.
// Refresh = kembali ke tampilan awal (permintaan Desweb).
const pesanBaru = ref('')
const sedangMengetik = ref(false)
const galatApi = ref('')
const teksGagal = ref('')
const konfirmasiHapus = ref(false)
// Di desktop sidebar tampil terbuka sejak awal; di layar kecil default tertutup (drawer).
const layarBesar = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
const sidebarTerbuka = ref(layarBesar)
const kataKunci = ref('')
const areaPesan = ref(null)
let idCounter = Date.now()

const KUNCI_RIWAYAT = 'warismu_riwayat_v1'
const kunciSesi = (id) => `warismu_sesi_${id}`

// ===== Status akun =====
// Diisi halaman Daftar (/daftar) dan Masuk (/masuk) ke localStorage.
// Tamu tetap boleh berkonsultasi, tapi percakapannya TIDAK disimpan:
// tidak masuk daftar riwayat, dan hilang saat halaman dimuat ulang.
function bacaPengguna() {
  try {
    const mentah = localStorage.getItem('warismu_user')
    return mentah ? JSON.parse(mentah) : null
  } catch {
    return null
  }
}
const pengguna = ref(bacaPengguna())
const sudahMasuk = computed(() => !!pengguna.value)

function muatRiwayat() {
  // Tamu tidak memuat riwayat sama sekali. Isi localStorage dibiarkan utuh,
  // jadi riwayat milik akun tidak hilang saat pengguna keluar (logout).
  if (!bacaPengguna()) return []
  try {
    const mentah = localStorage.getItem(KUNCI_RIWAYAT)
    const arr = mentah ? JSON.parse(mentah) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
function simpanRiwayat() {
  if (!sudahMasuk.value) return
  try {
    localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarRiwayat))
  } catch { /* abaikan: mode privat / storage penuh */ }
}
function bacaSesi(id) {
  try {
    const mentah = localStorage.getItem(kunciSesi(id))
    const arr = mentah ? JSON.parse(mentah) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
function simpanSesiAktif() {
  // Tamu tidak punya sesi tersimpan — cukup di memori sampai halaman di-refresh.
  if (!sudahMasuk.value || !sesiAktifId.value) return
  try {
    localStorage.setItem(kunciSesi(sesiAktifId.value), JSON.stringify(daftarPesan))
    // Catat waktu terakhir sesi diperbarui (dipakai daftar riwayat).
    const item = daftarRiwayat.find((r) => r.id === sesiAktifId.value)
    if (item) {
      item.waktu = Date.now()
      simpanRiwayat()
    }
  } catch { /* abaikan */ }
}

// Riwayat sidebar: mulai kosong, disimpan di local saja (Desweb, belum backend).
const daftarRiwayat = reactive(muatRiwayat())
const sesiAktifId = ref(null)

// Percakapan aktif: selalu mulai kosong. Sengaja TIDAK dipulihkan saat refresh.
const daftarPesan = reactive([])

const belumMulai = computed(() => daftarPesan.length === 0)

// ============ PENCARIAN SESI (judul + isi percakapan) ============
function cuplikanSekitar(teks, kunci) {
  const bersih = String(teks || '').replace(/\s+/g, ' ').trim()
  const pos = bersih.toLowerCase().indexOf(kunci)
  if (pos <= 0) return bersih.slice(0, 100) + (bersih.length > 100 ? '…' : '')
  const mulai = Math.max(0, pos - 30)
  return (
    (mulai > 0 ? '…' : '') +
    bersih.slice(mulai, mulai + 110) +
    (mulai + 110 < bersih.length ? '…' : '')
  )
}

// Daftar yang ditampilkan di sidebar: hanya sesi yang cocok, urutan tetap terbaru.
const riwayatTampil = computed(() => {
  const kunci = kataKunci.value.trim().toLowerCase()
  if (!kunci) return daftarRiwayat.map((r) => ({ ...r, cuplikan: '' }))
  return daftarRiwayat
    .map((r) => {
      const judulCocok = String(r.judul || '').toLowerCase().includes(kunci)
      const cocok = bacaSesi(r.id).find((p) => String(p.teks || '').toLowerCase().includes(kunci))
      if (!judulCocok && !cocok) return null
      return { ...r, cuplikan: cocok ? cuplikanSekitar(cocok.teks, kunci) : '' }
    })
    .filter(Boolean)
})

// ============ FALLBACK OFFLINE (dipakai jika /api/chat tak terjangkau) ============
function rupiah(n) {
  return 'Rp' + n.toLocaleString('id-ID')
}

function buatBalasanMock(teksUser) {
  const t = teksUser.toLowerCase()

  // Simulasi hasil perhitungan lengkap (FR-07 s/d FR-14)
  if (t.includes('500') || t.includes('rp') || /\d/.test(t)) {
    return {
      teks: `Baik, saya simulasikan dengan asumsi: pewaris (ayah) wafat meninggalkan ibu, istri, 1 anak laki-laki, dan 2 anak perempuan. Tirkah Rp500 juta (sudah bersih dari hutang & wasiat — mohon konfirmasi jika belum!).\n\nCatatan: hutang pewaris & wasiat (maks. 1/3) wajib diselesaikan dulu sebelum faraid (FR-04). Apakah pewaris masih punya hutang?`,
      hasil: {
        judul: 'Simulasi Faraid — Tirkah Rp500 juta (mock)',
        bagian: [
          { nama: 'Ibu', porsi: '1/6 (ada anak)', nominal: rupiah(83_333_333) },
          { nama: 'Istri', porsi: '1/8 (ada anak)', nominal: rupiah(62_500_000) },
          { nama: 'Anak laki-laki', porsi: 'ashabah — 2× anak pr', nominal: rupiah(141_666_667) },
          { nama: 'Anak pr @1', porsi: 'ashabah — ½ anak lk', nominal: rupiah(70_833_333) },
          { nama: 'Anak pr @2', porsi: 'ashabah — ½ anak lk', nominal: rupiah(70_833_333) },
        ],
        catatan: 'Total terbagi ± Rp429,16 jt. Angka mock untuk demo — backend LLM menghitung presisi + kasus aul/radd.',
      },
      sumber: 'QS. An-Nisa: 11–12; KHI Pasal 175–177 (FR-11)',
      disclaimer: 'Hasil ini simulasi edukatif, bukan fatwa/putusan hukum. Konsultasikan ke ahli faraid atau Pengadilan Agama. (FR-12)',
    }
  }
  if (t.includes('ashabah')) {
    return {
      teks: `Ashabah adalah ahli waris yang mengambil sisa harta setelah ashabul furudh (pemilik bagian pasti) menerima bagiannya — atau seluruh harta jika tidak ada ashabul furudh.\n\nContoh: anak laki-laki menjadi ashabah; ayah bisa jadi ashabah bila tidak ada anak laki-laki. Ada yang ingin disimulasikan dari kasus keluargamu?`,
      sumber: 'QS. An-Nisa: 11; kitab-kitab faraid (FR-11)',
      disclaimer: 'Penjelasan edukatif — bukan pengganti ahli faraid. (FR-12)',
    }
  }
  if (t.includes('anak') && (t.includes('istri') || t.includes('ibu'))) {
    return {
      teks: `Terima kasih, data ahli waris tercatat: ${t.includes('istri') ? 'istri ✓' : ''} ${t.includes('ibu') ? 'ibu ✓' : ''} ${t.includes('anak') ? 'anak ✓' : ''}.\n\nAgar simulasi akurat (FR-04), saya masih butuh:\n1. Apakah pewaris (ayah/ibu) masih punya orang tua yang hidup?\n2. Berapa total harta bersih (setelah hutang & wasiat)?\n3. Ada wasiat? (maks. 1/3 harta)`,
    }
  }
  return {
    teks: `Bisa diperjelas sedikit? (FR-05) Ceritakan dengan format santai, contoh:\n\n"Pewaris [ayah/ibu] wafat, meninggalkan [daftar keluarga], harta [nominal], hutang [ada/tidak], wasiat [ada/tidak]".`,
  }
}

function potongJudul(teks) {
  const bersih = teks.replace(/\s+/g, ' ').trim()
  return bersih.length > 38 ? bersih.slice(0, 38) + '…' : bersih
}

function ringkasRiwayat() {
  return daftarPesan.slice(-10).map((p) => ({ peran: p.peran, teks: p.teks }))
}

// Minta jawaban asisten untuk satu pesan pengguna (dipakai kirim & coba ulang).
async function mintaJawaban(isi) {
  galatApi.value = ''
  teksGagal.value = ''
  sedangMengetik.value = true
  gulirBawah()
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pesan: isi, riwayat: ringkasRiwayat() }),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    let teks = data.balas || 'Maaf, saya tidak mendapat jawaban. Coba ulangi.'
    if (data.tanya_lanjutan?.length && !data.selesai) {
      teks += '\n\n' + data.tanya_lanjutan.map((t, i) => `${i + 1}. ${t}`).join('\n')
    }
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      dilapor: false,
      teks,
      hasil: data.hasil ?? null,
      sumber: data.sumber,
      disclaimer: data.disclaimer,
    })
    galatApi.value = ''
  } catch {
    // DESIGN.md §4.2 — state Error: pesan error dengan border merah.
    // Mock Fallback tetap dipakai agar percakapan tidak buntu saat API key belum diset.
    galatApi.value =
      'Koneksi ke server gagal. Balasan di bawah ini dihasilkan mode luring (mock lokal), bukan dari Gemini.'
    teksGagal.value = isi
    const balasan = buatBalasanMock(isi) // offline / API down → mock lokal
    daftarPesan.push({ id: ++idCounter, peran: 'bot', dilapor: false, mock: true, ...balasan })
  } finally {
    sedangMengetik.value = false
    gulirBawah()
    simpanSesiAktif()
  }
}

async function kirimPesan(teksLangsung = '') {
  const isi = (teksLangsung || pesanBaru.value).trim()
  if (!isi || sedangMengetik.value) return

  // Pesan pertama (hanya untuk user yang sudah masuk) = buat sesi baru
  // + catat ke riwayat. Tamu: percakapan tetap jalan, riwayat tidak dicatat.
  if (belumMulai.value && sudahMasuk.value) {
    const idBaru = 's' + Date.now()
    sesiAktifId.value = idBaru
    daftarRiwayat.unshift({
      id: idBaru,
      judul: potongJudul(isi),
      grup: 'Hari ini',
      waktu: Date.now(),
    })
    simpanRiwayat()
  }

  daftarPesan.push({ id: ++idCounter, peran: 'user', teks: isi })
  pesanBaru.value = ''
  autoResize()
  gulirBawah()
  simpanSesiAktif()

  // Coba backend sungguhan dulu (UC-07/08/09 via Gemini), gagal → mock lokal
  await mintaJawaban(isi)
}

// Kirim ulang pesan terakhir yang gagal (buang balasan mock agar tidak dobel).
function cobaUlang() {
  if (!teksGagal.value || sedangMengetik.value) return
  const terakhir = daftarPesan[daftarPesan.length - 1]
  if (terakhir?.peran === 'bot' && terakhir.mock) daftarPesan.pop()
  mintaJawaban(teksGagal.value)
}

function laporkan(id) {
  const b = daftarPesan.find((p) => p.id === id)
  if (b) {
    b.dilapor = !b.dilapor // FR-19 mock: toggle status laporan
    simpanSesiAktif()
  }
}

// ============ INTERAKSI UI ============
function gulirBawah() {
  nextTick(() => {
    if (areaPesan.value) areaPesan.value.scrollTop = areaPesan.value.scrollHeight
  })
}

const inputRef = ref(null)
function autoResize() {
  nextTick(() => {
    const el = inputRef.value
    if (!el) return
    el.style.height = 'auto'
    const maks = 4 * 24 + 24 // ±4 baris
    el.style.height = Math.min(el.scrollHeight, maks) + 'px'
  })
}

function saatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    kirimPesan()
  }
}

// Escape: tutup dialog konfirmasi, lalu drawer sidebar (hanya di layar kecil).
function saatEscape(e) {
  if (e.key !== 'Escape') return
  if (konfirmasiHapus.value) {
    konfirmasiHapus.value = false
    return
  }
  const layarKecil = window.matchMedia('(max-width: 767px)').matches
  if (layarKecil && sidebarTerbuka.value) sidebarTerbuka.value = false
}
onMounted(() => window.addEventListener('keydown', saatEscape))
onUnmounted(() => window.removeEventListener('keydown', saatEscape))

// Di layar kecil sidebar berperan sebagai drawer, jadi wajar ditutup setelah aksi.
// Di desktop dibiarkan terbuka agar daftar riwayat tetap terlihat.
function tutupDrawerKecil() {
  if (window.matchMedia('(max-width: 767px)').matches) sidebarTerbuka.value = false
}

// Menutup sidebar TIDAK menghapus sesi / pesan / kata kunci pencarian.
function sesiBaru() {
  daftarPesan.splice(0)
  sesiAktifId.value = null
  pesanBaru.value = ''
  galatApi.value = ''
  teksGagal.value = ''
  tutupDrawerKecil()
}

function pilihRiwayat(r) {
  sesiAktifId.value = r.id
  tutupDrawerKecil()
  daftarPesan.splice(0)
  const tersimpan = bacaSesi(r.id)
  if (tersimpan.length) {
    tersimpan.forEach((p) => daftarPesan.push(p))
  } else {
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      teks: `Membuka riwayat "${r.judul}". Isi percakapan sesi ini tersimpan lokal di browser ini.`,
    })
  }
  gulirBawah()
}

// Tombol "Hapus riwayat" → minta konfirmasi dulu (Batal / Hapus semua).
function hapusSemua() {
  try {
    daftarRiwayat.forEach((r) => localStorage.removeItem(kunciSesi(r.id)))
  } catch { /* abaikan */ }
  daftarRiwayat.splice(0)
  simpanRiwayat()
  kataKunci.value = ''
  konfirmasiHapus.value = false
  sesiBaru()
}
</script>

<template>
  <div
    class="h-[calc(100vh-6.5rem)] md:h-[calc(100vh-6rem)] flex gap-4 px-4 sm:px-6 pb-4 max-w-7xl mx-auto w-full"
  >
    <ChatSidebar
      :riwayat="riwayatTampil"
      :total="daftarRiwayat.length"
      :sesi-aktif-id="sesiAktifId"
      :terbuka="sidebarTerbuka"
      :kata-kunci="kataKunci"
      @baru="sesiBaru"
      @pilih="pilihRiwayat"
      @hapus="konfirmasiHapus = true"
      @tutup="sidebarTerbuka = false"
      @cari="kataKunci = $event"
    />

    <!-- Area chat utama (DESIGN.md §4.2: background cream) -->
    <section
      class="flex-1 min-w-0 flex flex-col bg-cream border border-waris-900/10 rounded-2xl shadow-soft overflow-hidden"
    >
      <!-- Header chat -->
      <div class="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-waris-900/10">
        <button
          v-if="!sidebarTerbuka"
          type="button"
          title="Buka sidebar"
          aria-label="Buka sidebar"
          aria-controls="sidebar-riwayat"
          aria-expanded="false"
          class="w-11 h-11 shrink-0 grid place-items-center rounded-full text-waris-900 border border-waris-900/20 hover:bg-waris-900/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/40 transition-all duration-200"
          @click="sidebarTerbuka = true"
        >
          <PanelIcon arah="kanan" />
        </button>
        <span class="w-10 h-10 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center">
          <i class="fa-solid fa-scale-balanced"></i>
        </span>
        <div class="min-w-0">
          <p class="font-display font-bold leading-tight truncate">Konsultasi Waris</p>
          <p
            v-if="sedangMengetik"
            class="text-xs font-bold flex items-center gap-2 text-waris-700"
            role="status"
          >
            <span class="w-2 h-2 rounded-full bg-waris-600 animate-pulse"></span>
            WarisMu sedang menyiapkan jawaban…
          </p>
        </div>
        <button
          type="button"
          class="ml-auto h-10 px-4 rounded-full border border-waris-800 text-waris-800 text-xs font-extrabold hover:bg-waris-900/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/30 transition-all duration-200"
          @click="sesiBaru"
        >
          <i class="fa-solid fa-plus mr-2"></i><span class="hidden sm:inline">Sesi Baru</span>
        </button>
      </div>

      <!-- State ERROR (DESIGN.md §4.2): border merah + opsi coba lagi -->
      <div
        v-if="galatApi"
        class="mx-4 sm:mx-6 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-danger bg-danger-soft px-4 py-3 text-xs font-bold text-danger"
        role="alert"
      >
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <span class="flex-1 min-w-[12rem]">{{ galatApi }}</span>
        <button
          v-if="teksGagal"
          type="button"
          class="h-9 px-4 rounded-full bg-danger text-white font-extrabold hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 transition-all duration-200"
          @click="cobaUlang"
        >
          <i class="fa-solid fa-rotate-right mr-2"></i>Coba lagi
        </button>
      </div>

      <!-- TAMPILAN AWAL KOSONG: sapaan + input di tengah -->
      <div
        v-if="belumMulai && !sedangMengetik"
        class="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center px-6 py-8"
      >
        <span
          class="w-16 h-16 rounded-full bg-waris-900 text-white grid place-items-center text-2xl shadow-soft mb-4"
        >
          <i class="fa-solid fa-scale-balanced"></i>
        </span>
        <h2 class="font-display font-bold text-xl sm:text-2xl leading-snug max-w-xl">
          Assalamualaikum, semoga kondisimu baik-baik saja. Ada yang bisa WarisMu bantu?
        </h2>
        <p class="text-sm text-ink/50 mt-3 max-w-md">
          Ceritakan kondisi keluargamu dengan bahasa sehari-hari — WarisMu akan membantu
          melengkapinya.
        </p>

        <!-- Tamu: beri tahu sejak awal bahwa riwayat tidak disimpan -->
        <p
          v-if="!sudahMasuk"
          class="mt-4 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-waris-100 border border-waris-800/20 px-4 py-2 text-xs font-bold text-waris-800"
        >
          <i class="fa-solid fa-user-clock" aria-hidden="true"></i>
          <span>Mode tamu — riwayat tidak disimpan.</span>
          <RouterLink to="/daftar" class="underline hover:text-waris-900">Daftar akun</RouterLink>
        </p>

        <div class="w-full max-w-2xl mt-6">
          <div
            class="flex items-end gap-2 bg-white/70 border border-waris-900/20 rounded-2xl p-2 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-waris-900/30 transition-all"
          >
            <textarea
              ref="inputRef"
              v-model="pesanBaru"
              rows="1"
              placeholder="Ceritakan Warisan"
              aria-label="Ceritakan kondisi keluarga untuk simulasi waris"
              class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-3 max-h-32 placeholder:text-ink/35"
              @input="autoResize"
              @keydown="saatKeydown"
            ></textarea>
            <button
              type="button"
              aria-label="Kirim pesan"
              :disabled="!pesanBaru.trim()"
              class="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/40"
              :class="
                pesanBaru.trim()
                  ? 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft'
                  : 'bg-waris-900/25 cursor-not-allowed'
              "
              @click="kirimPesan()"
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
          <p class="text-xs text-ink/45 mt-3">
            Enter untuk kirim • Shift+Enter untuk baris baru. Hasil simulasi bersifat edukatif —
            tetap konsultasikan ke ahli faraid.
          </p>
        </div>
      </div>

      <!-- TAMPILAN CHAT AKTIF -->
      <template v-else>
        <!-- Daftar pesan + typing indicator -->
        <div ref="areaPesan" class="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
          <ChatBubble v-for="b in daftarPesan" :key="b.id" :bubble="b" @laporkan="laporkan" />
          <div v-if="sedangMengetik" class="flex justify-start gap-3" role="status">
            <span class="w-9 h-9 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center text-sm">
              <i class="fa-solid fa-scale-balanced"></i>
            </span>
            <div class="bg-waris-50 text-ink rounded-xl rounded-tl-none px-5 py-4 flex gap-2 items-center shadow-soft">
              <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 300ms"></span>
              <span class="sr-only">WarisMu sedang menyiapkan jawaban</span>
            </div>
          </div>
        </div>

        <!-- Input bawah -->
        <div class="px-4 sm:px-6 pb-2 pt-1">
          <div
            class="flex items-end gap-2 bg-white/70 border border-waris-900/20 rounded-2xl p-2 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-waris-900/30 transition-all"
          >
            <textarea
              ref="inputRef"
              v-model="pesanBaru"
              rows="1"
              placeholder="Ceritakan Warisan"
              aria-label="Tulis pesan untuk WarisMu"
              class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-3 max-h-32 placeholder:text-ink/35"
              @input="autoResize"
              @keydown="saatKeydown"
            ></textarea>
            <button
              type="button"
              aria-label="Kirim pesan"
              :disabled="!pesanBaru.trim()"
              class="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/40"
              :class="
                pesanBaru.trim()
                  ? 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft'
                  : 'bg-waris-900/25 cursor-not-allowed'
              "
              @click="kirimPesan()"
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </template>
    </section>

    <!-- Dialog konfirmasi hapus riwayat -->
    <transition name="modal">
      <div
        v-if="konfirmasiHapus"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-waris-950/60 backdrop-blur-sm"
        @click.self="konfirmasiHapus = false"
      >
        <div
          class="modal-card bg-cream rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-float border border-waris-900/10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-hapus-riwayat"
        >
          <span class="w-14 h-14 rounded-full bg-danger-soft text-danger grid place-items-center text-2xl">
            <i class="fa-solid fa-trash-can"></i>
          </span>
          <h3 id="judul-hapus-riwayat" class="font-display font-bold text-2xl mt-4 text-ink">
            Hapus semua riwayat?
          </h3>
          <p class="text-sm text-ink/60 leading-relaxed mt-2">
            {{ daftarRiwayat.length }} sesi percakapan beserta isinya akan dihapus dari browser ini.
            Tindakan ini tidak bisa dibatalkan.
          </p>
          <div class="flex flex-wrap gap-3 mt-6">
            <button
              type="button"
              class="h-12 flex-1 min-w-[8rem] rounded-full border border-waris-800 text-waris-800 text-sm font-extrabold hover:bg-waris-900/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/30 transition-all duration-200"
              @click="konfirmasiHapus = false"
            >
              Batal
            </button>
            <button
              type="button"
              class="h-12 flex-1 min-w-[8rem] rounded-full bg-danger text-white text-sm font-extrabold hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 transition-all duration-200"
              @click="hapusSemua"
            >
              <i class="fa-solid fa-trash-can mr-2"></i>Hapus semua
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
