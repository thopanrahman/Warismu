<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  artikel: { type: Object, required: true },
})
</script>

<template>
  <article
    class="group bg-cream rounded-[2rem] border border-waris-900/10 overflow-hidden shadow-soft hover:shadow-float hover:-translate-y-1 hover:rotate-1 transition-all duration-300 flex flex-col"
  >
    <div class="relative overflow-hidden">
      <img
        :src="artikel.gambar"
        :alt="artikel.judul"
        class="w-full h-44 object-cover group-hover:scale-105 transition-all duration-700"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-waris-950/15 group-hover:bg-transparent transition-all duration-500"></div>
      <span
        class="absolute top-3 left-3 text-[11px] font-extrabold bg-waris-900 text-white px-4 py-1.5 rounded-full shadow-soft"
      >
        {{ artikel.kategori }}
      </span>
    </div>
    <div class="p-6 flex flex-col flex-1">
      <div class="flex items-center gap-3 text-[11px] text-ink/45 font-bold mb-2">
        <span><i class="fa-regular fa-calendar mr-1"></i>{{ artikel.tanggal }}</span>
        <span><i class="fa-regular fa-clock mr-1"></i>{{ artikel.estimasi }}</span>
      </div>
      <h3 class="font-display font-bold text-lg leading-snug mb-2 text-ink">{{ artikel.judul }}</h3>
      <p class="text-sm text-ink/60 leading-relaxed flex-1">{{ artikel.ringkasan }}</p>
      <RouterLink
        :to="`/panduan/${artikel.id}`"
        class="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-waris-900 hover:gap-3 transition-all duration-300"
      >
        Baca Selengkapnya <i class="fa-solid fa-arrow-right text-xs"></i>
      </RouterLink>
    </div>
  </article>
</template>
