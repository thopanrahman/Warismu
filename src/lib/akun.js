// Satu pintu untuk status akun di browser: token JWT, profil, dan header
// Authorization. Dipakai halaman Daftar/Masuk, sidebar chat, Navbar, ChatPage.
const KUNCI_TOKEN = 'warismu_token'
const KUNCI_PENGGUNA = 'warismu_user'

export function ambilToken() {
  try {
    return localStorage.getItem(KUNCI_TOKEN) || ''
  } catch {
    return ''
  }
}

export function ambilPengguna() {
  try {
    const mentah = localStorage.getItem(KUNCI_PENGGUNA)
    return mentah ? JSON.parse(mentah) : null
  } catch {
    return null
  }
}

export function simpanLogin(token, user) {
  try {
    localStorage.setItem(KUNCI_TOKEN, token)
    localStorage.setItem(KUNCI_PENGGUNA, JSON.stringify(user))
  } catch {
    /* mode privat: chat tetap jalan tanpa riwayat */
  }
}

export function keluarAkun() {
  try {
    localStorage.removeItem(KUNCI_TOKEN)
    localStorage.removeItem(KUNCI_PENGGUNA)
  } catch {
    /* abaikan */
  }
}

export function headerAuth() {
  const token = ambilToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Panggil endpoint API yang butuh login. Selalu balik { ok, status, data }
// supaya pemanggil tidak perlu melempar error untuk kasus wajar seperti 401.
export async function panggilApi(jalur, opsi = {}) {
  const res = await fetch(jalur, {
    ...opsi,
    headers: { 'Content-Type': 'application/json', ...headerAuth(), ...(opsi.headers || {}) },
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    /* respons kosong / bukan JSON */
  }
  return { ok: res.ok, status: res.status, data }
}
