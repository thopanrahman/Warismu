<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ArticleCard from '../components/ArticleCard.vue'
import { daftarPanduan } from '../data/panduan.js'

// Dynamic route /panduan/:id
const route = useRoute()
const router = useRouter()

const artikel = computed(() => daftarPanduan.find((a) => a.id === Number(route.params.id)))

const artikelLain = computed(() =>
  daftarPanduan.filter((a) => a.id !== Number(route.params.id)).slice(0, 3),
)

function kembali() {
  router.back()
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-14">
    <button
      class="inline-flex items-center gap-2 h-12 px-6 rounded-full border-2 border-waris-800 text-waris-800 text-sm font-extrabold hover:bg-waris-900/5 hover:scale-105 active:scale-95 transition-all duration-300 mb-6"
      @click="kembali"
    >
      <i class="fa-solid fa-arrow-left"></i> Kembali
    </button>

    <article v-if="artikel" class="bg-cream rounded-[2rem] border border-waris-900/10 shadow-soft overflow-hidden">
      <div class="overflow-hidden">
        <img :src="artikel.gambar" :alt="artikel.judul" class="w-full h-60 sm:h-80 object-cover hover:scale-105 transition-all duration-700" />
      </div>
      <div class="p-6 sm:p-10">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-[11px] font-extrabold bg-waris-900 text-white px-4 py-1.5 rounded-full">
            {{ artikel.kategori }}
          </span>
          <span class="text-xs text-ink/45 font-bold">
            <i class="fa-regular fa-calendar mr-1"></i>{{ artikel.tanggal }}
            <span class="mx-1">•</span>
            <i class="fa-regular fa-clock mr-1"></i>{{ artikel.estimasi }}
          </span>
        </div>
        <h1 class="font-display text-4xl sm:text-5xl font-bold mt-4 leading-[1.1] text-ink">{{ artikel.judul }}</h1>
        <p class="text-ink/60 mt-4 leading-relaxed border-l-4 border-waris-800 pl-4 italic">
          {{ artikel.ringkasan }}
        </p>

        <div class="mt-6 space-y-4">
          <p v-for="(p, i) in artikel.isi" :key="i" class="text-sm sm:text-[15px] text-ink/70 leading-relaxed">
            {{ p }}
          </p>
        </div>

        <div class="mt-8 bg-waris-50 border border-waris-900/10 rounded-[2rem] p-6">
          <h2 class="font-display font-bold text-xl text-waris-950">
            <i class="fa-solid fa-list-checks mr-2"></i>Poin Penting
          </h2>
          <ul class="mt-3 space-y-2 text-sm text-ink/75">
            <li v-for="poin in artikel.poin" :key="poin" class="flex gap-2.5">
              <i class="fa-solid fa-circle-check text-waris-900 mt-0.5 shrink-0"></i>
              <span>{{ poin }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-ink/55 bg-white/60 rounded-[1.5rem] p-4 border border-waris-900/10">
          <span class="font-extrabold shrink-0"><i class="fa-solid fa-book mr-1.5 text-waris-900"></i>Sumber &amp; Dalil:</span>
          <span>{{ artikel.sumber }}</span>
        </div>

        <div class="mt-5 bg-waris-100/60 border border-waris-800/20 rounded-[1.5rem] p-4 text-xs text-ink/70 leading-relaxed">
          <i class="fa-solid fa-triangle-exclamation mr-1.5 text-waris-800"></i>
          <strong>Disclaimer:</strong> Artikel ini untuk edukasi dan bukan fatwa/putusan hukum.
          Konsultasikan kasus nyata kepada ahli faraid, ulama, atau Pengadilan Agama.
        </div>
      </div>
    </article>

    <div v-else class="text-center bg-cream border-2 border-dashed border-waris-800/25 rounded-[2rem] py-16">
      <i class="fa-solid fa-file-circle-question text-4xl text-waris-800/30"></i>
      <p class="font-display font-bold text-xl mt-3 text-ink">Artikel tidak ditemukan</p>
      <RouterLink to="/panduan" class="inline-block mt-4 h-12 px-8 rounded-full bg-waris-900 text-white text-sm font-extrabold leading-[3rem] hover:scale-105 transition-all duration-300">
        Kembali ke Daftar Panduan
      </RouterLink>
    </div>

    <section v-if="artikel" class="mt-14">
      <h2 class="font-display font-bold text-3xl text-ink">Baca Juga</h2>
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        <ArticleCard v-for="a in artikelLain" :key="a.id" :artikel="a" />
      </div>
    </section>
  </div>
</template>
