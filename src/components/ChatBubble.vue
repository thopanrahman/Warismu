<script setup>
defineProps({
  bubble: { type: Object, required: true },
})
defineEmits(['laporkan'])
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
    <span class="w-9 h-9 shrink-0 rounded-full bg-waris-900 text-white grid place-items-center text-sm">
      <i class="fa-solid fa-scale-balanced"></i>
    </span>
    <div
      class="max-w-[90%] sm:max-w-[80%] bg-waris-50 text-ink rounded-xl rounded-tl-none px-5 py-4 shadow-soft"
    >
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

      <!-- Disclaimer wajib (FR-12) -->
      <p v-if="bubble.disclaimer" class="mt-3 text-xs text-ink/60 bg-waris-100 border border-waris-800/20 rounded-lg px-4 py-3 leading-relaxed">
        <i class="fa-solid fa-triangle-exclamation mr-2 text-waris-800"></i>{{ bubble.disclaimer }}
      </p>

      <!-- Tombol Laporkan jawaban AI (FR-19) -->
      <div v-if="bubble.hasil" class="mt-3 flex justify-end">
        <button
          class="text-xs font-extrabold rounded-lg px-3 py-2 border transition-all duration-300 active:scale-95"
          :class="bubble.dilapor
            ? 'bg-waris-900/10 border-waris-900/20 text-waris-900'
            : 'border-waris-900/15 text-ink/45 hover:text-waris-900 hover:border-waris-800'"
          @click="$emit('laporkan', bubble.id)"
        >
          <i class="fa-solid fa-flag mr-2"></i>{{ bubble.dilapor ? 'Dilaporkan ✓' : 'Laporkan' }}
        </button>
      </div>
    </div>
  </div>
</template>
