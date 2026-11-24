<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { daftarPanduan, penulisPanduan } from '../data/panduan.js'

const route = useRoute()
const item = computed(() => daftarPanduan.find((artikel) => artikel.id === Number(route.params.id)))

watchEffect(() => {
  if (item.value && typeof document !== 'undefined') {
    document.title = `${item.value.judul} — Pustaka WarisMu`
  }
})
</script>

<template>
  <div v-if="item" class="w-full bg-canvas py-10 sm:py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb & Navigasi Kembali -->
      <div class="flex items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-2 text-xs font-bold text-ink-500">
          <RouterLink to="/" class="hover:text-forest-900 transition-colors">Beranda</RouterLink>
          <span class="text-ink-300">/</span>
          <RouterLink to="/panduan" class="hover:text-forest-900 transition-colors">Pustaka Faraid</RouterLink>
          <span class="text-ink-300">/</span>
          <span class="text-forest-900 truncate max-w-[12rem] sm:max-w-xs">{{ item.kategori }}</span>
        </div>

        <RouterLink
          to="/panduan"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 transition-colors"
        >
          <i class="fa-solid fa-arrow-left text-[10px]"></i>
          <span>Kembali ke Pustaka</span>
        </RouterLink>
      </div>

      <!-- Judul & Metadata Header -->
      <div class="mb-8">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-forest-100 text-forest-900 mb-3 border border-forest-900/10">
          {{ item.kategori }}
        </span>
        <h1 class="font-display text-3xl sm:text-5xl font-bold text-forest-950 tracking-tight leading-[1.15] mb-4">
          {{ item.judul }}
        </h1>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500 font-medium pb-6 border-b border-forest-900/10">
          <span class="inline-flex items-center gap-1.5 text-ink-700">
            <i class="fa-solid fa-user-pen text-forest-700"></i>
            {{ item.penulis }}
          </span>
          <span>•</span>
          <span class="inline-flex items-center gap-1.5">
            <i class="fa-regular fa-calendar text-forest-700"></i>
            {{ item.tanggal }}
          </span>
          <span>•</span>
          <span class="inline-flex items-center gap-1.5">
            <i class="fa-regular fa-clock text-forest-700"></i>
            {{ item.estimasi }}
          </span>
        </div>
      </div>

      <!-- Gambar Cover Artikel -->
      <div class="mb-10 rounded-3xl overflow-hidden aspect-[16/9] border border-forest-900/10 shadow-card bg-forest-100">
        <img
          :src="item.gambarCover"
          :alt="item.judul"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Konten Bacaan Utama (Comfortable Reading Width) -->
      <article class="prose max-w-none text-ink-800 text-base leading-relaxed space-y-6">
        <!-- Lead summary blockquote -->
        <div class="p-6 rounded-2xl bg-white border-l-4 border-forest-900 border-y border-r border-forest-900/10 shadow-subtle text-forest-950 font-medium text-base sm:text-lg italic leading-relaxed">
          {{ item.ringkasan }}
        </div>

        <!-- Paragraf isi -->
        <p v-for="(paragraf, i) in item.isi" :key="i" class="text-ink-700 leading-relaxed text-base sm:text-[17px]">
          {{ paragraf }}
        </p>

        <!-- Kotak Dalil Arab & Terjemahan -->
        <div
          v-if="item.arab"
          class="my-8 p-6 sm:p-8 rounded-2xl bg-dalil-50/80 border border-dalil-200/80 shadow-subtle"
        >
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dalil-700 mb-4">
            <i class="fa-solid fa-book-quran text-dalil-600"></i>
            <span>Dalil Landasan Syariat</span>
          </div>

          <p class="font-arabic text-2xl sm:text-3xl text-forest-950 text-right leading-loose mb-4" dir="rtl" lang="ar">
            {{ item.arab.teks }}
          </p>

          <p class="text-xs sm:text-sm text-ink-700 italic border-t border-dalil-200/60 pt-3">
            {{ item.arab.terjemahan }}
          </p>
        </div>

        <!-- Kotak Poin Penting -->
        <div v-if="item.poin?.length" class="my-8 p-6 sm:p-8 rounded-2xl bg-white border border-forest-900/10 shadow-card">
          <h3 class="font-display font-bold text-xl text-forest-950 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-forest-700"></i>
            <span>Poin-Poin Penting untuk Diingat</span>
          </h3>
          <ul class="space-y-3">
            <li v-for="poin in item.poin" :key="poin" class="flex items-start gap-3 text-sm text-ink-700 leading-relaxed">
              <span class="w-2 h-2 rounded-full bg-forest-600 mt-2 shrink-0"></span>
              <span>{{ poin }}</span>
            </li>
          </ul>
        </div>

        <!-- Sumber Rujukan -->
        <div class="pt-4 text-xs text-ink-500">
          <p><strong>Sumber Rujukan Kitab:</strong> {{ item.sumber }}</p>
        </div>
      </article>

      <!-- Profil Penulis / Author Bio -->
      <div class="mt-14 p-6 sm:p-8 rounded-3xl bg-forest-50/70 border border-forest-900/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div class="w-16 h-16 rounded-2xl bg-forest-900 text-white text-2xl font-bold grid place-items-center shrink-0">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="flex-1 min-w-0">
          <span class="text-[11px] font-bold uppercase tracking-wider text-forest-800">
            Penulis Materi
          </span>
          <h4 class="font-display font-bold text-xl text-forest-950 mt-0.5">
            {{ penulisPanduan.nama }}
          </h4>
          <p class="text-xs text-forest-700 font-semibold mb-2">
            {{ penulisPanduan.jabatan }}
          </p>
          <p class="text-xs text-ink-600 leading-relaxed">
            {{ penulisPanduan.deskripsi }}
          </p>
        </div>
      </div>

      <!-- Action Footer: Kembali & Uji di Kalkulator -->
      <div class="mt-10 pt-6 border-t border-forest-900/10 flex flex-wrap items-center justify-between gap-4">
        <RouterLink
          to="/panduan"
          class="inline-flex items-center gap-2 text-xs font-bold text-ink-700 hover:text-forest-900 transition-colors"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
          <span>Kembali ke Daftar Panduan</span>
        </RouterLink>

        <RouterLink
          to="/kalkulator"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition-all shadow-subtle active:scale-95"
        >
          <i class="fa-solid fa-calculator text-xs"></i>
          <span>Coba Hitung Kasus Ini di Kalkulator</span>
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- 404 Artikel Tidak Ditemukan -->
  <div v-else class="max-w-2xl mx-auto px-4 py-24 text-center">
    <div class="w-16 h-16 rounded-2xl bg-forest-50 text-forest-800 grid place-items-center text-3xl mx-auto mb-4">
      <i class="fa-solid fa-book-skull"></i>
    </div>
    <h2 class="font-display font-bold text-2xl text-forest-950">Artikel Tidak Ditemukan</h2>
    <p class="text-sm text-ink-600 mt-2">Artikel yang Anda tuju mungkin telah dipindahkan atau tautan tidak valid.</p>
    <RouterLink
      to="/panduan"
      class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-all"
    >
      Kembali ke Pustaka Faraid
    </RouterLink>
  </div>
</template>
