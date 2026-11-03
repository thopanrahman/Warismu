<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import { ambilPengguna, keluarAkun } from '../lib/akun.js'

const route = useRoute()
const router = useRouter()
const menuBuka = ref(false)

// ===== Status akun (UC-02 / UC-03) =====
// Navbar hidup di App.vue, jadi tidak ikut ter-mount ulang saat pindah rute.
// Karena itu status login dibaca ulang setiap rute berubah.
const pengguna = ref(ambilPengguna())
watch(
  () => route.fullPath,
  () => {
    pengguna.value = ambilPengguna()
  },
)
function keluar() {
  keluarAkun()
  pengguna.value = null
  tutupMenu()
  router.push('/')
}

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
  { path: '/chat', label: 'Chat', ikon: 'fa-solid fa-comments' },
  { path: '/tentang', label: 'Tentang', ikon: 'fa-solid fa-circle-info' },
  { path: '/panduan', label: 'Panduan', ikon: 'fa-solid fa-book-open' },
  { path: '/kontak', label: 'Kontak', ikon: 'fa-solid fa-envelope' },
]

// DESIGN.md §4.1: "Daftar Akun" tetap tombol primary bg-waris-900.
// Ukurannya sekarang disamakan dengan menu tengah (tidak lagi lebih besar
// dan tidak lagi memakai tinggi h-11 tersendiri).
const tombolDaftar = { path: '/daftar', label: 'Daftar Akun', ikon: 'fa-solid fa-user-plus' }
const tombolMasuk = { path: '/masuk', label: 'Masuk', ikon: 'fa-solid fa-right-to-bracket' }

// Satu ukuran untuk menu tengah maupun tombol akun, supaya tinggi & padding sama.
const kelasTautan = 'px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300'
</script>

<template>
  <div class="sticky top-4 z-40 px-4 sm:px-6">
    <header
      class="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-waris-900/10 shadow-soft transition-all duration-300"
      :class="menuBuka ? 'rounded-3xl' : 'rounded-full'"
    >
      <!-- Tiga kolom: logo kiri, menu di tengah, akun di kanan -->
      <nav class="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:px-6 py-3">
        <RouterLink to="/" class="flex items-center gap-3" @click="tutupMenu">
          <BrandLogo class="w-10 h-10" />
          <span class="leading-tight">
            <span class="block font-display font-bold text-lg text-ink">WarisMu</span>
            <span class="block text-xs text-ink/55 -mt-1 font-semibold">Asisten Waris Islam</span>
          </span>
        </RouterLink>

        <!-- Menu utama: tepat di tengah, setiap menu berikon -->
        <div class="hidden lg:flex items-center justify-center gap-1">
          <RouterLink
            v-for="t in tautan"
            :key="t.path"
            :to="t.path"
            :class="[
              kelasTautan,
              aktif(t.path)
                ? 'bg-waris-900 text-white shadow-soft'
                : 'text-ink/70 hover:bg-waris-900/10 hover:text-waris-900',
            ]"
          >
            <i :class="t.ikon" class="mr-2"></i>{{ t.label }}
          </RouterLink>
        </div>

        <!-- Akun: sudah masuk → nama + Keluar; belum → Masuk + Daftar Akun -->
        <div class="hidden lg:flex items-center justify-end gap-1">
          <template v-if="pengguna">
            <span class="px-3 text-sm font-bold text-waris-900 truncate max-w-[10rem]">
              <i class="fa-solid fa-circle-user mr-2" aria-hidden="true"></i>{{ pengguna.nama }}
            </span>
            <button
              type="button"
              :class="[kelasTautan, 'text-ink/70 hover:bg-waris-900/10 hover:text-waris-900']"
              @click="keluar"
            >
              <i class="fa-solid fa-right-from-bracket mr-2" aria-hidden="true"></i>Keluar
            </button>
          </template>
          <template v-else>
            <RouterLink
              :to="tombolMasuk.path"
              :class="[
                kelasTautan,
                aktif(tombolMasuk.path)
                  ? 'bg-waris-900/10 text-waris-900'
                  : 'text-ink/70 hover:bg-waris-900/10 hover:text-waris-900',
              ]"
            >
              {{ tombolMasuk.label }}
            </RouterLink>
            <RouterLink
              :to="tombolDaftar.path"
              :class="[kelasTautan, 'bg-waris-900 text-white shadow-soft hover:bg-waris-800 active:scale-95']"
            >
              {{ tombolDaftar.label }}
            </RouterLink>
          </template>
        </div>

        <!-- Tombol hamburger (mobile) -->
        <button
          class="lg:hidden justify-self-end w-11 h-11 grid place-items-center rounded-full border border-waris-900/20 text-waris-900 hover:bg-waris-900/10 transition-all duration-300 active:scale-95"
          :aria-expanded="menuBuka"
          aria-controls="menu-navigasi"
          :aria-label="menuBuka ? 'Tutup menu navigasi' : 'Buka menu navigasi'"
          @click="toggleMenu"
        >
          <i :class="menuBuka ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-lg"></i>
        </button>
      </nav>

      <!-- Menu mobile -->
      <transition name="fade">
        <div v-if="menuBuka" id="menu-navigasi" class="lg:hidden max-h-[calc(100vh-7rem)] overflow-y-auto px-4 pb-4">
          <div class="flex flex-col gap-1 rounded-lg border border-waris-900/10 bg-cream p-3">
            <RouterLink
              v-for="t in tautan"
              :key="t.path"
              :to="t.path"
              class="px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-all duration-300"
              :class="
                aktif(t.path)
                  ? 'bg-waris-900 text-white'
                  : 'text-ink/75 hover:bg-waris-900/10 hover:text-waris-900'
              "
              @click="tutupMenu"
            >
              <i :class="t.ikon" class="w-5 text-center"></i>{{ t.label }}
            </RouterLink>
            <template v-if="pengguna">
              <p class="px-4 py-3 text-sm font-bold text-waris-900 flex items-center gap-3 border-b border-waris-900/10">
                <i class="fa-solid fa-circle-user w-5 text-center" aria-hidden="true"></i>
                <span class="truncate">{{ pengguna.nama }}</span>
              </p>
              <button
                type="button"
                class="px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 text-ink/75 hover:bg-waris-900/10 hover:text-waris-900 transition-all duration-300"
                @click="keluar"
              >
                <i class="fa-solid fa-right-from-bracket w-5 text-center" aria-hidden="true"></i>Keluar
              </button>
            </template>
            <template v-else>
              <RouterLink
                :to="tombolMasuk.path"
                class="px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-all duration-300"
                :class="
                  aktif(tombolMasuk.path)
                    ? 'bg-waris-900/10 text-waris-900'
                    : 'text-ink/75 hover:bg-waris-900/10 hover:text-waris-900'
                "
                @click="tutupMenu"
              >
                <i :class="tombolMasuk.ikon" class="w-5 text-center"></i>{{ tombolMasuk.label }}
              </RouterLink>
              <RouterLink
                :to="tombolDaftar.path"
                class="px-4 py-3 rounded-lg bg-waris-900 text-white text-sm font-bold flex items-center gap-3 active:scale-95 transition-all duration-300"
                @click="tutupMenu"
              >
                <i :class="tombolDaftar.ikon" class="w-5 text-center"></i>{{ tombolDaftar.label }}
              </RouterLink>
            </template>
          </div>
        </div>
      </transition>
    </header>
  </div>
</template>
