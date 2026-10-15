// Koneksi PostgreSQL (Supabase) via pg — dipakai semua serverless function.
// DATABASE_URL memakai connection pooler (port 6543) + ?pgbouncer=true
// Lihat .env.example untuk format lengkapnya.
import pg from 'pg'

const { Pool } = pg

let pool = null

export function dapatkanPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL belum diisi (lihat .env.example)')
  pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false }, // wajib untuk Supabase
    max: 5, // serverless: batasi koneksi per instance
  })
  return pool
}

export async function tanya(teks, params = []) {
  return dapatkanPool().query(teks, params)
}
