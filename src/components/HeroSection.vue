<script setup>
import { RouterLink } from 'vue-router'

// Hero Beranda: foto keluarga sebagai latar + lapisan gelap agar teks putih terbaca.
// -mt-[5.25rem] = tinggi blok navbar (pt-4 App + navbar 68px) sehingga foto naik
// tepat ke tepi atas halaman dan navbar putih "mengapung" di atas foto.
defineEmits(['buka-modal'])

const janji = ['Gratis & tanpa login', 'Bahasa sehari-hari', 'Berbasis dalil & KHI']
</script>

<template>
  <section class="relative -mt-[5.25rem] overflow-hidden bg-waris-950">
    <img
      src="https://i.pinimg.com/736x/ea/6a/7a/ea6a7a55557685c0b00b78ed1e35a684.jpg"
      alt="Keluarga Muslim berkumpul bersama di ruang tamu"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <!-- Lapisan gelap: kontras teks putih WCAG-safe -->
    <div class="absolute inset-0 bg-waris-950/[0.72]"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 sm:pt-44 sm:pb-28">
      <span
        class="inline-flex items-center gap-2 rounded-full bg-white/[0.12] border border-white/25 backdrop-blur px-4 py-2 text-xs font-extrabold tracking-wide text-white"
      >
        <i class="fa-solid fa-mosque text-waris-200"></i> Asisten Waris Islam Berbasis AI
      </span>

      <h1 class="mt-6 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
        Pahami Waris Islam dengan Bercerita Saja.
      </h1>

      <p class="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-waris-50/85">
        WarisMu mengubah cerita keluargamu dalam bahasa sehari-hari menjadi simulasi faraid yang
        jelas lengkap dengan tabel bagian tiap ahli waris, dalil, dan penjelasan yang mudah
        dipahami.
      </p>

      <!-- Kolom kapsul: pintu masuk utama ke /chat -->
      <RouterLink
        to="/chat"
        class="group mt-8 flex items-center gap-3 w-full max-w-xl rounded-full bg-white pl-6 pr-2 py-2 shadow-float transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-waris-300/60"
      >
        <span class="flex-1 min-w-0 truncate text-sm sm:text-base font-bold text-ink/55">
          Ceritakan Warisan
        </span>
        <span
          class="w-11 h-11 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center transition-all duration-300 group-hover:bg-waris-800 group-hover:translate-x-0.5"
        >
          <i class="fa-solid fa-arrow-right"></i>
          <span class="sr-only">Mulai bercerita di halaman chat</span>
        </span>
      </RouterLink>

      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span v-for="j in janji" :key="j" class="text-xs sm:text-sm font-bold text-white/75">
          <i class="fa-solid fa-circle-check mr-2 text-waris-300"></i>{{ j }}
        </span>
        <button
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/75 hover:text-white underline decoration-white/30 underline-offset-4 transition-colors duration-300"
          @click="$emit('buka-modal')"
        >
          <i class="fa-solid fa-circle-question"></i> Belum kenal faraid? Apa itu Faraid?
        </button>
      </div>
    </div>
  </section>
</template>
