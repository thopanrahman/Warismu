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
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm"
      @click.self="$emit('tutup')"
    >
      <div class="modal-card bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-start justify-between gap-4">
          <span class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">
            <i class="fa-solid fa-scale-balanced"></i>
          </span>
          <button
            aria-label="Tutup modal"
            class="w-9 h-9 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            @click="$emit('tutup')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <h3 class="font-extrabold text-xl mt-4">Apa itu Faraid?</h3>
        <p class="text-sm text-slate-500 leading-relaxed mt-2">
          <strong class="text-slate-700">Faraid</strong> adalah ilmu waris dalam Islam yang mengatur
          siapa saja yang berhak menerima harta peninggalan dan berapa bagian pastinya — bersumber
          dari <strong class="text-slate-700">QS. An-Nisa ayat 11, 12, dan 176</strong>.
        </p>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li class="flex gap-2.5 bg-slate-50 rounded-2xl p-3">
            <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
            <span>Bagian pasti (<em>furudh</em>): mis. suami ½ atau ¼, istri ¼ atau ⅛.</span>
          </li>
          <li class="flex gap-2.5 bg-slate-50 rounded-2xl p-3">
            <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
            <span>Prinsip anak: laki-laki mendapat 2× bagian perempuan (QS. An-Nisa: 11).</span>
          </li>
          <li class="flex gap-2.5 bg-slate-50 rounded-2xl p-3">
            <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
            <span>Urutan: lunasi hutang &amp; wasiat (maks. ⅓) dulu, baru bagi waris.</span>
          </li>
        </ul>
        <button
          class="mt-5 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-sm transition"
          @click="$emit('tutup')"
        >
          Mengerti, Lanjut Belajar!
        </button>
      </div>
    </div>
  </transition>
</template>
