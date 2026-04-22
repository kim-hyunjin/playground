<script setup>
import { onMounted, ref } from 'vue'

const messageToAndroid = ref('')
const messageFromAndroid = ref('')
onMounted(() => {
  window.receiveMessageFromAndroid = (message) => {
    messageFromAndroid.value = message
  }
})
const sendToAndroid = () => {
  window.Android.send(messageToAndroid.value)
  messageToAndroid.value = ''
}
</script>

<template>
  <div class="main">
    <input v-model="messageToAndroid" placeholder="Say to Android" />
    <button @click="sendToAndroid">Send message to android</button>
    <p>Android says: {{ messageFromAndroid }}</p>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  height: 1.5rem;
}
</style>
