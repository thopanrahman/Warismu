<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatRupiah } from '../lib/faraidhCalculator.js'

const props = defineProps({
  hasil: {
    type: Object,
    required: true,
  },
  // Mode embedding: 'full' (di halaman kalkulator) atau 'compact' (di dalam chat bubble)
  mode: {
    type: String,
    default: 'full',
  },
})

const router = useRouter()
const statusSalin = ref(false)

const ringkasan = computed(() => props.hasil.ringkasanHarta || {})
const daftar = computed(() => props.hasil.daftarPenerima || [])
const totalHartaBersih = computed(() => ringkasan.value.hartaBersih || 0)

// Format teks salinan komprehensif untuk clipboard
function salinRingkasan() {
  if (!daftar.value.length) return

  let teks = `HASIL SIMULASI WARIS ISLAM (FARAID) — WARISMU\n`
  teks += `=========================================\n`
  if (ringkasan.value.hartaKotor) {
    teks += `Total Harta Kotor : ${formatRupiah(ringkasan.value.hartaKotor)}\n`
    if (ringkasan.value.hutang) teks += `Hutang Pewaris    : - ${formatRupiah(ringkasan.value.hutang)}\n`
    if (ringkasan.value.biayaPengurusan) teks += `Biaya Jenazah     : - ${formatRupiah(ringkasan.value.biayaPengurusan)}\n`
    if (ringkasan.value.wasiatDijalankan) teks += `Wasiat (Maks 1/3) : - ${formatRupiah(ringkasan.value.wasiatDijalankan)}\n`
    teks += `-----------------------------------------\n`
  }
  teks += `HARTA BERSIH (TIRKAH): ${formatRupiah(totalHartaBersih.value)}\n\n`
  teks += `RINCIAN PEMBAGIAN AHLI WARIS:\n`

  daftar.value.forEach((p, idx) => {
    teks += `${idx + 1}. ${p.label} (${p.jumlahOrang} orang)\n`
    teks += `   - Bagian Hukum : ${p.bagianHukum} (${p.porsiPersen}%)\n`
    teks += `   - Total Dana   : ${formatRupiah(p.danaTotal)}\n`
    if (p.jumlahOrang > 1) {
      teks += `   - Per Orang    : ${formatRupiah(p.danaPerOrang)}\n`
    }
    teks += `   - Dalil        : ${p.dalil}\n\n`
  })

  teks += `Rujukan: QS. An-Nisa ayat 11, 12, 176 dan Kompilasi Hukum Islam (KHI).\n`
  teks += `Dihasilkan melalui WarisMu (https://warismu.vercel.app)`

  navigator.clipboard.writeText(teks).then(() => {
    statusSalin.value = true
    setTimeout(() => {
      statusSalin.value = false
    }, 2500)
  })
}

// Bawa kasus ini ke halaman Chat AI untuk konsultasi mendalam
function konsultasikanKeChat() {
  let promptAwal = `Saya ingin berkonsultasi mengenai hasil perhitungan waris berikut:\n`
  promptAwal += `Total Harta Bersih: ${formatRupiah(totalHartaBersih.value)}.\n`
  promptAwal += `Ahli waris yang ada: `
  promptAwal += daftar.value.map((p) => `${p.label} (${p.jumlahOrang} orang: ${p.bagianHukum})`).join(', ')
  promptAwal += `. Bisakah dijelaskan lebih mendalam rukun dan hikmah pembagian ini?`

  // Simpan ke sessionStorage agar dibaca otomatis oleh ChatPage
  try {
    sessionStorage.setItem('konsultasi_prefill', promptAwal)
  } catch (e) {
    console.error(e)
  }
  router.push('/chat')
}

function cetakLaporan() {
  window.print()
}
</script>

<template>
  <div
    class="bg-white border border-forest-900/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-card"
    :class="mode === 'full' ? 'p-6 sm:p-8' : 'p-4 sm:p-5'"
  >
    <!-- Header Hasil -->
    <div class="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-forest-900/10">
      <div>
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-800 border border-forest-900/10"
          >
            <i class="fa-solid fa-scale-balanced text-xs text-forest-600"></i>
            Ketetapan Faraid & KHI
          </span>
          <span class="text-xs text-ink-500 font-medium">Berdasarkan Al-Qur'an</span>
        </div>
        <h3
          class="font-display font-bold text-ink mt-2 leading-tight"
          :class="mode === 'full' ? 'text-2xl sm:text-3xl' : 'text-xl'"
        >
          Rincian Pembagian Waris
        </h3>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 shrink-0 no-print">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
          :class="
            statusSalin
              ? 'bg-forest-100 text-forest-900 border-forest-300'
              : 'bg-white text-ink-700 hover:text-forest-900 hover:bg-forest-50 border-forest-900/15'
          "
          :title="statusSalin ? 'Tersalin ke clipboard' : 'Salin ringkasan ke clipboard'"
          @click="salinRingkasan"
        >
          <i :class="statusSalin ? 'fa-solid fa-check text-forest-700' : 'fa-regular fa-copy'"></i>
          <span>{{ statusSalin ? 'Tersalin' : 'Salin' }}</span>
        </button>

        <button
          v-if="mode === 'full'"
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-forest-900/15 bg-white text-ink-700 hover:text-forest-900 hover:bg-forest-50 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
          title="Cetak laporan pembagian"
          @click="cetakLaporan"
        >
          <i class="fa-solid fa-print"></i>
          <span>Cetak</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-forest-900 text-white hover:bg-forest-800 transition-all duration-200 shadow-subtle active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/40"
          title="Konsultasikan hasil ini ke AI Chat"
          @click="konsultasikanKeChat"
        >
          <i class="fa-solid fa-comments"></i>
          <span>Tanya AI</span>
        </button>
      </div>
    </div>

    <!-- Ringkasan Tirkah & Pengurang (Jika ada data kotor) -->
    <div
      v-if="ringkasan.hartaKotor && ringkasan.totalPengurang > 0"
      class="mt-6 p-4 rounded-xl bg-forest-50/70 border border-forest-900/10 text-xs text-ink-700"
    >
      <div class="flex items-center justify-between font-bold text-ink-900 mb-2">
        <span class="inline-flex items-center gap-1.5">
          <i class="fa-solid fa-calculator text-forest-700"></i>
          Penyelesaian Kewajiban Sebelum Waris
        </span>
        <span>Harta Bersih: {{ formatRupiah(totalHartaBersih) }}</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-ink-600 pt-1 border-t border-forest-900/10">
        <div>Harta Kotor: <strong class="text-ink-800">{{ formatRupiah(ringkasan.hartaKotor) }}</strong></div>
        <div v-if="ringkasan.hutang">Hutang: <strong class="text-danger-DEFAULT">-{{ formatRupiah(ringkasan.hutang) }}</strong></div>
        <div v-if="ringkasan.biayaPengurusan">Pemakaman: <strong class="text-danger-DEFAULT">-{{ formatRupiah(ringkasan.biayaPengurusan) }}</strong></div>
        <div v-if="ringkasan.wasiatDijalankan">
          Wasiat (Maks 1/3): <strong class="text-forest-700">-{{ formatRupiah(ringkasan.wasiatDijalankan) }}</strong>
          <span v-if="ringkasan.wasiatDipotong" class="block text-[10px] text-dalil-600 font-semibold">*dibatasi 1/3 syariat</span>
        </div>
      </div>
    </div>

    <!-- Highlight Total Harta Bersih -->
    <div class="mt-6 flex flex-wrap items-baseline justify-between gap-4 p-5 rounded-xl bg-forest-950 text-white">
      <div>
        <p class="text-xs uppercase tracking-wider text-forest-200 font-semibold">
          Harta Bersih yang Dibagikan (Tirkah)
        </p>
        <p class="font-display text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight text-white">
          {{ formatRupiah(totalHartaBersih) }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-xs text-forest-200 font-medium">Ahli Waris yang Berhak</p>
        <p class="font-bold text-lg text-white">
          {{ daftar.reduce((acc, curr) => acc + curr.jumlahOrang, 0) }} Orang
          <span class="text-xs text-forest-300 font-normal">({{ daftar.length }} kelompok)</span>
        </p>
      </div>
    </div>

    <!-- Visual Proportion Bar (Diagram Rasio Bagian Waris) -->
    <div class="mt-6">
      <div class="flex items-center justify-between text-xs font-semibold text-ink-600 mb-2">
        <span>Visualisasi Proporsi Pembagian</span>
        <span>Total: 100%</span>
      </div>
      <!-- Stacked segmented bar -->
      <div class="h-6 w-full rounded-lg overflow-hidden flex bg-forest-100/60 p-0.5 border border-forest-900/15">
        <div
          v-for="p in daftar"
          :key="p.id"
          class="h-full first:rounded-l-md last:rounded-r-md transition-all duration-300 relative group cursor-pointer"
          :style="{
            width: `${p.porsiPersen}%`,
            backgroundColor: p.warna,
          }"
          :title="`${p.label}: ${p.porsiPersen}% (${formatRupiah(p.danaTotal)})`"
        >
          <!-- Tooltip on hover -->
          <div
            class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 bg-ink-950 text-white text-[11px] font-semibold py-1 px-2.5 rounded shadow-float whitespace-nowrap pointer-events-none"
          >
            {{ p.label }} • {{ p.porsiPersen }}%
          </div>
        </div>
      </div>
      <!-- Legend row -->
      <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <div v-for="p in daftar" :key="p.id" class="inline-flex items-center gap-1.5 text-ink-700">
          <span class="w-3 h-3 rounded-sm shrink-0" :style="{ backgroundColor: p.warna }"></span>
          <span class="font-medium">{{ p.label }}</span>
          <span class="text-ink-500 font-mono">({{ p.porsiPersen }}%)</span>
        </div>
      </div>
    </div>

    <!-- Rincian Ahli Waris Cards -->
    <div class="mt-8 space-y-3">
      <p class="text-xs font-bold uppercase tracking-wider text-ink-500">
        Rincian Per Ahli Waris
      </p>

      <div
        v-for="(p, idx) in daftar"
        :key="p.id"
        class="rounded-xl border border-forest-900/10 p-4 transition-all duration-200 hover:border-forest-900/25 bg-canvas/60"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <!-- Identitas Ahli Waris -->
          <div class="flex items-start gap-3">
            <span
              class="w-8 h-8 rounded-lg text-white font-bold text-xs grid place-items-center shrink-0 mt-0.5"
              :style="{ backgroundColor: p.warna }"
            >
              {{ idx + 1 }}
            </span>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="font-bold text-ink-900 text-base leading-snug">
                  {{ p.label }}
                </h4>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-forest-100 text-forest-900 border border-forest-900/10"
                >
                  {{ p.jumlahOrang }} Orang
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-ink-700 border border-forest-900/10"
                >
                  {{ p.bagianHukum }}
                </span>
              </div>
              <p class="text-xs text-ink-500 mt-1 leading-relaxed">
                {{ p.penjelasan }}
              </p>
            </div>
          </div>

          <!-- Nominal Uang -->
          <div class="text-right ml-auto sm:ml-0">
            <p class="font-extrabold text-forest-900 text-base sm:text-lg tabular-nums">
              {{ formatRupiah(p.danaTotal) }}
            </p>
            <p v-if="p.jumlahOrang > 1" class="text-xs text-ink-500 font-medium">
              {{ formatRupiah(p.danaPerOrang) }} / orang
            </p>
            <p class="text-[11px] text-ink-400 font-mono">
              {{ p.bagianTerhitung }}
            </p>
          </div>
        </div>

        <!-- Dalil Reference Tag -->
        <div class="mt-3 pt-2.5 border-t border-forest-900/10 flex flex-wrap items-center justify-between text-[11px] text-ink-500">
          <span class="inline-flex items-center gap-1.5 text-forest-800 font-medium">
            <i class="fa-solid fa-book-quran text-forest-600"></i>
            {{ p.dalil }}
          </span>
          <span class="text-ink-400 font-medium">
            Rujukan: {{ p.khi }}
          </span>
        </div>
      </div>
    </div>

    <!-- Catatan Hukum / Disclaimer -->
    <div class="mt-8 rounded-xl bg-dalil-50/80 border border-dalil-200/80 p-4 text-xs leading-relaxed text-ink-800">
      <div class="flex items-start gap-2.5">
        <i class="fa-solid fa-circle-info text-dalil-600 mt-0.5 shrink-0 text-sm"></i>
        <div>
          <p class="font-bold text-ink-900">Ketentuan Syariat & Keabsahan Hukum</p>
          <p class="mt-1 text-ink-700">
            Kalkulasi ini mengacu pada hukum faraid Islam (QS. An-Nisa: 11-12, 176) dan Kompilasi Hukum Islam (KHI) Buku II.
            Sebelum harta dibagi, pastikan kewajiban hutang pewaris, biaya pemakaman, dan wasiat yang sah (maksimal 1/3) telah ditunaikan.
            Untuk pembagian berkekuatan hukum perdata, konsultasikan dengan Pengadilan Agama atau Notaris/PPAT setempat.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
