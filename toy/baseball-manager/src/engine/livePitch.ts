import type { AtBatOutcome, Player } from '../types/game'

export type PitchCall = 'ball' | 'strike' | 'inPlay'

export interface LivePitch {
  type: '직구' | '슬라이더' | '커브' | '체인지업'
  speedKmh: number
  x: number
  y: number
  call: PitchCall
}

function hash(values: Array<string | number>): number {
  let value = 2166136261
  for (const char of values.join(':')) {
    value ^= char.charCodeAt(0)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function unit(seed: number, shift: number): number {
  return ((seed >>> shift) & 0xff) / 255
}

export function createLivePitch(input: {
  seed: number
  cursor: number
  pitchNumber: number
  pitcher?: Player
  call: PitchCall
  outcome?: AtBatOutcome
}): LivePitch {
  const { seed, cursor, pitchNumber, pitcher, call, outcome } = input
  const value = hash([seed, cursor, pitchNumber, pitcher?.id ?? 'pitcher', call, outcome ?? 'none'])
  const velocity = pitcher?.velocity ?? 60
  const movement = pitcher?.movement ?? 60
  const selector = unit(value, 0)
  const type = selector < 0.48
    ? '직구'
    : selector < 0.7
      ? '슬라이더'
      : selector < 0.84
        ? '커브'
        : '체인지업'
  const speedOffset = type === '직구' ? 0 : type === '슬라이더' ? -12 : type === '커브' ? -20 : -15
  const speedKmh = Math.round(135 + velocity * 0.25 + speedOffset + (unit(value, 8) - 0.5) * 4)

  let x: number
  let y: number
  if (call === 'ball') {
    const side = unit(value, 16) < 0.5 ? -1 : 1
    x = side < 0 ? 9 + unit(value, 8) * 13 : 78 + unit(value, 8) * 13
    y = 12 + unit(value, 0) * 76
  } else {
    x = 30 + unit(value, 8) * 40
    y = 27 + unit(value, 16) * 46
    if (type !== '직구') y = Math.min(76, y + movement / 25)
  }

  return { type, speedKmh, x: Math.round(x), y: Math.round(y), call }
}

export const PITCH_CALL_LABEL: Record<PitchCall, string> = {
  ball: '볼',
  strike: '스트라이크',
  inPlay: '인플레이',
}

/** 현재 투구 재생 규칙에서 타석이 끝날 때까지 표시되는 투구 수. */
export function pitchCountForOutcome(outcome?: AtBatOutcome): number {
  if (outcome === 'walk') return 6
  if (outcome === 'strikeout') return 4
  return 3
}
