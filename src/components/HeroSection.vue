<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { formatRupiah } from '../lib/faraidhCalculator.js'

defineEmits(['buka-modal'])

// Mini preview interaktif langsung di hero
const skenarioHero = ref('keluarga') // 'keluarga' | 'putri'
const hartaHero = 200000000

const dataPreview = computed(() => {
  if (skenarioHero.value === 'keluarga') {
    return {
      kasus: 'Ayah wafat: 1 Istri, 2 Anak Laki-laki, 1 Anak Perempuan',
      rincian: [
        { label: 'Istri', porsi: '1/8', nominal: hartaHero * 0.125, warna: '#1d3e32' },
        { label: '2 Anak Laki-laki', porsi: 'Ashabah (2/5 sisa)', nominal: (hartaHero * 0.875) * 0.8, warna: '#2f614e' },
        { label: '1 Anak Perempuan', porsi: 'Ashabah (1/5 sisa)', nominal: (hartaHero * 0.875) * 0.2, warna: '#4f9578' },
      ],
    }
  }
  return {
    kasus: 'Ibu wafat: 1 Suami, 1 Anak Perempuan Tunggal',
    rincian: [
      { label: 'Suami', porsi: '1/4', nominal: hartaHero * 0.25, warna: '#1d3e32' },
      { label: 'Anak Perempuan', porsi: '1/2', nominal: hartaHero * 0.5, warna: '#2f614e' },
      { label: 'Baitul Mal / Asal Masalah', porsi: 'Sisa (1/4)', nominal: hartaHero * 0.25, warna: '#72b095' },
    ],
  }
})
</script>

<template>
  <section class="relative overflow-hidden bg-canvas pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-forest-900/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- Kolom Kiri: Narrative & Value Proposition (7 Kolom) -->
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-900/15 text-xs font-bold text-forest-900">
            <span class="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
            <span>Platform Faraid & Konsultasi Syariat</span>
          </div>

          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.08]">
            Memahami Waris Islam dengan Tenang, Adil, dan Berdalil.
          </h1>

          <p class="text-base sm:text-lg text-ink-700 leading-relaxed max-w-2xl">
            WarisMu menghadirkan cara yang beradab dan transparan untuk menghitung hak kewarisan keluarga.
            Kombinasi kalkulator faraid presisi dan konsultasi percakapan AI yang berakar pada ketentuan Al-Qur'an dan Kompilasi Hukum Islam.
          </p>

          <!-- Dual Call to Actions -->
          <div class="pt-2 flex flex-wrap items-center gap-3">
            <RouterLink
              to="/kalkulator"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-forest-900 text-white font-bold text-sm hover:bg-forest-800 transition-all shadow-card hover:shadow-card-hover active:scale-95"
            >
              <i class="fa-solid fa-calculator"></i>
              <span>Buka Kalkulator Faraid</span>
            </RouterLink>

            <RouterLink
              to="/chat"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-forest-900/20 bg-white text-forest-950 font-bold text-sm hover:bg-forest-50 hover:border-forest-900/30 transition-all active:scale-95"
            >
              <i class="fa-solid fa-comments text-forest-700"></i>
              <span>Konsultasi Lewat Cerita</span>
            </RouterLink>
          </div>

          <!-- Asuransi Kualitas / Kepastian -->
          <div class="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-ink-600">
            <span class="inline-flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved text-forest-700"></i>
              Tanpa Registrasi untuk Simulasi
            </span>
            <span class="inline-flex items-center gap-1.5">
              <i class="fa-solid fa-book-quran text-forest-700"></i>
              Disertai Rujukan QS. An-Nisa & KHI
            </span>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-forest-800 hover:text-forest-950 underline underline-offset-2 transition-colors"
              @click="$emit('buka-modal')"
            >
              <i class="fa-solid fa-circle-question"></i>
              Apa itu Faraid?
            </button>
          </div>
        </div>

        <!-- Kolom Kanan: Live Interactive Mini-Preview (5 Kolom) -->
        <div class="lg:col-span-5">
          <div class="relative bg-white rounded-3xl border border-forest-900/10 p-6 sm:p-7 shadow-float">
            <!-- Header Mini Preview -->
            <div class="flex items-center justify-between pb-4 border-b border-forest-900/10">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-forest-600"></span>
                <span class="text-xs font-extrabold uppercase tracking-wider text-forest-900">
                  Simulasi Cepat Langsung
                </span>
              </div>
              <div class="flex rounded-lg bg-forest-50 p-1 border border-forest-900/10 text-xs">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded font-bold transition-all"
                  :class="skenarioHero === 'keluarga' ? 'bg-white shadow-subtle text-forest-900' : 'text-ink-500'"
                  @click="skenarioHero = 'keluarga'"
                >
                  Kasus 1
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded font-bold transition-all"
                  :class="skenarioHero === 'putri' ? 'bg-white shadow-subtle text-forest-900' : 'text-ink-500'"
                  @click="skenarioHero = 'putri'"
                >
                  Kasus 2
                </button>
              </div>
            </div>

            <!-- Kasus context -->
            <div class="mt-4">
              <p class="text-xs text-ink-500 font-medium">Contoh Skenario:</p>
              <p class="font-bold text-sm text-ink-900 mt-0.5">{{ dataPreview.kasus }}</p>
              <p class="text-xs text-forest-800 font-mono mt-1">
                Tirkah Bersih: <strong>{{ formatRupiah(hartaHero) }}</strong>
              </p>
            </div>

            <!-- Visual Bar -->
            <div class="mt-4">
              <div class="h-3 w-full rounded-md overflow-hidden flex bg-forest-100/60 p-0.5 border border-forest-900/10">
                <div
                  v-for="item in dataPreview.rincian"
                  :key="item.label"
                  class="h-full first:rounded-l last:rounded-r transition-all duration-300"
                  :style="{
                    width: `${(item.nominal / hartaHero) * 100}%`,
                    backgroundColor: item.warna,
                  }"
                ></div>
              </div>
            </div>

            <!-- List pembagian -->
            <div class="mt-4 space-y-2.5 text-xs">
              <div
                v-for="item in dataPreview.rincian"
                :key="item.label"
                class="flex items-center justify-between p-2.5 rounded-xl bg-forest-50/60 border border-forest-900/10"
              >
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ backgroundColor: item.warna }"></span>
                  <span class="font-bold text-ink-900">{{ item.label }}</span>
                  <span class="text-[11px] text-ink-500 font-mono">({{ item.porsi }})</span>
                </div>
                <span class="font-bold text-forest-900 font-mono">
                  {{ formatRupiah(item.nominal) }}
                </span>
              </div>
            </div>

            <!-- Call to action inside preview -->
            <div class="mt-5 pt-4 border-t border-forest-900/10 flex items-center justify-between">
              <span class="text-[11px] text-ink-500">Ingin hitung nominal keluargamu?</span>
              <RouterLink
                to="/kalkulator"
                class="text-xs font-bold text-forest-900 hover:text-forest-700 inline-flex items-center gap-1"
              >
                Coba Sekarang <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
