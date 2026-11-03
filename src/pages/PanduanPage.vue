<script setup>
import { RouterLink } from 'vue-router'
import { daftarPanduan } from '../data/panduan.js'
</script>

<template>
  <div class="w-full">
    <!-- Hero: identitas Pustaka Faraid -->
    <section class="w-full bg-waris-900 py-16 md:py-24 px-4 text-center">
      <h1 class="font-display text-4xl md:text-5xl font-bold text-white mb-4">
        Pustaka Faraid: Memahami Hukum Waris Islam
      </h1>
      <p class="font-sans text-lg md:text-xl text-waris-50 max-w-3xl mx-auto">
        Telusuri kaidah, dalil, dan tata cara pembagian harta warisan sesuai syariat Islam.
        Disarikan dari rujukan kitab Fikih Faraidh untuk memudahkan Anda memahami dasar-dasar
        ilmu waris.
      </p>
    </section>

    <!-- Daftar artikel: grid kartu bergambar, tanpa tabel -->
    <section class="bg-paper">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="item in daftarPanduan"
            :key="item.id"
            :to="'/panduan/' + item.id"
            class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div class="relative">
              <img
                :src="item.gambarCover"
                :alt="item.judul"
                class="w-full h-48 object-cover"
                loading="lazy"
              />
              <span
                class="absolute top-4 left-4 bg-waris-900 text-white text-xs font-bold px-3 py-1 rounded-full"
              >
                {{ item.kategori }}
              </span>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-500 mt-4 px-6">
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-regular fa-calendar" aria-hidden="true"></i>{{ item.tanggal }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>{{ item.estimasi }}
              </span>
            </div>

            <h2 class="font-display text-xl font-bold text-ink mt-2 px-6 line-clamp-2">
              {{ item.judul }}
            </h2>

            <p class="text-sm text-gray-600 mt-2 px-6 line-clamp-3">
              {{ item.ringkasan }}
            </p>

            <div class="px-6 pb-6 mt-auto pt-4">
              <span class="text-waris-900 font-bold flex items-center gap-2 text-sm">
                Baca Selengkapnya
                <i
                  class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden="true"
                ></i>
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
