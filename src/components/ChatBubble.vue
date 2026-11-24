<script setup>
import { onUnmounted, ref } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  bubble: { type: Object, required: true },
})
defineEmits(['laporkan'])

const tersalin = ref(false)
let timerSalin = null

// Salin teks jawaban AI
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
  <!-- Bubble USER: Kanan, Deep Forest Green -->
  <div v-if="bubble.peran === 'user'" class="flex justify-end my-3">
    <div
      class="max-w-[88%] sm:max-w-[75%] bg-forest-900 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-subtle whitespace-pre-line"
    >
      {{ bubble.teks }}
    </div>
  </div>

  <!-- Bubble BOT: Kiri, Clean White Card + Logo -->
  <div v-else class="flex justify-start gap-3 my-3">
    <BrandLogo class="w-8 h-8 sm:w-9 sm:h-9 shrink-0 mt-1" />
    <div
      class="max-w-[94%] sm:max-w-[85%] bg-white text-ink-900 border border-forest-900/10 rounded-2xl rounded-tl-sm p-5 sm:p-6 shadow-card space-y-4"
    >
      <!-- Mode mock notice bila AI menggunakan fallback offline -->
      <div
        v-if="bubble.mock"
        class="inline-flex items-center gap-2 rounded-lg bg-dalil-50 border border-dalil-200 px-3 py-1.5 text-xs font-bold text-dalil-700"
      >
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <span>Mode tanggap cadangan lokal (simulasi edukasi)</span>
      </div>

      <!-- Teks Jawaban Naratif AI -->
      <p class="text-sm text-ink-800 leading-relaxed whitespace-pre-line font-normal">
        {{ bubble.teks }}
      </p>

      <!-- Hasil Perhitungan Tabular / Rich Card -->
      <div v-if="bubble.hasil" class="mt-4">
        <template v-if="Array.isArray(bubble.hasil.bagian) && bubble.hasil.bagian.length">
          <div class="rounded-xl border border-forest-900/15 overflow-hidden bg-canvas/50 p-4">
            <p class="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3 flex items-center gap-2">
              <i class="fa-solid fa-calculator text-forest-700"></i>
              {{ bubble.hasil.judul || 'Simulasi Perhitungan Faraid' }}
            </p>

            <div class="space-y-2">
              <div
                v-for="b in bubble.hasil.bagian"
                :key="b.nama"
                class="flex items-center justify-between p-3 rounded-lg bg-white border border-forest-900/10 text-xs"
              >
                <div>
                  <p class="font-bold text-ink-900">{{ b.nama }}</p>
                  <p class="text-ink-500 font-mono text-[11px]">{{ b.porsi }}</p>
                </div>
                <p class="font-bold text-forest-900 font-mono text-sm whitespace-nowrap">
                  {{ b.nominal }}
                </p>
              </div>
            </div>

            <p v-if="bubble.hasil.catatan" class="mt-3 text-[11px] text-ink-500 italic">
              {{ bubble.hasil.catatan }}
            </p>
          </div>
        </template>
      </div>

      <!-- Sumber Hukum -->
      <div
        v-if="bubble.sumber"
        class="text-xs text-ink-600 bg-forest-50/70 border border-forest-900/10 rounded-xl px-4 py-2.5 flex items-center gap-2.5"
      >
        <i class="fa-solid fa-book-quran text-forest-700 text-sm"></i>
        <span><strong>Dasar Hukum:</strong> {{ bubble.sumber }}</span>
      </div>

      <!-- Disclaimer Syariat -->
      <div
        v-if="bubble.disclaimer"
        class="text-xs text-ink-700 bg-dalil-50/80 border border-dalil-200/80 rounded-xl px-4 py-3 leading-relaxed flex items-start gap-2.5"
      >
        <i class="fa-solid fa-circle-exclamation text-dalil-600 mt-0.5 shrink-0 text-sm"></i>
        <div>
          <strong class="font-bold text-ink-900">Perhatian:</strong> {{ bubble.disclaimer }}
        </div>
      </div>

      <!-- Action Footer: Laporkan & Salin -->
      <div class="pt-2 border-t border-forest-900/10 flex items-center justify-end gap-2">
        <button
          v-if="bubble.hasil"
          type="button"
          class="text-xs font-bold rounded-lg px-3 py-1.5 border transition-all duration-200 active:scale-95"
          :class="
            bubble.dilapor
              ? 'bg-forest-100 border-forest-300 text-forest-900'
              : 'border-forest-900/15 text-ink-500 hover:text-forest-900 hover:bg-forest-50'
          "
          @click="$emit('laporkan', bubble.id)"
        >
          <i class="fa-solid fa-flag mr-1.5 text-xs"></i>
          <span>{{ bubble.dilapor ? 'Dilaporkan' : 'Laporkan' }}</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-forest-900/15 text-xs font-bold text-ink-600 hover:text-forest-900 hover:bg-forest-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
          :title="tersalin ? 'Tersalin ke clipboard' : 'Salin teks jawaban'"
          @click="salinTeks"
        >
          <i :class="tersalin ? 'fa-solid fa-check text-forest-700' : 'fa-regular fa-copy'" class="text-xs"></i>
          <span>{{ tersalin ? 'Tersalin' : 'Salin Jawaban' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
