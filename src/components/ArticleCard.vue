<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  artikel: { type: Object, required: true },
})
</script>

<template>
  <article
    class="group bg-white rounded-2xl border border-forest-900/10 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
  >
    <div class="relative overflow-hidden aspect-[16/10] bg-forest-100">
      <img
        :src="artikel.gambarCover"
        :alt="artikel.judul"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-forest-950/20 group-hover:bg-transparent transition-colors duration-300"></div>
      <span
        class="absolute top-3 left-3 text-[11px] font-extrabold uppercase tracking-wider bg-forest-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-full shadow-subtle"
      >
        {{ artikel.kategori }}
      </span>
    </div>
    <div class="p-6 flex flex-col flex-1">
      <div class="flex items-center gap-3 text-xs text-ink-500 font-medium mb-2.5">
        <span><i class="fa-regular fa-calendar mr-1"></i>{{ artikel.tanggal }}</span>
        <span>•</span>
        <span><i class="fa-regular fa-clock mr-1"></i>{{ artikel.estimasi }}</span>
      </div>
      <h3 class="font-display font-bold text-lg text-ink-900 leading-snug mb-2 group-hover:text-forest-800 transition-colors">
        {{ artikel.judul }}
      </h3>
      <p class="text-xs sm:text-sm text-ink-600 leading-relaxed flex-1 line-clamp-3">
        {{ artikel.ringkasan }}
      </p>
      <div class="mt-5 pt-3 border-t border-forest-900/10">
        <RouterLink
          :to="`/panduan/${artikel.id}`"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 transition-colors"
        >
          <span>Baca Selengkapnya</span>
          <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
        </RouterLink>
      </div>
    </div>
  </article>
</template>
