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
    <section class="relative bg-waris-950 text-white overflow-hidden">
      <div class="blob-a absolute -top-20 -left-20 w-80 h-80 bg-waris-700/30 blur-3xl pointer-events-none"></div>
      <div class="blob-b absolute -bottom-24 right-0 w-80 h-80 bg-waris-500/20 blur-3xl pointer-events-none"></div>
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-waris-200 uppercase">
            <i class="fa-solid fa-circle-info mr-1.5"></i>Tentang WarisMu
          </span>
          <h1 class="font-display text-5xl sm:text-6xl font-bold mt-3 leading-[1.05]">
            Edukasi Waris Islam untuk Semua Kalangan
          </h1>
          <p class="text-waris-50/80 mt-4 leading-relaxed">
            WarisMu adalah <strong>AI-Powered Islamic Inheritance Simulation and Education
            Assistant</strong> — platform web yang membantu masyarakat memahami pembagian harta
            waris (faraid) lewat pendekatan chatbot yang ramah dan conversational.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80"
          alt="Al-Qur'an dan tasbih"
          class="blob-b h-60 sm:h-72 w-full object-cover shadow-float border-4 border-white/90 rotate-2 hover:rotate-0 transition-all duration-500"
          loading="lazy"
        />
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid gap-8 md:grid-cols-2">
      <div class="bg-cream rounded-[2rem] border border-waris-900/10 p-8 shadow-soft hover:-translate-y-1 transition-all duration-300">
        <span class="w-14 h-14 rounded-2xl bg-waris-900/10 text-waris-900 grid place-items-center text-2xl mb-5">
          <i class="fa-solid fa-eye"></i>
        </span>
        <h2 class="font-display font-bold text-2xl text-ink">Visi</h2>
        <p class="text-sm text-ink/60 leading-relaxed mt-2">
          Menjadi asisten edukasi waris Islam paling dipercaya di Indonesia — menjembatani ilmu
          faraid klasik dengan teknologi percakapan modern, sehingga setiap keluarga dapat
          membagi warisan secara adil, transparan, dan sesuai syariat.
        </p>
      </div>
      <div class="bg-cream rounded-[2rem] rounded-tl-[4rem] border border-waris-900/10 p-8 shadow-soft hover:-translate-y-1 transition-all duration-300">
        <span class="w-14 h-14 rounded-2xl bg-waris-800/10 text-waris-800 grid place-items-center text-2xl mb-5">
          <i class="fa-solid fa-bullseye"></i>
        </span>
        <h2 class="font-display font-bold text-2xl text-ink">Misi</h2>
        <ul class="mt-3 space-y-2.5 text-sm text-ink/70">
          <li v-for="m in misi" :key="m.teks" class="flex gap-2.5">
            <i :class="m.ikon" class="text-waris-900 mt-1"></i><span>{{ m.teks }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div class="bg-cream rounded-[2rem] border border-waris-900/10 p-8 shadow-soft grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
            <i class="fa-solid fa-clock-rotate-left mr-1.5"></i>Latar Belakang
          </span>
          <h2 class="font-display font-bold text-3xl mt-3 text-ink">Kenapa WarisMu Dibuat?</h2>
          <p class="text-sm text-ink/60 leading-relaxed mt-3">
            Sengketa warisan adalah salah satu konflik keluarga paling umum di Indonesia. Akar
            masalahnya sering kali bukan niat buruk, melainkan <strong>kurangnya literasi
            faraid</strong> dan sulitnya berkonsultasi ke ahli yang kompeten.
          </p>
          <p class="text-sm text-ink/60 leading-relaxed mt-2">
            WarisMu hadir sebagai <em>gerbang pertama</em>: user bercerita dalam bahasa natural,
            sistem mengekstraksi data keluarga, menanyakan yang kurang, lalu menampilkan simulasi
            yang transparan — lengkap dengan dalil, sumber (KHI), dan disclaimer.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div class="bg-waris-50 rounded-[2rem] p-6 text-center border border-waris-900/10 hover:-translate-y-1 transition-all duration-300">
            <i class="fa-solid fa-user text-waris-900 text-2xl"></i>
            <p class="font-display font-bold mt-2 text-ink">Guest User</p>
            <p class="text-xs text-ink/55 mt-1">Konsultasi tanpa login; riwayat hilang saat browser ditutup.</p>
          </div>
          <div class="bg-waris-100/60 rounded-[2rem] rounded-br-[3.5rem] p-6 text-center border border-waris-900/10 hover:-translate-y-1 transition-all duration-300">
            <i class="fa-solid fa-user-check text-waris-800 text-2xl"></i>
            <p class="font-display font-bold mt-2 text-ink">Registered User</p>
            <p class="text-xs text-ink/55 mt-1">Punya akun; riwayat konsultasi tersimpan permanen.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-waris-50 border-2 border-dashed border-waris-800/30 rounded-[2rem] p-8">
        <h2 class="font-display font-bold text-2xl text-waris-950">
          <i class="fa-solid fa-shield-halved mr-2"></i>Batasan Produk — Penting Dibaca
        </h2>
        <ul class="mt-4 space-y-2.5 text-sm text-ink/70">
          <li v-for="b in batasan" :key="b.teks" class="flex gap-2.5">
            <i :class="b.ikon" class="text-waris-800 mt-1 shrink-0"></i><span>{{ b.teks }}</span>
          </li>
        </ul>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink to="/panduan" class="h-12 inline-flex items-center px-8 rounded-full bg-waris-900 hover:scale-105 active:scale-95 text-white text-sm font-extrabold shadow-soft transition-all duration-300">
            <i class="fa-solid fa-book-open mr-1.5"></i>Pelajari Faraid
          </RouterLink>
          <RouterLink to="/kontak" class="h-12 inline-flex items-center px-8 rounded-full border-2 border-waris-800 text-waris-800 text-sm font-extrabold hover:bg-waris-900/5 hover:scale-105 active:scale-95 transition-all duration-300">
            <i class="fa-solid fa-envelope mr-1.5"></i>Tanya Kami
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
