<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  CONTOH_SKENARIO,
  formatRupiah,
  hitungFaraidKomprehensif,
} from '../lib/faraidhCalculator.js'
import HasilPerhitungan from './HasilPerhitungan.vue'

// State form kalkulator
const genderPewaris = ref('laki_laki')
const totalHartaKotor = ref('250000000')
const hutangPewaris = ref('0')
const biayaJenazah = ref('5000000')
const wasiatPewaris = ref('0')

// Ahli waris
const ahliWaris = reactive({
  istri: 1,
  suami: 0,
  anak_laki_laki: 2,
  anak_perempuan: 1,
  ayah: 0,
  ibu: 1,
  cucu_laki_laki: 0,
  cucu_perempuan: 0,
  kakek: 0,
  nenek: 0,
  ibu_kakek: 0,
  saudara_kandung: 0,
  saudari_kandung: 0,
  saudara_tiri_seayah: 0,
  saudari_seayah: 0,
  saudara_saudari_tiri_seibu: 0,
})

const tampilkanKerabatTambahan = ref(false)

// Sinkronkan gender pewaris dengan pasangan
watch(genderPewaris, (baru) => {
  if (baru === 'laki_laki') {
    ahliWaris.suami = 0
    if (ahliWaris.istri === 0) ahliWaris.istri = 1
  } else {
    ahliWaris.istri = 0
    ahliWaris.suami = 1
  }
})

// Fungsi helper penyesuaian angka
function tambah(field, max = 20) {
  if (ahliWaris[field] < max) ahliWaris[field]++
}

function kurang(field) {
  if (ahliWaris[field] > 0) ahliWaris[field]--
}

function muatSkenario(skenario) {
  genderPewaris.value = skenario.gender
  totalHartaKotor.value = String(skenario.harta)
  hutangPewaris.value = String(skenario.hutang || 0)
  biayaJenazah.value = String(skenario.biaya || 0)
  wasiatPewaris.value = String(skenario.wasiat || 0)

  // Reset semua ahli waris
  Object.keys(ahliWaris).forEach((k) => (ahliWaris[k] = 0))
  // Isi dari skenario
  Object.keys(skenario.ahliWaris).forEach((k) => {
    ahliWaris[k] = skenario.ahliWaris[k]
  })
}

function resetForm() {
  genderPewaris.value = 'laki_laki'
  totalHartaKotor.value = '100000000'
  hutangPewaris.value = '0'
  biayaJenazah.value = '0'
  wasiatPewaris.value = '0'
  Object.keys(ahliWaris).forEach((k) => (ahliWaris[k] = 0))
  ahliWaris.istri = 1
  ahliWaris.anak_laki_laki = 1
  ahliWaris.ibu = 1
}

// Hasil kalkulasi reaktif instan
const hasilKalkulasi = computed(() => {
  return hitungFaraidKomprehensif({
    genderPewaris: genderPewaris.value,
    totalHartaKotor: totalHartaKotor.value,
    hutangPewaris: hutangPewaris.value,
    biayaJenazah: biayaJenazah.value,
    wasiatPewaris: wasiatPewaris.value,
    ahliWaris,
  })
})
</script>

<template>
  <div class="w-full">
    <!-- Preset Skenario Cepat -->
    <div class="mb-8 p-4 sm:p-5 rounded-2xl bg-forest-50/80 border border-forest-900/10">
      <div class="flex items-center gap-2 mb-3">
        <i class="fa-solid fa-wand-magic-sparkles text-forest-700 text-sm"></i>
        <span class="text-xs font-bold uppercase tracking-wider text-forest-900">
          Uji Coba Cepat Kasus Nyata
        </span>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <button
          v-for="s in CONTOH_SKENARIO"
          :key="s.judul"
          type="button"
          class="text-left p-3.5 rounded-xl border border-forest-900/10 bg-white hover:bg-forest-100/50 hover:border-forest-900/25 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
          @click="muatSkenario(s)"
        >
          <p class="font-bold text-xs text-forest-950">{{ s.judul }}</p>
          <p class="text-[11px] text-ink-600 mt-1 line-clamp-2 leading-snug">
            {{ s.deskripsi }}
          </p>
        </button>
      </div>
    </div>

    <!-- Layout Dua Kolom: Form Input (Kiri) + Hasil Live (Kanan) -->
    <div class="grid gap-8 lg:grid-cols-12 items-start">
      <!-- FORM INPUT (7 Kolom) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Card 1: Data Pewaris & Harta -->
        <div class="bg-white rounded-2xl border border-forest-900/10 p-6 sm:p-7 shadow-card">
          <div class="flex items-center justify-between gap-4 pb-4 border-b border-forest-900/10">
            <h3 class="font-display font-bold text-lg sm:text-xl text-ink-900">
              1. Pewaris & Harta Peninggalan
            </h3>
            <button
              type="button"
              class="text-xs font-bold text-ink-500 hover:text-danger-DEFAULT transition-colors"
              @click="resetForm"
            >
              <i class="fa-solid fa-rotate-left mr-1"></i> Reset
            </button>
          </div>

          <!-- Jenis Kelamin Pewaris -->
          <div class="mt-5">
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
              Pewaris yang Wafat
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
                :class="
                  genderPewaris === 'laki_laki'
                    ? 'bg-forest-900 text-white border-forest-900 shadow-subtle'
                    : 'bg-canvas text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="genderPewaris = 'laki_laki'"
              >
                <i class="fa-solid fa-mars text-base"></i>
                Laki-Laki (Suami / Ayah)
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
                :class="
                  genderPewaris === 'perempuan'
                    ? 'bg-forest-900 text-white border-forest-900 shadow-subtle'
                    : 'bg-canvas text-ink-700 border-forest-900/15 hover:bg-forest-50'
                "
                @click="genderPewaris = 'perempuan'"
              >
                <i class="fa-solid fa-venus text-base"></i>
                Perempuan (Istri / Ibu)
              </button>
            </div>
          </div>

          <!-- Total Harta Kotor -->
          <div class="mt-5">
            <div class="flex items-center justify-between mb-1.5">
              <label for="inputHarta" class="text-xs font-bold uppercase tracking-wider text-ink-600">
                Total Harta Kotor (Rp)
              </label>
              <span class="text-xs font-bold text-forest-800">
                {{ formatRupiah(totalHartaKotor) }}
              </span>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">
                Rp
              </span>
              <input
                id="inputHarta"
                v-model="totalHartaKotor"
                type="number"
                min="0"
                step="1000000"
                class="w-full h-12 pl-12 pr-4 rounded-xl border border-forest-900/15 bg-canvas font-mono font-bold text-sm text-ink-900 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 transition-all"
                placeholder="Contoh: 250000000"
              />
            </div>
          </div>

          <!-- Kewajiban Sebelum Waris (Hutang, Biaya, Wasiat) -->
          <div class="mt-5 pt-4 border-t border-forest-900/10">
            <p class="text-xs font-bold text-ink-700 mb-3 flex items-center gap-1.5">
              <i class="fa-solid fa-file-invoice-dollar text-forest-700"></i>
              Kewajiban Pengurang Sebelum Harta Dibagi
            </p>
            <div class="grid gap-3 sm:grid-cols-3">
              <div>
                <label for="inputHutang" class="block text-[11px] font-semibold text-ink-500 mb-1">
                  Hutang Pewaris
                </label>
                <input
                  id="inputHutang"
                  v-model="hutangPewaris"
                  type="number"
                  min="0"
                  class="w-full h-10 px-3 rounded-lg border border-forest-900/15 bg-canvas font-mono text-xs text-ink-900 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20"
                  placeholder="0"
                />
              </div>
              <div>
                <label for="inputBiaya" class="block text-[11px] font-semibold text-ink-500 mb-1">
                  Biaya Pemakaman
                </label>
                <input
                  id="inputBiaya"
                  v-model="biayaJenazah"
                  type="number"
                  min="0"
                  class="w-full h-10 px-3 rounded-lg border border-forest-900/15 bg-canvas font-mono text-xs text-ink-900 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20"
                  placeholder="0"
                />
              </div>
              <div>
                <label for="inputWasiat" class="block text-[11px] font-semibold text-ink-500 mb-1">
                  Wasiat (Maks 1/3)
                </label>
                <input
                  id="inputWasiat"
                  v-model="wasiatPewaris"
                  type="number"
                  min="0"
                  class="w-full h-10 px-3 rounded-lg border border-forest-900/15 bg-canvas font-mono text-xs text-ink-900 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Ahli Waris Primer (Keluarga Inti) -->
        <div class="bg-white rounded-2xl border border-forest-900/10 p-6 sm:p-7 shadow-card">
          <div class="pb-4 border-b border-forest-900/10">
            <h3 class="font-display font-bold text-lg sm:text-xl text-ink-900">
              2. Ahli Waris Primer (Keluarga Inti)
            </h3>
            <p class="text-xs text-ink-500 mt-1">
              Pasangan, anak kandung, dan orang tua adalah ahli waris yang tidak pernah gugur haknya.
            </p>
          </div>

          <div class="mt-5 space-y-4">
            <!-- Pasangan: Istri (bila pewaris laki-laki) -->
            <div
              v-if="genderPewaris === 'laki_laki'"
              class="flex items-center justify-between p-3.5 rounded-xl border border-forest-900/10 bg-canvas"
            >
              <div>
                <p class="font-bold text-sm text-ink-900">Istri yang Ditinggalkan</p>
                <p class="text-xs text-ink-500">Maksimal 4 orang istri yang sah</p>
              </div>
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="w-9 h-9 rounded-lg border border-forest-900/20 bg-white text-ink-800 grid place-items-center hover:bg-forest-50 active:scale-95"
                  @click="kurang('istri')"
                >
                  <i class="fa-solid fa-minus text-xs"></i>
                </button>
                <span class="w-7 text-center font-bold text-sm text-ink-900 font-mono">
                  {{ ahliWaris.istri }}
                </span>
                <button
                  type="button"
                  class="w-9 h-9 rounded-lg border border-forest-900/20 bg-white text-ink-800 grid place-items-center hover:bg-forest-50 active:scale-95"
                  @click="tambah('istri', 4)"
                >
                  <i class="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Pasangan: Suami (bila pewaris perempuan) -->
            <div
              v-else
              class="flex items-center justify-between p-3.5 rounded-xl border border-forest-900/10 bg-canvas"
            >
              <div>
                <p class="font-bold text-sm text-ink-900">Suami yang Ditinggalkan</p>
                <p class="text-xs text-ink-500">Apakah suami masih hidup?</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-4 py-1.5 rounded-lg border font-bold text-xs transition-all"
                  :class="
                    ahliWaris.suami === 1
                      ? 'bg-forest-900 text-white border-forest-900'
                      : 'bg-white text-ink-600 border-forest-900/15'
                  "
                  @click="ahliWaris.suami = ahliWaris.suami === 1 ? 0 : 1"
                >
                  {{ ahliWaris.suami === 1 ? 'Masih Hidup' : 'Tidak Ada' }}
                </button>
              </div>
            </div>

            <!-- Anak Laki-Laki Kandung -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-forest-900/10 bg-canvas">
              <div>
                <p class="font-bold text-sm text-ink-900">Anak Laki-Laki Kandung</p>
                <p class="text-xs text-ink-500">Menerima bagian sisa (Ashabah)</p>
              </div>
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="w-9 h-9 rounded-lg border border-forest-900/20 bg-white text-ink-800 grid place-items-center hover:bg-forest-50 active:scale-95"
                  @click="kurang('anak_laki_laki')"
                >
                  <i class="fa-solid fa-minus text-xs"></i>
                </button>
                <span class="w-7 text-center font-bold text-sm text-ink-900 font-mono">
                  {{ ahliWaris.anak_laki_laki }}
                </span>
                <button
                  type="button"
                  class="w-9 h-9 rounded-lg border border-forest-900/20 bg-white text-ink-800 grid place-items-center hover:bg-forest-50 active:scale-95"
                  @click="tambah('anak_laki_laki')"
                >
                  <i class="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Anak Perempuan Kandung -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-forest-900/10 bg-canvas">
              <div>
                <p class="font-bold text-sm text-ink-900">Anak Perempuan Kandung</p>
                <p class="text-xs text-ink-500">1/2 (tunggal), 2/3 (jamak), atau ashabah bersama anak laki-laki</p>
              </div>
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="w-9 h-9 rounded-lg border border-forest-900/20 bg-white text-ink-800 grid place-items-center hover:bg-forest-50 active:scale-95"
                  @click="kurang('anak_perempuan')"
                >
                  <i class="fa-solid fa-minus text-xs"></i>
                </button>
                <span class="w-7 text-center font-bold text-sm text-ink-900 font-mono">
                  {{ ahliWaris.anak_perempuan }}
                </span>
                <button
                  type="button"
                  class="w-9 h-9 rounded-lg border border-forest-900/20 bg-white text-ink-800 grid place-items-center hover:bg-forest-50 active:scale-95"
                  @click="tambah('anak_perempuan')"
                >
                  <i class="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Ayah Kandung -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-forest-900/10 bg-canvas">
              <div>
                <p class="font-bold text-sm text-ink-900">Ayah Kandung Pewaris</p>
                <p class="text-xs text-ink-500">Mendapat 1/6 pasti bila ada anak</p>
              </div>
              <button
                type="button"
                class="px-4 py-1.5 rounded-lg border font-bold text-xs transition-all"
                :class="
                  ahliWaris.ayah === 1
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-600 border-forest-900/15'
                "
                @click="ahliWaris.ayah = ahliWaris.ayah === 1 ? 0 : 1"
              >
                {{ ahliWaris.ayah === 1 ? 'Masih Hidup' : 'Tidak Ada' }}
              </button>
            </div>

            <!-- Ibu Kandung -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-forest-900/10 bg-canvas">
              <div>
                <p class="font-bold text-sm text-ink-900">Ibu Kandung Pewaris</p>
                <p class="text-xs text-ink-500">Mendapat 1/6 bila ada anak/saudara, atau 1/3 bila tanpa anak</p>
              </div>
              <button
                type="button"
                class="px-4 py-1.5 rounded-lg border font-bold text-xs transition-all"
                :class="
                  ahliWaris.ibu === 1
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-white text-ink-600 border-forest-900/15'
                "
                @click="ahliWaris.ibu = ahliWaris.ibu === 1 ? 0 : 1"
              >
                {{ ahliWaris.ibu === 1 ? 'Masih Hidup' : 'Tidak Ada' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Card 3: Ahli Waris Tambahan / Sekunder (Accordion) -->
        <div class="bg-white rounded-2xl border border-forest-900/10 p-6 sm:p-7 shadow-card">
          <button
            type="button"
            class="w-full flex items-center justify-between text-left focus-visible:outline-none"
            @click="tampilkanKerabatTambahan = !tampilkanKerabatTambahan"
          >
            <div>
              <h3 class="font-display font-bold text-lg text-ink-900">
                3. Ahli Waris Sekunder (Kakek, Nenek, Cucu & Saudara)
              </h3>
              <p class="text-xs text-ink-500 mt-0.5">
                Klik untuk menampilkan kerabat lain (diperlukan terutama jika pewaris tidak memiliki anak/ayah)
              </p>
            </div>
            <span
              class="w-8 h-8 rounded-full bg-forest-50 text-forest-800 grid place-items-center shrink-0 ml-3 transition-transform duration-200"
              :class="tampilkanKerabatTambahan ? 'rotate-180' : ''"
            >
              <i class="fa-solid fa-chevron-down text-xs"></i>
            </span>
          </button>

          <div v-show="tampilkanKerabatTambahan" class="mt-5 pt-4 border-t border-forest-900/10 space-y-4">
            <!-- Cucu Laki-laki & Perempuan -->
            <div class="grid sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl border border-forest-900/10 bg-canvas flex items-center justify-between">
                <div>
                  <p class="font-bold text-xs text-ink-900">Cucu Laki-Laki</p>
                  <p class="text-[11px] text-ink-500">Lewat anak laki-laki</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="kurang('cucu_laki_laki')">-</button>
                  <span class="w-6 text-center font-bold text-xs font-mono">{{ ahliWaris.cucu_laki_laki }}</span>
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="tambah('cucu_laki_laki')">+</button>
                </div>
              </div>
              <div class="p-3.5 rounded-xl border border-forest-900/10 bg-canvas flex items-center justify-between">
                <div>
                  <p class="font-bold text-xs text-ink-900">Cucu Perempuan</p>
                  <p class="text-[11px] text-ink-500">Lewat anak laki-laki</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="kurang('cucu_perempuan')">-</button>
                  <span class="w-6 text-center font-bold text-xs font-mono">{{ ahliWaris.cucu_perempuan }}</span>
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="tambah('cucu_perempuan')">+</button>
                </div>
              </div>
            </div>

            <!-- Kakek & Nenek -->
            <div class="grid sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl border border-forest-900/10 bg-canvas flex items-center justify-between">
                <span class="font-bold text-xs text-ink-900">Kakek (Pihak Ayah)</span>
                <button
                  type="button"
                  class="px-3 py-1 rounded text-xs font-bold border"
                  :class="ahliWaris.kakek ? 'bg-forest-900 text-white' : 'bg-white text-ink-600'"
                  @click="ahliWaris.kakek = ahliWaris.kakek ? 0 : 1"
                >
                  {{ ahliWaris.kakek ? 'Ada' : 'Tidak' }}
                </button>
              </div>
              <div class="p-3.5 rounded-xl border border-forest-900/10 bg-canvas flex items-center justify-between">
                <span class="font-bold text-xs text-ink-900">Nenek (Pihak Ibu)</span>
                <button
                  type="button"
                  class="px-3 py-1 rounded text-xs font-bold border"
                  :class="ahliWaris.nenek ? 'bg-forest-900 text-white' : 'bg-white text-ink-600'"
                  @click="ahliWaris.nenek = ahliWaris.nenek ? 0 : 1"
                >
                  {{ ahliWaris.nenek ? 'Ada' : 'Tidak' }}
                </button>
              </div>
            </div>

            <!-- Saudara & Saudari Kandung -->
            <div class="grid sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl border border-forest-900/10 bg-canvas flex items-center justify-between">
                <div>
                  <p class="font-bold text-xs text-ink-900">Saudara Laki-Laki Kandung</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="kurang('saudara_kandung')">-</button>
                  <span class="w-6 text-center font-bold text-xs font-mono">{{ ahliWaris.saudara_kandung }}</span>
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="tambah('saudara_kandung')">+</button>
                </div>
              </div>
              <div class="p-3.5 rounded-xl border border-forest-900/10 bg-canvas flex items-center justify-between">
                <div>
                  <p class="font-bold text-xs text-ink-900">Saudari Perempuan Kandung</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="kurang('saudari_kandung')">-</button>
                  <span class="w-6 text-center font-bold text-xs font-mono">{{ ahliWaris.saudari_kandung }}</span>
                  <button type="button" class="w-8 h-8 rounded border bg-white grid place-items-center text-xs" @click="tambah('saudari_kandung')">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HASIL LIVE PERHITUNGAN (5 Kolom Sticky) -->
      <div class="lg:col-span-5 lg:sticky lg:top-24">
        <HasilPerhitungan :hasil="hasilKalkulasi" mode="full" />
      </div>
    </div>
  </div>
</template>
