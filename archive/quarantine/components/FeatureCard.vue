<script setup>
defineProps({
  ikon: { type: String, default: 'fa-solid fa-star' },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  badge: { type: String, default: '' },
})
</script>

<template>
  <div
    class="group bg-white rounded-2xl border border-forest-900/10 p-7 shadow-card hover:shadow-card-hover hover:border-forest-900/25 transition-all duration-300 flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between mb-5">
        <span
          class="w-12 h-12 rounded-xl grid place-items-center text-xl bg-forest-50 text-forest-900 group-hover:bg-forest-900 group-hover:text-white transition-colors duration-300"
        >
          <i :class="ikon"></i>
        </span>
        <span v-if="badge" class="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-forest-100 text-forest-800">
          {{ badge }}
        </span>
      </div>
      <h3 class="font-bold text-lg mb-2 text-ink-900 group-hover:text-forest-800 transition-colors">{{ judul }}</h3>
      <p class="text-xs sm:text-sm text-ink-600 leading-relaxed">{{ deskripsi }}</p>
    </div>
  </div>
</template>
