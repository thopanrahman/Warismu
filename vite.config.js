import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// base './' = path relatif, jadi aman di-hosting di mana saja
// (root domain, sub-folder, GitHub Pages, Netlify, Vercel, dsb.)
// Kalau pakai '/' absolut, aset jadi 404 saat di-live-kan di sub-folder.
export default defineConfig({
  base: './',
  plugins: [vue()],
})
