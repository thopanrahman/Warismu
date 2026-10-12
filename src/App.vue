<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
// Di halaman chat ala DeepSeek tidak ada footer — chat butuh ruang penuh
const tampilFooter = computed(() => !route.meta.tanpaFooter)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper text-ink pt-4">
    <Navbar />
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="tampilFooter" />
  </div>
</template>
