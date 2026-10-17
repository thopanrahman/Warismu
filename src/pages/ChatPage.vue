<script setup>
import { computed, nextTick, ref, reactive } from 'vue'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'

// ============ STATE ============
// Mulai kosongan ala DeepSeek/ChatGPT: tidak ada sapaan bot, tidak ada mock.
// Refresh = kembali ke tampilan awal (permintaan Desweb).
const pesanBaru = ref('')
const sedangMengetik = ref(false)
const galatApi = ref('')
const sidebarTerbuka = ref(false)
const areaPesan = ref(null)
let idCounter = Date.now()

const KUNCI_RIWAYAT = 'warismu_riwayat_v1'
const kunciSesi = (id) => `warismu_sesi_${id}`

function muatRiwayat() {
  try {
    const mentah = localStorage.getItem(KUNCI_RIWAYAT)
    const arr = mentah ? JSON.parse(mentah) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
function simpanRiwayat() {
  try {
    localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarRiwayat))
  } catch { /* abaikan: mode privat / storage penuh */ }
}
function simpanSesiAktif() {
  if (!sesiAktifId.value) return
  try {
    localStorage.setItem(kunciSesi(sesiAktifId.value), JSON.stringify(daftarPesan))
  } catch { /* abaikan */ }
}

// Riwayat sidebar: mulai kosong, disimpan di local saja (Desweb, belum backend).
const daftarRiwayat = reactive(muatRiwayat())
const sesiAktifId = ref(null)

// Percakapan aktif: selalu mulai kosong. Sengaja TIDAK dipulihkan saat refresh.
const daftarPesan = reactive([])

const belumMulai = computed(() => daftarPesan.length === 0)

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

async function kirimPesan(teksLangsung = '') {
  const isi = (teksLangsung || pesanBaru.value).trim()
  if (!isi || sedangMengetik.value) return

  // Pesan pertama = buat sesi baru + catat ke riwayat (local saja)
  if (belumMulai.value) {
    const idBaru = 's' + Date.now()
    sesiAktifId.value = idBaru
    daftarRiwayat.unshift({ id: idBaru, judul: potongJudul(isi), grup: 'Hari ini' })
    simpanRiwayat()
  }

  daftarPesan.push({ id: ++idCounter, peran: 'user', teks: isi })
  pesanBaru.value = ''
  autoResize()
  gulirBawah()
  simpanSesiAktif()

  // Coba backend sungguhan dulu (UC-07/08/09 via Gemini), gagal → mock lokal
  galatApi.value = ''
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
    const balasan = buatBalasanMock(isi) // offline / API down → mock lokal
    daftarPesan.push({ id: ++idCounter, peran: 'bot', dilapor: false, ...balasan })
  } finally {
    sedangMengetik.value = false
    gulirBawah()
    simpanSesiAktif()
  }
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

function sesiBaru() {
  daftarPesan.splice(0)
  sesiAktifId.value = null
  pesanBaru.value = ''
  galatApi.value = ''
  sidebarTerbuka.value = false
}

function pilihRiwayat(r) {
  sesiAktifId.value = r.id
  sidebarTerbuka.value = false
  daftarPesan.splice(0)
  try {
    const mentah = localStorage.getItem(kunciSesi(r.id))
    const arr = mentah ? JSON.parse(mentah) : []
    if (Array.isArray(arr) && arr.length) {
      arr.forEach((p) => daftarPesan.push(p))
    } else {
      daftarPesan.push({
        id: ++idCounter,
        peran: 'bot',
        teks: `Membuka riwayat "${r.judul}". Isi percakapan sesi ini tersimpan lokal di browser ini.`,
      })
    }
  } catch {
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      teks: `Membuka riwayat "${r.judul}".`,
    })
  }
  gulirBawah()
}

function hapusRiwayat() {
  try {
    daftarRiwayat.forEach((r) => localStorage.removeItem(kunciSesi(r.id)))
  } catch { /* abaikan */ }
  daftarRiwayat.splice(0)
  simpanRiwayat()
  sesiBaru()
}
</script>

<template>
  <div class="h-[calc(100vh-6.5rem)] md:h-[calc(100vh-6rem)] flex gap-4 px-4 sm:px-6 pb-4 max-w-7xl mx-auto w-full">
    <ChatSidebar
      :riwayat="daftarRiwayat"
      :sesi-aktif-id="sesiAktifId"
      :terbuka="sidebarTerbuka"
      @baru="sesiBaru"
      @pilih="pilihRiwayat"
      @hapus="hapusRiwayat"
      @tutup="sidebarTerbuka = false"
    />

    <!-- Area chat utama (DESIGN.md §4.2: background cream) -->
    <section class="flex-1 min-w-0 flex flex-col bg-cream border border-waris-900/10 rounded-xl shadow-soft overflow-hidden">
      <!-- Header chat -->
      <div class="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-waris-900/10">
        <button
          aria-label="Buka/tutup riwayat"
          class="md:hidden w-11 h-11 grid place-items-center rounded-full border border-waris-900/20 text-waris-900 hover:bg-waris-900/10 active:scale-95 transition-all"
          @click="sidebarTerbuka = !sidebarTerbuka"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
        <span class="w-10 h-10 rounded-full bg-waris-900 text-white grid place-items-center">
          <i class="fa-solid fa-scale-balanced"></i>
        </span>
        <div class="min-w-0">
          <p class="font-bold leading-tight truncate">Konsultasi Waris</p>
          <p v-if="sedangMengetik" class="text-xs font-bold flex items-center gap-2 text-waris-700">
            <span class="w-2 h-2 rounded-full bg-waris-600 animate-pulse"></span>
            WarisMu sedang mengetik…
          </p>
        </div>
        <button
          class="ml-auto h-10 px-4 rounded-lg border border-waris-800 text-waris-800 text-xs font-extrabold hover:bg-waris-900/5 active:scale-95 transition-all"
          @click="sesiBaru"
        >
          <i class="fa-solid fa-plus mr-2"></i><span class="hidden sm:inline">Sesi Baru</span>
        </button>
      </div>

      <!-- State ERROR (DESIGN.md §4.2): border merah saat API Gemini gagal -->
      <div
        v-if="galatApi"
        class="mx-4 sm:mx-6 mt-4 flex items-start gap-3 rounded-lg border border-danger bg-danger-soft px-4 py-3 text-xs font-bold text-danger"
      >
        <i class="fa-solid fa-triangle-exclamation mt-1"></i>
        <span>{{ galatApi }}</span>
      </div>

      <!-- TAMPILAN AWAL KOSONG: input di tengah -->
      <div v-if="belumMulai && !sedangMengetik" class="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center px-6 py-8">
        <span class="w-16 h-16 rounded-full bg-waris-900 text-white grid place-items-center text-2xl shadow-soft mb-4">
          <i class="fa-solid fa-scale-balanced"></i>
        </span>
        <h2 class="font-bold text-xl sm:text-2xl leading-tight">Assalamualaikum, semoga kondisimu baik-baik saja. Ada yang bisa WarisMu bantu?</h2>

        <div class="w-full max-w-2xl mt-6">
          <div class="flex items-end gap-2 bg-white/70 border border-waris-900/20 rounded-lg p-2 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-waris-900/30 transition-all text-left">
            <textarea
              ref="inputRef"
              v-model="pesanBaru"
              rows="1"
              placeholder="Ceritakan ke WarisMu"
              class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-3 max-h-32 placeholder:text-ink/35"
              @input="autoResize"
              @keydown="saatKeydown"
            ></textarea>
            <button
              aria-label="Kirim pesan"
              :disabled="!pesanBaru.trim()"
              class="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white transition-all duration-300"
              :class="pesanBaru.trim() ? 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft' : 'bg-waris-900/25 cursor-not-allowed'"
              @click="kirimPesan()"
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>

      </div>

      <!-- TAMPILAN CHAT AKTIF -->
      <template v-else>
        <!-- Daftar pesan + typing indicator -->
        <div ref="areaPesan" class="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
          <ChatBubble v-for="b in daftarPesan" :key="b.id" :bubble="b" @laporkan="laporkan" />
          <div v-if="sedangMengetik" class="flex justify-start gap-3">
            <span class="w-9 h-9 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center text-sm">
              <i class="fa-solid fa-scale-balanced"></i>
            </span>
            <div class="bg-waris-50 text-ink rounded-xl rounded-tl-none px-5 py-4 flex gap-2 items-center shadow-soft">
              <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>

        <!-- Input bawah -->
        <div class="px-4 sm:px-6 pb-2 pt-1">
          <div class="flex items-end gap-2 bg-white/70 border border-waris-900/20 rounded-lg p-2 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-waris-900/30 transition-all">
            <textarea
              ref="inputRef"
              v-model="pesanBaru"
              rows="1"
              placeholder="Ceritakan ke WarisMu"
              class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-3 max-h-32 placeholder:text-ink/35"
              @input="autoResize"
              @keydown="saatKeydown"
            ></textarea>
            <button
              aria-label="Kirim pesan"
              :disabled="!pesanBaru.trim()"
              class="w-12 h-12 shrink-0 rounded-full grid place-items-center text-white transition-all duration-300"
              :class="pesanBaru.trim() ? 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft' : 'bg-waris-900/25 cursor-not-allowed'"
              @click="kirimPesan()"
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
