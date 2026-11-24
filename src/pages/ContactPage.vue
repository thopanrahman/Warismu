<script setup>
import ContactForm from '../components/ContactForm.vue'

const kanal = [
  { ikon: 'fa-solid fa-envelope', judul: 'Surat Elektronik', nilai: 'warismu@gmail.com' },
  { ikon: 'fa-brands fa-whatsapp', judul: 'WhatsApp Bantuan', nilai: '+62 812-3456-7890' },
  { ikon: 'fa-solid fa-location-dot', judul: 'Afiliasi Kampus', nilai: 'Institut Teknologi Kalimantan' },
]
</script>

<template>
  <div class="w-full bg-canvas py-10 sm:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Editorial -->
      <div class="max-w-3xl mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
          Layanan & Bantuan
        </span>
        <h1 class="font-display text-3xl sm:text-5xl font-bold text-forest-950 mt-2 tracking-tight leading-[1.12]">
          Ada Pertanyaan atau Masukan Syariat?
        </h1>
        <p class="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">
          Kami senantiasa terbuka menerima pertanyaan, diskusi kasus faraid, maupun koreksi rujukan hukum demi penyempurnaan platform WarisMu.
        </p>
      </div>

      <!-- Dua Kolom: Info Kontak & Formulir -->
      <div class="grid gap-8 lg:grid-cols-12 items-start">
        <!-- Kolom Kiri: Info Kanal (5 Kolom) -->
        <div class="lg:col-span-5 space-y-4">
          <div
            v-for="k in kanal"
            :key="k.judul"
            class="p-5 rounded-2xl bg-white border border-forest-900/10 shadow-card flex items-center gap-4 hover:border-forest-900/25 transition-all"
          >
            <span class="w-12 h-12 rounded-xl bg-forest-50 text-forest-900 grid place-items-center text-lg shrink-0">
              <i :class="k.ikon"></i>
            </span>
            <div class="min-w-0">
              <p class="text-[11px] font-bold uppercase tracking-wider text-ink-500">{{ k.judul }}</p>
              <p class="font-bold text-sm text-forest-950 mt-0.5 break-words">{{ k.nilai }}</p>
            </div>
          </div>

          <!-- Jam Kerja / Layanan -->
          <div class="p-6 rounded-2xl bg-forest-950 text-white shadow-float space-y-2">
            <div class="flex items-center gap-2 text-forest-300 text-xs font-bold uppercase tracking-wider">
              <i class="fa-solid fa-clock"></i>
              <span>Waktu Operasional</span>
            </div>
            <p class="font-display font-bold text-lg text-white">Senin - Jumat, 09.00 - 17.00 WITA</p>
            <p class="text-xs text-forest-200/80 leading-relaxed">
              Pesan dan pertanyaan yang masuk di luar jam operasional akan ditanggapi pada hari kerja berikutnya.
            </p>
          </div>
        </div>

        <!-- Kolom Kanan: Form Kontak (7 Kolom) -->
        <div class="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  </div>
</template>
