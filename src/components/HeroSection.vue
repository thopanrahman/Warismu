<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  tampilModal: { type: Boolean, default: false },
})
defineEmits(['buka-modal'])
</script>

<template>
  <section class="relative overflow-hidden bg-emerald-950 text-white">
    <div
      class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"
    ></div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid gap-10 md:grid-cols-2 items-center">
      <div>
        <span
          class="inline-flex items-center gap-2 text-xs font-bold bg-white/10 border border-white/15 text-emerald-100 px-3 py-1.5 rounded-full"
        >
          <i class="fa-solid fa-mosque text-amber-300"></i> AI-Powered Islamic Inheritance Assistant
        </span>
        <h1 class="text-3xl sm:text-5xl font-extrabold leading-tight mt-4">
          Pahami Waris Islam dengan
          <span class="text-amber-300">Bercerita Saja.</span>
        </h1>
        <p class="mt-4 text-emerald-100/85 leading-relaxed text-sm sm:text-base">
          WarisMu mengubah cerita keluargamu dalam bahasa natural menjadi simulasi faraid yang
          jelas — lengkap dengan tabel bagian, dalil, dan penjelasan yang mudah dipahami.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink
            to="/panduan"
            class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-900/40 transition"
          >
            <i class="fa-solid fa-comments"></i> Mulai Belajar
          </RouterLink>
          <button
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 font-bold px-6 py-3 rounded-2xl transition"
            @click="$emit('buka-modal')"
          >
            <i class="fa-solid fa-circle-question text-amber-300"></i> Apa itu Faraid?
          </button>
        </div>
        <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-emerald-100/70">
          <span><i class="fa-solid fa-check mr-1.5 text-emerald-400"></i>Tanpa login bisa coba</span>
          <span><i class="fa-solid fa-check mr-1.5 text-emerald-400"></i>Bahasa natural santai</span>
          <span><i class="fa-solid fa-check mr-1.5 text-emerald-400"></i>Berbasis dalil &amp; KHI</span>
        </div>
      </div>

      <div class="relative">
        <img
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80"
          alt="Keluarga muslim berdiskusi"
          class="rounded-3xl shadow-2xl w-full h-64 sm:h-80 object-cover border border-white/10"
          loading="lazy"
        />
        <div
          class="absolute -bottom-5 left-4 right-4 sm:left-6 sm:right-auto bg-white text-slate-800 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4"
        >
          <span class="w-12 h-12 shrink-0 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <div>
            <p class="text-xs text-slate-500 font-semibold">Contoh simulasi</p>
            <p class="font-extrabold text-sm">Anak Lk : Anak Pr = <span class="text-emerald-600">2 : 1</span></p>
            <p class="text-[11px] text-slate-500">QS. An-Nisa: 11</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
