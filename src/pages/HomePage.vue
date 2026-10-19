<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import FeatureCard from '../components/FeatureCard.vue'
import HowItWorks from '../components/HowItWorks.vue'
import ArticleCard from '../components/ArticleCard.vue'
import InfoModal from '../components/InfoModal.vue'
import { daftarPanduan } from '../data/panduan.js'

// Fitur interaktif #1: modal "Apa itu Faraid?" (dipicu dari hero)
const modalTerbuka = ref(false)

const fitur = [
  {
    ikon: 'fa-solid fa-calculator',
    judul: 'Simulasi Faraid',
    deskripsi:
      'Mengekstraksi informasi keluarga dari ceritamu, lalu menghitung bagian setiap ahli waris sesuai ketentuan faraid.',
  },
  {
    ikon: 'fa-solid fa-scale-balanced',
    judul: 'Penjelasan AI',
    deskripsi:
      'Setiap hasil disertai penjelasan beserta dalil: QS. An-Nisa, Kompilasi Hukum Islam (KHI), dan sumber hukum lainnya.',
  },
  {
    ikon: 'fa-solid fa-book-quran',
    judul: 'Belajar Hukum Faraidh',
    deskripsi:
      'Artikel tentang ashabul furudh, ashabah, hijab, aul, radd, hingga ikhtilaf ulama — ditulis dengan bahasa sederhana.',
  },
]

const artikelUnggulan = daftarPanduan.slice(0, 3)
</script>

<template>
  <div>
    <HeroSection @buka-modal="modalTerbuka = true" />

    <!-- Fitur utama: tiga kartu putih berjajar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
          <i class="fa-solid fa-sparkles mr-2"></i>Fitur Utama
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mt-4 text-ink">Kenapa Memilih WarisMu?</h2>
        <p class="text-ink/60 mt-4">
          Pendekatan bercerita yang ramah untuk topik yang sensitif tanpa istilah rumit.
        </p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
        <FeatureCard
          v-for="f in fitur"
          :key="f.judul"
          :ikon="f.ikon"
          :judul="f.judul"
          :deskripsi="f.deskripsi"
        />
      </div>
    </section>

    <HowItWorks />

    <!-- Artikel populer: latar hijau muda -->
    <section class="bg-waris-50 border-y border-waris-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
              <i class="fa-solid fa-fire mr-2"></i>Populer
            </span>
            <h2 class="text-4xl sm:text-5xl font-bold mt-4 text-ink">Mulai dari Sini</h2>
          </div>
          <RouterLink
            to="/panduan"
            class="shrink-0 h-12 inline-flex items-center gap-2 px-6 rounded-full border border-waris-800 bg-white/70 text-waris-800 text-sm font-extrabold hover:bg-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-waris-900/20"
          >
            Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
          </RouterLink>
        </div>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          <ArticleCard v-for="a in artikelUnggulan" :key="a.id" :artikel="a" />
        </div>
      </div>
    </section>

    <!-- Ajakan bertindak -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div
        class="relative bg-waris-900 rounded-3xl p-8 sm:p-14 text-center text-white overflow-hidden shadow-float"
      >
        <i class="fa-solid fa-scale-balanced absolute -right-6 -bottom-8 text-9xl opacity-10"></i>
        <h2 class="relative text-4xl sm:text-5xl font-bold">Siap Memahami Hak Waris Keluargamu?</h2>
        <p class="relative text-waris-50/85 mt-4 max-w-xl mx-auto">
          Layanan ini gratis, tanpa login, dan setiap penjelasan disertai dalil. Mulai dari
          bercerita, atau baca panduan faraid lebih dulu.
        </p>
        <div class="relative mt-8 flex flex-wrap justify-center gap-3">
          <RouterLink
            to="/chat"
            class="h-12 inline-flex items-center gap-2 px-8 rounded-full bg-white text-waris-900 font-extrabold hover:bg-waris-50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <i class="fa-solid fa-comments"></i>Mulai Konsultasi
          </RouterLink>
          <RouterLink
            to="/panduan"
            class="h-12 inline-flex items-center gap-2 px-8 rounded-full bg-white/15 border border-white/25 font-extrabold hover:bg-white/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            <i class="fa-solid fa-book-open"></i>Buka Panduan
          </RouterLink>
        </div>
      </div>
    </section>

    <InfoModal :terbuka="modalTerbuka" @tutup="modalTerbuka = false" />
  </div>
</template>
