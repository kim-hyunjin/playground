export interface PitchParams {
  releaseHeightFt: number
  /** degrees, + = upward release angle */
  releaseAngleDeg: number
  /** inches at plate, + = arm-side (RHP) — Statcast horizontal break */
  horizontalBreakIn: number
  /** inches at plate, + = rise vs spinless — Statcast induced vertical break */
  verticalBreakIn: number
  /** 0 = early break (t²), 1 = late break near plate */
  lateBreakRatio: number
  speedMph: number
}

export interface PitchDefinition {
  id: string
  name: string
  nameEn: string
  color: string
  description: string
  params: PitchParams
}

/** Release point distance from plate (ft). ~extension from rubber. */
export const RELEASE_DISTANCE_FT = 55

/** Statcast-inspired values tuned to cross the strike zone (1.5–3.5 ft). */
export const PITCHES: PitchDefinition[] = [
  {
    id: 'four-seam',
    name: '포심',
    nameEn: '4-Seam FB',
    color: '#ef4444',
    description: '가장 빠른 직구. 높은 IVB로 중력 낙하보다 덜 떨어지는 “상승” 궤적.',
    params: {
      releaseHeightFt: 6.0,
      releaseAngleDeg: -1.5,
      horizontalBreakIn: 2,
      verticalBreakIn: 16,
      lateBreakRatio: 0.2,
      speedMph: 95,
    },
  },
  {
    id: 'two-seam',
    name: '투심',
    nameEn: '2-Seam',
    color: '#f97316',
    description: '포심보다 느리고 arm-side로 떨어지며 sink가 큽니다.',
    params: {
      releaseHeightFt: 5.8,
      releaseAngleDeg: -2.0,
      horizontalBreakIn: 14,
      verticalBreakIn: -8,
      lateBreakRatio: 0.45,
      speedMph: 92,
    },
  },
  {
    id: 'cutter',
    name: '커터',
    nameEn: 'Cutter',
    color: '#eab308',
    description: '포심과 비슷하다가 후반에 glove-side로 살짝 꺾입니다.',
    params: {
      releaseHeightFt: 6.0,
      releaseAngleDeg: -1.4,
      horizontalBreakIn: -8,
      verticalBreakIn: 4,
      lateBreakRatio: 0.55,
      speedMph: 90,
    },
  },
  {
    id: 'slider',
    name: '슬라이더',
    nameEn: 'Slider',
    color: '#22c55e',
    description: '중간 구간부터 glove-side로 크게 꺾이며 낙하합니다.',
    params: {
      releaseHeightFt: 5.9,
      releaseAngleDeg: -1.2,
      horizontalBreakIn: -12,
      verticalBreakIn: -4,
      lateBreakRatio: 0.5,
      speedMph: 85,
    },
  },
  {
    id: 'curve',
    name: '커브',
    nameEn: 'Curveball',
    color: '#3b82f6',
    description: '느린 속도와 큰 induced drop으로 급격히 떨어집니다.',
    params: {
      releaseHeightFt: 6.0,
      releaseAngleDeg: 0.6,
      horizontalBreakIn: -6,
      verticalBreakIn: -11,
      lateBreakRatio: 0.55,
      speedMph: 78,
    },
  },
  {
    id: 'changeup',
    name: '체인지업',
    nameEn: 'Changeup',
    color: '#a855f7',
    description: '포심과 비슷한 초반 궤적, 느린 속도와 큰 낙하로 헛스윙을 유도.',
    params: {
      releaseHeightFt: 6.0,
      releaseAngleDeg: -0.6,
      horizontalBreakIn: 14,
      verticalBreakIn: -8,
      lateBreakRatio: 0.5,
      speedMph: 85,
    },
  },
  {
    id: 'splitter',
    name: '스플릿터',
    nameEn: 'Splitter',
    color: '#ec4899',
    description: '직구처럼 보이다가 플레이트 직전 급격히 떨어집니다.',
    params: {
      releaseHeightFt: 6.0,
      releaseAngleDeg: -0.3,
      horizontalBreakIn: -4,
      verticalBreakIn: -9,
      lateBreakRatio: 0.75,
      speedMph: 88,
    },
  },
  {
    id: 'knuckleball',
    name: '너클볼',
    nameEn: 'Knuckleball',
    color: '#64748b',
    description: '스핀이 거의 없어 공기 흐름에 따라 불규칙하게 흔들립니다.',
    params: {
      releaseHeightFt: 5.8,
      releaseAngleDeg: -0.5,
      horizontalBreakIn: 0,
      verticalBreakIn: -2,
      lateBreakRatio: 0.4,
      speedMph: 70,
    },
  },
]

export function getPitchById(id: string): PitchDefinition | undefined {
  return PITCHES.find((p) => p.id === id)
}
