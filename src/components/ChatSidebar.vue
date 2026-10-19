<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PanelIcon from './PanelIcon.vue'

const props = defineProps({
  riwayat: { type: Array, required: true },
  total: { type: Number, default: 0 },
  sesiAktifId: { type: [String, Number], default: null },
  terbuka: { type: Boolean, default: false },
  kataKunci: { type: String, default: '' },
})
defineEmits(['baru', 'pilih', 'hapus', 'tutup', 'cari'])

// ===== Kartu user: Registered vs Guest (FR-20) — dibaca dari localStorage =====
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

// ===== Pencarian sesi =====
const kunciAktif = computed(() => props.kataKunci.trim().length > 0)

// Pecah teks jadi potongan agar kata yang cocok bisa disorot.
function sorot(teks) {
  const kunci = props.kataKunci.trim().toLowerCase()
  const isi = String(teks ?? '')
  if (!kunci) return [{ teks: isi, cocok: false }]

  const hasil = []
  const rendah = isi.toLowerCase()
  let i = 0
  let pos = rendah.indexOf(kunci, i)
  while (pos !== -1) {
    if (pos > i) hasil.push({ teks: isi.slice(i, pos), cocok: false })
    hasil.push({ teks: isi.slice(pos, pos + kunci.length), cocok: true })
    i = pos + kunci.length
    pos = rendah.indexOf(kunci, i)
  }
  if (!hasil.length) return [{ teks: isi, cocok: false }]
  if (i < isi.length) hasil.push({ teks: isi.slice(i), cocok: false })
  return hasil
}

// Waktu terakhir sesi diperbarui: jam untuk hari ini, tanggal untuk hari lain.
function waktu(t) {
  if (!t) return ''
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  const hariIni = d.toDateString() === new Date().toDateString()
  return hariIni
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
function waktuLengkap(t) {
  if (!t) return ''
  return new Date(t).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

// ===== Pengelompokan & label waktu =====
// Riwayat dari versi lama belum punya properti `waktu`. Data TIDAK dihapus —
// hanya dikelompokkan & diberi label cadangan agar UI tidak terlihat rusak.
const URUTAN_GRUP = ['Hari ini', 'Kemarin', 'Minggu lalu']
const GRUP_CADANGAN = 'Percakapan Sebelumnya'

function grupDariWaktu(t) {
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return null
  const awalHari = (x) => {
    const c = new Date(x)
    c.setHours(0, 0, 0, 0)
    return c
  }
  const selisih = Math.round((awalHari(Date.now()) - awalHari(d)) / 86400000)
  if (selisih <= 0) return 'Hari ini'
  if (selisih === 1) return 'Kemarin'
  return 'Minggu lalu'
}

// Grup diturunkan dari stempel waktu. Tanpa stempel waktu (data lama) item tetap
// tampil, hanya masuk grup cadangan — jadi tidak ada riwayat yang hilang.
function grupDari(r) {
  return (r.waktu && grupDariWaktu(r.waktu)) || GRUP_CADANGAN
}

// Label waktu satu item: jam/tanggal, atau teks cadangan bila stempel waktu kosong.
function labelWaktu(r) {
  return waktu(r.waktu) || GRUP_CADANGAN
}

const kelompok = computed(() =>
  [...URUTAN_GRUP, GRUP_CADANGAN]
    .map((nama) => ({ nama, item: props.riwayat.filter((r) => grupDari(r) === nama) }))
    .filter((g) => g.item.length),
)
</script>

<template>
  <div>
    <!-- Overlay drawer (mobile): klik untuk menutup -->
    <transition name="fade">
      <div
        v-if="terbuka"
        class="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] md:hidden"
        aria-hidden="true"
        @click="$emit('tutup')"
      ></div>
    </transition>

    <!-- Pembungkus: menyusutkan lebar di desktop agar area chat melebar saat ditutup -->
    <div
      class="shrink-0 w-0 overflow-hidden transition-[width] duration-300 ease-out md:h-full"
      :class="terbuka ? 'md:w-72' : 'md:w-0'"
    >
      <aside
        :id="'sidebar-riwayat'"
        class="fixed inset-y-0 left-0 z-50 w-72 h-full bg-waris-950 text-waris-50 flex flex-col rounded-r-2xl md:rounded-2xl shadow-float transition-transform duration-300 ease-out md:static md:z-auto md:transition-none"
        :class="terbuka ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
        :aria-hidden="terbuka ? 'false' : 'true'"
        :inert="terbuka ? null : true"
      >
        <!-- Header -->
        <div class="flex items-center justify-between gap-2 p-4">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-9 h-9 shrink-0 rounded-full bg-waris-500 text-white grid place-items-center">
              <i class="fa-solid fa-scale-balanced text-sm"></i>
            </span>
            <span class="font-display font-bold truncate">Riwayat</span>
          </div>
          <button
            type="button"
            title="Tutup sidebar"
            aria-label="Tutup sidebar"
            aria-controls="sidebar-riwayat"
            class="w-9 h-9 shrink-0 grid place-items-center rounded-full text-waris-100/70 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-300 transition-all duration-200"
            @click="$emit('tutup')"
          >
            <PanelIcon arah="kiri" />
          </button>
        </div>

        <div class="px-4">
          <button
            type="button"
            class="w-full h-11 inline-flex items-center justify-center gap-2 rounded-full bg-waris-500 hover:bg-waris-600 active:scale-95 text-white text-sm font-extrabold shadow-soft transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-200"
            @click="$emit('baru')"
          >
            <i class="fa-solid fa-plus"></i> Sesi Baru
          </button>
        </div>

        <!-- Pencarian sesi (kapsul) -->
        <div class="px-4 pt-3">
          <div class="relative" role="search">
            <label for="cari-sesi" class="sr-only">Cari sesi percakapan</label>
            <i
              class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xs text-waris-100/50"
              aria-hidden="true"
            ></i>
            <input
              id="cari-sesi"
              :value="kataKunci"
              type="search"
              placeholder="Cari sesi…"
              autocomplete="off"
              class="w-full h-11 rounded-full bg-white/10 border border-white/10 pl-10 pr-11 text-sm font-semibold text-white placeholder:text-waris-100/45 outline-none transition-all duration-200 focus:bg-white/15 focus:border-waris-300/50 focus-visible:ring-2 focus-visible:ring-waris-300/60"
              @input="$emit('cari', $event.target.value)"
            />
            <button
              v-if="kataKunci"
              type="button"
              aria-label="Hapus kata kunci pencarian"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full text-waris-100/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
              @click="$emit('cari', '')"
            >
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Daftar riwayat (FR-29 mock) -->
        <div class="flex-1 overflow-y-auto px-3 py-4 space-y-4" aria-live="polite">
          <p v-if="kunciAktif && riwayat.length" class="px-2 text-[11px] font-bold text-waris-100/50">
            {{ riwayat.length }} sesi cocok dengan “{{ kataKunci }}”
          </p>

          <div v-for="g in kelompok" :key="g.nama">
            <p class="px-2 text-xs font-extrabold uppercase tracking-widest text-waris-100/40 mb-2">
              {{ g.nama }}
            </p>
            <button
              v-for="r in g.item"
              :key="r.id"
              type="button"
              :title="waktu(r.waktu) ? 'Diperbarui ' + waktuLengkap(r.waktu) : GRUP_CADANGAN"
              :aria-current="r.id === sesiAktifId ? 'true' : undefined"
              class="w-full text-left px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-300"
              :class="
                r.id === sesiAktifId
                  ? 'bg-white/15 text-white'
                  : 'text-waris-100/70 hover:bg-white/10 hover:text-white'
              "
              @click="$emit('pilih', r)"
            >
              <span class="flex items-start gap-3">
                <i class="fa-regular fa-message text-xs shrink-0 mt-1.5" aria-hidden="true"></i>
                <span class="min-w-0 flex-1">
                  <span class="flex items-baseline gap-2">
                    <span class="min-w-0 flex-1 truncate text-sm font-bold">
                      <template v-for="(bagian, i) in sorot(r.judul)" :key="i"
                        ><mark
                          v-if="bagian.cocok"
                          class="bg-waris-300/40 text-white rounded px-0.5"
                          >{{ bagian.teks }}</mark
                        ><span v-else>{{ bagian.teks }}</span></template
                      >
                    </span>
                    <span v-if="waktu(r.waktu)" class="shrink-0 text-[10px] font-bold text-waris-100/45">
                      {{ waktu(r.waktu) }}
                    </span>
                  </span>
                  <!-- Fallback data lama tanpa stempel waktu: label teks, bukan ruang kosong -->
                  <span
                    v-if="!waktu(r.waktu)"
                    class="mt-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-waris-100/40"
                  >
                    {{ labelWaktu(r) }}
                  </span>
                  <span
                    v-if="r.cuplikan"
                    class="mt-1 block text-xs leading-snug text-waris-100/55 line-clamp-2"
                  >
                    <template v-for="(bagian, i) in sorot(r.cuplikan)" :key="i"
                      ><mark
                        v-if="bagian.cocok"
                        class="bg-waris-300/40 text-white rounded px-0.5"
                        >{{ bagian.teks }}</mark
                      ><span v-else>{{ bagian.teks }}</span></template
                    >
                  </span>
                </span>
              </span>
            </button>
          </div>

          <!-- State: riwayat masih kosong -->
          <div v-if="!riwayat.length && !kunciAktif" class="text-center text-xs text-waris-100/50 py-8">
            <i class="fa-solid fa-folder-open text-2xl block mb-2" aria-hidden="true"></i>
            Riwayat kosong.
          </div>

          <!-- State: pencarian tidak menemukan hasil -->
          <div v-if="!riwayat.length && kunciAktif" class="text-center py-8">
            <i class="fa-solid fa-magnifying-glass text-2xl block mb-2 text-waris-100/40" aria-hidden="true"></i>
            <p class="text-sm font-extrabold text-waris-100/70">Sesi tidak ditemukan</p>
            <p class="text-xs text-waris-100/45 mt-1">Coba kata kunci lain.</p>
          </div>
        </div>

        <div class="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            :disabled="total === 0"
            class="w-full text-xs font-bold flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waris-300"
            :class="
              total === 0
                ? 'text-waris-100/25 cursor-not-allowed'
                : 'text-waris-100/55 hover:text-danger-light hover:bg-white/5'
            "
            @click="$emit('hapus')"
          >
            <i class="fa-solid fa-trash-can" aria-hidden="true"></i> Hapus riwayat
          </button>

          <!-- Kartu user: Registered vs Guest (FR-20) -->
          <div v-if="pengguna" class="bg-white/10 rounded-xl px-3 py-3">
            <div class="flex items-center gap-3">
              <span
                class="w-9 h-9 rounded-full bg-waris-300 text-waris-950 grid place-items-center text-xs font-extrabold shrink-0"
                >{{ inisial }}</span
              >
              <div class="min-w-0 flex-1">
                <p class="text-sm font-extrabold truncate">{{ pengguna.nama }}</p>
              </div>
              <button
                type="button"
                aria-label="Keluar"
                title="Keluar"
                class="w-8 h-8 shrink-0 grid place-items-center rounded-full text-waris-100/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                @click="keluar"
              >
                <i class="fa-solid fa-right-from-bracket text-xs"></i>
              </button>
            </div>
          </div>
          <RouterLink
            v-else
            to="/daftar"
            class="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-3 py-3 transition-colors duration-200"
            @click="$emit('tutup')"
          >
            <span
              class="w-9 h-9 rounded-full bg-waris-500 text-white grid place-items-center text-xs shrink-0"
            >
              <i class="fa-solid fa-user-plus"></i>
            </span>
            <span class="text-sm font-extrabold">Daftar / Masuk</span>
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>
