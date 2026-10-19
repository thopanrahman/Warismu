// POST /api/auth/login — UC-01 (lanjutan) Masuk Akun.
// Body: { email, password } → 200 { token, user }
// Tidak ada status login di server (stateless): token JWT disimpan frontend.
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { tanya } from '../lib/db.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' })

  try {
    const { email = '', password = '' } = req.body ?? {}
    if (!EMAIL_RE.test(String(email)) || !String(password)) {
      return res.status(400).json({ error: 'Email valid dan password wajib diisi' })
    }

    const q = await tanya(
      'SELECT id, nama, email, password_hash FROM users WHERE email = $1',
      [String(email).toLowerCase()],
    )
    // Pesan sengaja sama untuk email tak dikenal & password salah,
    // supaya tidak membocorkan email mana yang terdaftar.
    if (!q.rowCount) return res.status(401).json({ error: 'Email atau password salah' })

    const user = q.rows[0]
    const cocok = await bcrypt.compare(String(password), user.password_hash)
    if (!cocok) return res.status(401).json({ error: 'Email atau password salah' })

    const token = jwt.sign({ uid: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
    return res.status(200).json({
      token,
      user: { id: user.id, nama: user.nama, email: user.email },
    })
  } catch {
    const belumKonfig = !process.env.DATABASE_URL || !process.env.JWT_SECRET
    return res.status(500).json({
      error: belumKonfig
        ? 'Konfigurasi server belum lengkap (DATABASE_URL / JWT_SECRET)'
        : 'Gagal masuk, coba lagi',
    })
  }
}
