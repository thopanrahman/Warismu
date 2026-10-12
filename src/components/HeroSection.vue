<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  tampilModal: { type: Boolean, default: false },
})
defineEmits(['buka-modal'])
</script>

<template>
  <section class="relative overflow-hidden bg-paper">
    <!-- Blob ambient: wash hijau muda + aksen -->
    <div class="blob-a absolute -top-28 -right-24 w-[28rem] h-[28rem] bg-waris-200/50 blur-3xl pointer-events-none"></div>
    <div class="blob-b absolute -bottom-36 -left-20 w-[26rem] h-[26rem] bg-waris-100/70 blur-3xl pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid gap-12 lg:grid-cols-2 items-center">
      <div>
        <span
          class="inline-flex items-center gap-2 text-xs font-extrabold bg-waris-900/10 border border-waris-900/15 text-waris-900 px-4 py-2 rounded-full"
        >
          <i class="fa-solid fa-mosque text-waris-800"></i> AI-Powered Islamic Inheritance Assistant
        </span>
        <h1 class="font-display text-5xl sm:text-6xl font-bold leading-[1.05] mt-6 text-ink">
          Pahami Waris Islam dengan
          <span class="text-waris-900">Bercerita Saja.</span>
        </h1>
        <p class="mt-5 text-ink/65 leading-relaxed text-base sm:text-lg max-w-xl">
          WarisMu mengubah cerita keluargamu dalam bahasa natural menjadi simulasi faraid yang
          jelas — lengkap dengan tabel bagian, dalil, dan penjelasan yang mudah dipahami.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/chat"
            class="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-waris-900 hover:scale-105 active:scale-95 text-white font-bold shadow-soft hover:shadow-float transition-all duration-300"
          >
            <i class="fa-solid fa-comments"></i> Mulai Konsultasi
          </RouterLink>
          <RouterLink
            to="/panduan"
            class="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white/60 border-2 border-waris-900/20 text-waris-900 font-bold hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <i class="fa-solid fa-book-open"></i> Pelajari Dulu
          </RouterLink>
          <button
            class="inline-flex items-center gap-2 h-12 px-8 rounded-full border-2 border-waris-800 text-waris-800 font-bold hover:bg-waris-900/5 hover:scale-105 active:scale-95 transition-all duration-300"
            @click="$emit('buka-modal')"
          >
            <i class="fa-solid fa-circle-question"></i> Apa itu Faraid?
          </button>
        </div>
        <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/55 font-semibold">
          <span><i class="fa-solid fa-check mr-1.5 text-waris-800"></i>Tanpa login bisa coba</span>
          <span><i class="fa-solid fa-check mr-1.5 text-waris-800"></i>Bahasa natural santai</span>
          <span><i class="fa-solid fa-check mr-1.5 text-waris-800"></i>Berbasis dalil &amp; KHI</span>
        </div>
      </div>

      <div class="relative">
        <img
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80"
          alt="Keluarga muslim berdiskusi"
          class="w-full h-64 sm:h-80 object-cover border-4 border-white shadow-float -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 blob-b"
          loading="lazy"
        />
        <div
          class="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto bg-cream border border-waris-900/10 rounded-[2rem] rounded-tl-[3rem] shadow-soft px-5 py-4 flex items-center gap-4"
        >
          <span class="w-12 h-12 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center text-xl">
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <div>
            <p class="text-xs text-ink/50 font-bold">Contoh simulasi</p>
            <p class="font-extrabold text-sm text-ink">Anak Lk : Anak Pr = <span class="text-waris-900">2 : 1</span></p>
            <p class="text-[11px] text-ink/50 font-semibold">QS. An-Nisa: 11</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
