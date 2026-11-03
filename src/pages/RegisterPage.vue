<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { simpanLogin } from '../lib/akun.js'

const router = useRouter()
const nama = ref('')
const email = ref('')
const password = ref('')
const lihatSandi = ref(false)
const galat = ref('')
const sibuk = ref(false)

const BATAS_WAKTU_API = 10_000
const PESAN_KONEKSI = 'Gagal terhubung ke server. Coba lagi nanti.'
// Minimal 8 karakter, wajib mengandung huruf dan angka.
const SANDI_KUAT = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const sandiTidakValid = computed(
  () => password.value.length > 0 && !SANDI_KUAT.test(password.value),
)

// UC-01 Registrasi Akun → POST /api/auth/register
async function daftar() {
  galat.value = ''
  if (!nama.value.trim() || !/.+@.+\..+/.test(email.value)) {
    galat.value = 'Isi nama dan email valid.'
    return
  }
  if (!SANDI_KUAT.test(password.value)) {
    galat.value = 'Password minimal 8 karakter, kombinasi huruf dan angka.'
    return
  }

  sibuk.value = true
  // Batas 10 detik: Supabase/API yang menggantung tidak boleh membuat spinner abadi.
  const kendali = new AbortController()
  const batas = setTimeout(() => kendali.abort(), BATAS_WAKTU_API)

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama: nama.value.trim(), email: email.value.trim(), password: password.value }),
      signal: kendali.signal,
    })

    let data = {}
    try {
      data = await res.json()
    } catch { /* respons kosong / bukan JSON */ }

    if (!res.ok) {
      // 5xx = server/database bermasalah → pesan koneksi yang seragam.
      if (res.status >= 500) throw new Error(PESAN_KONEKSI)
      throw new Error(data.error || 'Gagal mendaftar, coba lagi.')
    }
    if (!data.token || !data.user) throw new Error(PESAN_KONEKSI)

    simpanLogin(data.token, data.user)
    router.push('/chat')
  } catch (e) {
    const gagalKoneksi =
      e?.name === 'AbortError' || e?.name === 'TypeError' || e?.message === PESAN_KONEKSI
    galat.value = gagalKoneksi ? PESAN_KONEKSI : e?.message || PESAN_KONEKSI
  } finally {
    clearTimeout(batas)
    sibuk.value = false
  }
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
    <div class="w-full max-w-md bg-cream border border-waris-900/10 rounded-lg shadow-soft p-6 sm:p-8">
      <span class="w-14 h-14 rounded-full bg-waris-900 text-white grid place-items-center text-xl mx-auto">
        <i class="fa-solid fa-user-plus"></i>
      </span>
      <h1 class="font-bold text-2xl text-center mt-3">Daftar Akun WarisMu</h1>

      <form class="mt-6 space-y-3" @submit.prevent="daftar">
        <input
          v-model="nama"
          type="text"
          placeholder="Nama lengkap"
          autocomplete="name"
          class="w-full h-12 px-5 rounded-lg bg-white/70 border border-waris-900/20 outline-none text-sm focus:ring-2 focus:ring-waris-900/30 placeholder:text-ink/35"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          class="w-full h-12 px-5 rounded-lg bg-white/70 border border-waris-900/20 outline-none text-sm focus:ring-2 focus:ring-waris-900/30 placeholder:text-ink/35"
        />
        <!-- Password + tombol lihat/sembunyikan -->
        <div class="relative">
          <input
            v-model="password"
            :type="lihatSandi ? 'text' : 'password'"
            placeholder="Password (min. 8 karakter, huruf + angka)"
            autocomplete="new-password"
            :aria-invalid="sandiTidakValid || undefined"
            :aria-describedby="sandiTidakValid ? 'sandi-error' : undefined"
            class="w-full h-12 pl-5 pr-14 rounded-lg bg-white/70 border outline-none text-sm focus:ring-2 placeholder:text-ink/35 transition-colors duration-200"
            :class="
              sandiTidakValid
                ? 'border-danger focus:ring-danger/30'
                : 'border-waris-900/20 focus:ring-waris-900/30'
            "
          />
          <button
            type="button"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-lg text-ink/45 hover:text-waris-900 hover:bg-waris-900/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/30"
            :aria-label="lihatSandi ? 'Sembunyikan password' : 'Tampilkan password'"
            :aria-pressed="lihatSandi"
            :title="lihatSandi ? 'Sembunyikan password' : 'Tampilkan password'"
            @click="lihatSandi = !lihatSandi"
          >
            <i :class="lihatSandi ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
        <p
          v-if="sandiTidakValid"
          id="sandi-error"
          class="text-xs font-bold text-danger mt-1 px-1"
        >
          <i class="fa-solid fa-circle-exclamation mr-1" aria-hidden="true"></i>
          Password minimal 8 karakter, kombinasi huruf dan angka.
        </p>
        <p v-if="galat" class="text-xs font-bold text-danger bg-danger-soft border border-danger/25 rounded-lg px-4 py-3">
          <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ galat }}
        </p>
        <button
          type="submit"
          :disabled="sibuk"
          class="w-full h-12 rounded-lg bg-waris-900 text-white text-sm font-extrabold shadow-soft transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
        >
          <i v-if="sibuk" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          {{ sibuk ? 'Mendaftarkan…' : 'Daftar Sekarang' }}
        </button>
      </form>

      <p class="text-xs text-ink/55 font-semibold text-center mt-4">
        Sudah punya akun?
        <RouterLink to="/masuk" class="text-waris-900 font-extrabold hover:underline">Masuk di sini</RouterLink>
      </p>
    </div>
  </div>
</template>
