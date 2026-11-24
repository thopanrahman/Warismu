<script setup>
import { RouterLink } from 'vue-router'
import BrandLogo from '../components/BrandLogo.vue'

const misi = [
  {
    ikon: 'fa-solid fa-book-quran',
    judul: 'Literasi Berdalil Sahih',
    teks: 'Menyebarkan pemahaman faraid yang berlandaskan nash Al-Qur’an (QS. An-Nisa: 11-12, 176) dan Kompilasi Hukum Islam secara mudah dipahami.',
  },
  {
    ikon: 'fa-solid fa-calculator',
    judul: 'Akurasi & Transparansi Perhitungan',
    teks: 'Menyajikan angka pembagian yang dapat ditelusuri rumusnya, mulai dari pelunasan hutang dan wasiat hingga bagian per orang.',
  },
  {
    ikon: 'fa-solid fa-handshake',
    judul: 'Menjaga Keharmonisan Silaturahmi',
    teks: 'Mencegah bibit sengketa keluarga melalui edukasi yang transparan, menenangkan, dan berkeadilan sejak dini.',
  },
]

const latarBelakang = [
  {
    nomor: '01',
    judul: 'Akar Masalah Sengketa Waris',
    paragraf:
      'Persoalan warisan termasuk pemicu keretakan keluarga yang paling sering terjadi. Akarnya kerap kali bukan karena niat jahat, melainkan minimnya literasi faraid, rasa sungkan membicarakan harta sebelum sengketa terjadi, dan sulitnya berkonsultasi kepada ahli yang kompeten.',
  },
  {
    nomor: '02',
    judul: 'Teknologi untuk Kemaslahatan',
    paragraf:
      'WarisMu memadukan algoritma perhitungan faraid deterministik dengan kecerdasan buatan percakapan. Pengguna dapat memilih menghitung lewat formulir terstruktur atau menceritakan kondisi keluarga dalam bahasa sehari-hari.',
  },
  {
    nomor: '03',
    judul: 'Semangat Tajdid & Islam Berkemajuan',
    paragraf:
      'WarisMu berikhtiar menjaga keotentikan syariat waris klasik, namun menyajikannya dengan medium digital yang akrab bagi generasi masa kini. Pembaharuan pada cara penyampaian, bukan penggantian isi ketentuan Allah.',
  },
]
</script>

<template>
  <div class="w-full bg-canvas py-10 sm:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Hero Editorial -->
      <div class="max-w-3xl mb-16">
        <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
          Tentang WarisMu
        </span>
        <h1 class="font-display text-3xl sm:text-5xl font-bold text-forest-950 mt-2 tracking-tight leading-[1.12]">
          Menjembatani Ilmu Faraid Klasik dengan Kebutuhan Keluarga Modern
        </h1>
        <p class="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">
          WarisMu adalah platform edukasi dan simulasi waris Islam independen yang bertujuan menghadirkan pemahaman faraid yang menenangkan, berkeadilan, dan dapat diakses siapa saja secara cuma-cuma.
        </p>
      </div>

      <!-- Visi & Misi Card -->
      <div class="grid lg:grid-cols-12 gap-8 mb-20">
        <!-- Visi (5 Kolom) -->
        <div class="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-forest-950 text-white shadow-float flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <BrandLogo class="w-10 h-10 brightness-110" />
              <span class="text-xs font-bold uppercase tracking-widest text-forest-400">Visi Utama</span>
            </div>
            <h2 class="font-display text-2xl sm:text-3xl font-bold leading-snug text-white">
              “Menjadi asisten edukasi waris Islam paling dipercaya di Indonesia.”
            </h2>
            <p class="text-xs sm:text-sm text-forest-200/80 leading-relaxed mt-4">
              Menghadirkan keterbukaan dan ketenangan bagi setiap keluarga muslim dalam menyelesaikan pembagian harta waris secara adil, transparan, dan sesuai syariat.
            </p>
          </div>

          <div class="pt-8 border-t border-forest-900 mt-6 flex items-center gap-2 text-xs text-forest-400">
            <i class="fa-solid fa-scale-balanced text-forest-500"></i>
            <span>Berdasarkan Al-Qur'an & Kompilasi Hukum Islam</span>
          </div>
        </div>

        <!-- Misi (7 Kolom) -->
        <div class="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-forest-900/10 shadow-card flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-forest-800">Misi Kami</span>
            <h2 class="font-display text-2xl font-bold text-ink-900 mt-1 mb-6">
              Tiga Langkah Perwujudan Nilai
            </h2>
            <div class="space-y-6">
              <div v-for="m in misi" :key="m.judul" class="flex items-start gap-4">
                <span class="w-10 h-10 rounded-xl bg-forest-50 text-forest-900 grid place-items-center text-sm shrink-0 mt-0.5">
                  <i :class="m.ikon"></i>
                </span>
                <div>
                  <h3 class="font-bold text-base text-ink-900">{{ m.judul }}</h3>
                  <p class="text-xs sm:text-sm text-ink-600 mt-1 leading-relaxed">{{ m.teks }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Latar Belakang & Filosofi -->
      <div class="mb-20">
        <div class="max-w-2xl mb-10">
          <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
            Latar Belakang
          </span>
          <h2 class="font-display text-2xl sm:text-4xl font-bold text-forest-950 mt-1 tracking-tight">
            Mengapa WarisMu Dibangun?
          </h2>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="item in latarBelakang"
            :key="item.nomor"
            class="p-8 rounded-3xl bg-white border border-forest-900/10 shadow-card flex flex-col justify-between"
          >
            <div>
              <span class="font-mono text-xs font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-md">
                {{ item.nomor }}
              </span>
              <h3 class="font-display font-bold text-xl text-ink-900 mt-4 mb-3">
                {{ item.judul }}
              </h3>
              <p class="text-xs sm:text-sm text-ink-600 leading-relaxed">
                {{ item.paragraf }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ajakan ke Layanan -->
      <div class="p-8 sm:p-12 rounded-3xl bg-forest-50/80 border border-forest-900/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="font-display font-bold text-2xl text-forest-950">
            Mulai Hitung Hak Waris Keluargamu
          </h3>
          <p class="text-xs sm:text-sm text-ink-600 mt-1">
            Gunakan kalkulator mandiri atau ceritakan situasimu ke asisten AI WarisMu sekarang.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <RouterLink
            to="/kalkulator"
            class="px-5 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition-all shadow-subtle active:scale-95"
          >
            Buka Kalkulator
          </RouterLink>
          <RouterLink
            to="/chat"
            class="px-5 py-2.5 rounded-xl border border-forest-900/20 bg-white text-forest-900 font-bold text-xs hover:bg-forest-100 transition-all"
          >
            Konsultasi AI
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
