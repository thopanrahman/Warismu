<script setup>
import { onUnmounted, ref } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  bubble: { type: Object, required: true },
})
defineEmits(['laporkan'])

const tersalin = ref(false)
let timerSalin = null

// Salin teks jawaban AI. Clipboard API butuh HTTPS/localhost; sediakan fallback
// untuk browser lama agar tombol tetap berguna saat demo.
async function salinTeks() {
  const teks = String(props.bubble.teks ?? '')
  if (!teks) return

  let berhasil = false
  try {
    await navigator.clipboard.writeText(teks)
    berhasil = true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = teks
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      berhasil = document.execCommand('copy')
      document.body.removeChild(area)
    } catch {
      berhasil = false
    }
  }

  if (!berhasil) return
  tersalin.value = true
  clearTimeout(timerSalin)
  timerSalin = setTimeout(() => {
    tersalin.value = false
  }, 2000)
}

onUnmounted(() => clearTimeout(timerSalin))
</script>

<template>
  <!-- Bubble USER: kanan, hijau waris (DESIGN.md §4.2) -->
  <div v-if="bubble.peran === 'user'" class="flex justify-end">
    <div
      class="max-w-[85%] sm:max-w-[75%] bg-waris-900 text-white rounded-xl rounded-tr-none px-5 py-3 text-sm leading-relaxed shadow-soft whitespace-pre-line"
    >
      {{ bubble.teks }}
    </div>
  </div>

  <!-- Bubble BOT: kiri, waris-50 (DESIGN.md §4.2) + avatar -->
  <div v-else class="flex justify-start gap-3">
    <BrandLogo class="w-9 h-9" />
    <div
      class="max-w-[90%] sm:max-w-[80%] bg-waris-50 text-ink rounded-xl rounded-tl-none px-5 py-4 shadow-soft"
    >
      <!-- Tanda jujur: balasan ini dibuat tanpa AI / tanpa mesin hitung -->
      <p
        v-if="bubble.mock"
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-danger-soft border border-danger/30 px-3 py-1 text-[11px] font-extrabold text-danger"
      >
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        Mode mock — bukan hasil Gemini
      </p>

      <p class="text-sm text-ink/80 leading-relaxed whitespace-pre-line">{{ bubble.teks }}</p>

      <!-- Hasil simulasi: grid div (data tabular TANPA elemen tabel, sesuai aturan dosen) -->
      <div v-if="bubble.hasil" class="mt-4 rounded-lg border border-waris-900/15 overflow-hidden">
        <p class="bg-waris-900 text-white text-xs font-extrabold px-4 py-3">
          <i class="fa-solid fa-calculator mr-2"></i>{{ bubble.hasil.judul }}
        </p>
        <div class="divide-y divide-waris-900/10 text-sm">
          <div
            v-for="b in bubble.hasil.bagian"
            :key="b.nama"
            class="grid grid-cols-[1fr_auto] gap-2 items-center px-4 py-3 bg-white/60"
          >
            <div>
              <p class="font-extrabold text-ink text-sm">{{ b.nama }}</p>
              <p class="text-xs text-ink/50 font-bold">{{ b.porsi }}</p>
            </div>
            <p class="font-extrabold text-waris-900 text-sm whitespace-nowrap">{{ b.nominal }}</p>
          </div>
        </div>
        <p class="px-4 py-3 text-xs text-ink/55 bg-waris-100 font-semibold">{{ bubble.hasil.catatan }}</p>
      </div>

      <!-- Sumber hukum otomatis (FR-11) -->
      <p v-if="bubble.sumber" class="mt-3 text-xs text-ink/55 bg-white/60 border border-waris-900/10 rounded-lg px-4 py-3">
        <i class="fa-solid fa-book mr-2 text-waris-900"></i><strong>Sumber:</strong> {{ bubble.sumber }}
      </p>

      <!-- FR-12: blok disclaimer sengaja TIDAK ditampilkan (permintaan pemilik produk).
           Datanya tetap ikut tersimpan di bubble.disclaimer, jadi bisa dinyalakan lagi
           cukup dengan mengembalikan blok <p> di bawah ini. -->
      <!-- <p v-if="bubble.disclaimer">…</p> -->

      <!-- Aksi bubble AI: laporan (bila ada hasil) + salin teks -->
      <div class="mt-3 flex items-center justify-end gap-2">
        <button
          v-if="bubble.hasil"
          type="button"
          class="text-xs font-extrabold rounded-lg px-3 py-2 border transition-all duration-300 active:scale-95"
          :class="bubble.dilapor
            ? 'bg-waris-900/10 border-waris-900/20 text-waris-900'
            : 'border-waris-900/15 text-ink/45 hover:text-waris-900 hover:border-waris-800'"
          @click="$emit('laporkan', bubble.id)"
        >
          <i class="fa-solid fa-flag mr-2"></i>{{ bubble.dilapor ? 'Dilaporkan ✓' : 'Laporkan' }}
        </button>

        <!-- Copy kecil di sudut kanan bawah; berubah jadi centang selama 2 detik -->
        <button
          type="button"
          class="w-8 h-8 grid place-items-center rounded-lg border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-900/30"
          :class="tersalin
            ? 'bg-waris-900/10 border-waris-900/20 text-waris-900'
            : 'border-waris-900/15 text-ink/45 hover:text-waris-900 hover:border-waris-800'"
          :aria-label="tersalin ? 'Teks jawaban disalin' : 'Salin teks jawaban AI'"
          :title="tersalin ? 'Tersalin' : 'Salin teks'"
          @click="salinTeks"
        >
          <i
            :class="tersalin ? 'fa-solid fa-check' : 'fa-regular fa-copy'"
            class="text-xs"
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>
