<script setup>
import { RouterLink } from 'vue-router'
import BrandLogo from './BrandLogo.vue'

const tahun = new Date().getFullYear()
</script>

<template>
  <footer class="bg-forest-950 text-white border-t border-forest-900/30 mt-20 no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
        <!-- Kolom 1: Brand & Misi (4 Kolom) -->
        <div class="lg:col-span-4 space-y-4">
          <RouterLink to="/" class="inline-flex items-center gap-3">
            <BrandLogo class="w-10 h-10 brightness-110" />
            <span class="font-display font-bold text-2xl tracking-tight text-white">WarisMu</span>
          </RouterLink>
          <p class="text-sm text-forest-200/80 leading-relaxed max-w-sm">
            Asisten edukasi dan simulasi waris Islam (faraid) modern. Membantu setiap keluarga muslim memahami hak waris secara adil, transparan, dan sesuai syariat tanpa kekhawatiran.
          </p>
          <div class="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/thopanrahman/Warismu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Repository GitHub WarisMu"
              class="w-9 h-9 rounded-lg bg-white/10 hover:bg-forest-800 grid place-items-center text-sm text-forest-200 hover:text-white transition-colors"
            >
              <i class="fa-brands fa-github"></i>
            </a>
            <RouterLink
              to="/kontak"
              aria-label="Hubungi WarisMu"
              class="w-9 h-9 rounded-lg bg-white/10 hover:bg-forest-800 grid place-items-center text-sm text-forest-200 hover:text-white transition-colors"
            >
              <i class="fa-solid fa-envelope"></i>
            </RouterLink>
          </div>
        </div>

        <!-- Kolom 2: Fitur & Layanan (2 Kolom) -->
        <div class="lg:col-span-2 space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-forest-400">
            Layanan
          </p>
          <ul class="space-y-2 text-sm text-forest-200/90">
            <li>
              <RouterLink to="/kalkulator" class="hover:text-white transition-colors">
                Kalkulator Faraid
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/chat" class="hover:text-white transition-colors">
                Konsultasi AI
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/panduan" class="hover:text-white transition-colors">
                Pustaka Faraid
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Kolom 3: Informasi (2 Kolom) -->
        <div class="lg:col-span-2 space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-forest-400">
            Informasi
          </p>
          <ul class="space-y-2 text-sm text-forest-200/90">
            <li>
              <RouterLink to="/tentang" class="hover:text-white transition-colors">
                Tentang WarisMu
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/kontak" class="hover:text-white transition-colors">
                Hubungi Kami
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/daftar" class="hover:text-white transition-colors">
                Daftar Akun
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Kolom 4: Landasan Syariat & Disclaimer (4 Kolom) -->
        <div class="lg:col-span-4 space-y-3">
          <p class="text-xs font-bold uppercase tracking-widest text-forest-400">
            Dasar Hukum & Disclaimer
          </p>
          <div class="p-4 rounded-xl bg-forest-900/60 border border-forest-800 text-xs text-forest-200/90 leading-relaxed space-y-2">
            <p>
              <strong class="text-white">Rujukan Syariat:</strong> QS. An-Nisa ayat 7, 11, 12, dan 176 serta Kompilasi Hukum Islam (KHI) Buku II Hukum Kewarisan.
            </p>
            <p class="text-[11px] text-forest-300/80 pt-1 border-t border-forest-800">
              WarisMu adalah media edukasi digital. Untuk penetapan waris berkekuatan hukum perdata, silakan ajukan permohonan penetapan ahli waris ke Pengadilan Agama atau notaris yang berwenang.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-6 border-t border-forest-900/60 flex flex-wrap items-center justify-between gap-4 text-xs text-forest-400">
        <p>&copy; {{ tahun }} WarisMu. Semua hak dilindungi undang-undang.</p>
        <p class="text-[11px] text-forest-500">
          Dirancang dengan ketenangan dan keadilan syariat untuk keluarga Indonesia.
        </p>
      </div>
    </div>
  </footer>
</template>
