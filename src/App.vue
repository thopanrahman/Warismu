<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const tampilFooter = computed(() => !route.meta.tanpaFooter)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-canvas text-ink selection:bg-forest-100 selection:text-forest-900">
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
