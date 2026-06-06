<script setup lang="ts">
import { ref } from 'vue'
import { useLifecycleConsole } from '@/composables/useLifecycleConsole'
import ToggleItem from '@/components/about/ToggleItem.vue'

const props = defineProps<{
  tagPrefix: string
}>()

const show = ref(false)

useLifecycleConsole(`${props.tagPrefix}:ToggleButton`)
</script>

<template>
  <div>
    <button @click="show = !show">Toggle</button>
    <ToggleItem v-if="show" :tag-prefix="`${tagPrefix}:v-if:`" />
    <ToggleItem v-show="show" :tag-prefix="`${tagPrefix}:v-show:`" />
  </div>
</template>

<style scoped></style>
