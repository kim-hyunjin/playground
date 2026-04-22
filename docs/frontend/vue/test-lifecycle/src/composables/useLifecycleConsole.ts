import {
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  onBeforeUpdate,
  onUpdated,
  onActivated,
  onDeactivated,
  onRenderTriggered,
  onRenderTracked,
  onErrorCaptured,
  onScopeDispose
} from 'vue'

export const useLifecycleConsole = (tag: string) => {
  onMounted(() => {
    console.log(`[${tag}] mounted`)
  })

  onBeforeMount(() => {
    console.log(`[${tag}] before mount`)
  })

  onBeforeUnmount(() => {
    console.log(`[${tag}] before unmount`)
  })

  onUnmounted(() => {
    console.log(`[${tag}] unmounted`)
  })

  onBeforeUpdate(() => {
    console.log(`[${tag}] before update`)
  })

  onUpdated(() => {
    console.log(`[${tag}] updated`)
  })

  onActivated(() => {
    console.log(`[${tag}] activated`)
  })

  onDeactivated(() => {
    console.log(`[${tag}] deactivated`)
  })

  onRenderTriggered(() => {
    console.log(`[${tag}] render triggered`)
  })

  onRenderTracked(() => {
    console.log(`[${tag}] render tracked`)
  })

  onErrorCaptured(() => {
    console.log(`[${tag}] error captured`)
  })

  onScopeDispose(() => {
    console.log(`[${tag}] scope disposed`)
  })
}
