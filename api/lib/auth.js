// Verifikasi token JWT pada header "Authorization: Bearer <token>".
// Dipakai endpoint yang wajib login (riwayat, laporan). Tidak ada sesi di
// server: token ditandatangani saat login/daftar, lalu diperiksa di sini.
import jwt from 'jsonwebtoken'

export function penggunaDariPermintaan(req) {
  const kepala = req?.headers?.authorization ?? req?.headers?.Authorization ?? ''
  const cocok = /^Bearer\s+(.+)$/i.exec(String(kepala).trim())
  if (!cocok) return null
  const rahasia = process.env.JWT_SECRET
  if (!rahasia) return null
  try {
    const isi = jwt.verify(cocok[1], rahasia)
    if (!isi?.uid) return null
    return { id: isi.uid, email: isi.email ?? null }
  } catch {
    return null
  }
}

// Server belum lengkap dikonfigurasi (bukan salah user) → balas 500, bukan 401.
export function konfigurasiKurang() {
  return !process.env.JWT_SECRET || !process.env.DATABASE_URL
}
