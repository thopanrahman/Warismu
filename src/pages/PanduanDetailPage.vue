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
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <button
      class="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-500 mb-6"
      @click="kembali"
    >
      <i class="fa-solid fa-arrow-left"></i> Kembali
    </button>

    <article v-if="artikel" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <img :src="artikel.gambar" :alt="artikel.judul" class="w-full h-60 sm:h-80 object-cover" />
      <div class="p-6 sm:p-10">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-[11px] font-extrabold bg-emerald-600 text-white px-3 py-1 rounded-full">
            {{ artikel.kategori }}
          </span>
          <span class="text-xs text-slate-400 font-semibold">
            <i class="fa-regular fa-calendar mr-1"></i>{{ artikel.tanggal }}
            <span class="mx-1">•</span>
            <i class="fa-regular fa-clock mr-1"></i>{{ artikel.estimasi }}
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold mt-3 leading-tight">{{ artikel.judul }}</h1>
        <p class="text-slate-500 mt-3 leading-relaxed border-l-4 border-emerald-500 pl-4 italic">
          {{ artikel.ringkasan }}
        </p>

        <div class="mt-6 space-y-4">
          <p v-for="(p, i) in artikel.isi" :key="i" class="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
            {{ p }}
          </p>
        </div>

        <div class="mt-8 bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6">
          <h2 class="font-extrabold text-emerald-800">
            <i class="fa-solid fa-list-checks mr-2"></i>Poin Penting
          </h2>
          <ul class="mt-3 space-y-2 text-sm text-emerald-950/80">
            <li v-for="poin in artikel.poin" :key="poin" class="flex gap-2.5">
              <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5 shrink-0"></i>
              <span>{{ poin }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-2xl p-4">
          <span class="font-bold shrink-0"><i class="fa-solid fa-book mr-1.5"></i>Sumber &amp; Dalil:</span>
          <span>{{ artikel.sumber }}</span>
        </div>

        <div class="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
          <i class="fa-solid fa-triangle-exclamation mr-1.5"></i>
          <strong>Disclaimer:</strong> Artikel ini untuk edukasi dan bukan fatwa/putusan hukum.
          Konsultasikan kasus nyata kepada ahli faraid, ulama, atau Pengadilan Agama.
        </div>
      </div>
    </article>

    <div v-else class="text-center bg-white border border-dashed border-slate-300 rounded-3xl py-16">
      <i class="fa-solid fa-file-circle-question text-4xl text-slate-300"></i>
      <p class="font-bold mt-3">Artikel tidak ditemukan</p>
      <RouterLink to="/panduan" class="inline-block mt-4 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold">
        Kembali ke Daftar Panduan
      </RouterLink>
    </div>

    <section v-if="artikel" class="mt-12">
      <h2 class="font-extrabold text-xl">Baca Juga</h2>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        <ArticleCard v-for="a in artikelLain" :key="a.id" :artikel="a" />
      </div>
    </section>
  </div>
</template>
