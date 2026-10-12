<script setup>
import { RouterLink } from 'vue-router'

const misi = [
  { ikon: 'fa-solid fa-comments', teks: 'Menyederhanakan konsultasi faraid lewat percakapan bahasa natural.' },
  { ikon: 'fa-solid fa-book-quran', teks: 'Menyebarkan literasi waris Islam yang berdalil dan mudah dipahami.' },
  { ikon: 'fa-solid fa-handshake', teks: 'Mencegah sengketa keluarga lewat edukasi yang transparan dan adil.' },
]

const batasan = [
  { ikon: 'fa-solid fa-triangle-exclamation', teks: 'Bukan pengganti ahli faraid, ulama, atau notaris/PPAT.' },
  { ikon: 'fa-solid fa-gavel', teks: 'Hasil simulasi bersifat edukasi — putusan resmi tetap lewat pengadilan agama.' },
  { ikon: 'fa-solid fa-file-circle-question', teks: 'Kasus kompleks (anak angkat, waris beda agama, hibah sengketa) butuh kajian khusus.' },
]
</script>

<template>
  <div>
    <section class="bg-emerald-950 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-amber-300 uppercase">
            <i class="fa-solid fa-circle-info mr-1.5"></i>Tentang WarisMu
          </span>
          <h1 class="text-3xl sm:text-4xl font-extrabold mt-2 leading-tight">
            Edukasi Waris Islam untuk Semua Kalangan
          </h1>
          <p class="text-sm text-emerald-100/80 mt-3 leading-relaxed">
            WarisMu adalah <strong>AI-Powered Islamic Inheritance Simulation and Education
            Assistant</strong> — platform web yang membantu masyarakat memahami pembagian harta
            waris (faraid) lewat pendekatan chatbot yang ramah dan conversational.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80"
          alt="Al-Qur'an dan tasbih"
          class="rounded-3xl h-60 sm:h-72 w-full object-cover shadow-2xl border border-white/10"
          loading="lazy"
        />
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-2">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <span class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-xl mb-4">
          <i class="fa-solid fa-eye"></i>
        </span>
        <h2 class="font-extrabold text-xl">Visi</h2>
        <p class="text-sm text-slate-500 leading-relaxed mt-2">
          Menjadi asisten edukasi waris Islam paling dipercaya di Indonesia — menjembatani ilmu
          faraid klasik dengan teknologi percakapan modern, sehingga setiap keluarga dapat
          membagi warisan secara adil, transparan, dan sesuai syariat.
        </p>
      </div>
      <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <span class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center text-xl mb-4">
          <i class="fa-solid fa-bullseye"></i>
        </span>
        <h2 class="font-extrabold text-xl">Misi</h2>
        <ul class="mt-3 space-y-2.5 text-sm text-slate-600">
          <li v-for="m in misi" :key="m.teks" class="flex gap-2.5">
            <i :class="m.ikon" class="text-emerald-600 mt-1"></i><span>{{ m.teks }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm grid gap-8 md:grid-cols-2 items-center">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">
            <i class="fa-solid fa-clock-rotate-left mr-1.5"></i>Latar Belakang
          </span>
          <h2 class="font-extrabold text-xl sm:text-2xl mt-2">Kenapa WarisMu Dibuat?</h2>
          <p class="text-sm text-slate-500 leading-relaxed mt-3">
            Sengketa warisan adalah salah satu konflik keluarga paling umum di Indonesia. Akar
            masalahnya sering kali bukan niat buruk, melainkan <strong>kurangnya literasi
            faraid</strong> dan sulitnya berkonsultasi ke ahli yang kompeten.
          </p>
          <p class="text-sm text-slate-500 leading-relaxed mt-2">
            WarisMu hadir sebagai <em>gerbang pertama</em>: user bercerita dalam bahasa natural,
            sistem mengekstraksi data keluarga, menanyakan yang kurang, lalu menampilkan simulasi
            yang transparan — lengkap dengan dalil, sumber (KHI), dan disclaimer.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-emerald-50 rounded-3xl p-5 text-center">
            <i class="fa-solid fa-user text-emerald-600 text-2xl"></i>
            <p class="font-extrabold mt-2">Guest User</p>
            <p class="text-xs text-slate-500 mt-1">Konsultasi tanpa login; riwayat hilang saat browser ditutup.</p>
          </div>
          <div class="bg-amber-50 rounded-3xl p-5 text-center">
            <i class="fa-solid fa-user-check text-amber-600 text-2xl"></i>
            <p class="font-extrabold mt-2">Registered User</p>
            <p class="text-xs text-slate-500 mt-1">Punya akun; riwayat konsultasi tersimpan permanen.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div class="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8">
        <h2 class="font-extrabold text-xl text-rose-800">
          <i class="fa-solid fa-shield-halved mr-2"></i>Batasan Produk — Penting Dibaca
        </h2>
        <ul class="mt-4 space-y-2.5 text-sm text-rose-900/80">
          <li v-for="b in batasan" :key="b.teks" class="flex gap-2.5">
            <i :class="b.ikon" class="mt-1 shrink-0"></i><span>{{ b.teks }}</span>
          </li>
        </ul>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink to="/panduan" class="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-6 py-3 rounded-2xl transition">
            <i class="fa-solid fa-book-open mr-1.5"></i>Pelajari Faraid
          </RouterLink>
          <RouterLink to="/kontak" class="bg-white border border-rose-200 text-rose-700 text-sm font-bold px-6 py-3 rounded-2xl hover:bg-rose-100 transition">
            <i class="fa-solid fa-envelope mr-1.5"></i>Tanya Kami
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
