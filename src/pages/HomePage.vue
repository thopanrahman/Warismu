<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import FeatureCard from '../components/FeatureCard.vue'
import HowItWorks from '../components/HowItWorks.vue'
import ArticleCard from '../components/ArticleCard.vue'
import InfoModal from '../components/InfoModal.vue'
import { daftarPanduan } from '../data/panduan.js'

// Fitur interaktif 3: modal "Apa itu Faraid?"
const modalTerbuka = ref(false)

const fitur = [
  { ikon: 'fa-solid fa-comments', judul: 'Simulasi Faraid', deskripsi: 'Ceritakan kondisi keluarga — sistem mengekstraksi data & menghitung porsi tiap ahli waris.' },
  { ikon: 'fa-solid fa-circle-question', judul: 'Penjelasan AI', deskripsi: 'Setiap hasil disertai penjelasan, dalil QS. An-Nisa, KHI, disclaimer & tombol Laporkan.' },
  { ikon: 'fa-solid fa-book-quran', judul: 'Belajar Hukum', deskripsi: 'Perpustakaan 8 artikel faraid: ashabul furudh, ashabah, hijab, aul & radd, hingga ikhtilaf.' },
]

// Komposisi asimetris (bukan 3 kartu sama besar): 5/4/3 kolom di layar besar.
const lebarFitur = ['sm:col-span-2 lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3']

const statistik = [
  { ikon: 'fa-solid fa-book-open', angka: '8+', label: 'Artikel Panduan' },
  { ikon: 'fa-solid fa-users', angka: '2', label: 'Mode Pengguna' },
  { ikon: 'fa-solid fa-book-quran', angka: '3', label: 'Ayat Rujukan Utama' },
  { ikon: 'fa-solid fa-mobile-screen', angka: '360–1920px', label: 'Rentang Responsif' },
]

const artikelUnggulan = daftarPanduan.slice(0, 3)
</script>

<template>
  <div>
    <HeroSection @buka-modal="modalTerbuka = true" />

    <!-- Statistik singkat -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="s in statistik"
          :key="s.label"
          class="group bg-cream rounded-lg border border-waris-900/10 p-6 text-center shadow-soft hover:-translate-y-1 transition-all duration-300"
        >
          <i :class="s.ikon" class="text-waris-900 text-2xl inline-block group-hover:scale-110 transition-all duration-300"></i>
          <p class="font-bold text-2xl mt-2 text-ink">{{ s.angka }}</p>
          <p class="text-xs text-ink/55 font-bold">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Fitur utama -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
          <i class="fa-solid fa-sparkles mr-2"></i>Fitur Utama
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold mt-4 text-ink">Kenapa Memilih WarisMu?</h2>
        <p class="text-ink/60 mt-4">Pendekatan conversational yang ramah untuk topik yang sensitif.</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-12 mt-12">
        <FeatureCard
          v-for="(f, i) in fitur"
          :key="f.judul"
          :ikon="f.ikon"
          :judul="f.judul"
          :deskripsi="f.deskripsi"
          :class="lebarFitur[i]"
        />
      </div>
    </section>

    <HowItWorks />

    <!-- Artikel unggulan -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div class="flex items-end justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
            <i class="fa-solid fa-fire mr-2"></i>Populer
          </span>
          <h2 class="text-4xl sm:text-5xl font-bold mt-4 text-ink">Mulai dari Sini</h2>
        </div>
        <RouterLink to="/panduan" class="shrink-0 h-12 inline-flex items-center gap-2 px-6 rounded-lg border border-waris-800 text-waris-800 text-sm font-extrabold hover:bg-waris-900/5 transition-all duration-300">
          Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
        </RouterLink>
      </div>
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        <ArticleCard v-for="a in artikelUnggulan" :key="a.id" :artikel="a" />
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="relative bg-waris-900 rounded-xl p-8 sm:p-14 text-center text-white overflow-hidden shadow-float">
        <i class="fa-solid fa-scale-balanced absolute -right-6 -bottom-8 text-9xl opacity-10"></i>
        <h2 class="relative text-4xl sm:text-5xl font-bold">Siap Memahami Hak Waris Keluargamu?</h2>
        <p class="relative text-waris-50/85 mt-4 max-w-xl mx-auto">
          Jelajahi panduan faraid atau hubungi kami — gratis, tanpa login, dan berbasis dalil.
        </p>
        <div class="relative mt-8 flex flex-wrap justify-center gap-3">
          <RouterLink to="/chat" class="h-12 inline-flex items-center gap-2 px-8 rounded-lg bg-white text-waris-900 font-extrabold hover:bg-waris-50 transition-all duration-300">
            <i class="fa-solid fa-comments"></i>Mulai Konsultasi
          </RouterLink>
          <RouterLink to="/panduan" class="h-12 inline-flex items-center gap-2 px-8 rounded-lg bg-white/15 border border-white/25 font-extrabold hover:bg-white/25 transition-all duration-300">
            <i class="fa-solid fa-book-open"></i>Buka Panduan
          </RouterLink>
        </div>
      </div>
    </section>

    <InfoModal :terbuka="modalTerbuka" @tutup="modalTerbuka = false" />
  </div>
</template>
