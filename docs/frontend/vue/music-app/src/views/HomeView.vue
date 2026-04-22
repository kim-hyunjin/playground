<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ t('home.listen') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">Songs</span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.doc_id" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { songsCollection } from '@/includes/firebase'
import { type SongWithID, type Song } from '@/models/song'
import {
  getDocs,
  query,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  orderBy,
  QueryConstraint
} from 'firebase/firestore'
import { onBeforeUnmount, ref } from 'vue'
import SongItem from '@/components/SongItem.vue'
import vIconSecondary from '@/directives/icon-secondary'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const songs = ref<SongWithID[]>([])
const maxPerPage = ref(3)

// undefined - 더 이상 가져올 아이템이 없음. null - 아이템 가져오기 전이라 마지막 아이템이 없음.
const lastDoc = ref<QueryDocumentSnapshot | undefined | null>(null)
const pendingRequest = ref(false)

getSongs()

window.addEventListener('scroll', handleScroll)
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  const { scrollTop, offsetHeight } = document.documentElement
  const { innerHeight } = window
  const bottomOfWindow = Math.round(scrollTop) + innerHeight > offsetHeight - 100

  if (bottomOfWindow) {
    getSongs()
  }
}

async function getSongs() {
  if (pendingRequest.value) {
    return
  }
  if (lastDoc.value === undefined) {
    return
  }

  pendingRequest.value = true
  const queryFilters: QueryConstraint[] = [orderBy('modified_name'), limit(maxPerPage.value)]
  if (lastDoc.value) {
    queryFilters.push(startAfter(lastDoc.value))
  }

  const q = query(songsCollection, ...queryFilters)
  const snapshots = await getDocs(q)

  lastDoc.value = snapshots.docs[snapshots.docs.length - 1]
  snapshots.forEach((doc) =>
    songs.value.push({
      doc_id: doc.id,
      ...(doc.data() as Song)
    })
  )

  pendingRequest.value = false
}
</script>

<style scoped></style>
