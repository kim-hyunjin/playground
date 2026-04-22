<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { useLifecycleConsole } from '@/composables/useLifecycleConsole'

useLifecycleConsole('HomeView')
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
