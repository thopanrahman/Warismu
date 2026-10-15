// Panggil Gemini REST langsung (tanpa SDK, cukup fetch bawaan Node 18+).
// Kontrak balasan ke frontend:
// { balas, tanya_lanjutan[], hasil{judul,bagian[],catatan}|null,
//   sumber, disclaimer, selesai, dipakaiMock }
const MODEL = 'gemini-2.0-flash'

const PROMPT_SISTEM = `Kamu WarisMu, asisten edukasi & simulasi waris Islam (faraid) untuk Muslim Indonesia.
Tugasmu lewat percakapan bahasa natural:
1. Ekstrak info keluarga dari cerita user (pewaris, ahli waris, harta, hutang, wasiat).
2. Jika data kurang (hutang? wasiat? harta bersih?), TANYAKAN dulu — jangan asal hitung.
3. Jika data cukup, hitung pembagian faraid (rujuk QS. An-Nisa 11,12,176 & KHI Buku II).

Wajib: balas HANYA berupa JSON valid tanpa markdown, bentuknya:
{"balas":"teks sapaan/penjelasan singkat","tanya_lanjutan":["pertanyaan 1", "..."],"hasil":{"judul":"...","bagian":[{"nama":"...","porsi":"...","nominal":"..."}],"catatan":"..."} atau null,"sumber":"dalil & pasal KHI","disclaimer":"Hasil ini simulasi edukatif, bukan fatwa/putusan hukum. Konsultasikan ke ahli faraid atau Pengadilan Agama.","selesai":true/false}
"selesai"=true hanya jika "hasil" sudah terisi. "tanya_lanjutan" maksimal 3 butir.`

function balasanMock(pesan) {
  return {
    balas:
      `Baik, ceritamu tercatat: "${pesan.slice(0, 120)}". ` +
      `Agar simulasi akurat, saya masih butuh: (1) siapa pewaris & siapa saja ahli waris yang hidup, ` +
      `(2) total harta bersih setelah hutang & wasiat, (3) ada wasiat? (maks. 1/3 harta). ` +
      `(Mode mock — backend LLM belum dikonfigurasi.)`,
    tanya_lanjutan: [
      'Siapa pewaris dan siapa saja ahli waris yang masih hidup?',
      'Berapa total harta bersih (setelah hutang & wasiat)?',
      'Apakah ada wasiat atau hutang pewaris?',
    ],
    hasil: null,
    sumber: 'QS. An-Nisa: 11–12, 176; KHI Buku II',
    disclaimer:
      'Hasil ini simulasi edukatif, bukan fatwa/putusan hukum. Konsultasikan ke ahli faraid atau Pengadilan Agama.',
    selesai: false,
    dipakaiMock: true,
  }
}

export async function tanyaGemini(pesan, riwayat = []) {
  const kunci = process.env.GEMINI_API_KEY
  if (!kunci) return balasanMock(pesan)

  const isi = [
    ...riwayat.slice(-10).map((m) => ({
      role: m.peran === 'user' ? 'user' : 'model',
      parts: [{ text: m.teks }],
    })),
    { role: 'user', parts: [{ text: pesan }] },
  ]

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${kunci}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: PROMPT_SISTEM }] },
          contents: isi,
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
        }),
      },
    )
    if (!res.ok) return { ...balasanMock(pesan), catatanServer: `Gemini HTTP ${res.status}` }
    const data = await res.json()
    const teks = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const hasil = JSON.parse(teks)
    return { dipakaiMock: false, ...hasil }
  } catch {
    return { ...balasanMock(pesan), catatanServer: 'Gemini tidak terjangkau / balasan bukan JSON' }
  }
}
