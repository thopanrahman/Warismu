<script setup>
import BrandLogo from './BrandLogo.vue'

defineProps({
  terbuka: { type: Boolean, default: false },
})
defineEmits(['tutup'])
</script>

<template>
  <transition name="modal">
    <div
      v-if="terbuka"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-faraid-title"
      @click.self="$emit('tutup')"
    >
      <div
        class="modal-card bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-float border border-forest-900/10 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-forest-900/10">
          <div class="flex items-center gap-3">
            <BrandLogo class="w-10 h-10" />
            <div>
              <h3 id="modal-faraid-title" class="font-display font-bold text-xl sm:text-2xl text-forest-950">
                Mengenal Ilmu Faraid
              </h3>
              <p class="text-xs text-forest-700 font-medium">Hukum Kewarisan dalam Islam</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup jendela penjelasan faraid"
            class="w-9 h-9 grid place-items-center rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30"
            @click="$emit('tutup')"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div class="mt-4 space-y-4 text-sm text-ink-700 leading-relaxed">
          <p>
            <strong class="text-ink-900">Faraid</strong> adalah disiplin ilmu syariat yang mengatur kaidah pemindahan harta peninggalan orang yang telah wafat kepada para ahli warisnya yang berhak, bersumber dari
            <strong class="text-ink-900">Al-Qur’an Surat An-Nisa ayat 11, 12, dan 176</strong>.
          </p>

          <div class="space-y-3 pt-2">
            <div class="flex items-start gap-3 p-3.5 rounded-xl bg-forest-50/70 border border-forest-900/10">
              <span class="w-6 h-6 rounded-full bg-forest-900 text-white text-xs font-bold grid place-items-center shrink-0 mt-0.5">1</span>
              <div>
                <p class="font-bold text-ink-900 text-xs">Pasti Berdasarkan Nash (Ashabul Furudh)</p>
                <p class="text-xs text-ink-600 mt-0.5">
                  Bagian pasti (seperti 1/2, 1/4, 1/8, 2/3, 1/3, 1/6) ditentukan langsung oleh firman Allah, bukan hasil perundingan spekulatif.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3.5 rounded-xl bg-forest-50/70 border border-forest-900/10">
              <span class="w-6 h-6 rounded-full bg-forest-900 text-white text-xs font-bold grid place-items-center shrink-0 mt-0.5">2</span>
              <div>
                <p class="font-bold text-ink-900 text-xs">Kewajiban Sebelum Pembagian</p>
                <p class="text-xs text-ink-600 mt-0.5">
                  Sebelum warisan dibagi, biaya pemakaman dan hutang pewaris wajib dilunasi. Wasiat dijalankan setelahnya dengan batas maksimal sepertiga harta bersih.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3.5 rounded-xl bg-forest-50/70 border border-forest-900/10">
              <span class="w-6 h-6 rounded-full bg-forest-900 text-white text-xs font-bold grid place-items-center shrink-0 mt-0.5">3</span>
              <div>
                <p class="font-bold text-ink-900 text-xs">Diakui Hukum Indonesia</p>
                <p class="text-xs text-ink-600 mt-0.5">
                  Kaidah faraid diakomodasi resmi dalam Kompilasi Hukum Islam (KHI) Buku II dan menjadi yurisdiksi Pengadilan Agama di Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-forest-900/10 flex items-center justify-end">
          <button
            type="button"
            class="px-6 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-all shadow-subtle active:scale-95"
            @click="$emit('tutup')"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
