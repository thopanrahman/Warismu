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

// warna ikon kartu fitur dipetakan ke tint hijau waris + aksen senada
const fitur = [
  { ikon: 'fa-solid fa-comments', judul: 'Simulasi Faraid', deskripsi: 'Ceritakan kondisi keluarga — sistem mengekstraksi data & menghitung porsi tiap ahli waris.', tint: 'bg-waris-900', indeks: 0 },
  { ikon: 'fa-solid fa-circle-question', judul: 'Penjelasan AI', deskripsi: 'Setiap hasil disertai penjelasan, dalil QS. An-Nisa, KHI, disclaimer & tombol Laporkan.', tint: 'bg-waris-800', indeks: 1 },
  { ikon: 'fa-solid fa-book-quran', judul: 'Belajar Hukum', deskripsi: 'Perpustakaan 8 artikel faraid: ashabul furudh, ashabah, hijab, aul & radd, hingga ikhtilaf.', tint: 'bg-waris-700', indeks: 2 },
]

const artikelUnggulan = daftarPanduan.slice(0, 3)
</script>

<template>
  <div>
    <HeroSection @buka-modal="modalTerbuka = true" />

    <!-- Statistik singkat -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="s in [
          { ikon: 'fa-solid fa-book-open', angka: '8+', label: 'Artikel Panduan' },
          { ikon: 'fa-solid fa-users', angka: '2', label: 'Mode Pengguna' },
          { ikon: 'fa-solid fa-book-quran', angka: '3', label: 'Ayat Rujukan Utama' },
          { ikon: 'fa-solid fa-mobile-screen', angka: '360–1920px', label: 'Rentang Responsif' },
        ]" :key="s.label" class="group bg-cream rounded-[2rem] border border-waris-900/10 p-6 text-center shadow-soft hover:-translate-y-1 transition-all duration-300">
          <i :class="s.ikon" class="text-waris-900 text-2xl group-hover:scale-110 transition-all duration-300 inline-block"></i>
          <p class="font-display font-bold text-2xl mt-2 text-ink">{{ s.angka }}</p>
          <p class="text-xs text-ink/55 font-bold">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Fitur utama -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div class="blob-c absolute top-10 left-0 w-72 h-72 bg-waris-100/60 blur-3xl pointer-events-none"></div>
      <div class="relative text-center max-w-2xl mx-auto">
        <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
          <i class="fa-solid fa-sparkles mr-1.5"></i>Fitur Utama
        </span>
        <h2 class="font-display text-4xl sm:text-5xl font-bold mt-3 text-ink">Kenapa Memilih WarisMu?</h2>
        <p class="text-ink/60 mt-3">Pendekatan conversational yang ramah untuk topik yang sensitif.</p>
      </div>
      <div class="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
        <FeatureCard
          v-for="f in fitur"
          :key="f.judul"
          :ikon="f.ikon"
          :judul="f.judul"
          :deskripsi="f.deskripsi"
          :indeks="f.indeks"
        />
      </div>
    </section>

    <HowItWorks />

    <!-- Artikel unggulan -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div class="flex items-end justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
            <i class="fa-solid fa-fire mr-1.5"></i>Populer
          </span>
          <h2 class="font-display text-4xl sm:text-5xl font-bold mt-3 text-ink">Mulai dari Sini</h2>
        </div>
        <RouterLink to="/panduan" class="shrink-0 h-12 inline-flex items-center gap-2 px-6 rounded-full border-2 border-waris-800 text-waris-800 text-sm font-extrabold hover:bg-waris-900/5 hover:scale-105 active:scale-95 transition-all duration-300">
          Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
        </RouterLink>
      </div>
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        <ArticleCard v-for="a in artikelUnggulan" :key="a.id" :artikel="a" />
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="relative bg-waris-900 rounded-[2.5rem] p-8 sm:p-14 text-center text-white overflow-hidden shadow-float">
        <div class="blob-a absolute -top-16 -left-16 w-64 h-64 bg-waris-500/40 blur-3xl pointer-events-none"></div>
        <div class="blob-b absolute -bottom-20 -right-12 w-72 h-72 bg-waris-700/50 blur-3xl pointer-events-none"></div>
        <i class="fa-solid fa-scale-balanced absolute -right-6 -bottom-8 text-[10rem] opacity-10"></i>
        <h2 class="font-display text-4xl sm:text-5xl font-bold relative">Siap Memahami Hak Waris Keluargamu?</h2>
        <p class="text-waris-50/85 mt-3 max-w-xl mx-auto relative">
          Jelajahi panduan faraid atau hubungi kami — gratis, tanpa login, dan berbasis dalil.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3 relative">
          <RouterLink to="/chat" class="h-12 inline-flex items-center px-8 rounded-full bg-white text-waris-900 font-extrabold hover:scale-105 active:scale-95 transition-all duration-300">
            <i class="fa-solid fa-comments mr-1.5"></i>Mulai Konsultasi
          </RouterLink>
          <RouterLink to="/panduan" class="h-12 inline-flex items-center px-8 rounded-full bg-white/15 border-2 border-white/25 font-extrabold hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-300">
            <i class="fa-solid fa-book-open mr-1.5"></i>Buka Panduan
          </RouterLink>
        </div>
      </div>
    </section>

    <InfoModal :terbuka="modalTerbuka" @tutup="modalTerbuka = false" />
  </div>
</template>
