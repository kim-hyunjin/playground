import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { SongWithID } from '@/models/song'

import { Howl } from 'howler'
import { formatTime } from '@/includes/helper'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref<SongWithID>()
  const sound = ref<Howl>()
  const seek = ref('00:00')
  const duration = ref('00:00')
  const playerProgress = ref('0%')

  const playing = computed(() => sound.value?.playing())

  async function playSong(song: SongWithID) {
    if (sound.value) {
      sound.value.unload()
    }

    currentSong.value = song
    sound.value = new Howl({
      src: [song.url],
      html5: true
    })

    sound.value.play()

    sound.value.on('play', () => {
      requestAnimationFrame(progress)
    })
  }

  function progress() {
    const soundSeek = sound.value?.seek() ?? 0
    const soundDuration = sound.value?.duration() ?? 0
    seek.value = formatTime(soundSeek)
    duration.value = formatTime(soundDuration)
    playerProgress.value = `${(soundSeek / soundDuration) * 100}%`

    if (sound.value?.playing()) {
      requestAnimationFrame(progress)
    }
  }

  async function pauseSong() {
    if (!sound.value) return

    if (sound.value.playing()) {
      sound.value.pause()
    }
  }

  async function toggleAudio() {
    if (!sound.value) return

    if (sound.value.playing()) {
      sound.value.pause()
    } else {
      sound.value.play()
    }
  }

  async function updateSeek(percentage: number) {
    if (!sound.value) return

    const seconds = sound.value?.duration() * percentage
    sound.value.seek(seconds)
    sound.value.once('seek', progress)
  }

  return {
    playSong,
    pauseSong,
    toggleAudio,
    updateSeek,
    playing,
    seek,
    duration,
    currentSong,
    playerProgress
  }
})
