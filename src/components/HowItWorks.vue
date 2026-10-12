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
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14">
    <div class="text-center max-w-2xl mx-auto">
      <span class="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">
        <i class="fa-solid fa-route mr-1.5"></i>Cara Kerja
      </span>
      <h2 class="text-2xl sm:text-3xl font-extrabold mt-2">Dari Cerita Menjadi Perhitungan</h2>
      <p class="text-sm text-slate-500 mt-2">Tiga langkah sederhana — tanpa formulir rumit, tanpa istilah membingungkan.</p>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      <div
        v-for="l in langkah"
        :key="l.judul"
        class="relative bg-emerald-950 text-white rounded-3xl p-6 overflow-hidden"
      >
        <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl"></div>
        <span class="w-12 h-12 rounded-2xl bg-emerald-500 grid place-items-center text-xl mb-4 relative">
          <i :class="l.ikon"></i>
        </span>
        <h3 class="font-extrabold text-lg relative">{{ l.judul }}</h3>
        <p class="text-sm text-emerald-100/75 mt-1.5 leading-relaxed relative">{{ l.deskripsi }}</p>
      </div>
    </div>
  </section>
</template>
