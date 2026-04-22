<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="uploadRef" :addSong="addSong"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="song in songs"
              :key="song.doc_id"
              :song="song"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
// import useUserStore from '@/stores/user'
import AppUpload from '@/components/AppUpload.vue'
import { songsCollection, auth } from '@/includes/firebase'
import type { Song, SongWithID } from '@/models/song'
import { query, where, getDocs } from 'firebase/firestore'
import CompositionItem from '@/components/CompositionItem.vue'

export default {
  name: 'ManageView',
  components: {
    AppUpload,
    CompositionItem
  },
  data() {
    return {
      songs: [] as SongWithID[],
      unsavedFlag: false
    }
  },
  async created() {
    const q = query(songsCollection, where('uid', '==', auth.currentUser?.uid))
    const snapshot = await getDocs(q)

    snapshot.forEach((doc) => {
      const song: SongWithID = {
        ...(doc.data() as Song),
        doc_id: doc.id
      }
      this.songs.push(song)
    })
  },
  methods: {
    updateSong(updatedSong: SongWithID) {
      const index = this.songs.findIndex((e) => e.doc_id === updatedSong.doc_id)
      if (index === -1) return

      this.songs[index] = updatedSong
    },
    removeSong(doc_id: string) {
      const index = this.songs.findIndex((e) => e.doc_id === doc_id)
      if (index === -1) return

      this.songs.splice(index, 1)
    },
    addSong(newSong: SongWithID) {
      this.songs.push(newSong)
    },
    updateUnsavedFlag(flag: boolean) {
      this.unsavedFlag = flag
    }
  },
  beforeRouteLeave(to, from, next) {
    // ;(this.$refs.uploadRef as any).cancelUploads()
    // next()
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
      next(leave)
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   const userStore = useUserStore()

  //   if (userStore.userLoggedIn) {
  //     next()
  //   } else {
  //     next({ name: 'home' })
  //   }
  // }
}
</script>

<style scoped></style>
