// POST /api/auth/register — UC-01 Registrasi Akun.
// Body: { nama, email, password } → 201 { token, user }
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { tanya } from '../lib/db.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' })

  try {
    const { nama = '', email = '', password = '' } = req.body ?? {}
    if (!String(nama).trim() || !EMAIL_RE.test(String(email)) || String(password).length < 6) {
      return res.status(400).json({ error: 'Nama, email valid, dan password min. 6 karakter wajib diisi' })
    }
    const surel = String(email).toLowerCase()
    const ada = await tanya('SELECT id FROM users WHERE email = $1', [surel])
    if (ada.rowCount) return res.status(409).json({ error: 'Email sudah terdaftar, silakan login' })

    const hash = await bcrypt.hash(String(password), 10)
    const q = await tanya(
      'INSERT INTO users (nama, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nama, email, created_at',
      [String(nama).trim(), surel, hash],
    )
    const user = q.rows[0]
    const token = jwt.sign({ uid: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.status(201).json({ token, user })
  } catch {
    const belumKonfig = !process.env.DATABASE_URL || !process.env.JWT_SECRET
    return res.status(500).json({
      error: belumKonfig
        ? 'Konfigurasi server belum lengkap (DATABASE_URL / JWT_SECRET)'
        : 'Gagal mendaftar, coba lagi',
    })
  }
}
