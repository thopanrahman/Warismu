<script setup>
import { RouterLink } from 'vue-router'

const langkah = [
  {
    nomor: '01',
    ikon: 'fa-solid fa-list-check',
    judul: 'Pemetaan Keluarga & Kewajiban Harta',
    deskripsi:
      'Catat siapa saja keluarga yang masih hidup. Sebelum harta dibagi, lunasi hutang pewaris, biaya pemakaman, dan wasiat yang sah (maksimal sepertiga).',
    link: '/kalkulator',
    linkLabel: 'Mulai input data',
  },
  {
    nomor: '02',
    ikon: 'fa-solid fa-scale-balanced',
    judul: 'Perhitungan Deterministik Sesuai Syariat',
    deskripsi:
      'Mesin faraid menentukan porsi pasti Ashabul Furudh (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) dan mengalokasikan sisa kepada Ashabah secara presisi tanpa rekayasa.',
    link: '/kalkulator',
    linkLabel: 'Lihat simulasi',
  },
  {
    nomor: '03',
    ikon: 'fa-solid fa-comments',
    judul: 'Penjelasan Berdalil & Tanya Jawab AI',
    deskripsi:
      'Pahami alasan di balik setiap angka melalui dalil Al-Qur’an (QS. An-Nisa: 11-12) dan Kompilasi Hukum Islam, atau tanyakan kasus khusus langsung ke asisten AI.',
    link: '/chat',
    linkLabel: 'Bercerita ke AI',
  },
]
</script>

<template>
  <section class="py-20 sm:py-28 bg-white border-b border-forest-900/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mb-16">
        <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
          Metodologi WarisMu
        </span>
        <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 mt-2 tracking-tight">
          Alur Transparan dari Cerita Menjadi Ketetapan Adil
        </h2>
        <p class="text-ink-600 text-base sm:text-lg mt-4 leading-relaxed">
          Tiga tahapan yang memastikan setiap hak tertunaikan sesuai tuntunan syariat, menghindarkan salah paham antarkeluarga.
        </p>
      </div>

      <!-- Progressive Grid -->
      <div class="grid gap-8 md:grid-cols-3">
        <div
          v-for="l in langkah"
          :key="l.nomor"
          class="group relative p-7 rounded-2xl border border-forest-900/10 bg-canvas hover:bg-white hover:border-forest-900/25 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="w-12 h-12 rounded-xl bg-forest-100 text-forest-900 grid place-items-center text-lg group-hover:bg-forest-900 group-hover:text-white transition-colors duration-300">
                <i :class="l.ikon"></i>
              </span>
              <span class="font-mono text-2xl font-extrabold text-forest-900/20 group-hover:text-forest-900/40 transition-colors">
                {{ l.nomor }}
              </span>
            </div>

            <h3 class="font-bold text-lg sm:text-xl text-ink-900 mb-3 leading-snug">
              {{ l.judul }}
            </h3>
            <p class="text-sm text-ink-600 leading-relaxed mb-6">
              {{ l.deskripsi }}
            </p>
          </div>

          <RouterLink
            :to="l.link"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 group-hover:translate-x-0.5 transition-transform"
          >
            <span>{{ l.linkLabel }}</span>
            <i class="fa-solid fa-arrow-right text-[11px]"></i>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
