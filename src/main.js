import { createApp } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/main.css'
import router from './router'
import App from './App.vue'

createApp(App).use(router).mount('#app')
