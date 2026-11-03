<script setup>
import { computed, reactive, ref } from 'vue'

// Fitur interaktif 2: form dengan validasi (nama, email, pesan)
const form = reactive({ nama: '', email: '', topik: 'Pertanyaan umum', pesan: '' })
const error = reactive({ nama: '', email: '', pesan: '' })
const terkirim = ref(false)

const bolehKirim = computed(
  () => form.nama.trim() && form.email.trim() && form.pesan.trim() && !error.nama && !error.email && !error.pesan,
)

// Satu kelas untuk semua kontrol input: membulat, garis tepi hijau muda,
// latar putih kehijauan agar terpisah dari kartu putih.
const kelasKontrol =
  'w-full rounded-xl border bg-paper px-4 text-sm text-ink placeholder:text-ink/40 outline-none transition-all duration-300 focus:border-waris-700 focus:ring-2 focus:ring-waris-700/20'
const kelasLabel = 'block text-sm font-bold text-waris-950'

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
  <div class="bg-white rounded-3xl border border-waris-900/10 shadow-soft p-6 sm:p-8 lg:p-10">
    <!-- Keadaan terkirim -->
    <div v-if="terkirim" class="text-center py-10">
      <span
        class="w-16 h-16 rounded-full bg-waris-100 text-waris-900 grid place-items-center text-3xl mx-auto mb-5"
      >
        <i class="fa-solid fa-circle-check"></i>
      </span>
      <h3 class="font-display font-bold text-2xl sm:text-3xl text-waris-950">Pesan Terkirim!</h3>
      <p class="text-sm text-ink/60 mt-3 max-w-sm mx-auto leading-relaxed">
        Terima kasih, <strong class="text-waris-950">{{ form.nama }}</strong>. Pesanmu soal
        “{{ form.topik }}” sudah kami terima (simulasi frontend) dan akan dibalas ke
        <strong class="text-waris-950">{{ form.email }}</strong>.
      </p>
      <button
        class="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-waris-900 px-8 text-sm font-bold text-white shadow-soft hover:bg-waris-800 hover:scale-105 active:scale-95 transition-all duration-300"
        @click="ulangi"
      >
        <i class="fa-solid fa-rotate-left"></i> Kirim Pesan Lain
      </button>
    </div>

    <form v-else novalidate class="grid gap-5" @submit.prevent="kirim">
      <!-- Baris pertama: nama + email berdampingan -->
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="nama" :class="kelasLabel">Nama Lengkap</label>
          <input
            id="nama"
            v-model="form.nama"
            type="text"
            placeholder="cth: Aisyah Putri"
            :class="[kelasKontrol, 'mt-2 h-12', error.nama ? 'border-danger' : 'border-waris-900/15']"
            @input="validasiNama"
          />
          <p v-if="error.nama" class="text-xs text-danger font-bold mt-2">{{ error.nama }}</p>
        </div>
        <div>
          <label for="email" :class="kelasLabel">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="cth: aisyah@email.com"
            :class="[kelasKontrol, 'mt-2 h-12', error.email ? 'border-danger' : 'border-waris-900/15']"
            @input="validasiEmail"
          />
          <p v-if="error.email" class="text-xs text-danger font-bold mt-2">{{ error.email }}</p>
        </div>
      </div>

      <!-- Topik: selebar formulir -->
      <div>
        <label for="topik" :class="kelasLabel">Topik Pesan</label>
        <select
          id="topik"
          v-model="form.topik"
          :class="[kelasKontrol, 'mt-2 h-12 border-waris-900/15']"
        >
          <option>Pertanyaan umum</option>
          <option>Konsultasi faraid</option>
          <option>Lapor kesalahan konten</option>
          <option>Kerja sama / kemitraan</option>
        </select>
      </div>

      <!-- Pesan + penghitung karakter -->
      <div>
        <div class="flex items-center justify-between gap-4">
          <label for="pesan" :class="kelasLabel">Pesan</label>
          <span class="text-xs font-bold text-waris-900/60">{{ form.pesan.length }}/500</span>
        </div>
        <textarea
          id="pesan"
          v-model="form.pesan"
          rows="6"
          maxlength="500"
          placeholder="Tulis pesanmu di sini (min. 10 karakter)…"
          :class="[
            kelasKontrol,
            'mt-2 py-3.5 resize-none',
            error.pesan ? 'border-danger' : 'border-waris-900/15',
          ]"
          @input="validasiPesan"
        ></textarea>
        <p v-if="error.pesan" class="text-xs text-danger font-bold mt-2">{{ error.pesan }}</p>
      </div>

      <!-- Tombol selebar formulir; hijau pucat saat formulir belum lengkap -->
      <button
        type="submit"
        :disabled="!bolehKirim"
        class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300"
        :class="
          bolehKirim
            ? 'bg-waris-900 text-white shadow-soft hover:bg-waris-800 hover:scale-[1.01] active:scale-95'
            : 'bg-waris-200/70 text-waris-900/45 cursor-not-allowed'
        "
      >
        <i class="fa-solid fa-paper-plane"></i> Kirim Pesan
      </button>
    </form>
  </div>
</template>
