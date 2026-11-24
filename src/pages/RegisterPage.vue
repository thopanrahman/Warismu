<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { migrasiSesiTamu, simpanLogin } from '../lib/akun.js'
import BrandLogo from '../components/BrandLogo.vue'

const router = useRouter()
const nama = ref('')
const email = ref('')
const password = ref('')
const lihatSandi = ref(false)
const galat = ref('')
const sibuk = ref(false)

const BATAS_WAKTU_API = 10_000
const PESAN_KONEKSI = 'Gagal terhubung ke server. Coba lagi nanti.'
const SANDI_KUAT = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

const sandiTidakValid = computed(
  () => password.value.length > 0 && !SANDI_KUAT.test(password.value),
)

async function daftar() {
  galat.value = ''
  if (!nama.value.trim() || !/.+@.+\..+/.test(email.value)) {
    galat.value = 'Silakan isi nama lengkap dan email yang valid.'
    return
  }
  if (!SANDI_KUAT.test(password.value)) {
    galat.value = 'Password minimal 8 karakter, kombinasi huruf dan angka.'
    return
  }

  sibuk.value = true
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
    } catch {
      /* respons non-json */
    }

    if (!res.ok) {
      if (res.status >= 500) throw new Error(PESAN_KONEKSI)
      throw new Error(data.error || 'Pendaftaran gagal, coba gunakan email lain.')
    }
    if (!data.token || !data.user) throw new Error(PESAN_KONEKSI)

    simpanLogin(data.token, data.user)
    await migrasiSesiTamu(data.token)
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
  <div class="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-canvas">
    <div class="w-full max-w-md bg-white border border-forest-900/10 rounded-3xl shadow-card p-6 sm:p-8">
      <div class="text-center mb-6">
        <BrandLogo class="w-12 h-12 mx-auto mb-3" />
        <h1 class="font-display font-bold text-2xl text-forest-950">Daftar Akun WarisMu</h1>
        <p class="text-xs text-ink-500 mt-1">
          Simpan riwayat konsultasi faraid dan akses kapan saja
        </p>
      </div>

      <!-- Migration benefit note -->
      <div class="mb-5 p-3 rounded-xl bg-forest-50 border border-forest-900/10 text-[11px] text-forest-800 flex items-center gap-2">
        <i class="fa-solid fa-cloud-arrow-up text-forest-700"></i>
        <span>Konsultasi yang sedang berjalan otomatis tersimpan ke akun baru Anda.</span>
      </div>

      <form class="space-y-4" @submit.prevent="daftar">
        <div>
          <label for="regNama" class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="regNama"
            v-model="nama"
            type="text"
            placeholder="Contoh: Muhammad Ilham"
            autocomplete="name"
            class="w-full h-11 px-4 rounded-xl border border-forest-900/15 bg-canvas outline-none text-xs text-ink-900 focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 transition-all placeholder:text-ink-400"
          />
        </div>

        <div>
          <label for="regEmail" class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
            Alamat Email
          </label>
          <input
            id="regEmail"
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            autocomplete="email"
            class="w-full h-11 px-4 rounded-xl border border-forest-900/15 bg-canvas outline-none text-xs text-ink-900 focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 transition-all placeholder:text-ink-400"
          />
        </div>

        <div>
          <label for="regPassword" class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
            Password (Min. 8 Karakter)
          </label>
          <div class="relative">
            <input
              id="regPassword"
              v-model="password"
              :type="lihatSandi ? 'text' : 'password'"
              placeholder="Kombinasi huruf dan angka"
              autocomplete="new-password"
              class="w-full h-11 pl-4 pr-11 rounded-xl border bg-canvas outline-none text-xs text-ink-900 focus:ring-2 transition-all placeholder:text-ink-400"
              :class="
                sandiTidakValid
                  ? 'border-danger-DEFAULT focus:border-danger-DEFAULT focus:ring-danger-DEFAULT/20'
                  : 'border-forest-900/15 focus:border-forest-800 focus:ring-forest-800/20'
              "
            />
            <button
              type="button"
              class="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-ink-500 hover:text-forest-900 transition-colors"
              :aria-label="lihatSandi ? 'Sembunyikan password' : 'Lihat password'"
              @click="lihatSandi = !lihatSandi"
            >
              <i :class="lihatSandi ? 'fa-solid fa-eye-slash text-xs' : 'fa-solid fa-eye text-xs'"></i>
            </button>
          </div>
          <p v-if="sandiTidakValid" class="text-[11px] text-danger-DEFAULT font-bold mt-1">
            Password minimal 8 karakter, wajib kombinasi huruf dan angka.
          </p>
        </div>

        <!-- Error notification -->
        <p
          v-if="galat"
          class="text-xs font-bold text-danger-DEFAULT bg-danger-soft border border-danger-DEFAULT/20 rounded-xl px-4 py-2.5 flex items-center gap-2"
        >
          <i class="fa-solid fa-circle-exclamation shrink-0"></i>
          <span>{{ galat }}</span>
        </p>

        <button
          type="submit"
          :disabled="sibuk"
          class="w-full h-11 rounded-xl bg-forest-900 text-white text-xs font-bold shadow-subtle hover:bg-forest-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i v-if="sibuk" class="fa-solid fa-circle-notch fa-spin text-xs"></i>
          <span>{{ sibuk ? 'Mendaftarkan…' : 'Daftar Sekarang' }}</span>
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-forest-900/10 text-center">
        <p class="text-xs text-ink-600">
          Sudah memiliki akun?
          <RouterLink to="/masuk" class="text-forest-900 font-bold hover:underline ml-1">
            Masuk di sini
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
