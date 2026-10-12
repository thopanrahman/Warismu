import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AboutPage from '../pages/AboutPage.vue'
import PanduanPage from '../pages/PanduanPage.vue'
import PanduanDetailPage from '../pages/PanduanDetailPage.vue'
import ContactPage from '../pages/ContactPage.vue'

// Sengaja pakai Hash History (URL jadi /#/tentang).
// Alasannya: hosting murah/statis (GitHub Pages, Netlify tanpa config,
// dibuka lewat Live Server / sub-folder) tidak punya fallback SPA,
// sehingga History Mode bikin refresh di /tentang atau /panduan/3
// melempar 404. Dengan hash, semua rute tetap jalan tanpa setting server.
const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { title: 'Beranda' } },
  { path: '/tentang', name: 'tentang', component: AboutPage, meta: { title: 'Tentang' } },
  { path: '/panduan', name: 'panduan', component: PanduanPage, meta: { title: 'Panduan Faraid' } },
  {
    path: '/panduan/:id',
    name: 'panduan-detail',
    component: PanduanDetailPage,
    meta: { title: 'Detail Panduan' },
  },
  { path: '/kontak', name: 'kontak', component: ContactPage, meta: { title: 'Kontak' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'WarisMu'} — WarisMu`
})

export default router
