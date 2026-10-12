<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const menuBuka = ref(false)

// Fitur interaktif 1: toggle menu mobile
function toggleMenu() {
  menuBuka.value = !menuBuka.value
}
function tutupMenu() {
  menuBuka.value = false
}
function aktif(path) {
  return route.path === path || (path === '/panduan' && route.path.startsWith('/panduan'))
}

const tautan = [
  { path: '/', label: 'Beranda', ikon: 'fa-solid fa-house' },
  { path: '/tentang', label: 'Tentang', ikon: 'fa-solid fa-circle-info' },
  { path: '/panduan', label: 'Panduan', ikon: 'fa-solid fa-book-open' },
  { path: '/kontak', label: 'Kontak', ikon: 'fa-solid fa-envelope' },
]
</script>

<template>
  <div class="sticky top-4 z-40 px-4 sm:px-6">
    <header
      class="max-w-6xl mx-auto rounded-full bg-white/70 backdrop-blur-md border border-[#DED8CF]/50 shadow-soft"
    >
      <nav class="flex items-center justify-between px-4 sm:px-6 py-3">
        <RouterLink to="/" class="flex items-center gap-2.5" @click="tutupMenu">
          <span
            class="w-10 h-10 rounded-full bg-waris-900 text-white grid place-items-center text-xl shadow-soft"
          >
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <span class="leading-tight">
            <span class="block font-display font-bold text-lg text-ink">WarisMu</span>
            <span class="block text-[11px] text-ink/55 -mt-0.5 font-semibold">Asisten Waris Islam</span>
          </span>
        </RouterLink>

        <!-- Menu desktop -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="t in tautan"
            :key="t.path"
            :to="t.path"
            class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300"
            :class="
              aktif(t.path)
                ? 'bg-waris-900 text-white shadow-soft'
                : 'text-ink/70 hover:bg-waris-900/10 hover:text-waris-900'
            "
          >
            <i :class="t.ikon" class="mr-1.5"></i>{{ t.label }}
          </RouterLink>
        </div>

        <!-- Tombol hamburger (mobile) -->
        <button
          class="md:hidden w-11 h-11 grid place-items-center rounded-full border border-waris-900/20 text-waris-900 hover:bg-waris-900/10 transition-all duration-300 active:scale-95"
          :aria-expanded="menuBuka"
          aria-label="Buka/tutup menu navigasi"
          @click="toggleMenu"
        >
          <i :class="menuBuka ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-lg"></i>
        </button>
      </nav>

      <!-- Menu mobile -->
      <transition name="fade">
        <div v-if="menuBuka" class="md:hidden px-4 pb-4">
          <div class="flex flex-col gap-1 rounded-[2rem] border border-waris-900/10 bg-cream p-3">
            <RouterLink
              v-for="t in tautan"
              :key="t.path"
              :to="t.path"
              class="px-4 py-3 rounded-full text-sm font-bold flex items-center gap-3 transition-all duration-300"
              :class="
                aktif(t.path)
                  ? 'bg-waris-900 text-white'
                  : 'text-ink/75 hover:bg-waris-900/10 hover:text-waris-900'
              "
              @click="tutupMenu"
            >
              <i :class="t.ikon" class="w-5 text-center"></i>{{ t.label }}
            </RouterLink>
          </div>
        </div>
      </transition>
    </header>
  </div>
</template>
