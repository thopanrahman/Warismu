<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import ArticleCard from '../components/ArticleCard.vue'
import InfoModal from '../components/InfoModal.vue'
import { daftarPanduan } from '../data/panduan.js'

const modalTerbuka = ref(false)
const artikelUnggulan = daftarPanduan.slice(0, 3)
</script>

<template>
  <div class="w-full">
    <!-- Hero Section dengan live interactive preview -->
    <HeroSection @buka-modal="modalTerbuka = true" />

    <!-- Section Dua Pendekatan: Kalkulator Presisi vs AI Chat -->
    <section class="py-20 sm:py-24 bg-canvas border-b border-forest-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-12">
          <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
            Dua Pintu Masuk
          </span>
          <h2 class="font-display text-3xl sm:text-4xl font-bold text-forest-950 mt-2 tracking-tight">
            Pilih Cara yang Paling Nyaman untuk Keluargamu
          </h2>
          <p class="text-ink-600 text-base mt-3 leading-relaxed">
            Apakah Anda sudah memiliki susunan anggota keluarga, atau baru ingin menceritakan situasinya secara bebas? WarisMu menyediakan keduanya.
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2">
          <!-- Cara 1: Kalkulator Faraid Interaktif -->
          <div class="p-8 sm:p-10 rounded-3xl bg-white border border-forest-900/10 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-forest-100 text-forest-900 grid place-items-center text-2xl mb-6">
                <i class="fa-solid fa-calculator"></i>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-forest-700">Opsi 1 • Data Terstruktur</span>
              <h3 class="font-display font-bold text-2xl text-ink-900 mt-2 mb-3">
                Kalkulator Faraid Interaktif
              </h3>
              <p class="text-ink-600 text-sm leading-relaxed mb-6">
                Masukkan nilai harta kotor, kewajiban hutang, wasiat, dan jumlah anak atau kerabat.
                Dapatkan visualisasi proporsi persen, nominal per orang, dan rujukan dalil Al-Qur'an secara instan tanpa menunggu.
              </p>
            </div>
            <div class="pt-6 border-t border-forest-900/10 flex items-center justify-between">
              <span class="text-xs text-ink-500 font-medium">Tanpa registrasi • Hasil seketika</span>
              <RouterLink
                to="/kalkulator"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition-all shadow-subtle active:scale-95"
              >
                <span>Buka Kalkulator</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </RouterLink>
            </div>
          </div>

          <!-- Cara 2: Konsultasi Cerita Bahasa Alami -->
          <div class="p-8 sm:p-10 rounded-3xl bg-white border border-forest-900/10 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-forest-50 text-forest-800 grid place-items-center text-2xl mb-6">
                <i class="fa-solid fa-comments"></i>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-forest-700">Opsi 2 • Bahasa Sehari-hari</span>
              <h3 class="font-display font-bold text-2xl text-ink-900 mt-2 mb-3">
                Konsultasi AI Berbasis Percakapan
              </h3>
              <p class="text-ink-600 text-sm leading-relaxed mb-6">
                Cukup ceritakan situasi Anda dalam bahasa santai, seperti: “Ayah baru wafat, meninggalkan ibu, 2 anak laki-laki, dan sebuah rumah”.
                Asisten WarisMu akan mengajukan pertanyaan klarifikasi dengan empati hingga data lengkap.
              </p>
            </div>
            <div class="pt-6 border-t border-forest-900/10 flex items-center justify-between">
              <span class="text-xs text-ink-500 font-medium">Bercerita santai • Panduan langkah demi langkah</span>
              <RouterLink
                to="/chat"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-forest-900/20 bg-forest-50 text-forest-900 font-bold text-xs hover:bg-forest-100 transition-all active:scale-95"
              >
                <span>Mulai Percakapan</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Metodologi Alur Transparan -->
    <HowItWorks />

    <!-- Section Prinsip Syariat Faraid -->
    <section class="py-20 sm:py-24 bg-canvas border-b border-forest-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
              Keadilan Hukum Islam
            </span>
            <h2 class="font-display text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight leading-tight">
              Mengapa Faraid Bukan Sekadar Angka Pembagian?
            </h2>
            <p class="text-ink-600 text-sm sm:text-base leading-relaxed">
              Ilmu waris Islam dirancang untuk menjaga kesejahteraan antargenerasi dan mencegah sengketa yang merusak silaturahmi.
              Pembagiannya didasarkan pada besaran tanggung jawab nafkah dan derajat kedekatan nasab dengan pewaris.
            </p>
            <div class="pt-2">
              <RouterLink
                to="/panduan"
                class="inline-flex items-center gap-2 text-xs font-bold text-forest-900 hover:text-forest-700 underline underline-offset-4"
              >
                Pelajari kaidah selengkapnya di Pustaka Faraid &rarr;
              </RouterLink>
            </div>
          </div>

          <div class="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
              <span class="text-xs font-bold text-forest-800 uppercase tracking-wider">Prinsip 1</span>
              <h4 class="font-bold text-base text-ink-900 mt-1 mb-2">Bebas dari Kepentingan Pribadi</h4>
              <p class="text-xs text-ink-600 leading-relaxed">
                Karena ketentuan porsi bersumber langsung dari Al-Qur'an, tidak ada satu ahli waris pun yang berhak mengubah takaran sesuai selera pribadi tanpa keridhaan seluruh ahli waris lainnya.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
              <span class="text-xs font-bold text-forest-800 uppercase tracking-wider">Prinsip 2</span>
              <h4 class="font-bold text-base text-ink-900 mt-1 mb-2">Pelindungan Kaum Lemah</h4>
              <p class="text-xs text-ink-600 leading-relaxed">
                Ibu, istri, dan anak perempuan mendapatkan bagian pasti yang dijamin syariat dan dilindungi Kompilasi Hukum Islam, tanpa risiko dikesampingkan oleh kerabat lain.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
              <span class="text-xs font-bold text-forest-800 uppercase tracking-wider">Prinsip 3</span>
              <h4 class="font-bold text-base text-ink-900 mt-1 mb-2">Keseimbangan Beban Nafkah</h4>
              <p class="text-xs text-ink-600 leading-relaxed">
                Rasio pembagian anak laki-laki dan perempuan (2:1) sejalan dengan kewajiban syariat bahwa laki-laki menanggung nafkah istri, anak, dan kerabat perempuannya yang membutuhkan.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-white border border-forest-900/10 shadow-subtle">
              <span class="text-xs font-bold text-forest-800 uppercase tracking-wider">Prinsip 4</span>
              <h4 class="font-bold text-base text-ink-900 mt-1 mb-2">Ketetapan Hukum Positif</h4>
              <p class="text-xs text-ink-600 leading-relaxed">
                KHI Buku II Pasal 171-193 menjadi dasar yurisdiksi di Pengadilan Agama Indonesia, memberikan kepastian hukum yang kuat terhadap penetapan ahli waris.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Pustaka & Literasi Unggulan -->
    <section class="py-20 sm:py-24 bg-white border-b border-forest-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
              Pustaka Faraid
            </span>
            <h2 class="font-display text-3xl sm:text-4xl font-bold text-forest-950 mt-2 tracking-tight">
              Bacaan Penting Seputar Waris
            </h2>
          </div>
          <RouterLink
            to="/panduan"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-forest-900/20 text-forest-900 font-bold text-xs hover:bg-forest-50 transition-colors"
          >
            <span>Buka Semua Artikel</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </RouterLink>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in artikelUnggulan" :key="a.id" :artikel="a" />
        </div>
      </div>
    </section>

    <!-- Banner Ajakan Bertindak (Trust & Tranquility) -->
    <section class="py-20 bg-canvas">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative bg-forest-950 rounded-3xl p-8 sm:p-14 text-center text-white overflow-hidden shadow-float">
          <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Siap Memahami Hak Warisan Keluargamu Secara Adil?
          </h2>
          <p class="text-forest-200/80 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Perhitungan gratis, tanpa kewajiban membuat akun, dan setiap hasil disertai rujukan Al-Qur'an serta Kompilasi Hukum Islam.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <RouterLink
              to="/kalkulator"
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-forest-950 font-bold text-sm hover:bg-forest-50 transition-all shadow-subtle active:scale-95"
            >
              <i class="fa-solid fa-calculator"></i>
              <span>Simulasi Mandiri</span>
            </RouterLink>
            <RouterLink
              to="/chat"
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-forest-900 text-white border border-forest-700 font-bold text-sm hover:bg-forest-800 transition-all active:scale-95"
            >
              <i class="fa-solid fa-comments text-forest-300"></i>
              <span>Konsultasi AI</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Informasi -->
    <InfoModal :terbuka="modalTerbuka" @tutup="modalTerbuka = false" />
  </div>
</template>
