<script setup>
// Halaman Tentang WarisMu — struktur: Hero → Visi → Misi → Pilihan Layanan → Latar Belakang.
const misi = [
  {
    ikon: 'fa-solid fa-book-quran',
    teks: 'Menyebarkan literasi waris Islam yang berdalil dan mudah dipahami.',
  },
  {
    ikon: 'fa-solid fa-comments',
    teks: 'Menyederhanakan konsultasi faraid lewat percakapan bahasa natural.',
  },
  {
    ikon: 'fa-solid fa-handshake',
    teks: 'Mencegah sengketa keluarga lewat edukasi yang transparan dan adil.',
  },
]

const latarBelakang = [
  {
    nomor: '01',
    judul: 'Kenapa WarisMu Dibuat?',
    paragraf: [
      'Persoalan warisan termasuk pemicu konflik keluarga yang paling sering terjadi. Akarnya bukan selalu niat buruk, melainkan keterbatasan literasi faraid serta sulitnya mengakses informasi dan konsultasi yang kompeten.',
      'Akibatnya, harta sering dibagi tanpa pemahaman syariat yang memadai padahal ketentuannya sudah jelas dalam Al-Qur’an dan diakomodasi Kompilasi Hukum Islam.',
    ],
  },
  {
    nomor: '02',
    judul: 'Seperti Apa Bentuknya?',
    paragraf: [
      'Pengguna cukup menceritakan kondisi keluarga dengan bahasa sehari-hari. AI membantu mengidentifikasi data ahli waris, meminta informasi tambahan bila diperlukan, lalu menyajikan simulasi pembagian warisan.',
      'Setiap hasil dilengkapi dasar hukum serta rujukan Al-Qur’an, hadis, dan Kompilasi Hukum Islam (KHI), sehingga pengguna dapat menelusuri sendiri asal angka yang ditampilkan.',
    ],
  },
  {
    nomor: '03',
    judul: 'Motivasi WarisMu',
    paragraf: [
      'WarisMu adalah ikhtiar memadukan nilai Islam, pendidikan, dan inovasi digital: ilmu faraid yang klasik tetap dijaga keotentikannya, namun disampaikan lewat percakapan modern yang akrab bagi siapa saja.',
      'Semangat ini sejalan dengan Islam Berkemajuan yang diusung Muhammadiyah serta tradisi tajdid pembaruan cara, bukan penggantian isi — agar literasi waris lebih mudah diakses, transparan, dan dipahami masyarakat luas.',
    ],
  },
]
</script>

<template>
  <div>
    <!-- Hero: foto Al-Qur'an sebagai latar, judul di kiri -->
    <section class="relative -mt-[5.25rem] overflow-hidden bg-waris-950">
      <img
        src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=80"
        alt="Mushaf Al-Qur'an bernuansa hijau dan emas"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-waris-950/[0.78]"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 sm:pt-44 sm:pb-24">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/[0.12] border border-white/25 backdrop-blur px-4 py-2 text-xs font-extrabold tracking-wide text-white"
        >
          <i class="fa-solid fa-circle-info text-waris-200"></i> Tentang WarisMu
        </span>
        <h1 class="mt-6 max-w-3xl text-4xl sm:text-6xl font-bold leading-[1.05] text-white">
          Edukasi Waris Islam untuk Semua Kalangan
        </h1>
        <p class="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-waris-50/85">
          WarisMu adalah asisten edukasi dan simulasi waris Islam berbasis kecerdasan buatan yang
          membantu masyarakat memahami faraid — dari cerita keluarga sehari-hari, hingga hasil
          perhitungan yang disertai dalil dan penjelasan.
        </p>
      </div>
    </section>

    <!-- Visi: latar putih kehijauan + kartu putih besar -->
    <section class="bg-waris-50 border-b border-waris-900/10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-white rounded-3xl border border-waris-900/10 p-8 sm:p-12 shadow-soft">
          <span class="w-14 h-14 rounded-2xl bg-waris-100 text-waris-900 grid place-items-center text-2xl">
            <i class="fa-solid fa-eye"></i>
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold mt-5 text-ink">Visi</h2>
          <p class="mt-4 text-lg sm:text-xl leading-relaxed text-waris-950 font-semibold">
            “Menjadi asisten edukasi waris Islam paling dipercaya di Indonesia, menjembatani ilmu
            faraid klasik dengan teknologi percakapan modern, sehingga setiap keluarga dapat membagi
            warisan secara adil, transparan, dan sesuai syariat.”
          </p>
        </div>

        <!-- Misi: kartu putih terpisah -->
        <div class="bg-white rounded-3xl border border-waris-900/10 p-8 sm:p-12 shadow-soft mt-8">
          <span class="w-14 h-14 rounded-2xl bg-waris-100 text-waris-900 grid place-items-center text-2xl">
            <i class="fa-solid fa-bullseye"></i>
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold mt-5 text-ink">Misi</h2>
          <ul class="mt-6 space-y-4">
            <li v-for="m in misi" :key="m.teks" class="flex gap-4">
              <span
                class="w-9 h-9 shrink-0 rounded-full bg-waris-100 text-waris-900 grid place-items-center text-sm"
              >
                <i :class="m.ikon"></i>
              </span>
              <span class="text-base leading-relaxed text-ink/70 pt-1.5">{{ m.teks }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Pilihan layanan: latar hijau muda + kartu pembungkus putih -->
    <section class="bg-waris-50 border-b border-waris-900/10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-white rounded-3xl border border-waris-900/10 p-8 sm:p-12 shadow-soft">
          <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
            <i class="fa-solid fa-layer-group mr-2"></i>Tingkat Lanjutan
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold mt-4 text-ink">Pilihan Layanan</h2>
          <p class="text-ink/60 mt-3 max-w-2xl">
            Mulai dari simulasi mandiri tanpa biaya, sampai pendampingan langsung oleh ahli faraid
            ketika kasusmu membutuhkan kajian lebih dalam.
          </p>

          <div class="grid gap-6 sm:grid-cols-2 mt-8">
            <div class="bg-waris-50 rounded-2xl border border-waris-900/10 p-7">
              <span class="w-12 h-12 rounded-2xl bg-waris-100 text-waris-900 grid place-items-center text-xl">
                <i class="fa-solid fa-gift"></i>
              </span>
              <h3 class="font-bold text-xl mt-4 text-ink">Gratis</h3>
              <p class="text-sm text-ink/65 leading-relaxed mt-2">
                Akses penuh ke simulasi chatbot dan seluruh artikel panduan faraid — tanpa batas,
                tanpa biaya, dan tanpa perlu membuat akun.
              </p>
            </div>

            <div class="bg-waris-950 text-white rounded-2xl p-7">
              <span class="w-12 h-12 rounded-2xl bg-white/10 text-waris-200 grid place-items-center text-xl">
                <i class="fa-solid fa-user-tie"></i>
              </span>
              <h3 class="font-bold text-xl mt-4">Konsultasi Ahli</h3>
              <p class="text-sm text-waris-50/80 leading-relaxed mt-2">
                Bertanya langsung kepada ahli faraid tersertifikasi melalui telepon dan chat, untuk
                kasus-kasus yang perlu penelusuran lebih detail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latar belakang: kartu putih besar, tiga bagian vertikal -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="bg-white rounded-3xl border border-waris-900/10 p-8 sm:p-12 shadow-soft">
        <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
          <i class="fa-solid fa-clock-rotate-left mr-2"></i>Latar Belakang
        </span>

        <div class="mt-8 space-y-10">
          <article v-for="l in latarBelakang" :key="l.judul" class="flex gap-5">
            <span class="font-display text-2xl font-bold text-waris-200 shrink-0 pt-0.5">
              {{ l.nomor }}
            </span>
            <div>
              <h3 class="text-2xl font-bold text-ink">{{ l.judul }}</h3>
              <p
                v-for="(p, i) in l.paragraf"
                :key="i"
                class="text-sm sm:text-base text-ink/65 leading-relaxed mt-3"
              >
                {{ p }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
