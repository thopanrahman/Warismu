<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const lihatSandi = ref(false)
const galat = ref('')
const sibuk = ref(false)

// UC-01 (lanjutan) Masuk Akun → POST /api/auth/login
async function masuk() {
  galat.value = ''
  if (!/.+@.+\..+/.test(email.value) || !password.value) {
    galat.value = 'Isi email valid dan password.'
    return
  }
  sibuk.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim(), password: password.value }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Gagal masuk, coba lagi.')
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
    <div class="w-full max-w-md bg-cream border border-waris-900/10 rounded-lg shadow-soft p-6 sm:p-8">
      <span class="w-14 h-14 rounded-full bg-waris-900 text-white grid place-items-center text-xl mx-auto">
        <i class="fa-solid fa-right-to-bracket"></i>
      </span>
      <h1 class="font-display font-bold text-2xl text-center mt-3">Masuk ke WarisMu</h1>

      <form class="mt-6 space-y-3" @submit.prevent="masuk">
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
            placeholder="Password"
            autocomplete="current-password"
            class="w-full h-12 pl-5 pr-14 rounded-lg bg-white/70 border border-waris-900/20 outline-none text-sm focus:ring-2 focus:ring-waris-900/30 placeholder:text-ink/35"
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

        <p v-if="galat" class="text-xs font-bold text-danger bg-danger-soft border border-danger/25 rounded-lg px-4 py-3">
          <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ galat }}
        </p>
        <button
          type="submit"
          :disabled="sibuk"
          class="w-full h-12 rounded-lg bg-waris-900 text-white text-sm font-extrabold shadow-soft transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
        >
          <i v-if="sibuk" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          {{ sibuk ? 'Memeriksa…' : 'Masuk' }}
        </button>
      </form>

      <p class="text-xs text-ink/55 font-semibold text-center mt-4">
        Belum punya akun?
        <RouterLink to="/daftar" class="text-waris-900 font-extrabold hover:underline">Daftar gratis</RouterLink>
      </p>
    </div>
  </div>
</template>
