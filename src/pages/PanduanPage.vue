<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { daftarPanduan } from '../data/panduan.js'
import ArticleCard from '../components/ArticleCard.vue'

const kategoriAktif = ref('Semua')

const kategoriList = computed(() => {
  const unik = ['Semua', ...new Set(daftarPanduan.map((a) => a.kategori))]
  return unik
})

const artikelTersaring = computed(() => {
  if (kategoriAktif.value === 'Semua') return daftarPanduan
  return daftarPanduan.filter((a) => a.kategori === kategoriAktif.value)
})

const artikelUtama = computed(() => artikelTersaring.value[0] || null)
const artikelSisa = computed(() => artikelTersaring.value.slice(1))
</script>

<template>
  <div class="w-full bg-canvas py-10 sm:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Editorial Pustaka Faraid -->
      <div class="max-w-3xl mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
          Pusat Literasi & Edukasi
        </span>
        <h1 class="font-display text-3xl sm:text-5xl font-bold text-forest-950 mt-2 tracking-tight leading-[1.1]">
          Pustaka Faraid: Memahami Kaidah & Dalil Waris Islam
        </h1>
        <p class="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">
          Kumpulan panduan komprehensif yang disarikan dari kitab rujukan fikih faraid dan Kompilasi Hukum Islam.
          Disajikan dengan bahasa yang lugas agar setiap keluarga dapat membagi warisan dengan adil dan damai.
        </p>

        <!-- Kategori Filter Tabs -->
        <div class="mt-8 flex flex-wrap gap-2">
          <button
            v-for="k in kategoriList"
            :key="k"
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            :class="
              kategoriAktif === k
                ? 'bg-forest-900 text-white shadow-subtle'
                : 'bg-white border border-forest-900/15 text-ink-700 hover:bg-forest-50'
            "
            @click="kategoriAktif = k"
          >
            {{ k }}
          </button>
        </div>
      </div>

      <!-- Lead Article Feature (Bila ada) -->
      <div v-if="artikelUtama && kategoriAktif === 'Semua'" class="mb-14">
        <div class="group bg-white rounded-3xl border border-forest-900/10 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 grid md:grid-cols-12 items-center">
          <div class="md:col-span-6 relative aspect-[16/11] md:aspect-auto md:h-full bg-forest-100 overflow-hidden">
            <img
              :src="artikelUtama.gambarCover"
              :alt="artikelUtama.judul"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span class="absolute top-4 left-4 text-xs font-extrabold uppercase tracking-wider bg-forest-900/90 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full">
              Artikel Pilihan • {{ artikelUtama.kategori }}
            </span>
          </div>
          <div class="md:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 text-xs text-ink-500 font-medium mb-3">
                <span>{{ artikelUtama.tanggal }}</span>
                <span>•</span>
                <span>{{ artikelUtama.estimasi }}</span>
                <span>•</span>
                <span>{{ artikelUtama.penulis }}</span>
              </div>
              <h2 class="font-display font-bold text-2xl sm:text-3xl text-forest-950 group-hover:text-forest-800 transition-colors leading-tight mb-4">
                {{ artikelUtama.judul }}
              </h2>
              <p class="text-ink-600 text-sm leading-relaxed mb-6">
                {{ artikelUtama.ringkasan }}
              </p>
            </div>
            <div>
              <RouterLink
                :to="`/panduan/${artikelUtama.id}`"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition-all shadow-subtle active:scale-95"
              >
                <span>Baca Panduan Lengkap</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid Artikel Pendamping -->
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="a in (kategoriAktif === 'Semua' ? artikelSisa : artikelTersaring)"
          :key="a.id"
          :artikel="a"
        />
      </div>
    </div>
  </div>
</template>
