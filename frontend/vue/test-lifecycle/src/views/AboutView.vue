<script lang="ts" setup>
import { useLifecycleConsole } from '@/composables/useLifecycleConsole'
import ToggleButton from '@/components/about/ToggleButton.vue'
import { useCounterStore } from '@/stores/counter'

useLifecycleConsole('AboutView')
const store = useCounterStore()
</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ToggleButton tag-prefix="AboutView" />
    <p>Counter: {{ store.count }}</p>
    <button @click="store.increment">increase</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
