<script setup>
defineProps({
  ikon: { type: String, default: 'fa-solid fa-star' },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  warna: { type: String, default: 'emerald' },
})

const gayaIkon = {
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  sky: 'bg-sky-100 text-sky-700',
  rose: 'bg-rose-100 text-rose-700',
}
</script>

<template>
  <div
    class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
  >
    <span
      class="w-12 h-12 rounded-2xl grid place-items-center text-xl mb-4"
      :class="gayaIkon[warna] ?? gayaIkon.emerald"
    >
      <i :class="ikon"></i>
    </span>
    <h3 class="font-extrabold text-lg mb-1.5">{{ judul }}</h3>
    <p class="text-sm text-slate-500 leading-relaxed">{{ deskripsi }}</p>
  </div>
</template>
