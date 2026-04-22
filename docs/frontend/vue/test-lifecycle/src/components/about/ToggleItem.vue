<script setup lang="ts">
import { useLifecycleConsole } from '@/composables/useLifecycleConsole'

const props = defineProps<{
  tagPrefix: string
}>()

useLifecycleConsole(`${props.tagPrefix}:ToggleItem`)
</script>

<template>
  <h1>{{ tagPrefix }}hello!</h1>
</template>

<style scoped></style>
