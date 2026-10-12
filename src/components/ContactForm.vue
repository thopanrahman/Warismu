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
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
    <div v-if="terkirim" class="text-center py-8">
      <span class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center text-3xl mx-auto mb-4">
        <i class="fa-solid fa-circle-check"></i>
      </span>
      <h3 class="font-extrabold text-xl">Pesan Terkirim!</h3>
      <p class="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
        Terima kasih, <strong>{{ form.nama }}</strong>. Pesanmu soal “{{ form.topik }}” sudah kami
        terima (simulasi frontend) dan akan dibalas ke <strong>{{ form.email }}</strong>.
      </p>
      <button
        class="mt-5 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition"
        @click="ulangi"
      >
        <i class="fa-solid fa-rotate-left mr-1.5"></i>Kirim Pesan Lain
      </button>
    </div>

    <form v-else novalidate class="grid gap-4" @submit.prevent="kirim">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="nama" class="text-sm font-bold">Nama Lengkap</label>
          <input
            id="nama"
            v-model="form.nama"
            type="text"
            placeholder="cth: Aisyah Putri"
            class="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500"
            :class="error.nama ? 'border-rose-400' : 'border-slate-200'"
            @input="validasiNama"
          />
          <p v-if="error.nama" class="text-xs text-rose-500 mt-1">{{ error.nama }}</p>
        </div>
        <div>
          <label for="email" class="text-sm font-bold">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="cth: aisyah@email.com"
            class="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500"
            :class="error.email ? 'border-rose-400' : 'border-slate-200'"
            @input="validasiEmail"
          />
          <p v-if="error.email" class="text-xs text-rose-500 mt-1">{{ error.email }}</p>
        </div>
      </div>
      <div>
        <label for="topik" class="text-sm font-bold">Topik Pesan</label>
        <select
          id="topik"
          v-model="form.topik"
          class="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option>Pertanyaan umum</option>
          <option>Konsultasi faraid</option>
          <option>Lapor kesalahan konten</option>
          <option>Kerja sama / kemitraan</option>
        </select>
      </div>
      <div>
        <div class="flex items-center justify-between">
          <label for="pesan" class="text-sm font-bold">Pesan</label>
          <span class="text-xs text-slate-400">{{ form.pesan.length }}/500</span>
        </div>
        <textarea
          id="pesan"
          v-model="form.pesan"
          rows="5"
          maxlength="500"
          placeholder="Tulis pesanmu di sini (min. 10 karakter)…"
          class="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 resize-none"
          :class="error.pesan ? 'border-rose-400' : 'border-slate-200'"
          @input="validasiPesan"
        ></textarea>
        <p v-if="error.pesan" class="text-xs text-rose-500 mt-1">{{ error.pesan }}</p>
      </div>
      <button
        type="submit"
        :disabled="!bolehKirim"
        class="inline-flex justify-center items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition"
        :class="bolehKirim ? 'bg-emerald-600 hover:bg-emerald-500 shadow' : 'bg-slate-300 cursor-not-allowed'"
      >
        <i class="fa-solid fa-paper-plane"></i> Kirim Pesan
      </button>
    </form>
  </div>
</template>
