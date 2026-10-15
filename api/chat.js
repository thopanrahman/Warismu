// POST /api/chat — inti konsultasi (UC-06, UC-07, UC-08, UC-09).
// Body: { pesan, riwayat: [{peran, teks}], sesiId? }
// Stateless untuk prototype: tanpa GEMINI_API_KEY otomatis fallback mock
// agar demo Desweb tidak pernah mati. Penyimpanan riwayat ke DB menyusul
// setelah UC-01 (registrasi) + sesi stabil.
import { tanyaGemini } from './lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' })

  const { pesan = '', riwayat = [] } = req.body ?? {}
  if (!String(pesan).trim()) return res.status(400).json({ error: 'pesan kosong' })

  const hasil = await tanyaGemini(String(pesan), Array.isArray(riwayat) ? riwayat : [])
  return res.status(200).json(hasil)
}
