<script setup>
import { RouterLink } from 'vue-router'

const tahun = new Date().getFullYear()
</script>

<template>
  <footer class="bg-emerald-950 text-emerald-50 mt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-3">
      <div>
        <div class="flex items-center gap-2.5 mb-3">
          <span class="w-10 h-10 rounded-2xl bg-emerald-500 text-white grid place-items-center text-xl">
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <span class="font-extrabold text-xl">WarisMu</span>
        </div>
        <p class="text-sm text-emerald-200/80 leading-relaxed">
          Asisten edukasi &amp; simulasi waris Islam (faraid) berbasis chatbot. Membantu masyarakat
          memahami pembagian harta waris secara adil sesuai syariat.
        </p>
        <div class="flex gap-2 mt-4">
          <a href="#" aria-label="Instagram" class="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-emerald-500 transition">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a href="#" aria-label="X" class="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-emerald-500 transition">
            <i class="fa-brands fa-x-twitter"></i>
          </a>
          <a href="#" aria-label="Youtube" class="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-emerald-500 transition">
            <i class="fa-brands fa-youtube"></i>
          </a>
        </div>
      </div>
      <div>
        <h3 class="font-bold mb-3 text-white">Navigasi</h3>
        <ul class="space-y-2 text-sm">
          <li><RouterLink to="/" class="hover:text-emerald-300"><i class="fa-solid fa-house mr-2 text-xs"></i>Beranda</RouterLink></li>
          <li><RouterLink to="/tentang" class="hover:text-emerald-300"><i class="fa-solid fa-circle-info mr-2 text-xs"></i>Tentang</RouterLink></li>
          <li><RouterLink to="/panduan" class="hover:text-emerald-300"><i class="fa-solid fa-book-open mr-2 text-xs"></i>Panduan Faraid</RouterLink></li>
          <li><RouterLink to="/kontak" class="hover:text-emerald-300"><i class="fa-solid fa-envelope mr-2 text-xs"></i>Kontak</RouterLink></li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold mb-3 text-white">Disclaimer</h3>
        <p class="text-sm text-emerald-200/80 leading-relaxed">
          WarisMu adalah media edukasi dan <strong>bukan pengganti ahli faraid / ulama / notaris</strong>.
          Untuk kasus nyata, selalu konsultasikan ke ahli waris yang kompeten.
        </p>
        <p class="text-xs text-emerald-200/60 mt-4">
          <i class="fa-solid fa-book-quran mr-1.5"></i>QS. An-Nisa: 11–12, 176 • KHI Buku II
        </p>
      </div>
    </div>
    <div class="border-t border-white/10">
      <p class="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-emerald-200/60 text-center">
        © {{ tahun }} WarisMu — Tugas Proyek Desain Web • Informatika • Frontend mock (data hardcode)
      </p>
    </div>
  </footer>
</template>
