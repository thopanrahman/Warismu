<script setup>
defineProps({
  ikon: { type: String, default: 'fa-solid fa-star' },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
})
</script>

<template>
  <div
    class="group bg-white rounded-2xl border border-waris-900/10 p-7 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all duration-300"
  >
    <span
      class="w-14 h-14 rounded-2xl grid place-items-center text-2xl mb-5 bg-waris-100 text-waris-900 group-hover:bg-waris-900 group-hover:text-white transition-all duration-300"
    >
      <i :class="ikon"></i>
    </span>
    <h3 class="font-bold text-xl mb-2 text-ink">{{ judul }}</h3>
    <p class="text-sm text-ink/60 leading-relaxed">{{ deskripsi }}</p>
  </div>
</template>
