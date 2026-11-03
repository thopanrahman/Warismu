<script setup>
import logo from '../assets/logo-waris-mu.png'

defineProps({
  alt: { type: String, default: 'Logo WarisMu' },
})
</script>

<template>
  <img :src="logo" :alt="alt" class="shrink-0 object-contain" decoding="async" />
</template>
