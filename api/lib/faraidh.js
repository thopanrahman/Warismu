// Klien Faraidh-API — satu-satunya tempat kalkulasi pembagian waris.
// LLM hanya mengekstrak data; angka bagian tidak boleh dihitung di Gemini.
//
// Kontrak API (dari repo alamrumambi/Faraidh-API):
// POST /solving
// { ahli_waris: { ...23 field... }, total_harta: number }
// -> { penerima_waris: [{ nama, bagian_hukum_waris, jumlah_orang,
//                         bagian_terhitung, dana_didapat, dana_per_orang }] }
//
// Endpoint publik bawaan repo (Heroku) sudah mati: POST ke
// https://faraidh-api.herokuapp.com/solving menjawab 404 "No such app".
// Karena itu perhitungan dijalankan oleh mesin lokal di ./faraidhLokal.js,
// yang merupakan port algoritma repo tersebut. Set FARAIDH_API_URL bila ingin
// memakai instance daring; bila instance itu gagal, mesin lokal dipakai lagi.
import { hitungFaraidLokal } from './faraidhLokal.js'

const TIMEOUT_DEFAULT = 10_000

export const AHLI_WARIS_FIELDS = [
  { key: 'anak_laki_laki', label: 'jumlah anak laki-laki kandung' },
  { key: 'cucu_laki_laki', label: 'jumlah cucu laki-laki melalui anak laki-laki' },
  { key: 'anak_perempuan', label: 'jumlah anak perempuan kandung' },
  { key: 'cucu_perempuan', label: 'jumlah cucu perempuan melalui anak laki-laki' },
  { key: 'ayah', label: 'ayah kandung pewaris (1 jika hidup, 0 jika tidak)' },
  { key: 'kakek', label: 'kakek dari pihak ayah (1 jika hidup, 0 jika tidak)' },
  { key: 'saudara_saudari_tiri_seibu', label: 'jumlah saudara/i seibu (laki-laki dan perempuan digabung)' },
  { key: 'saudara_kandung', label: 'jumlah saudara laki-laki kandung' },
  { key: 'saudara_tiri_seayah', label: 'jumlah saudara laki-laki seayah' },
  { key: 'anak_laki_laki_saudara_kandung', label: 'jumlah keponakan laki-laki dari saudara laki-laki kandung' },
  { key: 'anak_laki_laki_saudara_tiri_seayah', label: 'jumlah keponakan laki-laki dari saudara laki-laki seayah' },
  { key: 'saudara_kandung_ayah', label: 'jumlah paman (saudara laki-laki kandung ayah)' },
  { key: 'saudara_tiri_seayah_ayah', label: 'jumlah paman dari pihak ayah seayah' },
  { key: 'anak_laki_laki_saudara_kandung_ayah', label: 'jumlah sepupu laki-laki dari paman kandung' },
  { key: 'anak_laki_laki_saudara_tiri_seayah_ayah', label: 'jumlah sepupu laki-laki dari paman seayah' },
  { key: 'saudari_kandung', label: 'jumlah saudari perempuan kandung' },
  { key: 'saudari_seayah', label: 'jumlah saudari perempuan seayah' },
  { key: 'ibu', label: 'ibu kandung pewaris (1 jika hidup, 0 jika tidak)' },
  { key: 'nenek', label: 'nenek dari pihak ibu (1 jika hidup, 0 jika tidak)' },
  { key: 'ibu_kakek', label: 'nenek dari pihak ayah / ibu dari kakek (1 jika hidup, 0 jika tidak)' },
  { key: 'suami', label: 'suami pewaris (1 jika pewaris perempuan dan suami masih hidup)' },
  { key: 'istri', label: 'jumlah istri pewaris yang masih hidup' },
  { key: 'pria_wanita_yang_memerdekakan_budak', label: 'selalu 0 (tidak relevan di Indonesia modern)' },
]

function angka(nilai) {
  if (typeof nilai === 'string') {
    const bersih = nilai.replace(/[^\d.-]/g, '')
    const hasil = Number(bersih)
    return Number.isFinite(hasil) ? hasil : 0
  }
  const hasil = Number(nilai)
  return Number.isFinite(hasil) ? hasil : 0
}

function batasWaktu() {
  const nilai = Number(process.env.FARAIDH_TIMEOUT_MS)
  return Number.isFinite(nilai) && nilai > 0 ? nilai : TIMEOUT_DEFAULT
}

export function normalisasiAhliWaris(ahliWaris = {}) {
  const hasil = {}
  for (const { key } of AHLI_WARIS_FIELDS) {
    hasil[key] = Math.max(0, Math.floor(angka(ahliWaris?.[key])))
  }
  return hasil
}

export function buatPayloadFaraid(dataJson = {}) {
  return {
    ahli_waris: normalisasiAhliWaris(dataJson.ahli_waris),
    total_harta: Math.max(0, Math.round(angka(dataJson.total_harta))),
  }
}

// Perhitungan di proses yang sama, memakai port algoritma Faraidh-API.
function hitungLokal(payload) {
  try {
    const penerima = hitungFaraidLokal(payload.ahli_waris, payload.total_harta)
    if (!Array.isArray(penerima) || penerima.length === 0) {
      return {
        ok: false,
        code: 'INVALID_RESPONSE',
        error: 'Mesin hitung lokal tidak menghasilkan penerima waris',
        payload,
      }
    }
    return { ok: true, data: { penerima_waris: penerima }, payload, sumber: 'mesin lokal' }
  } catch (galat) {
    return {
      ok: false,
      code: 'INTERNAL',
      error: `Mesin hitung lokal gagal: ${galat?.message || galat}`,
      payload,
    }
  }
}

// Panggilan ke instance Faraidh-API daring.
async function hitungDaring(url, payload) {
  const kendali = new AbortController()
  const batas = setTimeout(() => kendali.abort(), batasWaktu())

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: kendali.signal,
    })

    const teks = await res.text()
    if (!res.ok) {
      return {
        ok: false,
        code: 'HTTP_ERROR',
        status: res.status,
        error: `Faraidh-API HTTP ${res.status}: ${teks.slice(0, 200)}`,
        payload,
      }
    }

    let data
    try {
      data = JSON.parse(teks)
    } catch {
      return {
        ok: false,
        code: 'INVALID_RESPONSE',
        error: 'Balasan Faraidh-API bukan JSON valid',
        payload,
      }
    }

    if (!Array.isArray(data?.penerima_waris) || data.penerima_waris.length === 0) {
      return {
        ok: false,
        code: 'INVALID_RESPONSE',
        error: 'Faraidh-API tidak mengembalikan daftar penerima waris',
        payload,
      }
    }

    return { ok: true, data, payload, sumber: 'Faraidh-API' }
  } catch (galat) {
    const timeout = galat?.name === 'AbortError'
    return {
      ok: false,
      code: timeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      error: timeout
        ? `Faraidh-API tidak merespons dalam ${batasWaktu()} ms`
        : `Faraidh-API tidak terjangkau: ${galat?.message || galat}`,
      payload,
    }
  } finally {
    clearTimeout(batas)
  }
}

export async function hitungFaraid(dataJson) {
  const payload = buatPayloadFaraid(dataJson)

  if (payload.total_harta <= 0) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'total_harta harus lebih dari 0',
      payload,
    }
  }

  const jumlahAhliWaris = Object.values(payload.ahli_waris).reduce((total, n) => total + n, 0)
  if (jumlahAhliWaris <= 0) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'Tidak ada ahli waris yang terdeteksi',
      payload,
    }
  }

  // Tanpa FARAIDH_API_URL, langsung pakai mesin lokal (tanpa panggilan jaringan
  // ke instance yang sudah mati).
  const url = process.env.FARAIDH_API_URL
  if (!url) return hitungLokal(payload)

  const daring = await hitungDaring(url, payload)
  if (daring.ok) return daring

  console.warn('[Faraidh] API daring gagal, memakai mesin lokal:', daring.code, daring.error)
  const lokal = hitungLokal(payload)
  if (!lokal.ok) return { ...daring, catatanLokal: lokal.error }

  return { ...lokal, catatanDaring: `${daring.code}: ${daring.error}` }
}
