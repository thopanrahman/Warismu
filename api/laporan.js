// POST /api/laporan — UC-14 Melaporkan Jawaban AI.
// Body: { alasan? } → 201 { ok: true, laporan: { id, status } }
// Wajib header Authorization: Bearer <token>.
import { tanya } from './lib/db.js'
import { penggunaDariPermintaan, konfigurasiKurang } from './lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' })
  if (konfigurasiKurang()) {
    return res.status(500).json({ error: 'Konfigurasi server belum lengkap (DATABASE_URL / JWT_SECRET)' })
  }
  const pengguna = penggunaDariPermintaan(req)
  if (!pengguna) return res.status(401).json({ error: 'Sesi login berakhir, silakan masuk lagi' })

  try {
    const alasan =
      String(req.body?.alasan ?? '').trim().slice(0, 500) || 'Jawaban AI dirasa kurang tepat'
    const q = await tanya(
      'INSERT INTO reports (user_id, reason) VALUES ($1, $2) RETURNING id, status',
      [pengguna.id, alasan],
    )
    return res.status(201).json({ ok: true, laporan: q.rows[0] })
  } catch {
    return res.status(500).json({ error: 'Gagal mengirim laporan, coba lagi' })
  }
}
