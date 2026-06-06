<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" v-if="showAlert" :class="alertVariant">
        {{ alertMessage }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { songsCollection, storage } from '@/includes/firebase'
import type { SongWithID } from '@/models/song'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { ErrorMessage } from 'vee-validate'
import { reactive, ref } from 'vue'

const props = defineProps<{
  song: SongWithID
  updateSong: (updated: SongWithID) => void
  removeSong: (doc_id: string) => void
  updateUnsavedFlag: (flag: boolean) => void
}>()

const showForm = ref(false)
const schema = reactive({
  modified_name: 'required',
  genre: 'alpha_spaces'
})
const inSubmission = ref(false)
const showAlert = ref(false)
const alertVariant = ref('bg-blue-500')
const alertMessage = ref('Please wait! Updating song info...')

async function edit(values: any) {
  inSubmission.value = true
  showAlert.value = true
  alertVariant.value = 'bg-blue-500'
  alertMessage.value = 'Please wait! Updating song info...'

  try {
    await updateDoc(doc(songsCollection, props.song.doc_id), values)

    props.updateSong({ ...props.song, ...values })
    props.updateUnsavedFlag(false)

    inSubmission.value = false
    alertVariant.value = 'bg-green-500'
    alertMessage.value = 'Success!'
  } catch (error) {
    inSubmission.value = false
    alertVariant.value = 'bg-red-500'
    alertMessage.value = 'Something went wrong...'
  }
}

async function deleteSong() {
  await deleteObject(storageRef(storage, `songs/${props.song.original_name}`))
  await deleteDoc(doc(songsCollection, props.song.doc_id))
  props.removeSong(props.song.doc_id)
}
</script>

<style scoped></style>
