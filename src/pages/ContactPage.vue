<script setup>
import ContactForm from '../components/ContactForm.vue'

const kanal = [
  { ikon: 'fa-solid fa-envelope', judul: 'Email', nilai: 'halo@warismu.id', tint: 'bg-waris-900/10 text-waris-900' },
  { ikon: 'fa-brands fa-whatsapp', judul: 'WhatsApp', nilai: '+62 812-3456-7890', tint: 'bg-waris-800/10 text-waris-800' },
  { ikon: 'fa-solid fa-location-dot', judul: 'Kampus', nilai: 'Prodi Informatika, Indonesia', tint: 'bg-waris-700/10 text-waris-700' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center max-w-2xl mx-auto">
      <span class="text-xs font-extrabold tracking-widest text-waris-900 uppercase">
        <i class="fa-solid fa-envelope mr-2"></i>Kontak
      </span>
      <h1 class="text-5xl sm:text-6xl font-bold mt-3 text-ink">Ada Pertanyaan? Sampaikan!</h1>
      <p class="text-ink/60 mt-3">
        Form ini dilengkapi validasi otomatis — tombol aktif hanya jika nama, email, dan pesan valid.
      </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-5 mt-12 items-start">
      <div class="lg:col-span-2 grid gap-8">
        <div
          v-for="k in kanal"
          :key="k.judul"
          class="bg-cream rounded-lg border border-waris-900/10 p-5 flex items-center gap-4 shadow-soft hover:-translate-y-1 transition-all duration-300"
        >
          <span class="w-14 h-14 rounded-full grid place-items-center text-xl shrink-0" :class="k.tint">
            <i :class="k.ikon"></i>
          </span>
          <div>
            <p class="text-xs text-ink/45 font-extrabold uppercase tracking-wide">{{ k.judul }}</p>
            <p class="font-extrabold text-sm text-ink">{{ k.nilai }}</p>
          </div>
        </div>
        <div class="bg-waris-950 text-white rounded-lg p-7 shadow-soft">
          <p class="font-bold text-xl"><i class="fa-solid fa-clock mr-2 text-waris-300"></i>Jam Respon</p>
          <p class="text-sm text-waris-50/75 mt-2">
            Senin–Jumat, 09.00–17.00 WIB. Pesan di luar jam kerja dibalas hari kerja berikutnya.
          </p>
        </div>
      </div>
      <div class="lg:col-span-3">
        <ContactForm />
      </div>
    </div>
  </div>
</template>
