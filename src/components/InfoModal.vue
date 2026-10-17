<script setup>
defineProps({
  terbuka: { type: Boolean, default: false },
})
defineEmits(['tutup'])
</script>

<template>
  <transition name="modal">
    <div
      v-if="terbuka"
      class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-waris-950/60 backdrop-blur-sm"
      @click.self="$emit('tutup')"
    >
      <div class="modal-card bg-cream rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-float border border-waris-900/10 max-h-[85vh] overflow-y-auto">
        <div class="flex items-start justify-between gap-4">
          <span class="w-14 h-14 rounded-full bg-waris-900 text-white grid place-items-center text-2xl">
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <button
            aria-label="Tutup modal"
            class="w-11 h-11 grid place-items-center rounded-full bg-waris-900/10 hover:bg-waris-900 hover:text-white text-waris-900 transition-all duration-300 active:scale-95"
            @click="$emit('tutup')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <h3 class="font-bold text-2xl mt-4 text-ink">Apa itu Faraid?</h3>
        <p class="text-sm text-ink/60 leading-relaxed mt-2">
          <strong class="text-ink">Faraid</strong> adalah ilmu waris dalam Islam yang mengatur
          siapa saja yang berhak menerima harta peninggalan dan berapa bagian pastinya — bersumber
          dari <strong class="text-ink">QS. An-Nisa ayat 11, 12, dan 176</strong>.
        </p>
        <ul class="mt-4 space-y-3 text-sm">
          <li class="flex gap-3 bg-waris-50 rounded-lg p-4 text-ink/75">
            <i class="fa-solid fa-circle-check text-waris-900 mt-1"></i>
            <span>Bagian pasti (<em>furudh</em>): mis. suami ½ atau ¼, istri ¼ atau ⅛.</span>
          </li>
          <li class="flex gap-3 bg-waris-50 rounded-lg p-4 text-ink/75">
            <i class="fa-solid fa-circle-check text-waris-900 mt-1"></i>
            <span>Prinsip anak: laki-laki mendapat 2× bagian perempuan (QS. An-Nisa: 11).</span>
          </li>
          <li class="flex gap-3 bg-waris-50 rounded-lg p-4 text-ink/75">
            <i class="fa-solid fa-circle-check text-waris-900 mt-1"></i>
            <span>Urutan: lunasi hutang &amp; wasiat (maks. ⅓) dulu, baru bagi waris.</span>
          </li>
        </ul>
        <button
          class="mt-5 w-full h-12 rounded-lg bg-waris-900 hover:scale-[1.02] active:scale-95 text-white font-bold text-sm shadow-soft transition-all duration-300"
          @click="$emit('tutup')"
        >
          Mengerti, Lanjut Belajar!
        </button>
      </div>
    </div>
  </transition>
</template>
