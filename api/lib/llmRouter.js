// Router LLM multi-provider untuk arsitektur hybrid WarisMu:
//   1. ekstrakData()   -> cerita user menjadi JSON terstruktur (tanpa menghitung waris)
//   2. jelaskanHasil() -> narasi dalil berdasarkan hasil hitung deterministik
//
// Urutan fallback (berhenti pada penyedia pertama yang berhasil):
//   1. Gemini   : gemini-3.5-flash  ->  gemini-flash-lite
//   2. DeepSeek : deepseek-chat                      (OpenAI-compatible)
//   3. OpenAI   : gpt-4o-mini                        (OpenAI-compatible)
//   4. Semua gagal -> mockResponse() dipakai api/chat.js
//
// Semua panggilan memakai fetch murni (tanpa SDK), timeout default 15 detik per
// penyedia (LLM_TIMEOUT_MS) dengan pagu total 45 detik (LLM_TOTAL_TIMEOUT_MS).
//
// Kontrak balasan ke frontend tetap:
// { balas, tanya_lanjutan[], hasil{judul,bagian[],catatan}|null,
//   sumber, disclaimer, selesai, dipakaiMock }
import { AHLI_WARIS_FIELDS } from './faraidh.js'

export const SUMBER_DEFAULT = 'QS. An-Nisa: 11–12, 176; KHI Buku II'
export const DISCLAIMER_DEFAULT =
  'Hasil ini simulasi edukatif, bukan fatwa/putusan hukum. Konsultasikan ke ahli faraid atau Pengadilan Agama.'

// Model Gemini: model utama dulu, lalu varian "lite" yang lebih ringan/cepat.
// Catatan: nama polos "gemini-flash-lite" tidak terdaftar di API (404), jadi
// dipakai nama resmi server: gemini-3.5-flash-lite -> gemini-flash-lite-latest.
const MODEL_GEMINI = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
const MODEL_GEMINI_CADANGAN = (process.env.GEMINI_MODEL_CADANGAN || 'gemini-3.5-flash-lite,gemini-flash-lite-latest')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)

const ENDPOINT_DEEPSEEK = 'https://api.deepseek.com/chat/completions'
const ENDPOINT_OPENAI = 'https://api.openai.com/v1/chat/completions'

const BATAS_PENYEDIA_DEFAULT = 15_000
const BATAS_TOTAL_DEFAULT = 45_000
// Sisa waktu minimum agar satu percobaan masih layak dijalankan.
const SISA_MINIMUM = 2_000

const DAFTAR_AHLI_WARIS = AHLI_WARIS_FIELDS.map(({ key, label }) => `- ${key}: ${label}`).join('\n')
const CONTOH_AHLI_WARIS = Object.fromEntries(AHLI_WARIS_FIELDS.map(({ key }) => [key, 0]))

const PROMPT_EKSTRAKSI = `Kamu adalah mesin ekstraksi data WarisMu untuk Muslim Indonesia.

TUGASMU HANYA:
1. Membaca cerita pengguna dan riwayat percakapan.
2. Mengubah fakta keluarga dan harta menjadi JSON terstruktur.
3. Menentukan apakah data sudah cukup untuk dihitung.

KAMU BUKAN KALKULATOR FARAID. Jangan menghitung bagian waris, jangan menentukan porsi, jangan membuat tabel pembagian, dan jangan menebak angka bagian. Perhitungan akan dilakukan oleh mesin hitung faraid.

Balas HANYA dengan JSON valid tanpa markdown, dengan bentuk:
{
  "balas": "teks singkat dalam bahasa Indonesia",
  "data_cukup": false,
  "ahli_waris": ${JSON.stringify(CONTOH_AHLI_WARIS, null, 2)},
  "harta_total": 0,
  "harta_bersama": 0,
  "hutang": 0,
  "wasiat": 0,
  "ringkasan_kasus": "ringkasan singkat kasus",
  "asumsi": ["asumsi yang dipakai"],
  "tanya_lanjutan": ["pertanyaan berikutnya"]
}

FIELD AHLI WARIS (isi JUMLAH ORANG, bukan nominal; 0 jika tidak ada/tidak disebut):
${DAFTAR_AHLI_WARIS}

ATURAN EKSTRAKSI:
- Sumber fakta utama adalah pesan user. Pesan asisten di riwayat hanya konteks; jangan mengambil angka pembagian dari pesan asisten.
- Hitung orang yang masih hidup dan berhak menjadi ahli waris. Jangan memasukkan orang yang sudah wafat, anak angkat, atau anak tiri.
- Jangan menebak jenis kelamin anak/cucu. Jika user menyebut "2 anak" tanpa jenis kelamin, data_cukup=false dan tanyakan.
- Jangan menebak hubungan keluarga. Jika user menyebut "orang tua" tanpa membedakan ayah/ibu, tanyakan.
- Cucu yang dimaksud adalah cucu melalui anak laki-laki. Jika cucu hanya dari anak perempuan, jangan masukkan ke field cucu.
- Gabungkan saudara/i seibu ke satu field. Pisahkan saudara kandung, saudara seayah, dan saudari kandung/seayah sesuai jenis kelamin.
- Isi 0 untuk field yang tidak disebut. Jangan mengisi angka hanya karena "biasanya ada".

ATURAN HARTA:
- harta_total: total nilai harta peninggalan yang disebut user, SEBELUM dikurangi hutang dan wasiat, dalam Rupiah penuh (contoh: "500 juta" -> 500000000). Jika ada harta bersama, masukkan juga nilai total harta bersama ke angka ini.
- harta_bersama: nilai total harta bersama dengan pasangan yang masih hidup, jika disebut. Sistem akan memisahkan bagian pewaris (1/2) dari harta bersama. Isi 0 jika tidak ada pasangan hidup atau bukan harta bersama.
- hutang: total hutang pewaris. Isi 0 jika user menyatakan tidak ada.
- wasiat: total wasiat. Isi 0 jika user menyatakan tidak ada.
- Jika user menyebut "harta bersih" atau "setelah hutang & wasiat", set harta_total = nilai bersih tersebut, hutang = 0, wasiat = 0, dan harta_bersama = 0 (kecuali user menyebut harta bersama yang belum dipisahkan). Catat asumsinya.
- Jangan menghitung bagian waris. Cukup ekstrak angka harta.

KAPAN data_cukup = true:
- Ada minimal satu ahli waris.
- harta_total > 0 dan jelas.
- Status hutang dan wasiat sudah jelas (user menyebut jumlahnya, menyatakan tidak ada, atau menyebut harta sudah bersih).
- Tidak ada ambiguitas kritis tentang jenis kelamin, hubungan keluarga, atau harta bersama.
Jika salah satu syarat belum terpenuhi, data_cukup=false. Isi "balas" dengan kalimat ramah yang merangkum data yang sudah dicatat, lalu ajukan maksimal 3 pertanyaan di "tanya_lanjutan".
Jika data sudah cukup, isi "balas" dengan konfirmasi singkat bahwa data lengkap dan siap dihitung, serta "tanya_lanjutan": [].

Jika pesan bukan kasus waris (misalnya bertanya definisi), tetap gunakan bentuk JSON di atas: data_cukup=false, "balas" berisi jawaban edukatif singkat, dan "tanya_lanjutan" berisi tawaran untuk memulai simulasi.

Gunakan bahasa Indonesia yang hangat, jelas, dan tidak menghakimi.`

const PROMPT_PENJELASAN = `Kamu adalah penjelas edukasi WarisMu untuk Muslim Indonesia.

KAMU TIDAK MENGHITUNG WARIS. Semua porsi dan nominal sudah dihitung secara deterministik oleh mesin hitung faraid. Tugasmu hanya menyusun penjelasan naratif berdasarkan DATA KASUS dan HASIL PERHITUNGAN yang diberikan.

Balas HANYA dengan JSON valid tanpa markdown, dengan bentuk:
{
  "balas": "narasi penjelasan dalam bahasa Indonesia",
  "tanya_lanjutan": [],
  "sumber": "dalil dan dasar hukum yang dipakai",
  "catatan": "catatan asumsi / hal penting"
}

ATURAN:
- Jangan mengubah, menambah, mengurangi, atau menghitung ulang porsi, nominal, dan jumlah penerima.
- Sebutkan setiap penerima waris beserta porsi dan nominal yang ada di hasil perhitungan.
- Jika jumlah_orang lebih dari 1, sebutkan nominal per orang jika tersedia.
- Jelaskan dasar hukum dengan merujuk QS. An-Nisa ayat 11, 12, dan 176 serta KHI Buku II. Jangan mengarang dalil.
- Jelaskan asumsi yang dipakai, termasuk harta bersama, hutang, wasiat, atau pembulatan jika ada.
- Jika ada penerima "dzawil_arhaam", jelaskan bahwa itu adalah kerabat jauh dan hasilnya bersifat edukatif.
- Bahasa Indonesia yang hangat, ringkas (maksimal sekitar 250 kata), dan mudah dipahami.
- Gunakan teks biasa dan baris baru; jangan memakai tanda markdown seperti **, ##, atau tabel di dalam "balas".
- Jangan memberikan fatwa atau putusan hukum. Ingatkan bahwa ini simulasi edukatif.
- "tanya_lanjutan" biasanya [], kecuali ada informasi penting yang benar-benar perlu diklarifikasi.
- "catatan" boleh berisi ringkasan asumsi dan peringatan, bukan angka baru.`

// ============ UTILITAS ============

function envNomor(nama, bawaan) {
  const nilai = Number(process.env[nama])
  return Number.isFinite(nilai) && nilai > 0 ? nilai : bawaan
}

function ambilJson(teks) {
  const bersih = String(teks ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')

  try {
    return JSON.parse(bersih)
  } catch {
    const awal = bersih.indexOf('{')
    const akhir = bersih.lastIndexOf('}')
    if (awal >= 0 && akhir > awal) {
      try {
        return JSON.parse(bersih.slice(awal, akhir + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

// Riwayat dari frontend + pesan terbaru menjadi satu percakapan netral.
// Dipakai bersama oleh format Gemini maupun format OpenAI/DeepSeek.
function susunPercakapan(pesan, riwayat = [], konteks = '') {
  const daftar = (Array.isArray(riwayat) ? riwayat : [])
    .filter((m) => m && typeof m.teks === 'string' && m.teks.trim())
    .slice(-10)
    .map((m) => ({
      peran: m.peran === 'user' || m.role === 'user' ? 'user' : 'bot',
      teks: m.teks,
    }))

  // Frontend mengirim riwayat yang sudah memuat pesan terbaru. Hindari dobel.
  const terakhir = daftar[daftar.length - 1]
  if (terakhir?.peran === 'user' && terakhir.teks.trim() === String(pesan).trim()) daftar.pop()

  const awalUser = daftar.findIndex((m) => m.peran === 'user')
  const bersih = awalUser >= 0 ? daftar.slice(awalUser) : []

  const teksTerakhir = konteks
    ? `${konteks}\n\nPESAN USER:\n${String(pesan).trim()}`
    : String(pesan).trim()

  return [...bersih, { peran: 'user', teks: teksTerakhir }]
}

function isiGemini(percakapan) {
  return percakapan.map((m) => ({
    role: m.peran === 'user' ? 'user' : 'model',
    parts: [{ text: m.teks }],
  }))
}

function pesanChat(percakapan, promptSistem) {
  return [
    { role: 'system', content: promptSistem },
    ...percakapan.map((m) => ({
      role: m.peran === 'user' ? 'user' : 'assistant',
      content: m.teks,
    })),
  ]
}

// Semua keluaran dinormalkan ke bentuk yang dipakai WarisMu, apa pun
// penyedia yang menjawab. Field khusus ekstraksi (data_cukup, ahli_waris, dst.)
// tetap ikut agar api/chat.js tidak perlu tahu penyedianya.
function normalkanKeluaran(data) {
  const dasar = data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  return {
    ...dasar,
    balas: typeof dasar.balas === 'string' ? dasar.balas.trim() : '',
    tanya_lanjutan: Array.isArray(dasar.tanya_lanjutan)
      ? dasar.tanya_lanjutan
          .filter((t) => typeof t === 'string' && t.trim())
          .map((t) => t.trim())
          .slice(0, 3)
      : [],
    hasil: dasar.hasil ?? null,
    sumber:
      typeof dasar.sumber === 'string' && dasar.sumber.trim()
        ? dasar.sumber.trim()
        : SUMBER_DEFAULT,
    disclaimer:
      typeof dasar.disclaimer === 'string' && dasar.disclaimer.trim()
        ? dasar.disclaimer.trim()
        : DISCLAIMER_DEFAULT,
    selesai: dasar.selesai === true,
  }
}

// ============ 1. GEMINI ============

async function panggilSatuModelGemini(model, promptSistem, isi, temperature, timeoutMs) {
  const kunci = process.env.GEMINI_API_KEY
  if (!kunci) return { ok: false, code: 'NO_KEY', error: 'GEMINI_API_KEY belum diset' }

  const dasar =
    process.env.GEMINI_API_URL ||
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const kendali = new AbortController()
  const batas = setTimeout(() => kendali.abort(), timeoutMs)

  try {
    const alamat = new URL(dasar)
    alamat.searchParams.set('key', kunci)

    const res = await fetch(alamat, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: promptSistem }] },
        contents: isi,
        generationConfig: { responseMimeType: 'application/json', temperature },
      }),
      signal: kendali.signal,
    })

    const badan = await res.text()
    if (!res.ok) {
      console.error('[Gemini API Error]', { status: res.status, body: badan.slice(0, 300) })
      return {
        ok: false,
        code: 'HTTP_ERROR',
        status: res.status,
        error: `Gemini HTTP ${res.status}: ${badan.slice(0, 160)}`,
      }
    }

    let data
    try {
      data = JSON.parse(badan)
    } catch {
      return { ok: false, code: 'INVALID_RESPONSE', error: 'Balasan Gemini bukan JSON' }
    }

    const teks = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p?.text ?? '').join('')
    if (!teks.trim()) {
      return {
        ok: false,
        code: 'EMPTY_RESPONSE',
        error: `Gemini tidak mengembalikan teks (finishReason: ${data.candidates?.[0]?.finishReason ?? 'unknown'})`,
      }
    }

    const hasil = ambilJson(teks)
    if (!hasil || typeof hasil !== 'object' || Array.isArray(hasil)) {
      return {
        ok: false,
        code: 'INVALID_DATA',
        error: `Gemini tidak mengembalikan JSON objek yang valid: ${teks.slice(0, 160)}`,
      }
    }

    return { ok: true, data: hasil }
  } catch (galat) {
    const timeout = galat?.name === 'AbortError'
    return {
      ok: false,
      code: timeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      error: timeout
        ? `Gemini tidak merespons dalam ${timeoutMs} ms`
        : `Gemini tidak terjangkau: ${galat?.message || galat}`,
    }
  } finally {
    clearTimeout(batas)
  }
}

// Galat yang tidak akan membaik dengan mencoba model Gemini lain.
function galatFatal(hasil) {
  if (hasil?.code === 'NO_KEY') return true
  const status = Number(hasil?.status)
  return hasil?.code === 'HTTP_ERROR' && (status === 400 || status === 401 || status === 403)
}

// Rantai model Gemini: model utama lalu gemini-flash-lite, berbagi satu jatah
// waktu supaya penyedia berikutnya masih kebagian.
async function panggilGemini(promptSistem, isi, temperature, budgetMs) {
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, code: 'NO_KEY', error: 'GEMINI_API_KEY belum diset' }
  }

  // GEMINI_API_URL manual (mis. stub uji) → jangan ganti-ganti model.
  if (process.env.GEMINI_API_URL) {
    const hasil = await panggilSatuModelGemini(MODEL_GEMINI, promptSistem, isi, temperature, budgetMs)
    return { ...hasil, provider: 'gemini', model: MODEL_GEMINI }
  }

  const daftarModel = [...new Set([MODEL_GEMINI, ...MODEL_GEMINI_CADANGAN])]
  const mulai = Date.now()
  let terakhir = { ok: false, code: 'NO_KEY', error: 'GEMINI_API_KEY belum diset' }

  for (let i = 0; i < daftarModel.length; i += 1) {
    const model = daftarModel[i]
    const sisa = budgetMs - (Date.now() - mulai)
    if (sisa < SISA_MINIMUM) break

    const hasil = await panggilSatuModelGemini(model, promptSistem, isi, temperature, sisa)
    if (hasil.ok) {
      if (i > 0) console.warn(`[Gemini] memakai model cadangan: ${model}`)
      return { ...hasil, provider: 'gemini', model }
    }

    terakhir = { ...hasil, provider: 'gemini', model }
    if (galatFatal(hasil)) break
    if (i < daftarModel.length - 1) {
      console.warn(
        `[Gemini] ${model} gagal (${hasil.code}${hasil.status ? ` ${hasil.status}` : ''}); mencoba ${daftarModel[i + 1]}`,
      )
    }
  }

  return terakhir
}

// ============ 2 & 3. DEEPSEEK / OPENAI (OpenAI-compatible) ============

function daftarPenyediaChat() {
  return [
    {
      id: 'deepseek',
      label: 'DeepSeek',
      url: process.env.DEEPSEEK_API_URL || ENDPOINT_DEEPSEEK,
      kunci: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    },
    {
      id: 'openai',
      label: 'OpenAI',
      url: process.env.OPENAI_API_URL || ENDPOINT_OPENAI,
      kunci: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
  ]
}

async function panggilChatKompatibel(penyedia, promptSistem, percakapan, temperature, timeoutMs) {
  const kendali = new AbortController()
  const batas = setTimeout(() => kendali.abort(), timeoutMs)

  try {
    const res = await fetch(penyedia.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${penyedia.kunci}`,
      },
      body: JSON.stringify({
        model: penyedia.model,
        messages: pesanChat(percakapan, promptSistem),
        temperature,
      }),
      signal: kendali.signal,
    })

    const badan = await res.text()
    if (!res.ok) {
      console.error(`[${penyedia.label} API Error]`, { status: res.status, body: badan.slice(0, 300) })
      return {
        ok: false,
        code: 'HTTP_ERROR',
        status: res.status,
        provider: penyedia.id,
        model: penyedia.model,
        error: `${penyedia.label} HTTP ${res.status}: ${badan.slice(0, 160)}`,
      }
    }

    let data
    try {
      data = JSON.parse(badan)
    } catch {
      return {
        ok: false,
        code: 'INVALID_RESPONSE',
        provider: penyedia.id,
        model: penyedia.model,
        error: `Balasan ${penyedia.label} bukan JSON`,
      }
    }

    const teks = String(data.choices?.[0]?.message?.content ?? '')
    if (!teks.trim()) {
      return {
        ok: false,
        code: 'EMPTY_RESPONSE',
        provider: penyedia.id,
        model: penyedia.model,
        error: `${penyedia.label} tidak mengembalikan teks (finish_reason: ${data.choices?.[0]?.finish_reason ?? 'unknown'})`,
      }
    }

    const hasil = ambilJson(teks)
    if (!hasil || typeof hasil !== 'object' || Array.isArray(hasil)) {
      return {
        ok: false,
        code: 'INVALID_DATA',
        provider: penyedia.id,
        model: penyedia.model,
        error: `${penyedia.label} tidak mengembalikan JSON objek yang valid: ${teks.slice(0, 160)}`,
      }
    }

    return { ok: true, data: hasil, provider: penyedia.id, model: penyedia.model }
  } catch (galat) {
    const timeout = galat?.name === 'AbortError'
    return {
      ok: false,
      code: timeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      provider: penyedia.id,
      model: penyedia.model,
      error: timeout
        ? `${penyedia.label} tidak merespons dalam ${timeoutMs} ms`
        : `${penyedia.label} tidak terjangkau: ${galat?.message || galat}`,
    }
  } finally {
    clearTimeout(batas)
  }
}

// ============ ROUTER ============

// Jalankan penyedia berurutan sampai ada yang berhasil. `jejak` menyimpan
// ringkasan kegagalan tiap penyedia untuk log server (tanpa data sensitif).
async function panggilLLM(promptSistem, pesan, riwayat, temperature, konteks = '') {
  const percakapan = susunPercakapan(pesan, riwayat, konteks)
  const batasPenyedia = envNomor('LLM_TIMEOUT_MS', BATAS_PENYEDIA_DEFAULT)
  const paguTotal = envNomor('LLM_TOTAL_TIMEOUT_MS', BATAS_TOTAL_DEFAULT)
  const mulai = Date.now()
  const jejak = []

  const sisaTotal = () => paguTotal - (Date.now() - mulai)
  const bolehLanjut = () => sisaTotal() >= SISA_MINIMUM

  let terakhir = {
    ok: false,
    code: 'NO_PROVIDER',
    error: 'Tidak ada penyedia LLM yang dikonfigurasi (GEMINI/DEEPSEEK/OPENAI_API_KEY kosong)',
  }

  // 1. Gemini
  if (process.env.GEMINI_API_KEY && bolehLanjut()) {
    const hasil = await panggilGemini(
      promptSistem,
      isiGemini(percakapan),
      temperature,
      Math.min(batasPenyedia, sisaTotal()),
    )
    if (hasil.ok) return { ...hasil, data: normalkanKeluaran(hasil.data) }
    jejak.push({ provider: 'gemini', code: hasil.code, status: hasil.status ?? null })
    terakhir = hasil
  }

  // 2. DeepSeek, 3. OpenAI (keduanya lewat jalur chat/completions yang sama)
  for (const penyedia of daftarPenyediaChat()) {
    if (!penyedia.kunci) {
      jejak.push({ provider: penyedia.id, code: 'NO_KEY' })
      continue
    }
    if (!bolehLanjut()) {
      jejak.push({ provider: penyedia.id, code: 'SKIPPED_BUDGET' })
      continue
    }

    const hasil = await panggilChatKompatibel(
      penyedia,
      promptSistem,
      percakapan,
      temperature,
      Math.min(batasPenyedia, sisaTotal()),
    )
    if (hasil.ok) {
      console.warn(`[LLM] Gemini tidak tersedia, memakai ${penyedia.label} (${penyedia.model})`)
      return { ...hasil, data: normalkanKeluaran(hasil.data) }
    }

    jejak.push({ provider: penyedia.id, code: hasil.code, status: hasil.status ?? null })
    terakhir = hasil
  }

  console.error('[LLM] semua penyedia gagal:', JSON.stringify(jejak))
  return { ...terakhir, ok: false, jejak }
}

// ============ MOCK (semua penyedia gagal) ============

export function mockResponse(pesan, catatanServer = '') {
  const ringkas = String(pesan ?? '').trim().slice(0, 120)
  return {
    balas:
      `Baik, ceritamu tercatat${ringkas ? `: "${ringkas}"` : ''}. ` +
      'Agar simulasi akurat, saya masih butuh: (1) siapa pewaris dan siapa saja ahli waris yang hidup, ' +
      '(2) total harta bersih setelah hutang & wasiat, (3) apakah ada hutang atau wasiat? ' +
      '(Mode mock — belum ada penyedia LLM yang bisa dihubungi.)',
    tanya_lanjutan: [
      'Siapa pewaris dan siapa saja ahli waris yang masih hidup?',
      'Berapa total harta bersih (setelah hutang & wasiat)?',
      'Apakah ada wasiat atau hutang pewaris?',
    ],
    hasil: null,
    sumber: SUMBER_DEFAULT,
    disclaimer: DISCLAIMER_DEFAULT,
    selesai: false,
    dipakaiMock: true,
    mode: 'mock',
    alasanMock: 'llm',
    ...(catatanServer ? { catatanServer } : {}),
  }
}

// Nama lama dipertahankan agar pemanggil lama tidak perlu diubah sekaligus.
export const balasanMock = mockResponse

// ============ API PUBLIK ============

export async function ekstrakData(pesan, riwayat = []) {
  return panggilLLM(PROMPT_EKSTRAKSI, pesan, riwayat, 0.1)
}

export async function jelaskanHasil({ pesan, riwayat = [], data, hasilHitung, tirkah, catatanTirkah = [] }) {
  const kasus = {
    ahli_waris: data?.ahli_waris ?? {},
    harta_total: data?.harta_total ?? 0,
    harta_bersama: data?.harta_bersama ?? 0,
    hutang: data?.hutang ?? 0,
    wasiat: data?.wasiat ?? 0,
    ringkasan_kasus: data?.ringkasan_kasus ?? '',
    asumsi: data?.asumsi ?? [],
  }

  const konteks = [
    'DATA KASUS:',
    JSON.stringify(kasus, null, 2),
    '',
    'HASIL PERHITUNGAN MESIN FARAID (JANGAN DIUBAH):',
    JSON.stringify(hasilHitung, null, 2),
    '',
    `TIRKAH BERSIH: ${tirkah}`,
    `CATATAN PERHITUNGAN: ${catatanTirkah.length ? catatanTirkah.join('; ') : 'tidak ada'}`,
  ].join('\n')

  return panggilLLM(PROMPT_PENJELASAN, pesan, riwayat, 0.3, konteks)
}
