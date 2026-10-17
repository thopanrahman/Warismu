<script setup>
import { computed, reactive, ref } from 'vue'

// Fitur interaktif 2: form dengan validasi (nama, email, pesan)
const form = reactive({ nama: '', email: '', topik: 'Pertanyaan umum', pesan: '' })
const error = reactive({ nama: '', email: '', pesan: '' })
const terkirim = ref(false)

const bolehKirim = computed(
  () => form.nama.trim() && form.email.trim() && form.pesan.trim() && !error.nama && !error.email && !error.pesan,
)

function validasiNama() {
  error.nama =
    form.nama.trim().length < 3 ? 'Nama minimal 3 karakter.' : ''
}
function validasiEmail() {
  const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  error.email = !form.email.trim()
    ? 'Email wajib diisi.'
    : !pola.test(form.email.trim())
      ? 'Format email tidak valid.'
      : ''
}
function validasiPesan() {
  error.pesan =
    form.pesan.trim().length < 10 ? 'Pesan minimal 10 karakter.' : ''
}

function kirim() {
  validasiNama()
  validasiEmail()
  validasiPesan()
  if (error.nama || error.email || error.pesan) return
  terkirim.value = true
}

function ulangi() {
  form.nama = ''
  form.email = ''
  form.topik = 'Pertanyaan umum'
  form.pesan = ''
  terkirim.value = false
}
</script>

<template>
  <div class="bg-cream rounded-lg border border-waris-900/10 shadow-soft p-6 sm:p-8">
    <div v-if="terkirim" class="text-center py-8">
      <span class="w-16 h-16 rounded-full bg-waris-900/10 text-waris-900 grid place-items-center text-3xl mx-auto mb-4">
        <i class="fa-solid fa-circle-check"></i>
      </span>
      <h3 class="font-bold text-2xl text-ink">Pesan Terkirim!</h3>
      <p class="text-sm text-ink/60 mt-2 max-w-sm mx-auto">
        Terima kasih, <strong>{{ form.nama }}</strong>. Pesanmu soal “{{ form.topik }}” sudah kami
        terima (simulasi frontend) dan akan dibalas ke <strong>{{ form.email }}</strong>.
      </p>
      <button
        class="mt-5 h-12 px-8 rounded-lg bg-waris-900 hover:scale-105 active:scale-95 text-white text-sm font-bold shadow-soft transition-all duration-300"
        @click="ulangi"
      >
        <i class="fa-solid fa-rotate-left mr-2"></i>Kirim Pesan Lain
      </button>
    </div>

    <form v-else novalidate class="grid gap-4" @submit.prevent="kirim">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="nama" class="text-sm font-extrabold text-ink">Nama Lengkap</label>
          <input
            id="nama"
            v-model="form.nama"
            type="text"
            placeholder="cth: Aisyah Putri"
            class="mt-2 h-12 w-full rounded-lg border bg-white/50 px-5 text-sm outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-waris-900/30 focus-visible:ring-offset-2"
            :class="error.nama ? 'border-danger' : 'border-waris-900/20'"
            @input="validasiNama"
          />
          <p v-if="error.nama" class="text-xs text-danger font-bold mt-2">{{ error.nama }}</p>
        </div>
        <div>
          <label for="email" class="text-sm font-extrabold text-ink">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="cth: aisyah@email.com"
            class="mt-2 h-12 w-full rounded-lg border bg-white/50 px-5 text-sm outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-waris-900/30 focus-visible:ring-offset-2"
            :class="error.email ? 'border-danger' : 'border-waris-900/20'"
            @input="validasiEmail"
          />
          <p v-if="error.email" class="text-xs text-danger font-bold mt-2">{{ error.email }}</p>
        </div>
      </div>
      <div>
        <label for="topik" class="text-sm font-extrabold text-ink">Topik Pesan</label>
        <select
          id="topik"
          v-model="form.topik"
          class="mt-2 h-12 w-full rounded-lg border border-waris-900/20 bg-white/50 px-5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-waris-900/30 focus-visible:ring-offset-2"
        >
          <option>Pertanyaan umum</option>
          <option>Konsultasi faraid</option>
          <option>Lapor kesalahan konten</option>
          <option>Kerja sama / kemitraan</option>
        </select>
      </div>
      <div>
        <div class="flex items-center justify-between">
          <label for="pesan" class="text-sm font-extrabold text-ink">Pesan</label>
          <span class="text-xs text-ink/45 font-bold">{{ form.pesan.length }}/500</span>
        </div>
        <textarea
          id="pesan"
          v-model="form.pesan"
          rows="5"
          maxlength="500"
          placeholder="Tulis pesanmu di sini (min. 10 karakter)…"
          class="mt-2 w-full rounded-lg border bg-white/50 px-5 py-4 text-sm outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-waris-900/30 focus-visible:ring-offset-2 resize-none"
          :class="error.pesan ? 'border-danger' : 'border-waris-900/20'"
          @input="validasiPesan"
        ></textarea>
        <p v-if="error.pesan" class="text-xs text-danger font-bold mt-2">{{ error.pesan }}</p>
      </div>
      <button
        type="submit"
        :disabled="!bolehKirim"
        class="inline-flex h-12 justify-center items-center gap-2 rounded-lg px-8 text-sm font-bold text-white transition-all duration-300"
        :class="bolehKirim ? 'bg-waris-900 hover:scale-105 active:scale-95 shadow-soft' : 'bg-waris-900/25 cursor-not-allowed'"
      >
        <i class="fa-solid fa-paper-plane"></i> Kirim Pesan
      </button>
    </form>
  </div>
</template>
