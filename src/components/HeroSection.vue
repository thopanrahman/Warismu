<script setup>
import { RouterLink } from 'vue-router'

defineEmits(['buka-modal'])
</script>

<template>
  <section class="relative overflow-hidden bg-canvas py-12 sm:py-20 border-b border-forest-900/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <!-- Label Kecil -->
        <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
          Asisten Waris Islam
        </span>

        <!-- Headline Utama (Editorial Serif, Rata Kiri seperti Gambar 2) -->
        <h1 class="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-forest-950 mt-2 tracking-tight leading-[1.1]">
          Memahami Waris Islam dengan Tenang, Adil, dan Berdalil.
        </h1>

        <!-- Deskripsi Singkat -->
        <p class="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">
          Hitung pembagian waris keluarga secara presisi dengan kalkulator faraid atau ceritakan kondisi keluarga Anda melalui konsultasi AI berlandaskan Al-Qur'an dan Kompilasi Hukum Islam.
        </p>

        <!-- Dua CTA Utama (Rata Kiri) -->
        <div class="mt-8 flex flex-wrap items-center gap-3.5">
          <RouterLink
            to="/kalkulator"
            class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-forest-900 text-white font-bold text-sm hover:bg-forest-800 transition-colors shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/40"
          >
            <i class="fa-solid fa-calculator text-xs"></i>
            <span>Buka Kalkulator Faraid</span>
          </RouterLink>

          <RouterLink
            to="/chat"
            class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border border-forest-900/20 bg-white text-forest-950 font-bold text-sm hover:bg-forest-50 hover:border-forest-900/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
          >
            <i class="fa-solid fa-comments text-xs text-forest-700"></i>
            <span>Konsultasi AI</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
