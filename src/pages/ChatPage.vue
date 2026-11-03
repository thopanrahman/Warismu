<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import PanelIcon from '../components/PanelIcon.vue'
import BrandLogo from '../components/BrandLogo.vue'
import { ambilPengguna, keluarAkun, panggilApi } from '../lib/akun.js'

// ============ STATE ============
// Mulai kosongan ala DeepSeek/ChatGPT: tidak ada sapaan bot, tidak ada mock.
// Refresh = kembali ke tampilan awal (permintaan Desweb).
const pesanBaru = ref('')
const sedangMengetik = ref(false)
const galatApi = ref('')
const teksGagal = ref('')
const konfirmasiHapus = ref(false)
// Sidebar awalnya TERTUTUP di semua ukuran layar. Halaman chat dibuka dengan
// kolom percakapan bersih; user sendiri yang memilih membuka sidebar riwayat.
const sidebarTerbuka = ref(false)
const kataKunci = ref('')
const areaPesan = ref(null)
let idCounter = Date.now()

// ===== Status akun =====
// Token & profil disimpan src/lib/akun.js saat Daftar/Masuk. Tamu tetap boleh
// berkonsultasi, tapi percakapannya TIDAK disimpan ke server: tidak masuk daftar
// riwayat, dan hilang saat halaman dimuat ulang.
const pengguna = ref(ambilPengguna())
const sudahMasuk = computed(() => !!pengguna.value)

// ===== Riwayat konsultasi (Supabase, bukan localStorage) =====
// Daftar sesi + isi percakapannya diambil dari GET /api/riwayat. Isi pesan
// disimpan di memori agar pencarian di sidebar dan buka-sesi terasa instan.
const daftarRiwayat = reactive([])
const sesiAktifId = ref(null)
const judulSesiAktif = ref('')
const sesiTersimpan = reactive({})
const memuatRiwayat = ref(false)
const galatRiwayat = ref('')

// Field yang ikut dikirim ke server — jangan kirim id internal atau properti
// tampilan (itu bukan data konsultasi).
function ringkasPesan(p) {
  return {
    peran: p.peran,
    teks: p.teks,
    hasil: p.hasil ?? null,
    sumber: p.sumber ?? null,
    disclaimer: p.disclaimer ?? null,
    dilapor: p.dilapor === true,
    mock: p.mock === true,
  }
}

// Token kedaluwarsa / tidak sah → kembali ke mode tamu, bukan layar error.
function sesiHabis() {
  keluarAkun()
  pengguna.value = null
  daftarRiwayat.splice(0)
  Object.keys(sesiTersimpan).forEach((k) => delete sesiTersimpan[k])
  sesiAktifId.value = null
}

async function muatRiwayatServer() {
  if (!sudahMasuk.value) return
  memuatRiwayat.value = true
  galatRiwayat.value = ''
  try {
    const { ok, status, data } = await panggilApi('/api/riwayat')
    if (status === 401) return sesiHabis()
    if (!ok) throw new Error('HTTP ' + status)
    daftarRiwayat.splice(0)
    Object.keys(sesiTersimpan).forEach((k) => delete sesiTersimpan[k])
    for (const s of data.daftar ?? []) {
      sesiTersimpan[s.id] = Array.isArray(s.pesan) ? s.pesan : []
      daftarRiwayat.push({ id: s.id, judul: s.judul, waktu: s.waktu, jumlah: s.jumlah ?? 0 })
    }
  } catch {
    galatRiwayat.value = 'Riwayat tidak bisa dimuat dari server. Periksa koneksi.'
  } finally {
    memuatRiwayat.value = false
  }
}

// Simpan seluruh percakapan aktif. Dipanggil setiap ada pesan baru, jadi sesi
// pertama otomatis dibuat di server dan ID-nya dipakai untuk pembaruan berikutnya.
// Permintaan disimpan berurutan (antrean) supaya pesan pertama tidak sempat
// membuat dua sesi gara-gara dua penyimpanan berjalan bersamaan.
let antreanSimpan = Promise.resolve()
function simpanSesiAktif() {
  antreanSimpan = antreanSimpan.then(simpanSesiSekarang).catch(() => {})
  return antreanSimpan
}

async function simpanSesiSekarang() {
  if (!sudahMasuk.value || !daftarPesan.length) return
  const judul = judulSesiAktif.value || potongJudul(daftarPesan[0]?.teks || 'Konsultasi')
  try {
    const { ok, status, data } = await panggilApi('/api/riwayat', {
      method: 'POST',
      body: JSON.stringify({
        id: sesiAktifId.value,
        judul,
        pesan: daftarPesan.map(ringkasPesan),
      }),
    })
    if (status === 401) return sesiHabis()
    if (!ok || !data.id) throw new Error('HTTP ' + status)

    if (!sesiAktifId.value) {
      sesiAktifId.value = data.id
      judulSesiAktif.value = judul
      daftarRiwayat.unshift({ id: data.id, judul, waktu: Date.now(), jumlah: daftarPesan.length })
    } else {
      const item = daftarRiwayat.find((r) => r.id === sesiAktifId.value)
      if (item) {
        item.waktu = Date.now()
        item.jumlah = daftarPesan.length
      }
    }
    sesiTersimpan[sesiAktifId.value] = daftarPesan.map(ringkasPesan)
    galatRiwayat.value = ''
  } catch {
    galatRiwayat.value = 'Riwayat belum tersimpan ke server. Periksa koneksi.'
  }
}

// Menutup sesi (UC-13): tandai 'selesai' beserta waktu berakhirnya.
function akhiriSesi() {
  const id = sesiAktifId.value
  if (!sudahMasuk.value || !id) return
  panggilApi('/api/riwayat', {
    method: 'POST',
    body: JSON.stringify({ id, selesai: true }),
  }).catch(() => {})
}

// Percakapan aktif: selalu mulai kosong. Sengaja TIDAK dipulihkan saat refresh.
const daftarPesan = reactive([])

const belumMulai = computed(() => daftarPesan.length === 0)
// Tombol kirim mati saat pesan kosong ATAU saat AI masih membalas (anti-spam klik).
const kirimNonaktif = computed(() => sedangMengetik.value || !pesanBaru.value.trim())

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
      const cocok = (sesiTersimpan[r.id] || []).find((p) =>
        String(p.teks || '').toLowerCase().includes(kunci),
      )
      if (!judulCocok && !cocok) return null
      return { ...r, cuplikan: cocok ? cuplikanSekitar(cocok.teks, kunci) : '' }
    })
    .filter(Boolean)
})

// ============ SERVER TIDAK TERJANGKAU ============
// Tidak ada balasan tiruan. Kalau /api/chat tidak bisa dijangkau, user hanya
// diberi tahu bahwa koneksi terputus — bukan disodori angka waris karangan.
const PESAN_SERVER_PUTUS =
  'Koneksi ke server terputus. Silakan periksa internet Anda dan coba lagi.'

function potongJudul(teks) {
  const bersih = teks.replace(/\s+/g, ' ').trim()
  return bersih.length > 38 ? bersih.slice(0, 38) + '…' : bersih
}

function ringkasRiwayat() {
  return daftarPesan.slice(-10).map((p) => ({ peran: p.peran, teks: p.teks }))
}

// Server sengaja membalas HTTP 200 walau mesin AI atau mesin hitung gagal
// (agar demo tidak menampilkan layar error). Konsekuensinya user harus
// diberi tahu bahwa balasan itu mock, bukan hasil Gemini/Faraidh sungguhan.
function pesanMockServer(alasan) {
  if (alasan === 'mesin-hitung') {
    return (
      'Data keluarga sudah tercatat, tetapi mesin hitung faraid di server sedang tidak aktif, ' +
      'jadi angka pembagian belum bisa ditampilkan. Coba lagi beberapa saat lagi.'
    )
  }
  return (
    'Balasan ini dibuat tanpa AI (mode mock), jadi ceritamu belum benar-benar diproses. ' +
    'Periksa konfigurasi GEMINI_API_KEY di server, lalu tekan Coba lagi.'
  )
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
    const mock = data.dipakaiMock === true
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      dilapor: false,
      teks,
      hasil: data.hasil ?? null,
      sumber: data.sumber,
      disclaimer: data.disclaimer,
      ...(mock ? { mock: true } : {}),
    })
    if (mock) {
      galatApi.value = pesanMockServer(data.alasanMock)
      teksGagal.value = isi
    }
  } catch {
    // DESIGN.md §4.2 — state Error: pesan error dengan border merah.
    // Sengaja TIDAK membuat balasan tiruan: user hanya diberi tahu koneksi
    // terputus, lalu bisa menekan "Coba lagi".
    galatApi.value = PESAN_SERVER_PUTUS
    teksGagal.value = isi
  } finally {
    sedangMengetik.value = false
    gulirBawah()
    simpanSesiAktif()
  }
}

async function kirimPesan(teksLangsung = '') {
  const isi = (teksLangsung || pesanBaru.value).trim()
  // Validasi: tolak pesan kosong / hanya berisi spasi.
  if (!isi) return
  // Anti-spam: jangan kirim pesan baru selama AI masih membalas.
  if (sedangMengetik.value) return

  // Pesan pertama (hanya untuk user yang sudah masuk) = sesi baru di server.
  // ID sesi diisi dari balikan POST /api/riwayat saat pesan pertama disimpan.
  // Tamu: percakapan tetap jalan, riwayat tidak dicatat.
  if (belumMulai.value && sudahMasuk.value) {
    sesiAktifId.value = null
    judulSesiAktif.value = potongJudul(isi)
    galatRiwayat.value = ''
  }

  daftarPesan.push({ id: ++idCounter, peran: 'user', teks: isi })
  pesanBaru.value = ''
  autoResize()
  gulirBawah()
  simpanSesiAktif()

  // Kirim ke backend sungguhan (UC-07/08/09 via Gemini). Bila gagal dijangkau,
  // user diberi pesan koneksi terputus — tanpa balasan tiruan.
  await mintaJawaban(isi)
}

// Kirim ulang pesan terakhir yang gagal (buang balasan mock agar tidak dobel).
function cobaUlang() {
  if (!teksGagal.value || sedangMengetik.value) return
  const terakhir = daftarPesan[daftarPesan.length - 1]
  if (terakhir?.peran === 'bot' && terakhir.mock) daftarPesan.pop()
  mintaJawaban(teksGagal.value)
}

// FR-19 / UC-14: laporan jawaban AI dicatat ke tabel reports, bukan cuma
// penanda di layar. Tamu tidak punya akun di server, jadi laporan hanya
// ditandai di layar (tidak ada yang bisa dihubungkan ke akun).
async function laporkan(id) {
  const b = daftarPesan.find((p) => p.id === id)
  if (!b) return
  const sebelumnya = b.dilapor
  b.dilapor = !sebelumnya
  if (!sudahMasuk.value) return

  const { ok, status } = await panggilApi('/api/laporan', {
    method: 'POST',
    body: JSON.stringify({ alasan: `Jawaban nomor ${daftarPesan.indexOf(b) + 1}: ${b.teks.slice(0, 200)}` }),
  })
  if (status === 401) return sesiHabis()
  if (!ok) {
    b.dilapor = sebelumnya
    galatRiwayat.value = 'Laporan gagal dikirim ke server. Coba lagi.'
    return
  }
  galatRiwayat.value = ''
  simpanSesiAktif()
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

// Enter = kirim. Shift+Enter tetap baris baru karena handler memakai modifier .exact.
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
onMounted(() => {
  window.addEventListener('keydown', saatEscape)
  // Riwayat diambil dari server saat halaman dibuka (UC-04). Percakapan aktif
  // tetap mulai kosong: refresh tidak memulihkan sesi yang sedang berjalan.
  muatRiwayatServer()
})
onUnmounted(() => window.removeEventListener('keydown', saatEscape))

// Di layar kecil sidebar berperan sebagai drawer, jadi wajar ditutup setelah aksi.
// Di desktop dibiarkan terbuka agar daftar riwayat tetap terlihat.
function tutupDrawerKecil() {
  if (window.matchMedia('(max-width: 767px)').matches) sidebarTerbuka.value = false
}

// Menutup sidebar TIDAK menghapus sesi / pesan / kata kunci pencarian.
// Sesi yang ditinggalkan ditandai selesai di server (UC-13).
function sesiBaru(tutupSesi = true) {
  if (tutupSesi) akhiriSesi()
  daftarPesan.splice(0)
  sesiAktifId.value = null
  judulSesiAktif.value = ''
  pesanBaru.value = ''
  galatApi.value = ''
  teksGagal.value = ''
  tutupDrawerKecil()
}

function pilihRiwayat(r) {
  akhiriSesi()
  sesiAktifId.value = r.id
  judulSesiAktif.value = r.judul
  tutupDrawerKecil()
  galatApi.value = ''
  teksGagal.value = ''
  daftarPesan.splice(0)
  const tersimpan = sesiTersimpan[r.id] || []
  if (tersimpan.length) {
    tersimpan.forEach((p) => daftarPesan.push({ ...p, id: ++idCounter }))
  } else {
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      teks: `Sesi "${r.judul}" tersimpan di akunmu, tetapi isi percakapannya belum terekam.`,
    })
  }
  gulirBawah()
}

// Tombol "Hapus riwayat" → konfirmasi dulu (Batal / Hapus semua), lalu
// DELETE /api/riwayat menghapus seluruh sesi akun ini di server (UC-15).
async function hapusSemua() {
  konfirmasiHapus.value = false
  if (!sudahMasuk.value) {
    daftarRiwayat.splice(0)
    sesiBaru(false)
    return
  }
  const { ok, status } = await panggilApi('/api/riwayat', { method: 'DELETE' })
  if (status === 401) return sesiHabis()
  if (!ok) {
    galatRiwayat.value = 'Gagal menghapus riwayat di server. Coba lagi.'
    return
  }
  galatRiwayat.value = ''
  daftarRiwayat.splice(0)
  Object.keys(sesiTersimpan).forEach((k) => delete sesiTersimpan[k])
  kataKunci.value = ''
  sesiBaru(false)
}
</script>

<template>
  <div
    class="h-[calc(100vh-6.5rem)] md:h-[calc(100vh-6rem)] flex px-4 sm:px-6 pb-4 max-w-7xl mx-auto w-full"
    :class="sidebarTerbuka ? 'gap-4' : 'gap-0'"
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
          type="button"
          :title="sidebarTerbuka ? 'Tutup sidebar riwayat' : 'Buka sidebar riwayat'"
          :aria-label="sidebarTerbuka ? 'Tutup sidebar riwayat' : 'Buka sidebar riwayat'"
          aria-controls="sidebar-riwayat"
          :aria-expanded="sidebarTerbuka ? 'true' : 'false'"
          class="w-11 h-11 shrink-0 grid place-items-center rounded-full text-waris-900 border border-waris-900/20 hover:bg-waris-900/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/40 transition-all duration-200"
          @click="sidebarTerbuka = !sidebarTerbuka"
        >
          <PanelIcon :arah="sidebarTerbuka ? 'kiri' : 'kanan'" />
        </button>
        <BrandLogo class="w-10 h-10" />
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
          <p v-else-if="memuatRiwayat" class="text-xs font-semibold text-ink/45" role="status">
            Memuat riwayat…
          </p>
        </div>
        <button
          type="button"
          class="ml-auto h-10 px-4 rounded-full border border-waris-800 text-waris-800 text-xs font-extrabold hover:bg-waris-900/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/30 transition-all duration-200"
          @click="sesiBaru()"
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

      <!-- State riwayat: gagal simpan/muat/hapus di server (tidak fatal) -->
      <div
        v-if="galatRiwayat"
        class="mx-4 sm:mx-6 mt-4 flex items-center gap-3 rounded-xl border border-waris-900/20 bg-waris-100 px-4 py-3 text-xs font-bold text-waris-900"
        role="status"
      >
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        <span>{{ galatRiwayat }}</span>
      </div>

      <!-- TAMPILAN AWAL KOSONG: sapaan + input di tengah -->
      <div
        v-if="belumMulai && !sedangMengetik"
        class="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center px-6 py-8"
      >
        <BrandLogo class="w-16 h-16 mb-4" />
        <h2 class="font-display font-bold text-xl sm:text-2xl leading-snug max-w-xl">
          Assalamualaikum, semoga kondisimu baik-baik saja. Ada yang bisa WarisMu bantu?
        </h2>


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
              @keydown.enter.exact.prevent="kirimPesan()"
            ></textarea>
            <button
              type="button"
              aria-label="Kirim pesan"
              :disabled="kirimNonaktif"
              class="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/40"
              :class="
                kirimNonaktif
                  ? 'bg-waris-900/25 opacity-50 cursor-not-allowed'
                  : 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft'
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
            <BrandLogo class="w-9 h-9" />
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
              @keydown.enter.exact.prevent="kirimPesan()"
            ></textarea>
            <button
              type="button"
              aria-label="Kirim pesan"
              :disabled="kirimNonaktif"
              class="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/40"
              :class="
                kirimNonaktif
                  ? 'bg-waris-900/25 opacity-50 cursor-not-allowed'
                  : 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft'
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
            {{ daftarRiwayat.length }} sesi percakapan beserta isinya akan dihapus dari akunmu.
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
