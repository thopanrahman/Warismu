<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'

// ============ STATE ============
const pesanBaru = ref('')
const sedangMengetik = ref(false)
const sidebarTerbuka = ref(false)
const areaPesan = ref(null)
let idCounter = 100

// Sapaan pembuka + disclaimer (FR-01, FR-20: guest bisa konsultasi)
const daftarPesan = reactive([
  {
    id: 1,
    peran: 'bot',
    teks: `Assalamu'alaikum 👋 Saya WarisMu, asisten simulasi waris Islam. Ceritakan saja kondisi keluarga dan harta pewaris dengan bahasa sehari-hari.\n\nContoh: "Ayah saya wafat, meninggalkan ibu, istri, 1 anak laki-laki dan 2 anak perempuan, harta Rp500 juta".`,
    disclaimer: 'WarisMu adalah simulasi edukatif — bukan pengganti ahli faraid. (FR-12)',
  },
])

// Riwayat sidebar mock 5 item (FR-29)
const daftarRiwayat = reactive([
  { id: 'r1', judul: 'Ayah wafat, harta 500jt', grup: 'Hari ini' },
  { id: 'r2', judul: 'Bagian istri & 2 anak', grup: 'Hari ini' },
  { id: 'r3', judul: 'Harta bersama vs waris', grup: 'Kemarin' },
  { id: 'r4', judul: 'Cucu terhijab atau tidak?', grup: 'Kemarin' },
  { id: 'r5', judul: 'Wasiat maksimal 1/3', grup: 'Minggu lalu' },
])
const sesiAktifId = ref('r1')

// Suggestion chips — muncul saat chat masih kosong (hanya sapaan)
const tampilSaran = computed(() => daftarPesan.length <= 1)
const daftarSaran = [
  'Ayah wafat, tinggal ibu, istri, 1 anak lk & 2 anak pr, harta Rp500jt',
  'Apa itu ashabah dalam faraid?',
  'Berapa bagian istri jika ada anak?',
  'Hutang pewaris belum lunas, bagaimana?',
]

// ============ MESIN MOCK (nanti diganti LLM: FR-03 s/d FR-07) ============
function rupiah(n) {
  return 'Rp' + n.toLocaleString('id-ID')
}

function buatBalasanMock(teksUser) {
  const t = teksUser.toLowerCase()

  // Simulasi hasil perhitungan lengkap (FR-07 s/d FR-14)
  if (t.includes('500') || t.includes('rp') || /\d/.test(t)) {
    const total = 500_000_000
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
    teks: `Bisa diperjelas sedikit? (FR-05) Ceritakan dengan format santai, contoh:\n\n"Pewaris [ayah/ibu] wafat, meninggalkan [daftar keluarga], harta [nominal], hutang [ada/tidak], wasiat [ada/tidak]".\n\nAtau klik salah satu saran di bawah 👇`,
  }
}

function kirimPesan(teksLangsung = '') {
  const isi = (teksLangsung || pesanBaru.value).trim()
  if (!isi || sedangMengetik.value) return
  daftarPesan.push({ id: ++idCounter, peran: 'user', teks: isi })
  pesanBaru.value = ''
  autoResize()
  gulirBawah()

  // Typing indicator + balasan mock 900ms
  sedangMengetik.value = true
  gulirBawah()
  setTimeout(() => {
    const balasan = buatBalasanMock(isi)
    daftarPesan.push({ id: ++idCounter, peran: 'bot', dilapor: false, ...balasan })
    sedangMengetik.value = false
    gulirBawah()
  }, 900)
}

function laporkan(id) {
  const b = daftarPesan.find((p) => p.id === id)
  if (b) b.dilapor = !b.dilapor // FR-19 mock: toggle status laporan
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
  daftarPesan.splice(1) // sisakan sapaan
  sidebarTerbuka.value = false
}

function pilihRiwayat(r) {
  sesiAktifId.value = r.id
  sidebarTerbuka.value = false
  daftarPesan.push({
    id: ++idCounter,
    peran: 'bot',
    teks: `Membuka riwayat "${r.judul}" (mock FR-30). Di versi production, seluruh percakapan sesi ini dimuat dari server.`,
  })
  gulirBawah()
}

function hapusRiwayat() {
  daftarRiwayat.splice(0) // mock FR-32
  sesiAktifId.value = null
}

onMounted(() => gulirBawah())
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

    <!-- Area chat utama -->
    <section class="flex-1 min-w-0 flex flex-col bg-cream border border-waris-900/10 rounded-[2rem] shadow-soft overflow-hidden">
      <!-- Header chat -->
      <div class="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-waris-900/10">
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
          <p class="font-display font-bold leading-tight truncate">Konsultasi Waris</p>
          <p class="text-[11px] font-bold flex items-center gap-1.5" :class="sedangMengetik ? 'text-waris-700' : 'text-waris-900'">
            <span class="w-2 h-2 rounded-full" :class="sedangMengetik ? 'bg-waris-600 animate-pulse' : 'bg-waris-900'"></span>
            {{ sedangMengetik ? 'WarisMu sedang mengetik…' : 'Online • Mode Tamu' }}
          </p>
        </div>
        <button
          class="ml-auto h-10 px-4 rounded-full border-2 border-waris-800 text-waris-800 text-xs font-extrabold hover:bg-waris-900/5 active:scale-95 transition-all"
          @click="sesiBaru"
        >
          <i class="fa-solid fa-plus mr-1"></i><span class="hidden sm:inline">Sesi Baru</span>
        </button>
      </div>

      <!-- Daftar pesan + typing indicator -->
      <div ref="areaPesan" class="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
        <ChatBubble v-for="b in daftarPesan" :key="b.id" :bubble="b" @laporkan="laporkan" />
        <div v-if="sedangMengetik" class="flex justify-start gap-2.5">
          <span class="w-9 h-9 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center text-sm">
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <div class="bg-cream border border-waris-900/10 rounded-[1.5rem] rounded-bl-lg px-5 py-4 flex gap-1.5 items-center shadow-soft">
            <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 rounded-full bg-waris-800 animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>

      <!-- Suggestion chips (saat chat kosong) -->
      <div v-if="tampilSaran" class="px-4 sm:px-6 pb-2 flex gap-2 overflow-x-auto">
        <button
          v-for="s in daftarSaran"
          :key="s"
          class="shrink-0 max-w-[16rem] truncate h-10 px-4 rounded-full bg-waris-900/10 border border-waris-900/15 text-waris-900 text-xs font-extrabold hover:bg-waris-900 hover:text-white active:scale-95 transition-all duration-300"
          @click="kirimPesan(s)"
        >
          {{ s }}
        </button>
      </div>

      <!-- Input bawah -->
      <div class="px-4 sm:px-6 pb-2 pt-1">
        <div class="flex items-end gap-2 bg-white/70 border border-waris-900/20 rounded-[1.75rem] p-2 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-waris-900/30 transition-all">
          <textarea
            ref="inputRef"
            v-model="pesanBaru"
            rows="1"
            placeholder="Ceritakan kondisi keluarga & harta… (Enter kirim, Shift+Enter baris baru)"
            class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-2.5 max-h-32 placeholder:text-ink/35"
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
        <p class="text-center text-[11px] text-ink/45 font-semibold py-2.5">
          WarisMu adalah simulasi edukatif — bukan pengganti ahli faraid.
        </p>
      </div>
    </section>
  </div>
</template>
