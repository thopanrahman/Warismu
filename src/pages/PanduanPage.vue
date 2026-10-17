<script setup>
import { computed, ref } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'
import { daftarKategori, daftarPanduan } from '../data/panduan.js'

// Fitur interaktif 4: pencarian + filter kategori (computed property)
const kataKunci = ref('')
const kategoriAktif = ref('Semua')

const hasilFilter = computed(() => {
  const kunci = kataKunci.value.trim().toLowerCase()
  return daftarPanduan.filter((a) => {
    const cocokKategori = kategoriAktif.value === 'Semua' || a.kategori === kategoriAktif.value
    const cocokKunci =
      !kunci ||
      a.judul.toLowerCase().includes(kunci) ||
      a.ringkasan.toLowerCase().includes(kunci)
    return cocokKategori && cocokKunci
  })
})

function pilihKategori(k) {
  kategoriAktif.value = k
}
function resetFilter() {
  kataKunci.value = ''
  kategoriAktif.value = 'Semua'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    <div class="text-center max-w-2xl mx-auto">
      <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
        <i class="fa-solid fa-book-open mr-2"></i>Panduan Faraid
      </span>
      <h1 class="text-5xl sm:text-6xl font-bold mt-4 text-ink">Perpustakaan Ilmu Waris</h1>
      <p class="text-ink/60 mt-4">
        {{ daftarPanduan.length }} artikel edukasi — dari dasar hingga lanjutan. Cari topik yang kamu butuhkan.
      </p>
    </div>

    <!-- Search bar -->
    <div class="max-w-xl mx-auto mt-10">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-waris-800/50"></i>
        <input
          v-model="kataKunci"
          type="search"
          placeholder="Cari artikel… (cth: anak, suami, hutang)"
          class="w-full h-12 rounded-lg border border-waris-900/20 bg-white pl-12 pr-5 text-sm outline-none shadow-soft focus-visible:ring-2 focus-visible:ring-waris-900/30 transition-all duration-300"
        />
      </div>
    </div>

    <!-- Filter kategori -->
    <div class="flex flex-wrap justify-center gap-2 mt-6">
      <button
        v-for="k in daftarKategori"
        :key="k"
        class="h-10 px-5 rounded-full text-xs font-extrabold transition-all duration-300"
        :class="
          kategoriAktif === k
            ? 'bg-waris-900 text-white shadow-soft'
            : 'bg-cream border border-waris-900/15 text-ink/65 hover:border-waris-800 hover:text-waris-900'
        "
        @click="pilihKategori(k)"
      >
        {{ k }}
      </button>
    </div>

    <p class="text-center text-xs text-ink/55 font-bold mt-6">
      Menampilkan <strong class="text-waris-900">{{ hasilFilter.length }}</strong> dari
      {{ daftarPanduan.length }} artikel
    </p>

    <!-- Grid artikel (CSS Grid Tailwind — TANPA table) -->
    <div v-if="hasilFilter.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      <ArticleCard v-for="a in hasilFilter" :key="a.id" :artikel="a" />
    </div>
    <div v-else class="text-center bg-cream border border-waris-800/25 rounded-xl py-16 mt-8">
      <i class="fa-solid fa-folder-open text-4xl text-waris-800/30"></i>
      <p class="font-bold text-xl mt-4 text-ink">Tidak ada artikel yang cocok</p>
      <p class="text-sm text-ink/55 mt-2">Coba kata kunci atau kategori lain.</p>
      <button
        class="mt-6 h-12 px-8 rounded-lg bg-waris-900 text-white text-sm font-extrabold shadow-soft hover:bg-waris-800 transition-all duration-300"
        @click="resetFilter"
      >
        <i class="fa-solid fa-rotate-left mr-2"></i>Reset Filter
      </button>
    </div>
  </div>
</template>
