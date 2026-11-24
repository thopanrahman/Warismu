<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import { ambilPengguna, keluarAkun } from '../lib/akun.js'

const route = useRoute()
const router = useRouter()
const menuBuka = ref(false)

// Status akun
const pengguna = ref(ambilPengguna())
watch(
  () => route.fullPath,
  () => {
    pengguna.value = ambilPengguna()
    menuBuka.value = false
  },
)

function keluar() {
  keluarAkun()
  pengguna.value = null
  menuBuka.value = false
  router.push('/')
}

function toggleMenu() {
  menuBuka.value = !menuBuka.value
}

function tutupMenu() {
  menuBuka.value = false
}

function aktif(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const tautan = [
  { path: '/', label: 'Beranda' },
  { path: '/kalkulator', label: 'Kalkulator Faraid', badge: 'Fitur Utama' },
  { path: '/chat', label: 'Konsultasi AI' },
  { path: '/panduan', label: 'Panduan' },
  { path: '/tentang', label: 'Tentang' },
  { path: '/kontak', label: 'Kontak' },
]

function saatEscape(e) {
  if (e.key === 'Escape' && menuBuka.value) {
    menuBuka.value = false
  }
}

onMounted(() => window.addEventListener('keydown', saatEscape))
onUnmounted(() => window.removeEventListener('keydown', saatEscape))
</script>

<template>
  <div class="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 transition-all">
    <header
      class="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-forest-900/10 rounded-2xl shadow-card transition-all duration-300"
    >
      <nav class="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        <!-- Logo & Brand Title -->
        <RouterLink
          to="/"
          class="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30 rounded-xl py-1 pr-2"
          @click="tutupMenu"
        >
          <BrandLogo class="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 hover:scale-105" />
          <span class="leading-tight">
            <span class="block font-display font-bold text-lg sm:text-xl text-forest-950 tracking-tight">WarisMu</span>
            <span class="block text-[11px] text-forest-700/80 font-semibold -mt-0.5 tracking-wide">Asisten Waris Islam</span>
          </span>
        </RouterLink>

        <!-- Menu Desktop: Horizontal Navigation (tengah) -->
        <div class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="t in tautan"
            :key="t.path"
            :to="t.path"
            class="relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200"
            :class="
              aktif(t.path)
                ? 'bg-forest-900 text-white shadow-subtle'
                : 'text-ink-700 hover:text-forest-950 hover:bg-forest-50'
            "
          >
            <span>{{ t.label }}</span>
            <span
              v-if="t.badge && !aktif(t.path)"
              class="ml-1.5 px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-forest-100 text-forest-800"
            >
              {{ t.badge }}
            </span>
          </RouterLink>
        </div>

        <!-- Akun & CTA Desktop (kanan) -->
        <div class="hidden lg:flex items-center gap-2">
          <template v-if="pengguna">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-900/10 text-xs font-bold text-forest-900">
              <i class="fa-solid fa-circle-user text-forest-700"></i>
              <span class="truncate max-w-[8rem]">{{ pengguna.nama }}</span>
            </div>
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-bold text-ink-600 hover:text-danger-DEFAULT hover:bg-danger-soft transition-colors"
              title="Keluar dari akun"
              @click="keluar"
            >
              <i class="fa-solid fa-arrow-right-from-bracket mr-1.5"></i>Keluar
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/masuk"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-ink-700 hover:text-forest-900 hover:bg-forest-50 transition-colors"
            >
              Masuk
            </RouterLink>
            <RouterLink
              to="/daftar"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-forest-900 text-white hover:bg-forest-800 transition-all duration-200 shadow-subtle active:scale-95"
            >
              Daftar Akun
            </RouterLink>
          </template>
        </div>

        <!-- Hamburger Button (Mobile) -->
        <button
          type="button"
          class="lg:hidden w-10 h-10 grid place-items-center rounded-xl border border-forest-900/15 text-forest-900 hover:bg-forest-50 transition-all active:scale-95"
          :aria-expanded="menuBuka"
          aria-label="Toggle navigasi menu"
          @click="toggleMenu"
        >
          <i :class="menuBuka ? 'fa-solid fa-xmark text-lg' : 'fa-solid fa-bars text-base'"></i>
        </button>
      </nav>

      <!-- Drawer Menu Mobile -->
      <div
        v-if="menuBuka"
        class="lg:hidden px-4 pb-4 pt-2 border-t border-forest-900/10 space-y-2 animate-in fade-in duration-200"
      >
        <div class="grid gap-1">
          <RouterLink
            v-for="t in tautan"
            :key="t.path"
            :to="t.path"
            class="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            :class="
              aktif(t.path)
                ? 'bg-forest-900 text-white'
                : 'text-ink-700 hover:bg-forest-50'
            "
            @click="tutupMenu"
          >
            <span>{{ t.label }}</span>
            <span
              v-if="t.badge"
              class="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded"
              :class="aktif(t.path) ? 'bg-white/20 text-white' : 'bg-forest-100 text-forest-800'"
            >
              {{ t.badge }}
            </span>
          </RouterLink>
        </div>

        <!-- Akun Mobile -->
        <div class="pt-3 border-t border-forest-900/10 flex items-center justify-between gap-2">
          <template v-if="pengguna">
            <span class="text-xs font-bold text-forest-900">
              <i class="fa-solid fa-circle-user mr-1.5"></i>{{ pengguna.nama }}
            </span>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-bold text-danger-DEFAULT hover:bg-danger-soft"
              @click="keluar"
            >
              Keluar
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/masuk"
              class="flex-1 py-2 text-center rounded-xl text-xs font-bold border border-forest-900/20 text-ink-800 hover:bg-forest-50"
              @click="tutupMenu"
            >
              Masuk
            </RouterLink>
            <RouterLink
              to="/daftar"
              class="flex-1 py-2 text-center rounded-xl text-xs font-bold bg-forest-900 text-white hover:bg-forest-800"
              @click="tutupMenu"
            >
              Daftar Akun
            </RouterLink>
          </template>
        </div>
      </div>
    </header>
  </div>
</template>
