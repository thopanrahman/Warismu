<script setup>
defineProps({
  ikon: { type: String, default: 'fa-solid fa-star' },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  // indeks dipakai untuk memutar variasi radius organik antar kartu
  indeks: { type: Number, default: 0 },
})

const radiusOrganik = [
  'rounded-[2rem]',
  'rounded-[2rem] rounded-tl-[4rem]',
  'rounded-[2rem] rounded-br-[4rem]',
  'rounded-[2rem] rounded-tr-[4rem]',
  'rounded-[2rem] rounded-bl-[4rem]',
  'rounded-[2rem] rounded-tl-[3rem] rounded-br-[3rem]',
]
</script>

<template>
  <div
    class="group bg-cream border border-waris-900/10 p-7 shadow-soft hover:shadow-float hover:-translate-y-1 hover:rotate-1 transition-all duration-300"
    :class="radiusOrganik[indeks % radiusOrganik.length]"
  >
    <span
      class="w-14 h-14 rounded-2xl grid place-items-center text-2xl mb-5 bg-waris-900/10 text-waris-900 group-hover:bg-waris-900 group-hover:text-white transition-all duration-300"
    >
      <i :class="ikon"></i>
    </span>
    <h3 class="font-display font-bold text-xl mb-2 text-ink">{{ judul }}</h3>
    <p class="text-sm text-ink/60 leading-relaxed">{{ deskripsi }}</p>
  </div>
</template>
