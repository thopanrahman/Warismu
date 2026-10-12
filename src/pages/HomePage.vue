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
  { ikon: 'fa-solid fa-comments', judul: 'Chatbot Bahasa Natural', deskripsi: 'Cukup bercerita seperti mengobrol — sistem mengekstraksi data keluarga otomatis.', warna: 'emerald' },
  { ikon: 'fa-solid fa-calculator', judul: 'Simulasi Faraid Instan', deskripsi: 'Hasil tabel bagian tiap ahli waris lengkap dengan dalil dan penjelasan.', warna: 'amber' },
  { ikon: 'fa-solid fa-book-quran', judul: 'Edukasi Berbasis Dalil', deskripsi: 'Setiap hasil disertai sumber QS. An-Nisa & Kompilasi Hukum Islam (KHI).', warna: 'sky' },
  { ikon: 'fa-solid fa-user-shield', judul: 'Mode Guest & Akun', deskripsi: 'Coba tanpa login (riwayat hilang saat browser ditutup) atau daftar untuk simpan riwayat.', warna: 'rose' },
]

const artikelUnggulan = daftarPanduan.slice(0, 3)
</script>

<template>
  <div>
    <HeroSection @buka-modal="modalTerbuka = true" />

    <!-- Statistik singkat -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 -mt-0 pt-10">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="s in [
          { ikon: 'fa-solid fa-book-open', angka: '8+', label: 'Artikel Panduan' },
          { ikon: 'fa-solid fa-users', angka: '2', label: 'Mode Pengguna' },
          { ikon: 'fa-solid fa-book-quran', angka: '3', label: 'Ayat Rujukan Utama' },
          { ikon: 'fa-solid fa-mobile-screen', angka: '360px–1920px', label: 'Rentang Responsif' },
        ]" :key="s.label" class="bg-white rounded-3xl border border-slate-200 p-5 text-center shadow-sm">
          <i :class="s.ikon" class="text-emerald-600 text-xl"></i>
          <p class="font-extrabold text-xl mt-2">{{ s.angka }}</p>
          <p class="text-xs text-slate-500">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Fitur utama -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">
          <i class="fa-solid fa-sparkles mr-1.5"></i>Fitur Utama
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold mt-2">Kenapa Memilih WarisMu?</h2>
        <p class="text-sm text-slate-500 mt-2">Pendekatan conversational yang ramah untuk topik yang sensitif.</p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        <FeatureCard
          v-for="f in fitur"
          :key="f.judul"
          :ikon="f.ikon"
          :judul="f.judul"
          :deskripsi="f.deskripsi"
          :warna="f.warna"
        />
      </div>
    </section>

    <HowItWorks />

    <!-- Artikel unggulan -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">
            <i class="fa-solid fa-fire mr-1.5"></i>Populer
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold mt-2">Mulai dari Sini</h2>
        </div>
        <RouterLink to="/panduan" class="shrink-0 text-sm font-bold text-emerald-700 hover:text-emerald-500">
          Lihat Semua <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
        </RouterLink>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        <ArticleCard v-for="a in artikelUnggulan" :key="a.id" :artikel="a" />
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
        <i class="fa-solid fa-scale-balanced absolute -right-6 -bottom-8 text-[10rem] opacity-10"></i>
        <h2 class="text-2xl sm:text-3xl font-extrabold relative">Siap Memahami Hak Waris Keluargamu?</h2>
        <p class="text-sm text-emerald-100/85 mt-2 max-w-xl mx-auto relative">
          Jelajahi panduan faraid atau hubungi kami — gratis, tanpa login, dan berbasis dalil.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3 relative">
          <RouterLink to="/panduan" class="bg-white text-emerald-700 font-bold px-6 py-3 rounded-2xl hover:bg-emerald-50 transition">
            <i class="fa-solid fa-book-open mr-1.5"></i>Buka Panduan
          </RouterLink>
          <RouterLink to="/kontak" class="bg-white/15 border border-white/25 font-bold px-6 py-3 rounded-2xl hover:bg-white/25 transition">
            <i class="fa-solid fa-envelope mr-1.5"></i>Hubungi Kami
          </RouterLink>
        </div>
      </div>
    </section>

    <InfoModal :terbuka="modalTerbuka" @tutup="modalTerbuka = false" />
  </div>
</template>
