<script setup>
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  bubble: { type: Object, required: true },
  interaktif: { type: Boolean, default: true },
})
const emit = defineEmits(['laporkan', 'kirim-lanjut'])

const tersalin = ref(false)
let timerSalin = null

// State interaktif kartu pertanyaan lanjutan untuk melengkapi data waris
const formLanjutan = reactive({
  pasangan: '', // 'istri' | 'suami' | 'tidak_ada'
  jumlahIstri: 1,
  statusAnak: '', // 'ada' | 'tidak_ada'
  anakLaki: 0,
  anakPerempuan: 0,
  orangTua: '', // 'ibu' | 'ayah' | 'keduanya' | 'tidak_ada'
  hartaJuta: '', // angka dalam juta atau rupiah
  statusHutang: 'bersih', // 'bersih' | 'ada'
  nominalHutangJuta: '',
})

// Sinkronisasi awal bila backend sudah mengekstrak sebagian data
watch(
  () => props.bubble?.data_saat_ini,
  (d) => {
    if (!d) return
    const aw = d.ahli_waris || {}
    if (Number(aw.istri) > 0) {
      formLanjutan.pasangan = 'istri'
      formLanjutan.jumlahIstri = Number(aw.istri)
    } else if (Number(aw.suami) > 0) {
      formLanjutan.pasangan = 'suami'
    }
    if (Number(aw.anak_laki_laki) > 0 || Number(aw.anak_perempuan) > 0) {
      formLanjutan.statusAnak = 'ada'
      formLanjutan.anakLaki = Number(aw.anak_laki_laki) || 0
      formLanjutan.anakPerempuan = Number(aw.anak_perempuan) || 0
    }
    if (Number(aw.ayah) > 0 && Number(aw.ibu) > 0) {
      formLanjutan.orangTua = 'keduanya'
    } else if (Number(aw.ibu) > 0) {
      formLanjutan.orangTua = 'ibu'
    } else if (Number(aw.ayah) > 0) {
      formLanjutan.orangTua = 'ayah'
    }
    if (Number(d.harta_total) > 0) {
      formLanjutan.hartaJuta = String(Math.round(Number(d.harta_total) / 1_000_000))
    }
  },
  { immediate: true },
)

const tampilKartuPelengkap = computed(() => {
  return (
    props.bubble.peran === 'bot' &&
    !props.bubble.hasil &&
    !props.bubble.selesai &&
    props.bubble.mode !== 'qna'
  )
})

const daftarPertanyaanKlik = computed(() => {
  if (!Array.isArray(props.bubble.tanya_lanjutan)) return []
  return props.bubble.tanya_lanjutan.filter((t) => typeof t === 'string' && t.trim())
})

function pilihPasangan(jenis) {
  formLanjutan.pasangan = jenis
  if (jenis === 'istri' && formLanjutan.jumlahIstri < 1) {
    formLanjutan.jumlahIstri = 1
  }
}

function ubahIstri(delta) {
  formLanjutan.pasangan = 'istri'
  const baru = formLanjutan.jumlahIstri + delta
  if (baru >= 1 && baru <= 4) formLanjutan.jumlahIstri = baru
}

function ubahAnak(jenis, delta) {
  formLanjutan.statusAnak = 'ada'
  if (jenis === 'laki') {
    const baru = Math.max(0, Math.min(20, formLanjutan.anakLaki + delta))
    formLanjutan.anakLaki = baru
  } else {
    const baru = Math.max(0, Math.min(20, formLanjutan.anakPerempuan + delta))
    formLanjutan.anakPerempuan = baru
  }
  if (formLanjutan.anakLaki === 0 && formLanjutan.anakPerempuan === 0) {
    formLanjutan.statusAnak = 'tidak_ada'
  }
}

function setTidakAdaAnak() {
  formLanjutan.statusAnak = 'tidak_ada'
  formLanjutan.anakLaki = 0
  formLanjutan.anakPerempuan = 0
}

function pilihHartaCepat(juta) {
  formLanjutan.hartaJuta = String(juta)
}

const kalimatDataPelengkap = computed(() => {
  const bagian = []

  // 1. Pasangan
  if (formLanjutan.pasangan === 'istri') {
    bagian.push(`meninggalkan ${formLanjutan.jumlahIstri} orang istri yang masih hidup`)
  } else if (formLanjutan.pasangan === 'suami') {
    bagian.push('meninggalkan suami yang masih hidup')
  } else if (formLanjutan.pasangan === 'tidak_ada') {
    bagian.push('tidak meninggalkan pasangan (suami/istri)')
  }

  // 2. Anak
  if (formLanjutan.statusAnak === 'tidak_ada') {
    bagian.push('tidak memiliki anak kandung')
  } else if (formLanjutan.statusAnak === 'ada') {
    const rincianAnak = []
    if (formLanjutan.anakLaki > 0) rincianAnak.push(`${formLanjutan.anakLaki} anak laki-laki`)
    if (formLanjutan.anakPerempuan > 0) rincianAnak.push(`${formLanjutan.anakPerempuan} anak perempuan`)
    if (rincianAnak.length) {
      bagian.push(`memiliki ${rincianAnak.join(' dan ')}`)
    }
  }

  // 3. Orang tua
  if (formLanjutan.orangTua === 'keduanya') {
    bagian.push('ayah dan ibu kandung masih hidup')
  } else if (formLanjutan.orangTua === 'ibu') {
    bagian.push('ibu kandung masih hidup (ayah sudah wafat)')
  } else if (formLanjutan.orangTua === 'ayah') {
    bagian.push('ayah kandung masih hidup (ibu sudah wafat)')
  } else if (formLanjutan.orangTua === 'tidak_ada') {
    bagian.push('ayah dan ibu kandung keduanya sudah wafat')
  }

  // 4. Harta & Hutang
  const angkaHarta = Number(String(formLanjutan.hartaJuta).replace(/[^\d.]/g, ''))
  if (Number.isFinite(angkaHarta) && angkaHarta > 0) {
    if (formLanjutan.statusHutang === 'ada') {
      const angkaHutang = Number(String(formLanjutan.nominalHutangJuta).replace(/[^\d.]/g, '')) || 0
      if (angkaHutang > 0) {
        bagian.push(`total harta ${angkaHarta} juta rupiah dengan hutang/wasiat ${angkaHutang} juta rupiah`)
      } else {
        bagian.push(`total harta ${angkaHarta} juta rupiah`)
      }
    } else {
      bagian.push(`total harta bersih ${angkaHarta} juta rupiah tanpa hutang dan tanpa wasiat`)
    }
  }

  if (!bagian.length) return ''
  return `Data tambahan keluarga: Pewaris ${bagian.join(', ')}.`
})

function kirimDataPelengkap() {
  if (!kalimatDataPelengkap.value) return
  emit('kirim-lanjut', kalimatDataPelengkap.value)
}

function klikPertanyaanLanjutan(teks) {
  if (!teks) return
  emit('kirim-lanjut', teks)
}

// Salin teks jawaban AI
async function salinTeks() {
  const teks = String(props.bubble.teks ?? '')
  if (!teks) return

  let berhasil = false
  try {
    await navigator.clipboard.writeText(teks)
    berhasil = true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = teks
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      berhasil = document.execCommand('copy')
      document.body.removeChild(area)
    } catch {
      berhasil = false
    }
  }

  if (!berhasil) return
  tersalin.value = true
  clearTimeout(timerSalin)
  timerSalin = setTimeout(() => {
    tersalin.value = false
  }, 2000)
}

onUnmounted(() => clearTimeout(timerSalin))
</script>

<template>
  <!-- Bubble USER: Kanan, Deep Forest Green -->
  <div v-if="bubble.peran === 'user'" class="flex justify-end my-3">
    <div
      class="max-w-[88%] sm:max-w-[75%] bg-forest-900 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-subtle whitespace-pre-line"
    >
      {{ bubble.teks }}
    </div>
  </div>

  <!-- Bubble BOT: Kiri, Clean White Card + Logo -->
  <div v-else class="flex justify-start gap-3 my-3">
    <BrandLogo class="w-8 h-8 sm:w-9 sm:h-9 shrink-0 mt-1" />
    <div
      class="max-w-[94%] sm:max-w-[85%] bg-white text-ink-900 border border-forest-900/10 rounded-2xl rounded-tl-sm p-5 sm:p-6 shadow-card space-y-4"
    >
      <!-- Mode mock notice bila AI menggunakan fallback offline -->
      <div
        v-if="bubble.mock"
        class="inline-flex items-center gap-2 rounded-lg bg-dalil-50 border border-dalil-200 px-3 py-1.5 text-xs font-bold text-dalil-700"
      >
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <span>Mode tanggap cadangan lokal (simulasi edukasi)</span>
      </div>

      <!-- Teks Jawaban Naratif AI -->
      <p class="text-sm text-ink-800 leading-relaxed whitespace-pre-line font-normal">
        {{ bubble.teks }}
      </p>

      <!-- KARTU INTERAKTIF PERTANYAAN LANJUTAN (MELENGKAPI DATA KELUARGA & HARTA) -->
      <div v-if="tampilKartuPelengkap" class="pt-2 space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold text-forest-900 flex items-center gap-1.5">
            <i class="fa-solid fa-hand-pointer text-forest-700"></i>
            <span>Klik pilihan di bawah ini untuk melengkapi data dengan cepat:</span>
          </p>
        </div>

        <!-- Grid 2x2 Kartu Gaya Gambar 1 -->
        <div class="grid sm:grid-cols-2 gap-3 text-left">
          <!-- Kartu 1: Status Pasangan (Istri / Suami) -->
          <div
            class="p-4 rounded-xl border transition-all duration-200 shadow-subtle"
            :class="
              formLanjutan.pasangan
                ? 'border-forest-900/35 bg-forest-50/70'
                : 'border-forest-900/10 bg-white hover:border-forest-900/25'
            "
          >
            <div class="flex items-center justify-between">
              <p class="font-bold text-xs text-forest-900">1. Status Pasangan (Istri / Suami)</p>
              <i
                class="fa-solid text-xs transition-opacity"
                :class="
                  formLanjutan.pasangan
                    ? 'fa-circle-check text-forest-700 opacity-100'
                    : 'fa-arrow-right text-forest-700 opacity-40'
                "
              ></i>
            </div>
            <p class="text-xs text-ink-600 mt-1 leading-relaxed">
              Apakah istri atau suami pewaris masih hidup?
            </p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.pasangan === 'istri'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="pilihPasangan('istri')"
              >
                Istri Masih Ada
              </button>
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.pasangan === 'suami'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="pilihPasangan('suami')"
              >
                Suami Masih Ada
              </button>
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.pasangan === 'tidak_ada'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="pilihPasangan('tidak_ada')"
              >
                Tidak Ada / Wafat
              </button>
            </div>
            <!-- Pilihan jumlah istri bila memilih Istri -->
            <div
              v-if="formLanjutan.pasangan === 'istri'"
              class="mt-2.5 pt-2 border-t border-forest-900/10 flex items-center justify-between text-xs"
            >
              <span class="text-ink-700 font-medium">Jumlah Istri Sah:</span>
              <div class="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  class="w-7 h-7 rounded-lg border border-forest-900/20 bg-white font-bold text-ink-800 hover:bg-forest-100"
                  @click="ubahIstri(-1)"
                >
                  -
                </button>
                <span class="w-6 text-center font-mono font-bold text-forest-950">
                  {{ formLanjutan.jumlahIstri }}
                </span>
                <button
                  type="button"
                  class="w-7 h-7 rounded-lg border border-forest-900/20 bg-white font-bold text-ink-800 hover:bg-forest-100"
                  @click="ubahIstri(1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Kartu 2: Jumlah Anak Kandung (Laki-laki & Perempuan) -->
          <div
            class="p-4 rounded-xl border transition-all duration-200 shadow-subtle"
            :class="
              formLanjutan.statusAnak
                ? 'border-forest-900/35 bg-forest-50/70'
                : 'border-forest-900/10 bg-white hover:border-forest-900/25'
            "
          >
            <div class="flex items-center justify-between">
              <p class="font-bold text-xs text-forest-900">2. Anak Kandung (Laki-laki & Perempuan)</p>
              <i
                class="fa-solid text-xs transition-opacity"
                :class="
                  formLanjutan.statusAnak
                    ? 'fa-circle-check text-forest-700 opacity-100'
                    : 'fa-arrow-right text-forest-700 opacity-40'
                "
              ></i>
            </div>
            <p class="text-xs text-ink-600 mt-1 leading-relaxed">
              Berapa jumlah anak laki-laki dan anak perempuan kandung?
            </p>
            <div class="mt-2.5 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-ink-800">Anak Laki-laki:</span>
                <div class="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    class="w-7 h-7 rounded-lg border border-forest-900/20 bg-white font-bold text-ink-800 hover:bg-forest-100 active:scale-95"
                    @click="ubahAnak('laki', -1)"
                  >
                    -
                  </button>
                  <span class="w-6 text-center font-mono font-bold text-forest-950">
                    {{ formLanjutan.anakLaki }}
                  </span>
                  <button
                    type="button"
                    class="w-7 h-7 rounded-lg border border-forest-900/20 bg-white font-bold text-ink-800 hover:bg-forest-100 active:scale-95"
                    @click="ubahAnak('laki', 1)"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-ink-800">Anak Perempuan:</span>
                <div class="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    class="w-7 h-7 rounded-lg border border-forest-900/20 bg-white font-bold text-ink-800 hover:bg-forest-100 active:scale-95"
                    @click="ubahAnak('perempuan', -1)"
                  >
                    -
                  </button>
                  <span class="w-6 text-center font-mono font-bold text-forest-950">
                    {{ formLanjutan.anakPerempuan }}
                  </span>
                  <button
                    type="button"
                    class="w-7 h-7 rounded-lg border border-forest-900/20 bg-white font-bold text-ink-800 hover:bg-forest-100 active:scale-95"
                    @click="ubahAnak('perempuan', 1)"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                class="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 text-center"
                :class="
                  formLanjutan.statusAnak === 'tidak_ada'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="setTidakAdaAnak"
              >
                Tidak Ada Anak Kandung
              </button>
            </div>
          </div>

          <!-- Kartu 3: Orang Tua Kandung (Ayah & Ibu) -->
          <div
            class="p-4 rounded-xl border transition-all duration-200 shadow-subtle"
            :class="
              formLanjutan.orangTua
                ? 'border-forest-900/35 bg-forest-50/70'
                : 'border-forest-900/10 bg-white hover:border-forest-900/25'
            "
          >
            <div class="flex items-center justify-between">
              <p class="font-bold text-xs text-forest-900">3. Orang Tua Pewaris (Ayah & Ibu)</p>
              <i
                class="fa-solid text-xs transition-opacity"
                :class="
                  formLanjutan.orangTua
                    ? 'fa-circle-check text-forest-700 opacity-100'
                    : 'fa-arrow-right text-forest-700 opacity-40'
                "
              ></i>
            </div>
            <p class="text-xs text-ink-600 mt-1 leading-relaxed">
              Apakah ayah atau ibu kandung pewaris masih hidup?
            </p>
            <div class="grid grid-cols-2 gap-1.5 mt-3">
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.orangTua === 'ibu'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="formLanjutan.orangTua = 'ibu'"
              >
                Hanya Ibu Hidup
              </button>
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.orangTua === 'ayah'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="formLanjutan.orangTua = 'ayah'"
              >
                Hanya Ayah Hidup
              </button>
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.orangTua === 'keduanya'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="formLanjutan.orangTua = 'keduanya'"
              >
                Ayah & Ibu Hidup
              </button>
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                :class="
                  formLanjutan.orangTua === 'tidak_ada'
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="formLanjutan.orangTua = 'tidak_ada'"
              >
                Keduanya Wafat
              </button>
            </div>
          </div>

          <!-- Kartu 4: Total Harta & Hutang / Wasiat -->
          <div
            class="p-4 rounded-xl border transition-all duration-200 shadow-subtle"
            :class="
              formLanjutan.hartaJuta
                ? 'border-forest-900/35 bg-forest-50/70'
                : 'border-forest-900/10 bg-white hover:border-forest-900/25'
            "
          >
            <div class="flex items-center justify-between">
              <p class="font-bold text-xs text-forest-900">4. Total Harta & Kewajiban</p>
              <i
                class="fa-solid text-xs transition-opacity"
                :class="
                  formLanjutan.hartaJuta
                    ? 'fa-circle-check text-forest-700 opacity-100'
                    : 'fa-arrow-right text-forest-700 opacity-40'
                "
              ></i>
            </div>
            <p class="text-xs text-ink-600 mt-1 leading-relaxed">
              Pilih atau isi perkiraan harta bersih (dalam Juta Rupiah):
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2.5">
              <button
                v-for="nom in [100, 150, 250, 500, 1000]"
                :key="nom"
                type="button"
                class="px-2 py-1 rounded-lg text-[11px] font-bold border transition-all active:scale-95"
                :class="
                  String(formLanjutan.hartaJuta) === String(nom)
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="pilihHartaCepat(nom)"
              >
                {{ nom === 1000 ? 'Rp 1 Miliar' : `Rp ${nom} Jt` }}
              </button>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <input
                v-model="formLanjutan.hartaJuta"
                type="number"
                min="1"
                placeholder="Nominal lain (Juta Rp)…"
                class="flex-1 h-8 px-2.5 rounded-lg border border-forest-900/20 bg-white text-xs font-mono text-ink-900 outline-none focus:border-forest-800"
              />
              <span class="text-[11px] font-semibold text-ink-500">Juta Rp</span>
            </div>
          </div>
        </div>

        <!-- Bar Kirim Data yang Sudah Diklik -->
        <div
          v-if="kalimatDataPelengkap"
          class="p-3.5 rounded-xl bg-forest-50 border border-forest-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <p class="text-xs text-forest-950 leading-relaxed">
            <strong class="font-bold">Ringkasan Jawaban:</strong> {{ kalimatDataPelengkap }}
          </p>
          <button
            type="button"
            class="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 active:scale-95 transition-all shadow-subtle"
            @click="kirimDataPelengkap"
          >
            <span>Kirim Data & Hitung</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>

      <!-- KARTU PERTANYAAN LANJUTAN Q&A (Bisa Diklik Seperti Gambar 1) -->
      <div
        v-else-if="daftarPertanyaanKlik.length"
        class="pt-2 space-y-2.5"
      >
        <p class="text-xs font-bold text-forest-900 flex items-center gap-1.5">
          <i class="fa-regular fa-compass text-forest-700"></i>
          <span>Pertanyaan Lanjutan (Klik untuk menanyakan):</span>
        </p>
        <div class="grid sm:grid-cols-2 gap-2.5 text-left">
          <button
            v-for="(tanya, idx) in daftarPertanyaanKlik"
            :key="idx"
            type="button"
            class="p-3.5 rounded-xl border border-forest-900/15 bg-canvas/60 hover:bg-forest-50/80 hover:border-forest-900/30 transition-all duration-200 active:scale-[0.98] shadow-subtle group text-left"
            @click="klikPertanyaanLanjutan(tanya)"
          >
            <p class="font-bold text-xs text-forest-900 group-hover:text-forest-700 flex items-center justify-between gap-2">
              <span>Pertanyaan Lanjutan {{ idx + 1 }}</span>
              <i class="fa-solid fa-arrow-right text-[10px] opacity-70 group-hover:opacity-100 transition-opacity"></i>
            </p>
            <p class="text-xs text-ink-700 mt-1 leading-relaxed">
              {{ tanya }}
            </p>
          </button>
        </div>
      </div>

      <!-- Hasil Perhitungan Tabular / Rich Card -->
      <div v-if="bubble.hasil" class="mt-4">
        <template v-if="Array.isArray(bubble.hasil.bagian) && bubble.hasil.bagian.length">
          <div class="rounded-xl border border-forest-900/15 overflow-hidden bg-canvas/50 p-4">
            <p class="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3 flex items-center gap-2">
              <i class="fa-solid fa-calculator text-forest-700"></i>
              {{ bubble.hasil.judul || 'Simulasi Perhitungan Faraid' }}
            </p>

            <div class="space-y-2">
              <div
                v-for="b in bubble.hasil.bagian"
                :key="b.nama"
                class="flex items-center justify-between p-3 rounded-lg bg-white border border-forest-900/10 text-xs"
              >
                <div>
                  <p class="font-bold text-ink-900">{{ b.nama }}</p>
                  <p class="text-ink-500 font-mono text-[11px]">{{ b.porsi }}</p>
                </div>
                <p class="font-bold text-forest-900 font-mono text-sm whitespace-nowrap">
                  {{ b.nominal }}
                </p>
              </div>
            </div>

            <p v-if="bubble.hasil.catatan" class="mt-3 text-[11px] text-ink-500 italic">
              {{ bubble.hasil.catatan }}
            </p>
          </div>
        </template>
      </div>

      <!-- Sumber Hukum -->
      <div
        v-if="bubble.sumber"
        class="text-xs text-ink-600 bg-forest-50/70 border border-forest-900/10 rounded-xl px-4 py-2.5 flex items-center gap-2.5"
      >
        <i class="fa-solid fa-book-quran text-forest-700 text-sm"></i>
        <span><strong>Dasar Hukum:</strong> {{ bubble.sumber }}</span>
      </div>

      <!-- Disclaimer Syariat -->
      <div
        v-if="bubble.disclaimer"
        class="text-xs text-ink-700 bg-dalil-50/80 border border-dalil-200/80 rounded-xl px-4 py-3 leading-relaxed flex items-start gap-2.5"
      >
        <i class="fa-solid fa-circle-exclamation text-dalil-600 mt-0.5 shrink-0 text-sm"></i>
        <div>
          <strong class="font-bold text-ink-900">Perhatian:</strong> {{ bubble.disclaimer }}
        </div>
      </div>

      <!-- Action Footer: Laporkan & Salin -->
      <div class="pt-2 border-t border-forest-900/10 flex items-center justify-end gap-2">
        <button
          v-if="bubble.hasil"
          type="button"
          class="text-xs font-bold rounded-lg px-3 py-1.5 border transition-all duration-200 active:scale-95"
          :class="
            bubble.dilapor
              ? 'bg-forest-100 border-forest-300 text-forest-900'
              : 'border-forest-900/15 text-ink-500 hover:text-forest-900 hover:bg-forest-50'
          "
          @click="$emit('laporkan', bubble.id)"
        >
          <i class="fa-solid fa-flag mr-1.5 text-xs"></i>
          <span>{{ bubble.dilapor ? 'Dilaporkan' : 'Laporkan' }}</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-forest-900/15 text-xs font-bold text-ink-600 hover:text-forest-900 hover:bg-forest-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
          :title="tersalin ? 'Tersalin ke clipboard' : 'Salin teks jawaban'"
          @click="salinTeks"
        >
          <i :class="tersalin ? 'fa-solid fa-check text-forest-700' : 'fa-regular fa-copy'" class="text-xs"></i>
          <span>{{ tersalin ? 'Tersalin' : 'Salin Jawaban' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
