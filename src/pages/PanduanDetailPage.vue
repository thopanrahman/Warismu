<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { daftarPanduan, penulisPanduan } from '../data/panduan.js'

const route = useRoute()

const item = computed(() => daftarPanduan.find((artikel) => artikel.id === Number(route.params.id)))

// Judul tab mengikuti artikel yang sedang dibaca.
watchEffect(() => {
  if (item.value && typeof document !== 'undefined') {
    document.title = `${item.value.judul} — WarisMu`
  }
})
</script>

<template>
  <div v-if="item" class="w-full bg-paper">
    <!-- Hero image artikel -->
    <div class="relative w-full h-[400px]">
      <img
        :src="item.gambarCover"
        :alt="item.judul"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-waris-950/35"></div>

      <RouterLink
        to="/panduan"
        class="absolute top-6 left-4 sm:left-6 inline-flex items-center gap-2 bg-paper/95 text-ink text-sm font-bold px-4 py-2 rounded-full hover:bg-cream transition-colors duration-300"
      >
        <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
        Pustaka
      </RouterLink>

      <span
        class="absolute bottom-6 left-4 sm:left-6 bg-waris-900 text-white text-xs font-bold px-3 py-1 rounded-full"
      >
        {{ item.kategori }}
      </span>
    </div>

    <!-- Isi artikel -->
    <div class="max-w-3xl mx-auto px-4 py-10">
      <h1 class="font-display text-4xl font-bold text-ink mb-4 leading-tight">
        {{ item.judul }}
      </h1>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-8">
        <span class="inline-flex items-center gap-2">
          <i class="fa-regular fa-user" aria-hidden="true"></i>{{ item.penulis }}
        </span>
        <span class="inline-flex items-center gap-2">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i>{{ item.tanggal }}
        </span>
        <span class="inline-flex items-center gap-2">
          <i class="fa-regular fa-clock" aria-hidden="true"></i>{{ item.estimasi }}
        </span>
      </div>

      <p class="mb-8 text-ink/80 leading-relaxed italic border-l-4 border-waris-900 pl-4">
        {{ item.ringkasan }}
      </p>

      <p v-for="(paragraf, i) in item.isi" :key="i" class="mb-6 text-ink leading-relaxed">
        {{ paragraf }}
      </p>

      <!-- Kotak dalil Arab, hanya tampil bila artikel memilikinya -->
      <div
        v-if="item.arab"
        class="bg-waris-50 p-6 rounded-xl border border-waris-900/20 text-right mb-8"
      >
        <p class="text-3xl leading-loose text-ink" dir="rtl" lang="ar">{{ item.arab.teks }}</p>
        <p class="text-sm text-ink/70 italic mt-4 text-left">{{ item.arab.terjemahan }}</p>
      </div>

      <!-- Poin penting -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 class="font-display text-xl font-bold text-ink mb-4">Poin Penting</h2>
        <ul class="space-y-3">
          <li v-for="poin in item.poin" :key="poin" class="flex gap-3 text-sm text-ink/80">
            <i class="fa-solid fa-circle-check text-waris-900 mt-0.5 shrink-0" aria-hidden="true"></i>
            <span>{{ poin }}</span>
          </li>
        </ul>
      </div>

      <p class="text-xs text-gray-500 leading-relaxed">
        <strong class="text-ink">Sumber:</strong> {{ item.sumber }}
      </p>

      <!-- Kotak penulis -->
      <div class="bg-cream rounded-2xl p-8 border border-gray-200 mt-16">
        <p class="text-xs font-extrabold tracking-widest text-waris-900">TENTANG PENULIS</p>
        <h2 class="font-display text-2xl font-bold text-ink mt-2">{{ penulisPanduan.nama }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ penulisPanduan.jabatan }}</p>
        <p class="text-gray-600 text-sm mt-3 leading-relaxed">{{ penulisPanduan.deskripsi }}</p>

        <RouterLink
          to="/panduan"
          class="inline-flex items-center gap-2 bg-waris-900 text-white rounded-full px-6 py-2 font-bold text-sm mt-6 hover:bg-waris-800 transition-colors duration-300"
        >
          <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
          Kembali ke Pustaka
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Artikel tidak ditemukan -->
  <div v-else class="w-full bg-paper">
    <div class="max-w-3xl mx-auto px-4 py-24 text-center">
      <i class="fa-solid fa-file-circle-question text-4xl text-waris-900/30" aria-hidden="true"></i>
      <h1 class="font-display text-2xl font-bold text-ink mt-4">Artikel tidak ditemukan</h1>
      <p class="text-gray-600 mt-2">
        Artikel yang Anda cari mungkin sudah dipindahkan atau tautannya tidak lengkap.
      </p>
      <RouterLink
        to="/panduan"
        class="inline-flex items-center gap-2 bg-waris-900 text-white rounded-full px-6 py-2 font-bold text-sm mt-6 hover:bg-waris-800 transition-colors duration-300"
      >
        <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
        Kembali ke Pustaka
      </RouterLink>
    </div>
  </div>
</template>
