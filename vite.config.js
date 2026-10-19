import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// base './' = path relatif, jadi aman di-hosting di mana saja
// (root domain, sub-folder, GitHub Pages, Netlify, Vercel, dsb.)
// Kalau pakai '/' absolut, aset jadi 404 saat di-live-kan di sub-folder.

// ---------------------------------------------------------------------------
// Plugin khusus dev: menjalankan handler di folder api/ langsung dari Vite.
//
// Tanpa ini, `npm run dev` (Vite) hanya menyajikan frontend. Request ke
// /api/chat dibalas 404, sehingga chat selalu jatuh ke mock lokal dan Supabase
// tidak pernah tersentuh. Dengan plugin ini, `npm run dev` sudah setara
// `vercel dev` untuk endpoint yang dipakai UI:
//
//   POST /api/chat            -> api/chat.js
//   POST /api/auth/register   -> api/auth/register.js
//
// Hanya aktif saat `vite dev` (apply: 'serve'). `vite build` dan hasil
// deploy di Vercel tidak terpengaruh. Tidak ada satu baris pun di dalam
// folder api/ yang diubah — handler-nya dipanggil apa adanya.
// ---------------------------------------------------------------------------
function apiLokalDev() {
  // Modul di-cache supaya koneksi pool pg tidak dibuat ulang tiap request.
  // Efek samping: setelah mengedit file di api/, restart dev server agar
  // perubahan terbaca.
  const modulCache = new Map()

  // Handler di api/ membaca process.env (GEMINI_API_KEY, DATABASE_URL,
  // JWT_SECRET). Vite tidak memuat kunci tanpa awalan VITE_ ke process.env,
  // jadi .env.local harus disuntik manual di sini.
  function suntikEnv(server) {
    const env = loadEnv(server.config.mode, server.config.envDir, '')
    for (const [kunci, nilai] of Object.entries(env)) {
      if (!process.env[kunci]) process.env[kunci] = nilai
    }
  }

  // '/api/chat' -> <root>/api/chat.js ; '/api/auth/register' -> .../auth/register.js
  function berkasHandler(url, akarApi) {
    const jalur = String(url || '').split('?')[0].replace(/\/+$/, '')
    if (!jalur.startsWith('/api/')) return null
    const berkas = path.resolve(akarApi, '.' + jalur.slice('/api'.length) + '.js')
    // Cegah keluar dari folder api/ (mis. /api/../../.env.local)
    if (!berkas.startsWith(akarApi + path.sep)) return null
    return fs.existsSync(berkas) ? berkas : null
  }

  function muatModul(berkas) {
    if (!modulCache.has(berkas)) modulCache.set(berkas, import(pathToFileURL(berkas).href))
    return modulCache.get(berkas)
  }

  // Tiruan objek res gaya Express/Vercel: status(kode).json(data).
  function tiruanRes(res) {
    return {
      statusCode: 200,
      setHeader(kunci, nilai) {
        res.setHeader(kunci, nilai)
      },
      status(kode) {
        this.statusCode = kode
        return this
      },
      json(data) {
        if (res.writableEnded) return
        res.statusCode = this.statusCode
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(data))
      },
    }
  }

  return {
    name: 'warismu-api-lokal',
    apply: 'serve',
    configureServer(server) {
      suntikEnv(server)
      const akarApi = path.resolve(server.config.root, 'api')

      server.middlewares.use((req, res, next) => {
        const berkas = berkasHandler(req.url, akarApi)
        if (!berkas) return next()

        let mentah = ''
        req.setEncoding('utf8')
        req.on('data', (potong) => {
          mentah += potong
        })
        req.on('error', () => next())
        req.on('end', async () => {
          let body = {}
          if (mentah.trim()) {
            try {
              body = JSON.parse(mentah)
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              return res.end(JSON.stringify({ error: 'Body bukan JSON valid' }))
            }
          }
          try {
            const modul = await muatModul(berkas)
            const handler = modul.default ?? modul.handler
            if (typeof handler !== 'function') throw new Error('tidak ada export default')
            await handler({ method: req.method, url: req.url, headers: req.headers, body }, tiruanRes(res))
          } catch (galat) {
            console.error('[api-lokal]', path.basename(berkas), galat)
            if (res.writableEnded) return
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'Handler api lokal gagal: ' + (galat?.message || galat) }))
          }
        })
      })

      server.httpServer?.once('listening', () => {
        const { logger } = server.config
        const tanda = (kunci) => (process.env[kunci] ? 'terisi' : 'KOSONG')
        logger.info('  API lokal: POST /api/chat + POST /api/auth/register aktif')
        logger.info(
          `  Kunci api : GEMINI_API_KEY ${tanda('GEMINI_API_KEY')} | DATABASE_URL ${tanda('DATABASE_URL')} | JWT_SECRET ${tanda('JWT_SECRET')}`,
        )
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [vue(), apiLokalDev()],
})
