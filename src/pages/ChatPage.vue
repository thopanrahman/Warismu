<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { onBeforeRouteLeave, RouterLink } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import PanelIcon from '../components/PanelIcon.vue'
import BrandLogo from '../components/BrandLogo.vue'
import { ambilPengguna, keluarAkun, panggilApi } from '../lib/akun.js'

// ============ STATE ============
const pesanBaru = ref('')
const sedangMengetik = ref(false)
const galatApi = ref('')
const teksGagal = ref('')
const konfirmasiHapus = ref(false)
const sidebarTerbuka = ref(false)
const kataKunci = ref('')
const areaPesan = ref(null)
const inputRef = ref(null)
let idCounter = Date.now()

// Status akun
const pengguna = ref(ambilPengguna())
const sudahMasuk = computed(() => !!pengguna.value)

// Riwayat konsultasi
const daftarRiwayat = reactive([])
const sesiAktifId = ref(null)
const judulSesiAktif = ref('')
const sesiTersimpan = reactive({})
const memuatRiwayat = ref(false)
const galatRiwayat = ref('')

function ringkasPesan(p) {
  return {
    peran: p.peran,
    teks: p.teks,
    tanya_lanjutan: Array.isArray(p.tanya_lanjutan) ? p.tanya_lanjutan : [],
    data_saat_ini: p.data_saat_ini ?? null,
    selesai: Boolean(p.selesai),
    mode: p.mode ?? null,
    hasil: p.hasil ?? null,
    sumber: p.sumber ?? null,
    disclaimer: p.disclaimer ?? null,
    dilapor: p.dilapor === true,
    mock: p.mock === true,
  }
}

function sesiHabis() {
  keluarAkun()
  pengguna.value = null
  daftarRiwayat.splice(0)
  Object.keys(sesiTersimpan).forEach((k) => delete sesiTersimpan[k])
  sesiAktifId.value = null
}

async function muatRiwayatServer() {
  if (!sudahMasuk.value) return
  memuatRiwayat.value = true
  galatRiwayat.value = ''
  try {
    const { ok, status, data } = await panggilApi('/api/riwayat')
    if (status === 401) return sesiHabis()
    if (!ok) throw new Error('HTTP ' + status)
    daftarRiwayat.splice(0)
    Object.keys(sesiTersimpan).forEach((k) => delete sesiTersimpan[k])
    for (const s of data.daftar ?? []) {
      sesiTersimpan[s.id] = Array.isArray(s.pesan) ? s.pesan : []
      daftarRiwayat.push({ id: s.id, judul: s.judul, waktu: s.waktu, jumlah: s.jumlah ?? 0 })
    }
  } catch {
    galatRiwayat.value = 'Riwayat belum bisa dimuat dari server.'
  } finally {
    memuatRiwayat.value = false
  }
}

let antreanSimpan = Promise.resolve()
function simpanSesiAktif() {
  antreanSimpan = antreanSimpan.then(simpanSesiSekarang).catch(() => {})
  return antreanSimpan
}

async function simpanSesiSekarang() {
  if (!sudahMasuk.value || !daftarPesan.length) return
  const judul = judulSesiAktif.value || potongJudul(daftarPesan[0]?.teks || 'Konsultasi Waris')
  try {
    const { ok, status, data } = await panggilApi('/api/riwayat', {
      method: 'POST',
      body: JSON.stringify({
        id: sesiAktifId.value,
        judul,
        pesan: daftarPesan.map(ringkasPesan),
      }),
    })
    if (status === 401) return sesiHabis()
    if (!ok || !data.id) throw new Error('HTTP ' + status)

    if (!sesiAktifId.value) {
      sesiAktifId.value = data.id
      judulSesiAktif.value = judul
      daftarRiwayat.unshift({ id: data.id, judul, waktu: Date.now(), jumlah: daftarPesan.length })
    } else {
      const item = daftarRiwayat.find((r) => r.id === sesiAktifId.value)
      if (item) {
        item.waktu = Date.now()
        item.jumlah = daftarPesan.length
      }
    }
    sesiTersimpan[sesiAktifId.value] = daftarPesan.map(ringkasPesan)
    galatRiwayat.value = ''
  } catch {
    galatRiwayat.value = 'Riwayat belum tersimpan ke server.'
  }
}

function akhiriSesi() {
  const id = sesiAktifId.value
  if (!sudahMasuk.value || !id) return
  panggilApi('/api/riwayat', {
    method: 'POST',
    body: JSON.stringify({ id, selesai: true }),
  }).catch(() => {})
}

const daftarPesan = reactive([])
const belumMulai = computed(() => daftarPesan.length === 0)
const kirimNonaktif = computed(() => sedangMengetik.value || !pesanBaru.value.trim())

function cuplikanSekitar(teks, kunci) {
  const bersih = String(teks || '').replace(/\s+/g, ' ').trim()
  const pos = bersih.toLowerCase().indexOf(kunci)
  if (pos <= 0) return bersih.slice(0, 100) + (bersih.length > 100 ? '…' : '')
  const mulai = Math.max(0, pos - 30)
  return (
    (mulai > 0 ? '…' : '') +
    bersih.slice(mulai, mulai + 110) +
    (mulai + 110 < bersih.length ? '…' : '')
  )
}

const riwayatTampil = computed(() => {
  const kunci = kataKunci.value.trim().toLowerCase()
  if (!kunci) return daftarRiwayat.map((r) => ({ ...r, cuplikan: '' }))
  return daftarRiwayat
    .map((r) => {
      const judulCocok = String(r.judul || '').toLowerCase().includes(kunci)
      const cocok = (sesiTersimpan[r.id] || []).find((p) =>
        String(p.teks || '').toLowerCase().includes(kunci),
      )
      if (!judulCocok && !cocok) return null
      return { ...r, cuplikan: cocok ? cuplikanSekitar(cocok.teks, kunci) : '' }
    })
    .filter(Boolean)
})

const PESAN_SERVER_PUTUS = 'Koneksi ke server terputus. Silakan periksa internet Anda dan coba lagi.'

function potongJudul(teks) {
  const bersih = teks.replace(/\s+/g, ' ').trim()
  return bersih.length > 38 ? bersih.slice(0, 38) + '…' : bersih
}

function simpanMigrasiChat() {
  if (!sudahMasuk.value && daftarPesan.length > 0) {
    try {
      sessionStorage.setItem('migrasi_chat', JSON.stringify(daftarPesan.map(ringkasPesan)))
    } catch (e) {
      console.warn('[Migrasi] Gagal menyimpan migrasi_chat:', e)
    }
  }
}

onBeforeRouteLeave((to) => {
  if (!sudahMasuk.value && (to.path === '/daftar' || to.path === '/masuk') && daftarPesan.length > 0) {
    simpanMigrasiChat()
  }
})

function ringkasRiwayat() {
  return daftarPesan.slice(-10).map((p) => ({
    peran: p.peran,
    teks: p.teks,
    hasil: p.hasil ?? null,
    selesai: Boolean(p.hasil),
  }))
}

function pesanMockServer(alasan) {
  if (alasan === 'mesin-hitung') {
    return 'Data keluarga sudah tercatat, namun mesin hitung di server sedang dalam pemeliharaan. Coba beberapa saat lagi.'
  }
  return 'Balasan ini dibuat dalam mode cadangan offline (simulasi edukasi).'
}

async function mintaJawaban(isi) {
  galatApi.value = ''
  teksGagal.value = ''
  sedangMengetik.value = true
  gulirBawah()
  try {
    const sudahAdaHasil = daftarPesan.some((p) => Boolean(p.hasil))
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pesan: isi,
        riwayat: ringkasRiwayat(),
        selesai: sudahAdaHasil,
      }),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    const teks = data.balas || 'Maaf, saya tidak mendapat jawaban. Silakan ulangi.'
    const mock = data.dipakaiMock === true
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      dilapor: false,
      teks,
      tanya_lanjutan: Array.isArray(data.tanya_lanjutan) ? data.tanya_lanjutan : [],
      data_saat_ini: data.data_saat_ini ?? null,
      selesai: Boolean(data.selesai),
      mode: data.mode ?? null,
      hasil: data.hasil ?? null,
      sumber: data.sumber,
      disclaimer: data.disclaimer,
      ...(mock ? { mock: true } : {}),
    })
    if (mock) {
      galatApi.value = pesanMockServer(data.alasanMock)
      teksGagal.value = isi
    }
  } catch {
    galatApi.value = PESAN_SERVER_PUTUS
    teksGagal.value = isi
  } finally {
    sedangMengetik.value = false
    gulirBawah()
    simpanSesiAktif()
  }
}

async function kirimPesan(teksLangsung = '') {
  const isi = (teksLangsung || pesanBaru.value).trim()
  if (!isi || sedangMengetik.value) return

  if (belumMulai.value && sudahMasuk.value) {
    sesiAktifId.value = null
    judulSesiAktif.value = potongJudul(isi)
    galatRiwayat.value = ''
  }

  daftarPesan.push({ id: ++idCounter, peran: 'user', teks: isi })
  pesanBaru.value = ''
  autoResize()
  gulirBawah()
  simpanSesiAktif()
  await mintaJawaban(isi)
}

function cobaUlang() {
  if (!teksGagal.value || sedangMengetik.value) return
  const terakhir = daftarPesan[daftarPesan.length - 1]
  if (terakhir?.peran === 'bot' && terakhir.mock) daftarPesan.pop()
  mintaJawaban(teksGagal.value)
}

async function laporkan(id) {
  const b = daftarPesan.find((p) => p.id === id)
  if (!b) return
  const sebelumnya = b.dilapor
  b.dilapor = !sebelumnya
  if (!sudahMasuk.value) return

  const { ok, status } = await panggilApi('/api/laporan', {
    method: 'POST',
    body: JSON.stringify({ alasan: `Jawaban nomor ${daftarPesan.indexOf(b) + 1}: ${b.teks.slice(0, 200)}` }),
  })
  if (status === 401) return sesiHabis()
  if (!ok) {
    b.dilapor = sebelumnya
    galatRiwayat.value = 'Laporan gagal dikirim ke server. Coba lagi.'
    return
  }
  galatRiwayat.value = ''
  simpanSesiAktif()
}

function gulirBawah() {
  nextTick(() => {
    if (areaPesan.value) areaPesan.value.scrollTop = areaPesan.value.scrollHeight
  })
}

function autoResize() {
  nextTick(() => {
    const el = inputRef.value
    if (!el) return
    el.style.height = 'auto'
    const maks = 4 * 24 + 24
    el.style.height = Math.min(el.scrollHeight, maks) + 'px'
  })
}

function saatEscape(e) {
  if (e.key !== 'Escape') return
  if (konfirmasiHapus.value) {
    konfirmasiHapus.value = false
    return
  }
  const layarKecil = window.matchMedia('(max-width: 767px)').matches
  if (layarKecil && sidebarTerbuka.value) sidebarTerbuka.value = false
}

onMounted(() => {
  window.addEventListener('keydown', saatEscape)
  muatRiwayatServer()

  // Periksa apakah ada prefill konsultasi dari kalkulator
  try {
    const prefill = sessionStorage.getItem('konsultasi_prefill')
    if (prefill) {
      pesanBaru.value = prefill
      sessionStorage.removeItem('konsultasi_prefill')
      autoResize()
    }
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => window.removeEventListener('keydown', saatEscape))

function tutupDrawerKecil() {
  if (window.matchMedia('(max-width: 767px)').matches) sidebarTerbuka.value = false
}

function sesiBaru(tutupSesi = true) {
  if (tutupSesi) akhiriSesi()
  daftarPesan.splice(0)
  sesiAktifId.value = null
  judulSesiAktif.value = ''
  pesanBaru.value = ''
  galatApi.value = ''
  teksGagal.value = ''
  tutupDrawerKecil()
}

function pilihRiwayat(r) {
  akhiriSesi()
  sesiAktifId.value = r.id
  judulSesiAktif.value = r.judul
  tutupDrawerKecil()
  galatApi.value = ''
  teksGagal.value = ''
  daftarPesan.splice(0)
  const tersimpan = sesiTersimpan[r.id] || []
  if (tersimpan.length) {
    tersimpan.forEach((p) => daftarPesan.push({ ...p, id: ++idCounter }))
  } else {
    daftarPesan.push({
      id: ++idCounter,
      peran: 'bot',
      teks: `Sesi "${r.judul}" tersimpan di akunmu.`,
    })
  }
  gulirBawah()
}

async function hapusSemua() {
  konfirmasiHapus.value = false
  if (!sudahMasuk.value) {
    daftarRiwayat.splice(0)
    sesiBaru(false)
    return
  }
  const { ok, status } = await panggilApi('/api/riwayat', { method: 'DELETE' })
  if (status === 401) return sesiHabis()
  if (!ok) {
    galatRiwayat.value = 'Gagal menghapus riwayat di server. Coba lagi.'
    return
  }
  galatRiwayat.value = ''
  daftarRiwayat.splice(0)
  Object.keys(sesiTersimpan).forEach((k) => delete sesiTersimpan[k])
  kataKunci.value = ''
  sesiBaru(false)
}
</script>

<template>
  <div
    class="h-[calc(100vh-5.5rem)] flex px-3 sm:px-6 pb-4 max-w-7xl mx-auto w-full transition-all"
    :class="sidebarTerbuka ? 'gap-4' : 'gap-0'"
  >
    <!-- Sidebar Riwayat -->
    <ChatSidebar
      :riwayat="riwayatTampil"
      :total="daftarRiwayat.length"
      :sesi-aktif-id="sesiAktifId"
      :terbuka="sidebarTerbuka"
      :kata-kunci="kataKunci"
      @baru="sesiBaru"
      @pilih="pilihRiwayat"
      @hapus="konfirmasiHapus = true"
      @tutup="sidebarTerbuka = false"
      @cari="kataKunci = $event"
    />

    <!-- Area Chat Utama -->
    <section
      class="flex-1 min-w-0 flex flex-col bg-canvas border border-forest-900/10 rounded-2xl shadow-card overflow-hidden"
    >
      <!-- Chat Header -->
      <div class="flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-white border-b border-forest-900/10">
        <button
          type="button"
          :title="sidebarTerbuka ? 'Tutup sidebar riwayat' : 'Buka sidebar riwayat'"
          aria-label="Toggle sidebar riwayat"
          class="w-10 h-10 shrink-0 grid place-items-center rounded-xl text-forest-900 border border-forest-900/15 hover:bg-forest-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/30 transition-all"
          @click="sidebarTerbuka = !sidebarTerbuka"
        >
          <PanelIcon :arah="sidebarTerbuka ? 'kiri' : 'kanan'" />
        </button>

        <BrandLogo class="w-8 h-8 sm:w-9 sm:h-9" />

        <div class="min-w-0">
          <p class="font-display font-bold leading-tight truncate text-forest-950 text-sm sm:text-base">
            Konsultasi Waris AI
          </p>
          <p
            v-if="sedangMengetik"
            class="text-xs font-semibold flex items-center gap-1.5 text-forest-700"
            role="status"
          >
            <span class="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
            WarisMu sedang menyiapkan jawaban…
          </p>
          <p v-else class="text-[11px] text-ink-500 font-medium">
            Percakapan Berdasar Syariat Faraid
          </p>
        </div>

        <!-- Tombol Aksi Header: Sesi Baru & Buka Kalkulator -->
        <div class="ml-auto flex items-center gap-2">
          <RouterLink
            to="/kalkulator"
            class="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-forest-900/15 text-forest-900 text-xs font-bold hover:bg-forest-50 transition-colors"
          >
            <i class="fa-solid fa-calculator text-xs"></i>
            <span>Form Kalkulator</span>
          </RouterLink>

          <button
            type="button"
            class="h-9 px-3.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 active:scale-95 transition-all shadow-subtle flex items-center gap-1.5"
            @click="sesiBaru()"
          >
            <i class="fa-solid fa-plus text-xs"></i>
            <span class="hidden sm:inline">Sesi Baru</span>
          </button>
        </div>
      </div>

      <!-- State ERROR / Notifikasi Server -->
      <div
        v-if="galatApi"
        class="mx-4 sm:mx-6 mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-danger-DEFAULT/30 bg-danger-soft px-4 py-2.5 text-xs font-bold text-danger-DEFAULT"
        role="alert"
      >
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="flex-1 min-w-[12rem]">{{ galatApi }}</span>
        <button
          v-if="teksGagal"
          type="button"
          class="h-8 px-3.5 rounded-lg bg-danger-DEFAULT text-white font-bold hover:opacity-90 active:scale-95 transition-all"
          @click="cobaUlang"
        >
          <i class="fa-solid fa-rotate-right mr-1.5 text-xs"></i>Coba Lagi
        </button>
      </div>

      <!-- EMPTY STATE: Sapaan Tenang + Input di Tengah -->
      <div
        v-if="belumMulai && !sedangMengetik"
        class="flex-1 overflow-y-auto px-4 sm:px-6 py-8 flex flex-col"
      >
        <div class="my-auto flex flex-col items-center max-w-2xl mx-auto w-full text-center">
          <BrandLogo class="w-14 h-14 mb-4 shrink-0" />
          <h2 class="font-display font-bold text-2xl sm:text-3xl text-forest-950 leading-tight">
            Assalamualaikum. Ada yang bisa WarisMu bantu seputar pembagian waris?
          </h2>
          <p class="text-sm text-ink-600 mt-2 max-w-lg leading-relaxed">
            Ceritakan kondisi keluarga Anda secara bebas dalam bahasa sehari-hari, atau tanyakan hal seputar hukum waris Islam.
          </p>

          <!-- Central Input Area -->
          <div class="w-full mt-7">
            <div
              class="flex items-end gap-2 bg-white border border-forest-900/20 rounded-2xl p-2 pl-4 shadow-card focus-within:ring-2 focus-within:ring-forest-900/30 transition-all"
            >
              <textarea
                ref="inputRef"
                v-model="pesanBaru"
                rows="1"
                placeholder="Ceritakan kondisi keluarga atau tanyakan hukum waris…"
                class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-2.5 max-h-32 text-ink-900 placeholder:text-ink-400"
                @input="autoResize"
                @keydown.enter.exact.prevent="kirimPesan()"
              ></textarea>
              <button
                type="button"
                aria-label="Kirim pesan konsultasi"
                :disabled="kirimNonaktif"
                class="w-11 h-11 shrink-0 rounded-xl grid place-items-center text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/40"
                :class="
                  kirimNonaktif
                    ? 'bg-forest-900/30 opacity-50 cursor-not-allowed'
                    : 'bg-forest-900 hover:bg-forest-800 active:scale-95 shadow-subtle'
                "
                @click="kirimPesan()"
              >
                <i class="fa-solid fa-arrow-up text-sm"></i>
              </button>
            </div>
            <p class="text-[11px] text-ink-500 mt-2.5 leading-relaxed">
              Hasil simulasi bersifat edukatif berdasarkan hukum faraid &amp; KHI, bukan fatwa atau putusan hukum resmi. Konsultasikan ke ahli faraid atau Pengadilan Agama.
            </p>
          </div>
        </div>
      </div>

      <!-- ACTIVE CHAT VIEW -->
      <template v-else>
        <!-- Daftar Pesan Chat -->
        <div ref="areaPesan" class="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          <ChatBubble
            v-for="b in daftarPesan"
            :key="b.id"
            :bubble="b"
            @laporkan="laporkan"
            @kirim-lanjut="kirimPesan"
          />

          <!-- Typing indicator -->
          <div v-if="sedangMengetik" class="flex justify-start gap-3" role="status">
            <BrandLogo class="w-8 h-8 shrink-0 mt-1" />
            <div class="bg-white border border-forest-900/10 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-card flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-forest-700 animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 rounded-full bg-forest-700 animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 rounded-full bg-forest-700 animate-bounce" style="animation-delay: 300ms"></span>
              <span class="text-xs text-ink-500 font-medium ml-1">WarisMu sedang menelaah…</span>
            </div>
          </div>
        </div>

        <!-- Bottom Input Area -->
        <div class="p-3 sm:p-4 bg-white border-t border-forest-900/10">
          <div
            class="flex items-end gap-2 bg-canvas border border-forest-900/20 rounded-2xl p-2 pl-4 focus-within:ring-2 focus-within:ring-forest-900/30 transition-all"
          >
            <textarea
              ref="inputRef"
              v-model="pesanBaru"
              rows="1"
              placeholder="Ketik tanggapan atau pertanyaan lanjutan…"
              class="flex-1 min-w-0 bg-transparent resize-none outline-none text-sm py-2 max-h-32 text-ink-900 placeholder:text-ink-400"
              @input="autoResize"
              @keydown.enter.exact.prevent="kirimPesan()"
            ></textarea>
            <button
              type="button"
              aria-label="Kirim pesan"
              :disabled="kirimNonaktif"
              class="w-10 h-10 shrink-0 rounded-xl grid place-items-center text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900/40"
              :class="
                kirimNonaktif
                  ? 'bg-forest-900/30 opacity-50 cursor-not-allowed'
                  : 'bg-forest-900 hover:bg-forest-800 active:scale-95 shadow-subtle'
              "
              @click="kirimPesan()"
            >
              <i class="fa-solid fa-arrow-up text-xs"></i>
            </button>
          </div>
          <p class="text-[11px] text-ink-500 mt-2 text-center leading-relaxed">
            Hasil simulasi bersifat edukatif berdasarkan hukum faraid &amp; KHI, bukan fatwa atau putusan hukum resmi. Konsultasikan ke ahli faraid atau Pengadilan Agama.
          </p>
        </div>
      </template>
    </section>

    <!-- Dialog Konfirmasi Hapus Riwayat -->
    <transition name="modal">
      <div
        v-if="konfirmasiHapus"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-hapus"
        @click.self="konfirmasiHapus = false"
      >
        <div class="modal-card bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-float border border-forest-900/10">
          <span class="w-12 h-12 rounded-xl bg-danger-soft text-danger-DEFAULT grid place-items-center text-xl mb-4">
            <i class="fa-solid fa-trash-can"></i>
          </span>
          <h3 id="judul-hapus" class="font-display font-bold text-xl text-ink-900">
            Hapus Semua Riwayat Percakapan?
          </h3>
          <p class="text-xs sm:text-sm text-ink-600 leading-relaxed mt-2">
            Seluruh riwayat konsultasi yang tersimpan akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex items-center gap-3 mt-6">
            <button
              type="button"
              class="flex-1 py-2.5 rounded-xl border border-forest-900/20 text-ink-700 text-xs font-bold hover:bg-forest-50"
              @click="konfirmasiHapus = false"
            >
              Batal
            </button>
            <button
              type="button"
              class="flex-1 py-2.5 rounded-xl bg-danger-DEFAULT text-white text-xs font-bold hover:bg-danger-dark shadow-subtle"
              @click="hapusSemua"
            >
              Hapus Semua
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
