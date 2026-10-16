<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  riwayat: { type: Array, required: true },
  sesiAktifId: { type: [String, Number], default: null },
  terbuka: { type: Boolean, default: false },
})
defineEmits(['baru', 'pilih', 'hapus', 'tutup'])

// Kartu user: Registered vs Guest (FR-20) — dibaca dari localStorage (diisi UC-01)
const pengguna = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('warismu_user'))
  } catch {
    return null
  }
})
const inisial = computed(() => {
  const n = pengguna.value?.nama || '?'
  return n.trim().charAt(0).toUpperCase()
})
function keluar() {
  localStorage.removeItem('warismu_token')
  localStorage.removeItem('warismu_user')
  location.reload()
}

// Kelompokkan riwayat ala DeepSeek: Hari ini / Kemarin / Minggu lalu
const kelompok = computed(() => {
  const urutan = ['Hari ini', 'Kemarin', 'Minggu lalu']
  return urutan
    .map((nama) => ({ nama, item: props.riwayat.filter((r) => r.grup === nama) }))
    .filter((g) => g.item.length)
})
</script>

<template>
  <div>
    <!-- Overlay mobile -->
    <transition name="fade">
      <div v-if="terbuka" class="fixed inset-0 z-40 bg-ink/40 md:hidden" @click="$emit('tutup')"></div>
    </transition>

    <aside
      class="fixed md:static z-50 md:z-auto top-0 bottom-0 left-0 w-72 shrink-0 bg-waris-950 text-waris-50 flex flex-col rounded-r-[2rem] md:rounded-[2rem] shadow-float transition-transform duration-300"
      :class="terbuka ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-2">
          <span class="w-9 h-9 rounded-full bg-waris-500 text-white grid place-items-center">
            <i class="fa-solid fa-scale-balanced text-sm"></i>
          </span>
          <span class="font-display font-bold">Riwayat</span>
        </div>
        <button
          aria-label="Tutup sidebar"
          class="md:hidden w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"
          @click="$emit('tutup')"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <div class="px-4">
        <button
          class="w-full h-11 inline-flex items-center justify-center gap-2 rounded-full bg-waris-500 hover:bg-waris-600 hover:scale-[1.02] active:scale-95 text-white text-sm font-extrabold shadow-soft transition-all duration-300"
          @click="$emit('baru')"
        >
          <i class="fa-solid fa-plus"></i> Sesi Baru
        </button>
      </div>

      <!-- Daftar riwayat konsultasi (FR-29 mock) -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <div v-for="g in kelompok" :key="g.nama">
          <p class="px-2 text-[10px] font-extrabold uppercase tracking-widest text-waris-100/50 mb-1.5">{{ g.nama }}</p>
          <button
            v-for="r in g.item"
            :key="r.id"
            class="w-full text-left px-3 py-2.5 rounded-2xl text-[13px] font-semibold flex items-center gap-2.5 transition-all duration-300 truncate"
            :class="r.id === sesiAktifId ? 'bg-white/15 text-white' : 'text-waris-100/70 hover:bg-white/10 hover:text-white'"
            @click="$emit('pilih', r)"
          >
            <i class="fa-regular fa-message text-xs shrink-0"></i>
            <span class="truncate">{{ r.judul }}</span>
          </button>
        </div>
        <div v-if="!riwayat.length" class="text-center text-xs text-waris-100/50 py-6">
          <i class="fa-solid fa-folder-open text-2xl block mb-2"></i>
          Riwayat kosong.
        </div>
      </div>

      <div class="p-3 border-t border-white/10 space-y-2">
        <button
          class="w-full text-[11px] font-bold text-waris-100/50 hover:text-[#d08c82] flex items-center gap-2 px-3 py-1.5 transition"
          @click="$emit('hapus')"
        >
          <i class="fa-solid fa-trash-can"></i> Hapus riwayat
        </button>
        <!-- Kartu user: Registered vs Guest (FR-20) -->
        <div v-if="pengguna" class="bg-white/10 rounded-2xl px-3 py-2.5">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-full bg-waris-300 text-waris-950 grid place-items-center text-xs font-extrabold shrink-0">{{ inisial }}</span>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-extrabold truncate">{{ pengguna.nama }}</p>
            </div>
            <button
              aria-label="Keluar"
              title="Keluar"
              class="w-8 h-8 shrink-0 grid place-items-center rounded-full text-waris-100/60 hover:text-white hover:bg-white/10 transition"
              @click="keluar"
            >
              <i class="fa-solid fa-right-from-bracket text-xs"></i>
            </button>
          </div>
        </div>
        <RouterLink
          v-else
          to="/daftar"
          class="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-2xl px-3 py-2.5 transition"
          @click="$emit('tutup')"
        >
          <span class="w-9 h-9 rounded-full bg-waris-500 text-white grid place-items-center text-xs shrink-0">
            <i class="fa-solid fa-user-plus"></i>
          </span>
          <span class="text-[13px] font-extrabold">Daftar / Masuk</span>
        </RouterLink>
      </div>
    </aside>
  </div>
</template>
