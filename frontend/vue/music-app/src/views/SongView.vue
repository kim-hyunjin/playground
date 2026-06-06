<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          id="play-btn"
          @click.prevent="handlePlayAndPause"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song?.modified_name }}</div>
          <div>{{ song?.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song?.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="commentShowAlert"
            :class="commentAlertVariant"
          >
            {{ commentAlertMsg }}
          </div>

          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.doc_id"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { songsCollection, auth, commentsCollection } from '@/includes/firebase'
import type { Song, SongWithID } from '@/models/song'
import { doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { ErrorMessage } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { Comment, CommentWithID } from '@/models/comments'
import { usePlayerStore } from '@/stores/player'

const router = useRouter()
const route = useRoute()
const songId = route.params.id as string

const song = ref<SongWithID>()

getSongData()
getComments()

async function getSongData() {
  const songRef = doc(songsCollection, songId)
  const snapshot = await getDoc(songRef)
  if (!snapshot.exists()) {
    router.push({ name: 'home' })
  }

  song.value = {
    ...(snapshot.data() as Song),
    doc_id: songId
  }
}

const userStore = useUserStore()
const { userLoggedIn } = storeToRefs(userStore)

/**
 * Comment
 */
const comments = ref<CommentWithID[]>([])
const sort = ref<'latest' | 'oldest'>('latest')
const sortInUrl = route.query.sort
sort.value = sortInUrl === 'latest' || sortInUrl === 'oldest' ? sortInUrl : 'latest'
const sortedComments = computed(() =>
  comments.value.slice().sort((a, b) => {
    if (sort.value === 'latest') {
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
    } else {
      return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
    }
  })
)
const schema = {
  comment: 'required|min:3'
}
const commentInSubmission = ref(false)
const commentShowAlert = ref(false)
const commentAlertVariant = ref('bg-blue-500')
const commentAlertMsg = ref('Please wait! Your comment is being submitted')

async function getComments() {
  const q = query(commentsCollection, where('sid', '==', songId))
  const commentSnapshots = await getDocs(q)

  const temp: CommentWithID[] = []
  commentSnapshots.forEach((doc) => {
    temp.push({
      ...(doc.data() as Comment),
      doc_id: doc.id
    })
  })

  comments.value = temp
}

async function addComment(values: { comment: string }, { resetForm }: { resetForm: () => void }) {
  commentInSubmission.value = true
  commentShowAlert.value = true
  commentAlertVariant.value = 'bg-blue-500'
  commentAlertMsg.value = 'Please wait! Your comment is being submitted'

  const comment: Comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: songId,
    name: auth.currentUser?.displayName ?? '',
    uid: auth.currentUser?.uid ?? ''
  }

  await setDoc(doc(commentsCollection), comment)

  if (song.value) {
    song.value.comment_count += 1
    await updateDoc(doc(songsCollection, songId), { comment_count: song.value.comment_count })
  }

  getComments()

  commentInSubmission.value = false
  commentAlertVariant.value = 'bg-green-500'
  commentAlertMsg.value = 'Comment added!'

  resetForm()
}

watch(sort, (newVal) => {
  if (newVal === sortInUrl) {
    return
  }

  router.push({
    query: {
      sort: newVal
    }
  })
})

/**
 * Play
 */
const playerStore = usePlayerStore()
const { playing, currentSong } = storeToRefs(playerStore)
const { playSong, pauseSong, toggleAudio } = playerStore

function handlePlayAndPause() {
  if (playing.value) {
    pauseSong()
    return
  }
  if (currentSong.value?.doc_id === song.value?.doc_id) {
    toggleAudio()
    return
  }

  if (song.value) {
    playSong(song.value)
  }
}
</script>

<style scoped></style>
