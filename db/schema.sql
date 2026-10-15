-- WarisMu D1–D5 — jalankan di Supabase SQL Editor (sekali saja).
-- Supabase Postgres sudah mendukung gen_random_uuid() tanpa ekstensi tambahan.

-- D1 | users — data akun pengguna
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nama TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- D2 | sessions — sesi konsultasi (guest & registered)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_token TEXT UNIQUE NOT NULL,
  data_json JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'aktif',
  migrated_flag BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- D3 | consultations — hasil konsultasi tersimpan
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  cerita TEXT NOT NULL,
  hasil_json JSONB NOT NULL DEFAULT '{}',
  penjelasan TEXT,
  sumber TEXT,
  disclaimer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- D4 | reports — laporan jawaban AI yang salah
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'baru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- D5 | prompts — prompt LLM modular
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT UNIQUE NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'chat',
  konten TEXT NOT NULL,
  versi INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
