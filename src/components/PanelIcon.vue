<script setup>
// Ikon panel + panah untuk tombol buka/tutup sidebar riwayat.
// Dibuat SVG lokal (bukan Font Awesome) karena FA free tidak punya "panel-left".
defineProps({
  arah: { type: String, default: 'kiri' }, // 'kiri' = tutup, 'kanan' = buka
})
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="w-5 h-5"
  >
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9.5 4v16" />
    <path v-if="arah === 'kiri'" d="M17.5 12h-4.5M15.2 9.7 12.9 12l2.3 2.3" />
    <path v-else d="M12.5 12h4.5M14.8 9.7 17.1 12l-2.3 2.3" />
  </svg>
</template>
