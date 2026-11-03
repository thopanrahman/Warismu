// POST /api/chat — orkestrator hybrid (UC-06 s/d UC-09).
//
// Alur:
//   pesan user
//     -> LLM (llmRouter: Gemini -> DeepSeek -> OpenAI): ekstraksi fakta -> JSON
//     -> mesin hitung faraid lokal: hitung pembagian secara deterministik
//     -> LLM (llmRouter, urutan fallback sama): susun penjelasan naratif
//     -> response dengan kontrak lama agar frontend tidak berubah
//
// Tidak ada perhitungan faraid di file ini maupun di LLM. Satu-satunya
// sumber angka pembagian adalah api/lib/faraidh.js.
import { hitungFaraid } from './lib/faraidh.js'
import {
  DISCLAIMER_DEFAULT,
  ekstrakData,
  jelaskanHasil,
  mockResponse,
  SUMBER_DEFAULT,
} from './lib/llmRouter.js'

const LABEL_AHLI_WARIS = {
  anak_laki_laki: 'Anak laki-laki',
  cucu_laki_laki: 'Cucu laki-laki',
  anak_perempuan: 'Anak perempuan',
  cucu_perempuan: 'Cucu perempuan',
  ayah: 'Ayah',
  kakek: 'Kakek',
  saudara_saudari_tiri_seibu: 'Saudara seibu',
  saudara_kandung: 'Saudara laki-laki kandung',
  saudara_tiri_seayah: 'Saudara laki-laki seayah',
  anak_laki_laki_saudara_kandung: 'Keponakan laki-laki',
  anak_laki_laki_saudara_tiri_seayah: 'Keponakan laki-laki seayah',
  saudara_kandung_ayah: 'Paman',
  saudara_tiri_seayah_ayah: 'Paman seayah',
  anak_laki_laki_saudara_kandung_ayah: 'Sepupu laki-laki',
  anak_laki_laki_saudara_tiri_seayah_ayah: 'Sepupu laki-laki seayah',
  saudari_kandung: 'Saudari kandung',
  saudari_seayah: 'Saudari seayah',
  ibu: 'Ibu',
  nenek: 'Nenek dari pihak ibu',
  ibu_kakek: 'Nenek dari pihak ayah',
  suami: 'Suami',
  istri: 'Istri',
  pria_wanita_yang_memerdekakan_budak: 'Mukatab',
  dzawil_arhaam: 'Dzawil arham',
}

const formatRupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function angka(nilai) {
  if (typeof nilai === 'string') {
    const bersih = nilai.replace(/[^\d.-]/g, '')
    const hasil = Number(bersih)
    return Number.isFinite(hasil) ? hasil : 0
  }
  const hasil = Number(nilai)
  return Number.isFinite(hasil) ? hasil : 0
}

function rupiah(nilai) {
  const n = angka(nilai)
  return Number.isFinite(n) ? formatRupiah.format(Math.round(n)) : '—'
}

function daftarTeks(nilai, maksimal = 3) {
  if (!Array.isArray(nilai)) return []
  return nilai
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => item.trim())
    .slice(0, maksimal)
}

function labelAhliWaris(nama) {
  if (LABEL_AHLI_WARIS[nama]) return LABEL_AHLI_WARIS[nama]
  return String(nama ?? 'Ahli waris').replaceAll('_', ' ')
}

function normalisasiEkstraksi(data = {}) {
  const ahliWaris =
    data.ahli_waris && typeof data.ahli_waris === 'object' && !Array.isArray(data.ahli_waris)
      ? data.ahli_waris
      : {}

  return {
    balas: typeof data.balas === 'string' ? data.balas.trim() : '',
    data_cukup: data.data_cukup === true || data.data_cukup === 'true',
    ahli_waris: ahliWaris,
    harta_total: angka(data.harta_total),
    harta_bersama: angka(data.harta_bersama),
    hutang: angka(data.hutang),
    wasiat: angka(data.wasiat),
    ringkasan_kasus: typeof data.ringkasan_kasus === 'string' ? data.ringkasan_kasus.trim() : '',
    asumsi: daftarTeks(data.asumsi, 10),
    tanya_lanjutan: daftarTeks(data.tanya_lanjutan, 3),
  }
}

function adaAhliWaris(ahliWaris = {}) {
  return Object.values(ahliWaris).some((nilai) => angka(nilai) > 0)
}

// Tirkah = harta bersih siap dibagi. Ini aritmetika harta, bukan faraid:
// pisahkan harta bersama, kurangi hutang, lalu batasi wasiat maksimal 1/3.
function hitungTirkah(data) {
  const catatan = []
  const hartaTotal = Math.max(0, angka(data.harta_total))
  const hartaBersama = Math.max(0, Math.min(angka(data.harta_bersama), hartaTotal))
  const hutang = Math.max(0, angka(data.hutang))
  const wasiat = Math.max(0, angka(data.wasiat))

  if (hartaTotal <= 0) return { total: 0, catatan: ['Nilai harta belum diketahui.'] }

  const hartaPewaris = hartaBersama > 0 ? Math.max(0, hartaTotal - hartaBersama / 2) : hartaTotal
  if (hartaBersama > 0) {
    catatan.push('Harta bersama dipisahkan lebih dulu: 1/2 menjadi bagian pasangan yang masih hidup.')
  }

  const setelahHutang = Math.max(0, hartaPewaris - hutang)
  if (hutang > 0) catatan.push(`Hutang pewaris dikurangkan sebesar ${rupiah(hutang)}.`)

  const batasWasiat = setelahHutang / 3
  const wasiatDipakai = Math.min(wasiat, batasWasiat)
  if (wasiat > 0) {
    if (wasiat > batasWasiat) {
      catatan.push('Wasiat dibatasi maksimal 1/3 dari harta setelah hutang.')
    } else {
      catatan.push(`Wasiat dikurangkan sebesar ${rupiah(wasiat)}.`)
    }
  }

  return {
    total: Math.max(0, Math.round(setelahHutang - wasiatDipakai)),
    catatan,
  }
}

function petakanHasil(hasilHitung, data, tirkah, catatanTirkah = []) {
  const bagian = (hasilHitung.penerima_waris ?? []).map((penerima) => {
    const jumlah = Math.max(1, Math.floor(angka(penerima.jumlah_orang)) || 1)
    const porsiHukum = String(penerima.bagian_hukum_waris ?? '').trim()
    const porsiHitung = String(penerima.bagian_terhitung ?? '').trim()
    const porsi = [...new Set([porsiHitung, porsiHukum].filter(Boolean))].join(' · ')
    const dana = Math.max(0, angka(penerima.dana_didapat))

    return {
      nama: `${labelAhliWaris(penerima.nama)}${jumlah > 1 ? ` (${jumlah} orang)` : ''}`,
      porsi: porsi || 'Sesuai ketentuan faraid',
      nominal: rupiah(dana),
    }
  })

  const catatan = [`Tirkah bersih: ${rupiah(tirkah)}.`]
  for (const item of [...(data.asumsi ?? []), ...catatanTirkah]) {
    if (item && !catatan.includes(item)) catatan.push(item)
  }

  return {
    judul: 'Simulasi Pembagian Waris',
    bagian,
    catatan: catatan.join(' '),
  }
}

function responsBelumCukup(data) {
  return {
    balas:
      data.balas ||
      'Agar simulasi akurat, saya perlu beberapa data tambahan tentang pewaris, ahli waris, dan harta.',
    tanya_lanjutan: data.tanya_lanjutan?.length
      ? data.tanya_lanjutan
      : [
          'Siapa saja ahli waris yang masih hidup?',
          'Berapa total harta bersih setelah hutang & wasiat?',
          'Apakah ada hutang atau wasiat pewaris?',
        ],
    hasil: null,
    sumber: SUMBER_DEFAULT,
    disclaimer: DISCLAIMER_DEFAULT,
    selesai: false,
    dipakaiMock: false,
  }
}

function responsMockFaraid(error) {
  return {
    balas:
      'Data keluarga sudah saya catat. Namun mesin hitung faraid gagal memproses kombinasi ahli waris ini, ' +
      'jadi saya belum bisa menampilkan angka pembagian yang bisa dipertanggungjawabkan. ' +
      'Coba periksa kembali susunan ahli waris, atau konsultasikan kasus ini kepada ahli faraid.',
    tanya_lanjutan: [],
    hasil: null,
    sumber: SUMBER_DEFAULT,
    disclaimer: DISCLAIMER_DEFAULT,
    selesai: false,
    dipakaiMock: true,
    mode: 'mock',
    alasanMock: 'mesin-hitung',
    catatanServer: error,
  }
}

function narasiFallback(hasil, data, tirkah, catatanTirkah = []) {
  const rincian = hasil.bagian.map((b) => `• ${b.nama}: ${b.porsi} — ${b.nominal}`).join('\n')
  const asumsi = [...(data.asumsi ?? []), ...catatanTirkah].filter(Boolean)

  return [
    'Perhitungan faraid untuk kasus ini sudah selesai.',
    '',
    rincian,
    '',
    `Tirkah bersih: ${rupiah(tirkah)}.`,
    ...(asumsi.length ? [`Catatan: ${asumsi.join(' ')}`] : []),
    '',
    'Ini simulasi edukatif, bukan fatwa atau putusan hukum.',
  ].join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' })

  const { pesan = '', riwayat = [] } = req.body ?? {}
  const teksPesan = String(pesan ?? '').trim()
  if (!teksPesan) return res.status(400).json({ error: 'pesan kosong' })

  const riwayatAman = Array.isArray(riwayat) ? riwayat.slice(-10) : []

  try {
    // 1. Ekstraksi fakta oleh LLM (Gemini -> DeepSeek -> OpenAI). Tidak ada perhitungan faraid di sini.
    const ekstraksi = await ekstrakData(teksPesan, riwayatAman)
    if (!ekstraksi.ok) {
      console.error('[Chat] Ekstraksi LLM gagal:', ekstraksi.code, ekstraksi.error)
      return res
        .status(200)
        .json(mockResponse(teksPesan, `${ekstraksi.code}: ${ekstraksi.error}`))
    }

    const data = normalisasiEkstraksi(ekstraksi.data)
    // Terlihat di log dev server: penyedia mana yang menjawab (tanpa kunci API).
    console.log(`[Chat] ekstraksi via ${ekstraksi.provider} (${ekstraksi.model})`)

    if (!data.data_cukup) {
      return res.status(200).json(responsBelumCukup(data))
    }

    if (!adaAhliWaris(data.ahli_waris)) {
      return res.status(200).json(
        responsBelumCukup({
          ...data,
          tanya_lanjutan: ['Siapa saja ahli waris yang masih hidup?'],
        }),
      )
    }

    const tirkah = hitungTirkah(data)
    if (tirkah.total <= 0) {
      const hartaDiketahui = angka(data.harta_total) > 0
      return res.status(200).json(
        responsBelumCukup({
          ...data,
          balas: hartaDiketahui
            ? 'Setelah dikurangi hutang dan wasiat, tidak ada harta bersih yang tersisa untuk dibagi. Mohon periksa kembali nilai harta, hutang, dan wasiat.'
            : data.balas,
          tanya_lanjutan: hartaDiketahui
            ? ['Apakah nilai harta, hutang, dan wasiat sudah benar?']
            : ['Berapa total harta bersih setelah hutang & wasiat?'],
        }),
      )
    }

    // 2. Kalkulasi deterministik oleh Faraidh-API.
    const hitung = await hitungFaraid({
      ahli_waris: data.ahli_waris,
      total_harta: tirkah.total,
    })

    if (!hitung.ok) {
      console.error('[Chat] Faraidh-API gagal:', hitung.code, hitung.error)
      return res.status(200).json(responsMockFaraid(hitung.error))
    }

    const hasil = petakanHasil(hitung.data, data, tirkah.total, tirkah.catatan)

    // 3. LLM hanya menyusun narasi dalil dari hasil hitung. Angka tidak diubah.
    const penjelasan = await jelaskanHasil({
      pesan: teksPesan,
      riwayat: riwayatAman,
      data,
      hasilHitung: hitung.data,
      tirkah: tirkah.total,
      catatanTirkah: tirkah.catatan,
    })

    if (!penjelasan.ok) {
      console.error('[Chat] Penjelasan LLM gagal:', penjelasan.code, penjelasan.error)
    }

    const narasi =
      penjelasan.ok && typeof penjelasan.data.balas === 'string' && penjelasan.data.balas.trim()
        ? penjelasan.data.balas.trim()
        : narasiFallback(hasil, data, tirkah.total, tirkah.catatan)

    if (penjelasan.ok && typeof penjelasan.data.catatan === 'string' && penjelasan.data.catatan.trim()) {
      hasil.catatan = `${hasil.catatan} ${penjelasan.data.catatan.trim()}`.trim()
    }

    const sumber =
      penjelasan.ok &&
      typeof penjelasan.data.sumber === 'string' &&
      penjelasan.data.sumber.trim()
        ? penjelasan.data.sumber.trim()
        : SUMBER_DEFAULT

    return res.status(200).json({
      balas: narasi,
      tanya_lanjutan: penjelasan.ok ? daftarTeks(penjelasan.data.tanya_lanjutan, 3) : [],
      hasil,
      sumber,
      disclaimer: DISCLAIMER_DEFAULT,
      selesai: true,
      dipakaiMock: false,
      mode: 'hybrid',
      penyedia: penjelasan.ok ? penjelasan.provider : null,
      ...(penjelasan.ok
        ? {}
        : { catatanServer: `${penjelasan.code}: ${penjelasan.error}`, penjelasanMock: true }),
    })
  } catch (galat) {
    // Jangan pernah menampilkan layar error ke user saat demo.
    console.error('[Chat] Error tak terduga:', galat)
    return res
      .status(200)
      .json(mockResponse(teksPesan, `INTERNAL: ${galat?.message || galat}`))
  }
}
