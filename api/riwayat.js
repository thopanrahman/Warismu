// /api/riwayat — riwayat konsultasi milik akun, disimpan di Supabase (tabel
// sessions). Sebelumnya riwayat hanya menumpang di localStorage browser.
//
//   GET    /api/riwayat          → { daftar: [{ id, judul, waktu, jumlah, pesan }] }
//   GET    /api/riwayat?id=UUID  → { sesi: {...} }
//   POST   /api/riwayat          → { id } simpan/perbarui sesi   (UC-04, UC-05)
//   POST   /api/riwayat {selesai:true} → menutup sesi            (UC-13)
//   DELETE /api/riwayat          → { dihapus: n } hapus semua     (UC-15)
//
// Wajib header Authorization: Bearer <token>.
import { tanya } from './lib/db.js'
import { penggunaDariPermintaan, konfigurasiKurang } from './lib/auth.js'

const MAKS_SESI = 50
const MAKS_PESAN = 200
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function teks(nilai, maks) {
  return String(nilai ?? '').slice(0, maks)
}

// Hanya simpan field yang dipakai UI. Pesan dari klien tidak pernah dipercaya
// mentah-mentah: peran dinormalkan, panjang dibatasi.
function bersihkanPesan(masukan) {
  if (!Array.isArray(masukan)) return []
  return masukan.slice(-MAKS_PESAN).map((p) => ({
    peran: p?.peran === 'user' ? 'user' : 'bot',
    teks: teks(p?.teks, 8000),
    hasil: p?.hasil && typeof p.hasil === 'object' ? p.hasil : null,
    sumber: p?.sumber ? teks(p.sumber, 400) : null,
    disclaimer: p?.disclaimer ? teks(p.disclaimer, 800) : null,
    dilapor: p?.dilapor === true,
    mock: p?.mock === true,
  }))
}

function keSesi(baris) {
  const data = baris.data_json || {}
  const pesan = bersihkanPesan(data.pesan)
  return {
    id: baris.id,
    judul: teks(data.judul, 120) || 'Konsultasi',
    waktu: new Date(baris.created_at).getTime() || null,
    jumlah: pesan.length,
    pesan,
  }
}

function idDari(url) {
  try {
    return new URL(String(url || ''), 'http://localhost').searchParams.get('id') || ''
  } catch {
    return ''
  }
}

export default async function handler(req, res) {
  if (konfigurasiKurang()) {
    return res.status(500).json({ error: 'Konfigurasi server belum lengkap (DATABASE_URL / JWT_SECRET)' })
  }
  const pengguna = penggunaDariPermintaan(req)
  if (!pengguna) return res.status(401).json({ error: 'Sesi login berakhir, silakan masuk lagi' })

  const metode = String(req.method || 'GET').toUpperCase()
  try {
    if (metode === 'GET') return await ambil(req, res, pengguna)
    if (metode === 'POST') return await simpan(req, res, pengguna)
    if (metode === 'DELETE') return await hapus(res, pengguna)
    return res.status(405).json({ error: 'Metode tidak didukung' })
  } catch {
    return res.status(500).json({ error: 'Gagal memproses riwayat, coba lagi' })
  }
}

async function ambil(req, res, pengguna) {
  const id = idDari(req.url)
  if (id) {
    if (!UUID_RE.test(id)) return res.status(400).json({ error: 'ID sesi tidak valid' })
    const q = await tanya(
      'SELECT id, data_json, created_at FROM sessions WHERE id = $1 AND user_id = $2',
      [id, pengguna.id],
    )
    if (!q.rowCount) return res.status(404).json({ error: 'Sesi tidak ditemukan' })
    return res.status(200).json({ sesi: keSesi(q.rows[0]) })
  }

  const q = await tanya(
    'SELECT id, data_json, created_at FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [pengguna.id, MAKS_SESI],
  )
  return res.status(200).json({ daftar: q.rows.map(keSesi) })
}

async function simpan(req, res, pengguna) {
  const body = req.body ?? {}
  const id = body.id ? String(body.id) : ''
  if (id && !UUID_RE.test(id)) return res.status(400).json({ error: 'ID sesi tidak valid' })

  // Menutup sesi (UC-13): status jadi 'selesai' + catat waktu berakhir.
  if (body.selesai === true) {
    if (!id) return res.status(400).json({ error: 'ID sesi wajib untuk menutup sesi' })
    const q = await tanya(
      "UPDATE sessions SET status = 'selesai', ended_at = now() WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, pengguna.id],
    )
    if (!q.rowCount) return res.status(404).json({ error: 'Sesi tidak ditemukan' })
    return res.status(200).json({ id, selesai: true })
  }

  const judul = teks(body.judul, 120).trim() || 'Konsultasi'
  const data = JSON.stringify({ judul, pesan: bersihkanPesan(body.pesan) })

  // Sesi yang sudah ada: perbarui isinya. Bila ID tidak dikenal (mis. baris
  // sudah dihapus di tab lain), lanjut dibuat baru agar chat tidak putus.
  if (id) {
    const q = await tanya(
      'UPDATE sessions SET data_json = $3::jsonb WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, pengguna.id, data],
    )
    if (q.rowCount) return res.status(200).json({ id })
  }

  // session_token wajib unik & terisi: dipakai token acak dari Postgres.
  // $1 di-cast eksplisit karena dipakai dua tipe (uuid untuk user_id, text
  // untuk token) — tanpa cast, Postgres menolak dengan "inconsistent types".
  const baru = await tanya(
    `INSERT INTO sessions (user_id, session_token, data_json)
     VALUES ($1::uuid, md5(random()::text || clock_timestamp()::text || $1::text), $2::jsonb)
     RETURNING id`,
    [pengguna.id, data],
  )
  return res.status(201).json({ id: baru.rows[0].id })
}

async function hapus(res, pengguna) {
  const q = await tanya('DELETE FROM sessions WHERE user_id = $1 RETURNING id', [pengguna.id])
  return res.status(200).json({ dihapus: q.rowCount })
}
