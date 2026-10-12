<script setup>
import ContactForm from '../components/ContactForm.vue'

const kanal = [
  { ikon: 'fa-solid fa-envelope', judul: 'Email', nilai: 'halo@warismu.id', warna: 'bg-emerald-100 text-emerald-700' },
  { ikon: 'fa-brands fa-whatsapp', judul: 'WhatsApp', nilai: '+62 812-3456-7890', warna: 'bg-green-100 text-green-700' },
  { ikon: 'fa-solid fa-location-dot', judul: 'Kampus', nilai: 'Prodi Informatika, Indonesia', warna: 'bg-amber-100 text-amber-700' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
    <div class="text-center max-w-2xl mx-auto">
      <span class="text-xs font-extrabold tracking-widest text-emerald-600 uppercase">
        <i class="fa-solid fa-envelope mr-1.5"></i>Kontak
      </span>
      <h1 class="text-3xl sm:text-4xl font-extrabold mt-2">Ada Pertanyaan? Sampaikan!</h1>
      <p class="text-sm text-slate-500 mt-2">
        Form ini dilengkapi validasi otomatis — tombol aktif hanya jika nama, email, dan pesan valid.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-5 mt-10 items-start">
      <div class="lg:col-span-2 grid gap-4">
        <div
          v-for="k in kanal"
          :key="k.judul"
          class="bg-white rounded-3xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm"
        >
          <span class="w-12 h-12 rounded-2xl grid place-items-center text-xl shrink-0" :class="k.warna">
            <i :class="k.ikon"></i>
          </span>
          <div>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wide">{{ k.judul }}</p>
            <p class="font-bold text-sm">{{ k.nilai }}</p>
          </div>
        </div>
        <div class="bg-emerald-950 text-white rounded-3xl p-6 relative overflow-hidden">
          <i class="fa-solid fa-mosque absolute -right-4 -bottom-5 text-8xl opacity-10"></i>
          <p class="font-extrabold relative"><i class="fa-solid fa-clock mr-2 text-amber-300"></i>Jam Respon</p>
          <p class="text-sm text-emerald-100/75 mt-1.5 relative">
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
