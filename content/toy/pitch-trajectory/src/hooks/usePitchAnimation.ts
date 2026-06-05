import { useCallback, useEffect, useRef, useState } from 'react'
import { flightTimeMs } from '../lib/flightTime.ts'
import type { PitchDefinition } from '../data/pitches.ts'

export interface PitchAnimationState {
  isPlaying: boolean
  speedMultiplier: number
  progressByPitchId: Record<string, number>
  play: () => void
  pause: () => void
  reset: () => void
  setSpeedMultiplier: (value: number) => void
}

function initialProgress(pitchIds: string[]): Record<string, number> {
  return Object.fromEntries(pitchIds.map((id) => [id, 0]))
}

export function usePitchAnimation(
  selectedPitches: PitchDefinition[],
): PitchAnimationState {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMultiplier, setSpeedMultiplierState] = useState(1)
  const [progressByPitchId, setProgressByPitchId] = useState<Record<string, number>>({})

  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const isPlayingRef = useRef(false)
  const progressRef = useRef<Record<string, number>>({})
  const pitchesRef = useRef(selectedPitches)
  const speedRef = useRef(speedMultiplier)

  pitchesRef.current = selectedPitches
  speedRef.current = speedMultiplier
  isPlayingRef.current = isPlaying

  const pitchIds = selectedPitches.map((p) => p.id).join(',')

  useEffect(() => {
    const initial = initialProgress(selectedPitches.map((p) => p.id))
    progressRef.current = initial
    setProgressByPitchId(initial)
    setIsPlaying(false)
    lastTimeRef.current = null
  }, [pitchIds, selectedPitches])

  const tick = useCallback((timestamp: number) => {
    if (!isPlayingRef.current) return

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    const deltaMs = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    if (deltaMs <= 0) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    const pitches = pitchesRef.current
    const multiplier = speedRef.current
    const prev = progressRef.current
    const next = { ...prev }
    let allDone = true

    for (const pitch of pitches) {
      const current = next[pitch.id] ?? 0
      if (current >= 1) {
        next[pitch.id] = 1
        continue
      }
      allDone = false
      const duration = flightTimeMs(
        pitch.params.speedMph,
        multiplier,
        pitch.params.releaseAngleDeg,
      )
      next[pitch.id] = Math.min(1, current + deltaMs / duration)
    }

    progressRef.current = next
    setProgressByPitchId(next)

    if (allDone) {
      setIsPlaying(false)
      isPlayingRef.current = false
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      isPlayingRef.current = true
      lastTimeRef.current = null
      rafRef.current = requestAnimationFrame(tick)
    } else {
      isPlayingRef.current = false
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isPlaying, tick])

  const play = useCallback(() => {
    if (selectedPitches.length === 0) return

    const needsReset = selectedPitches.every(
      (p) => (progressRef.current[p.id] ?? 0) >= 1,
    )
    if (needsReset) {
      const initial = initialProgress(selectedPitches.map((p) => p.id))
      progressRef.current = initial
      setProgressByPitchId(initial)
    }

    setIsPlaying(true)
  }, [selectedPitches])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    const initial = initialProgress(selectedPitches.map((p) => p.id))
    progressRef.current = initial
    setProgressByPitchId(initial)
    lastTimeRef.current = null
  }, [selectedPitches])

  const setSpeedMultiplier = useCallback((value: number) => {
    setSpeedMultiplierState(value)
  }, [])

  return {
    isPlaying,
    speedMultiplier,
    progressByPitchId,
    play,
    pause,
    reset,
    setSpeedMultiplier,
  }
}
