<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const nama = ref('')
const email = ref('')
const password = ref('')
const galat = ref('')
const sibuk = ref(false)

// UC-01 Registrasi Akun → POST /api/auth/register
async function daftar() {
  galat.value = ''
  if (!nama.value.trim() || !/.+@.+\..+/.test(email.value) || password.value.length < 6) {
    galat.value = 'Isi nama, email valid, dan password minimal 6 karakter.'
    return
  }
  sibuk.value = true
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama: nama.value.trim(), email: email.value.trim(), password: password.value }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Gagal mendaftar, coba lagi.')
    localStorage.setItem('warismu_token', data.token)
    localStorage.setItem('warismu_user', JSON.stringify(data.user))
    router.push('/chat')
  } catch (e) {
    galat.value = e.message
  } finally {
    sibuk.value = false
  }
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
    <div class="w-full max-w-md bg-cream border border-waris-900/10 rounded-[2rem] shadow-soft p-6 sm:p-8">
      <span class="w-14 h-14 rounded-full bg-waris-900 text-white grid place-items-center text-xl mx-auto">
        <i class="fa-solid fa-user-plus"></i>
      </span>
      <h1 class="font-display font-bold text-2xl text-center mt-3">Daftar Akun WarisMu</h1>
      <p class="text-sm text-ink/60 font-semibold text-center mt-1">
        Simpan riwayat konsultasimu agar bisa dibuka lagi kapan saja.
      </p>

      <form class="mt-6 space-y-3" @submit.prevent="daftar">
        <input
          v-model="nama"
          type="text"
          placeholder="Nama lengkap"
          autocomplete="name"
          class="w-full h-12 px-5 rounded-full bg-white/70 border border-waris-900/20 outline-none text-sm focus:ring-2 focus:ring-waris-900/30 placeholder:text-ink/35"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          class="w-full h-12 px-5 rounded-full bg-white/70 border border-waris-900/20 outline-none text-sm focus:ring-2 focus:ring-waris-900/30 placeholder:text-ink/35"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password (min. 6 karakter)"
          autocomplete="new-password"
          class="w-full h-12 px-5 rounded-full bg-white/70 border border-waris-900/20 outline-none text-sm focus:ring-2 focus:ring-waris-900/30 placeholder:text-ink/35"
        />
        <p v-if="galat" class="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5">
          <i class="fa-solid fa-circle-exclamation mr-1.5"></i>{{ galat }}
        </p>
        <button
          type="submit"
          :disabled="sibuk"
          class="w-full h-12 rounded-full bg-waris-900 text-white text-sm font-extrabold shadow-soft transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
        >
          <i v-if="sibuk" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          {{ sibuk ? 'Mendaftarkan…' : 'Daftar Sekarang' }}
        </button>
      </form>

      <p class="text-xs text-ink/55 font-semibold text-center mt-4">
        Sudah punya akun?
        <RouterLink to="/chat" class="text-waris-900 font-extrabold hover:underline">Langsung konsultasi sebagai tamu</RouterLink>
      </p>
    </div>
  </div>
</template>
