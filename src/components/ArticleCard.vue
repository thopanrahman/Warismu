<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  artikel: { type: Object, required: true },
})
</script>

<template>
  <article
    class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col"
  >
    <div class="relative">
      <img :src="artikel.gambar" :alt="artikel.judul" class="w-full h-44 object-cover" loading="lazy" />
      <span
        class="absolute top-3 left-3 text-[11px] font-extrabold bg-emerald-600 text-white px-3 py-1 rounded-full shadow"
      >
        {{ artikel.kategori }}
      </span>
    </div>
    <div class="p-5 flex flex-col flex-1">
      <div class="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mb-2">
        <span><i class="fa-regular fa-calendar mr-1"></i>{{ artikel.tanggal }}</span>
        <span><i class="fa-regular fa-clock mr-1"></i>{{ artikel.estimasi }}</span>
      </div>
      <h3 class="font-extrabold leading-snug mb-2">{{ artikel.judul }}</h3>
      <p class="text-sm text-slate-500 leading-relaxed flex-1">{{ artikel.ringkasan }}</p>
      <RouterLink
        :to="`/panduan/${artikel.id}`"
        class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-500"
      >
        Baca Selengkapnya <i class="fa-solid fa-arrow-right text-xs"></i>
      </RouterLink>
    </div>
  </article>
</template>
