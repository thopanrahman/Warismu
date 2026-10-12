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
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
    <nav class="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
      <RouterLink to="/" class="flex items-center gap-2.5" @click="tutupMenu">
        <span
          class="w-10 h-10 rounded-2xl bg-emerald-600 text-white grid place-items-center text-xl shadow"
        >
          <i class="fa-solid fa-scale-balanced"></i>
        </span>
        <span class="leading-tight">
          <span class="block font-extrabold text-lg text-emerald-700">WarisMu</span>
          <span class="block text-[11px] text-slate-500 -mt-0.5">Asisten Waris Islam</span>
        </span>
      </RouterLink>

      <!-- Menu desktop -->
      <div class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="t in tautan"
          :key="t.path"
          :to="t.path"
          class="px-4 py-2 rounded-full text-sm font-semibold transition"
          :class="
            aktif(t.path)
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          "
        >
          <i :class="t.ikon" class="mr-1.5"></i>{{ t.label }}
        </RouterLink>
      </div>

      <!-- Tombol hamburger (mobile) -->
      <button
        class="md:hidden w-10 h-10 grid place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        :aria-expanded="menuBuka"
        aria-label="Buka/tutup menu navigasi"
        @click="toggleMenu"
      >
        <i :class="menuBuka ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-lg"></i>
      </button>
    </nav>

    <!-- Menu mobile -->
    <transition name="fade">
      <div v-if="menuBuka" class="md:hidden border-t border-slate-100 bg-white px-4 py-3">
        <div class="flex flex-col gap-1">
          <RouterLink
            v-for="t in tautan"
            :key="t.path"
            :to="t.path"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3"
            :class="
              aktif(t.path)
                ? 'bg-emerald-600 text-white'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            "
            @click="tutupMenu"
          >
            <i :class="t.ikon" class="w-5 text-center"></i>{{ t.label }}
          </RouterLink>
        </div>
      </div>
    </transition>
  </header>
</template>
