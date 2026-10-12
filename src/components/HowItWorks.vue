<script setup>
const langkah = [
  {
    ikon: 'fa-solid fa-message',
    judul: '1. Bercerita',
    deskripsi: 'Ceritakan kondisi keluarga dengan bahasa sehari-hari, misal “ayah wafat meninggalkan ibu, istri, dan 2 anak”.',
  },
  {
    ikon: 'fa-solid fa-list-checks',
    judul: '2. Lengkapi Data',
    deskripsi: 'Chatbot bertanya soal data yang kurang: hutang pewaris, harta bersama, atau status ahli waris.',
  },
  {
    ikon: 'fa-solid fa-calculator',
    judul: '3. Terima Hasil',
    deskripsi: 'Dapatkan tabel bagian tiap ahli waris + dalil, penjelasan, sumber, dan disclaimer.',
  },
]
</script>

<template>
  <section class="bg-waris-100/30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
          <i class="fa-solid fa-route mr-1.5"></i>Cara Kerja
        </span>
        <h2 class="font-display text-4xl sm:text-5xl font-bold mt-3 text-ink">Dari Cerita Menjadi Perhitungan</h2>
        <p class="text-ink/60 mt-3">Tiga langkah sederhana — tanpa formulir rumit, tanpa istilah membingungkan.</p>
      </div>
      <div class="relative grid gap-8 md:grid-cols-3 mt-12">
        <!-- Konektor lengkung gaya hand-drawn antar langkah (desktop) -->
        <svg class="hidden md:block absolute top-10 left-[18%] w-[64%] h-8 text-waris-800/40" viewBox="0 0 600 30" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 22 C 120 4, 200 4, 300 16 S 480 28, 600 10" stroke="currentColor" stroke-width="2.5" stroke-dasharray="8 7" stroke-linecap="round" />
        </svg>
        <div
          v-for="l in langkah"
          :key="l.judul"
          class="relative bg-waris-950 text-white rounded-[2rem] p-7 overflow-hidden shadow-soft hover:-translate-y-1 transition-all duration-300"
        >
          <div class="blob-a absolute -top-10 -right-10 w-36 h-36 bg-waris-700/30 blur-2xl"></div>
          <span class="relative w-14 h-14 rounded-full bg-waris-500 grid place-items-center text-2xl mb-5">
            <i :class="l.ikon"></i>
          </span>
          <h3 class="font-display font-bold text-xl relative">{{ l.judul }}</h3>
          <p class="text-sm text-waris-50/75 mt-2 leading-relaxed relative">{{ l.deskripsi }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
