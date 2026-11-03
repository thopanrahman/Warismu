<script setup>
import ContactForm from '../components/ContactForm.vue'

// Informasi kontak (data hardcode — mock frontend).
// Email memakai alamat kampus mahasiswa, kampus memakai nama institusi asli.
const kanal = [
  { ikon: 'fa-solid fa-envelope', judul: 'Email', nilai: 'warismu@gmail.com' },
  { ikon: 'fa-brands fa-whatsapp', judul: 'WhatsApp', nilai: '+62 812-3456-7890' },
  { ikon: 'fa-solid fa-location-dot', judul: 'Kampus', nilai: 'Institut Teknologi Kalimantan' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-24 sm:pb-28">
    <!-- Judul halaman: label kecil + judul dua baris, di tengah -->
    <div class="text-center max-w-3xl mx-auto">
      <span
        class="inline-flex items-center gap-2 rounded-full bg-waris-100 border border-waris-900/10 px-4 py-2 text-xs font-extrabold tracking-widest text-waris-900 uppercase"
      >
        <i class="fa-solid fa-envelope"></i> Kontak
      </span>
      <h1
        class="font-display mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.06] text-waris-950"
      >
        Ada Pertanyaan?<span class="block">Sampaikan Saran</span>
      </h1>
    </div>

    <!-- Konten utama: info kontak (kiri, lebih sempit) + formulir (kanan, lebih lebar) -->
    <div class="grid gap-6 lg:grid-cols-5 items-start mt-14 sm:mt-16">
      <!-- Kolom kiri -->
      <div class="lg:col-span-2 grid gap-4">
        <div
          v-for="k in kanal"
          :key="k.judul"
          class="bg-white rounded-2xl border border-waris-900/10 shadow-soft p-5 flex items-center gap-4 hover:-translate-y-1 hover:border-waris-900/20 transition-all duration-300"
        >
          <span
            class="w-12 h-12 shrink-0 rounded-full bg-waris-100 text-waris-900 grid place-items-center text-lg"
          >
            <i :class="k.ikon"></i>
          </span>
          <div class="min-w-0">
            <p class="text-xs font-extrabold uppercase tracking-widest text-waris-900/60">
              {{ k.judul }}
            </p>
            <p class="font-bold text-sm text-waris-950 mt-0.5 break-words">{{ k.nilai }}</p>
          </div>
        </div>

        <!-- Kartu jam kerja: panel hijau tua -->
        <div class="bg-waris-950 text-white rounded-2xl shadow-soft p-6">
          <span
            class="w-12 h-12 rounded-full bg-white/10 text-waris-200 grid place-items-center text-lg"
          >
            <i class="fa-solid fa-clock"></i>
          </span>
          <p class="font-display font-bold text-xl mt-4">Jam Kerja</p>
          <p class="text-sm text-waris-50/80 leading-relaxed mt-2">
            Senin–Jumat, 09.00–17.00 WITA. Pesan di luar jam kerja dibalas hari kerja berikutnya.
          </p>
        </div>
      </div>

      <!-- Kolom kanan -->
      <div class="lg:col-span-3">
        <ContactForm />
      </div>
    </div>
  </div>
</template>
