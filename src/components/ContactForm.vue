<script setup>
import { computed, reactive, ref } from 'vue'

const form = reactive({
  nama: '',
  email: '',
  topik: 'Pertanyaan umum',
  pesan: '',
})

const error = reactive({
  nama: '',
  email: '',
  pesan: '',
})

const terkirim = ref(false)

const bolehKirim = computed(
  () =>
    form.nama.trim() &&
    form.email.trim() &&
    form.pesan.trim() &&
    !error.nama &&
    !error.email &&
    !error.pesan,
)

function validasiNama() {
  error.nama = form.nama.trim().length < 3 ? 'Nama minimal 3 karakter.' : ''
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
  error.pesan = form.pesan.trim().length < 10 ? 'Pesan minimal 10 karakter.' : ''
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
  <div class="bg-white rounded-3xl border border-forest-900/10 shadow-card p-6 sm:p-8 lg:p-10">
    <!-- State Pesan Terkirim Sukses -->
    <div v-if="terkirim" class="text-center py-8">
      <span
        class="w-16 h-16 rounded-2xl bg-forest-100 text-forest-900 grid place-items-center text-3xl mx-auto mb-4"
      >
        <i class="fa-solid fa-circle-check"></i>
      </span>
      <h3 class="font-display font-bold text-2xl text-forest-950">Pesan Telah Diterima</h3>
      <p class="text-xs sm:text-sm text-ink-600 mt-2 max-w-sm mx-auto leading-relaxed">
        Terima kasih, <strong class="text-ink-900">{{ form.nama }}</strong>. Pesan Anda mengenai topik “{{ form.topik }}” telah tercatat dan akan ditindaklanjuti ke <strong class="text-ink-900">{{ form.email }}</strong>.
      </p>
      <button
        type="button"
        class="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-forest-900 px-6 text-xs font-bold text-white shadow-subtle hover:bg-forest-800 active:scale-95 transition-all"
        @click="ulangi"
      >
        <i class="fa-solid fa-rotate-left"></i>
        <span>Kirim Pesan Lain</span>
      </button>
    </div>

    <!-- Formulir Kontak -->
    <form v-else novalidate class="space-y-4" @submit.prevent="kirim">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="inputNama" class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="inputNama"
            v-model="form.nama"
            type="text"
            placeholder="Contoh: Ahmad Fauzan"
            class="w-full h-11 px-4 rounded-xl border bg-canvas text-xs text-ink-900 placeholder:text-ink-400 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 transition-all"
            :class="error.nama ? 'border-danger-DEFAULT' : 'border-forest-900/15'"
            @input="validasiNama"
          />
          <p v-if="error.nama" class="text-[11px] text-danger-DEFAULT font-bold mt-1">{{ error.nama }}</p>
        </div>

        <div>
          <label for="inputEmail" class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
            Alamat Email
          </label>
          <input
            id="inputEmail"
            v-model="form.email"
            type="email"
            placeholder="contoh@domain.com"
            class="w-full h-11 px-4 rounded-xl border bg-canvas text-xs text-ink-900 placeholder:text-ink-400 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 transition-all"
            :class="error.email ? 'border-danger-DEFAULT' : 'border-forest-900/15'"
            @input="validasiEmail"
          />
          <p v-if="error.email" class="text-[11px] text-danger-DEFAULT font-bold mt-1">{{ error.email }}</p>
        </div>
      </div>

      <div>
        <label for="inputTopik" class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
          Topik Pertanyaan
        </label>
        <select
          id="inputTopik"
          v-model="form.topik"
          class="w-full h-11 px-4 rounded-xl border border-forest-900/15 bg-canvas text-xs text-ink-900 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20"
        >
          <option>Pertanyaan umum seputar faraid</option>
          <option>Konsultasi perhitungan khusus</option>
          <option>Koreksi atau masukan dalil</option>
          <option>Kerja sama & kemitraan</option>
        </select>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="inputPesan" class="text-xs font-bold uppercase tracking-wider text-ink-700">
            Isi Pesan
          </label>
          <span class="text-[11px] font-mono text-ink-400">{{ form.pesan.length }}/500</span>
        </div>
        <textarea
          id="inputPesan"
          v-model="form.pesan"
          rows="5"
          maxlength="500"
          placeholder="Tuliskan pertanyaan atau saran Anda dengan jelas…"
          class="w-full p-4 rounded-xl border bg-canvas text-xs text-ink-900 placeholder:text-ink-400 outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 resize-none transition-all"
          :class="error.pesan ? 'border-danger-DEFAULT' : 'border-forest-900/15'"
          @input="validasiPesan"
        ></textarea>
        <p v-if="error.pesan" class="text-[11px] text-danger-DEFAULT font-bold mt-1">{{ error.pesan }}</p>
      </div>

      <button
        type="submit"
        :disabled="!bolehKirim"
        class="w-full h-11 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2"
        :class="
          bolehKirim
            ? 'bg-forest-900 text-white shadow-subtle hover:bg-forest-800 active:scale-95'
            : 'bg-forest-100 text-forest-800/40 cursor-not-allowed'
        "
      >
        <i class="fa-solid fa-paper-plane text-xs"></i>
        <span>Kirim Pesan</span>
      </button>
    </form>
  </div>
</template>
