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
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
    <div class="text-center max-w-2xl mx-auto">
      <span class="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">
        <i class="fa-solid fa-book-open mr-1.5"></i>Panduan Faraid
      </span>
      <h1 class="text-3xl sm:text-4xl font-extrabold mt-2">Perpustakaan Ilmu Waris</h1>
      <p class="text-sm text-slate-500 mt-2">
        {{ daftarPanduan.length }} artikel edukasi — dari dasar hingga lanjutan. Cari topik yang kamu butuhkan.
      </p>
    </div>

    <!-- Search bar -->
    <div class="max-w-xl mx-auto mt-8 relative">
      <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
      <input
        v-model="kataKunci"
        type="search"
        placeholder="Cari artikel… (cth: anak, suami, hutang)"
        class="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
      />
    </div>

    <!-- Filter kategori -->
    <div class="flex flex-wrap justify-center gap-2 mt-4">
      <button
        v-for="k in daftarKategori"
        :key="k"
        class="px-4 py-2 rounded-full text-xs font-bold transition"
        :class="
          kategoriAktif === k
            ? 'bg-emerald-600 text-white shadow'
            : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700'
        "
        @click="pilihKategori(k)"
      >
        {{ k }}
      </button>
    </div>

    <p class="text-center text-xs text-slate-400 mt-4">
      Menampilkan <strong class="text-slate-600">{{ hasilFilter.length }}</strong> dari
      {{ daftarPanduan.length }} artikel
    </p>

    <!-- Grid artikel (flex/grid Tailwind — TANPA table) -->
    <div v-if="hasilFilter.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      <ArticleCard v-for="a in hasilFilter" :key="a.id" :artikel="a" />
    </div>
    <div v-else class="text-center bg-white border border-dashed border-slate-300 rounded-3xl py-14 mt-6">
      <i class="fa-solid fa-folder-open text-4xl text-slate-300"></i>
      <p class="font-bold mt-3">Tidak ada artikel yang cocok</p>
      <p class="text-sm text-slate-500 mt-1">Coba kata kunci atau kategori lain.</p>
      <button
        class="mt-4 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition"
        @click="resetFilter"
      >
        <i class="fa-solid fa-rotate-left mr-1.5"></i>Reset Filter
      </button>
    </div>
  </div>
</template>
