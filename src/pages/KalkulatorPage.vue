<script setup>
import { RouterLink } from 'vue-router'
import KalkulatorFaraid from '../components/KalkulatorFaraid.vue'
</script>

<template>
  <div class="w-full bg-canvas py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb & Header Editorial -->
      <div class="max-w-3xl mb-10">
        <div class="flex items-center gap-2 text-xs font-bold text-ink-500 mb-3">
          <RouterLink to="/" class="hover:text-forest-900 transition-colors">Beranda</RouterLink>
          <span class="text-ink-300">/</span>
          <span class="text-forest-900">Kalkulator Faraid</span>
        </div>

        <h1 class="font-display text-3xl sm:text-5xl font-bold text-forest-950 tracking-tight leading-[1.1]">
          Simulasi Waris Islam Presisi dan Terpercaya
        </h1>
        <p class="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">
          Hitung bagian masing-masing ahli waris secara transparan berdasarkan Al-Qur’an (QS. An-Nisa: 11, 12, 176)
          dan Kompilasi Hukum Islam (KHI). Ubah angka dan komposisi keluarga di bawah untuk melihat rincian seketika.
        </p>

        <!-- Banner switch ke Chat -->
        <div class="mt-5 inline-flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-50 border border-forest-900/10 text-xs text-ink-700">
          <i class="fa-solid fa-comments text-forest-700"></i>
          <span>Lebih nyaman menceritakan kondisi keluarga secara bebas?</span>
          <RouterLink to="/chat" class="font-bold text-forest-900 underline hover:text-forest-700">
            Bercerita di Chat AI &rarr;
          </RouterLink>
        </div>
      </div>

      <!-- Komponen Kalkulator Utama -->
      <KalkulatorFaraid />

      <!-- Panduan Singkat Kaidah Faraid -->
      <div class="mt-16 pt-12 border-t border-forest-900/10">
        <div class="max-w-2xl mb-8">
          <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
            Kaidah Syariat
          </span>
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
            Prinsip Penting Perhitungan Faraid
          </h2>
        </div>

        <div class="grid gap-6 sm:grid-cols-3">
          <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
            <span class="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 grid place-items-center font-bold text-sm mb-4">
              01
            </span>
            <h3 class="font-bold text-base text-ink-900 mb-2">Tuntaskan Hak Harta Dahulu</h3>
            <p class="text-xs text-ink-600 leading-relaxed">
              Sebelum harta waris dibagi kepada siapa pun, kewajiban hutang pewaris dan biaya pengurusan jenazah wajib dilunasi terlebih dahulu. Wasiat dilaksanakan setelahnya dengan batas maksimal sepertiga (1/3) harta bersih.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
            <span class="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 grid place-items-center font-bold text-sm mb-4">
              02
            </span>
            <h3 class="font-bold text-base text-ink-900 mb-2">Ashabul Furudh & Ashabah</h3>
            <p class="text-xs text-ink-600 leading-relaxed">
              Ashabul Furudh adalah ahli waris yang bagiannya sudah ditentukan pasti oleh Al-Qur'an (1/2, 1/4, 1/8, 2/3, 1/3, 1/6). Ashabah adalah penerima sisa harta setelah ashabul furudh menerima haknya (misalnya anak laki-laki).
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
            <span class="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 grid place-items-center font-bold text-sm mb-4">
              03
            </span>
            <h3 class="font-bold text-base text-ink-900 mb-2">Konsep Hijab (Penghalang)</h3>
            <p class="text-xs text-ink-600 leading-relaxed">
              Kerabat yang lebih dekat dapat menghalangi (mahjub) kerabat yang lebih jauh. Keberadaan anak laki-laki kandung, misalnya, menghalangi cucu dan saudara dari mendapatkan bagian waris.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
