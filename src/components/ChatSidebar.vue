<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PanelIcon from './PanelIcon.vue'
import BrandLogo from './BrandLogo.vue'
import { ambilPengguna, keluarAkun } from '../lib/akun.js'

const props = defineProps({
  riwayat: { type: Array, required: true },
  total: { type: Number, default: 0 },
  sesiAktifId: { type: [String, Number], default: null },
  terbuka: { type: Boolean, default: false },
  kataKunci: { type: String, default: '' },
})
defineEmits(['baru', 'pilih', 'hapus', 'tutup', 'cari'])

const pengguna = computed(() => ambilPengguna())
const inisial = computed(() => {
  const n = pengguna.value?.nama || '?'
  return n.trim().charAt(0).toUpperCase()
})

function keluar() {
  keluarAkun()
  location.reload()
}

const kunciAktif = computed(() => props.kataKunci.trim().length > 0)

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

function waktu(t) {
  if (!t) return ''
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  const hariIni = d.toDateString() === new Date().toDateString()
  return hariIni
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const URUTAN_GRUP = ['Hari ini', 'Kemarin', 'Minggu lalu']
const GRUP_CADANGAN = 'Sebelumnya'

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

function grupDari(r) {
  return (r.waktu && grupDariWaktu(r.waktu)) || GRUP_CADANGAN
}

const kelompok = computed(() =>
  [...URUTAN_GRUP, GRUP_CADANGAN]
    .map((nama) => ({ nama, item: props.riwayat.filter((r) => grupDari(r) === nama) }))
    .filter((g) => g.item.length),
)
</script>

<template>
  <div>
    <!-- Overlay drawer (mobile) -->
    <transition name="fade">
      <div
        v-if="terbuka"
        class="fixed inset-0 z-40 bg-forest-950/40 backdrop-blur-xs md:hidden"
        aria-hidden="true"
        @click="$emit('tutup')"
      ></div>
    </transition>

    <!-- Pembungkus Lebar Desktop -->
    <div
      class="shrink-0 w-0 overflow-hidden transition-[width] duration-300 ease-out md:h-full"
      :class="terbuka ? 'md:w-80' : 'md:w-0'"
    >
      <aside
        id="sidebar-riwayat"
        class="fixed inset-y-0 left-0 z-50 w-80 h-full bg-forest-950 text-white flex flex-col rounded-r-2xl md:rounded-2xl shadow-float transition-transform duration-300 ease-out md:static md:z-auto md:transition-none border border-forest-900"
        :class="terbuka ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
        :aria-hidden="terbuka ? 'false' : 'true'"
      >
        <!-- Header Sidebar -->
        <div class="flex items-center justify-between gap-2 p-4 border-b border-forest-900/60">
          <div class="flex items-center gap-2.5 min-w-0">
            <BrandLogo class="w-8 h-8 brightness-110" />
            <span class="font-display font-bold text-base tracking-tight truncate text-white">
              Riwayat Konsultasi
            </span>
          </div>
          <button
            type="button"
            title="Tutup sidebar"
            aria-label="Tutup sidebar"
            class="w-8 h-8 grid place-items-center rounded-lg text-forest-300 hover:text-white hover:bg-white/10 transition-colors"
            @click="$emit('tutup')"
          >
            <PanelIcon arah="kiri" />
          </button>
        </div>

        <!-- Tombol Sesi Baru -->
        <div class="p-3">
          <button
            type="button"
            class="w-full h-11 px-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-subtle active:scale-95"
            @click="$emit('baru')"
          >
            <i class="fa-solid fa-plus text-xs"></i>
            <span>Mulai Sesi Baru</span>
          </button>
        </div>

        <!-- Pencarian Sesi -->
        <div class="px-3 pb-2">
          <div class="relative flex items-center">
            <i class="fa-solid fa-magnifying-glass absolute left-3 text-xs text-forest-400"></i>
            <input
              type="text"
              :value="kataKunci"
              placeholder="Cari riwayat percakapan…"
              class="w-full h-9 pl-9 pr-8 rounded-lg bg-forest-900/80 border border-forest-800 text-xs text-white placeholder:text-forest-400/80 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
              @input="$emit('cari', $event.target.value)"
            />
            <button
              v-if="kunciAktif"
              type="button"
              class="absolute right-2.5 text-xs text-forest-400 hover:text-white"
              title="Bersihkan pencarian"
              @click="$emit('cari', '')"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Daftar Sesi Scrollable -->
        <div class="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <template v-if="riwayat.length">
            <div v-for="grup in kelompok" :key="grup.nama" class="space-y-1">
              <p class="px-2 text-[10px] font-extrabold uppercase tracking-wider text-forest-400">
                {{ grup.nama }}
              </p>
              <button
                v-for="r in grup.item"
                :key="r.id"
                type="button"
                class="w-full text-left p-2.5 rounded-xl transition-all duration-150 flex flex-col gap-1"
                :class="
                  sesiAktifId === r.id
                    ? 'bg-forest-800 text-white border border-forest-700'
                    : 'text-forest-200 hover:bg-forest-900/60 hover:text-white'
                "
                @click="$emit('pilih', r)"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-bold text-xs truncate">
                    <template v-for="(p, i) in sorot(r.judul)" :key="i">
                      <mark v-if="p.cocok" class="bg-forest-500 text-white rounded px-0.5">{{ p.teks }}</mark>
                      <template v-else>{{ p.teks }}</template>
                    </template>
                  </span>
                  <span class="text-[10px] text-forest-400 shrink-0 font-mono">
                    {{ waktu(r.waktu) }}
                  </span>
                </div>
                <p v-if="r.cuplikan" class="text-[11px] text-forest-300/80 line-clamp-1">
                  {{ r.cuplikan }}
                </p>
              </button>
            </div>
          </template>

          <!-- Empty State Pencarian / Riwayat Kosong -->
          <div v-else class="text-center py-10 px-4 text-xs text-forest-400">
            <i class="fa-solid fa-inbox text-2xl mb-2 text-forest-500/50"></i>
            <p v-if="kunciAktif">Tidak ada riwayat yang cocok dengan kata kunci.</p>
            <p v-else>Belum ada riwayat percakapan yang tersimpan.</p>
          </div>
        </div>

        <!-- Footer Akun & Hapus Riwayat -->
        <div class="p-3 border-t border-forest-900/60 space-y-2">
          <div
            v-if="pengguna"
            class="flex items-center justify-between p-2 rounded-xl bg-forest-900/80 border border-forest-800"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-7 h-7 rounded-full bg-forest-700 text-white text-xs font-bold grid place-items-center shrink-0">
                {{ inisial }}
              </span>
              <span class="text-xs font-bold text-white truncate">{{ pengguna.nama }}</span>
            </div>
            <button
              type="button"
              class="text-xs text-forest-300 hover:text-danger-light p-1"
              title="Keluar"
              @click="keluar"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>

          <div
            v-else
            class="p-2.5 rounded-xl bg-forest-900/60 border border-forest-800 text-[11px] text-forest-300"
          >
            <p class="font-bold text-white mb-0.5">Mode Tamu</p>
            <p>Riwayat tidak disimpan ke server.</p>
            <RouterLink to="/daftar" class="font-bold text-forest-200 underline mt-1 inline-block hover:text-white">
              Daftar akun gratis &rarr;
            </RouterLink>
          </div>

          <button
            v-if="total > 0"
            type="button"
            class="w-full py-1.5 text-[11px] font-bold text-forest-400 hover:text-danger-light transition-colors text-center"
            @click="$emit('hapus')"
          >
            <i class="fa-solid fa-trash-can mr-1"></i> Hapus Semua Riwayat
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
