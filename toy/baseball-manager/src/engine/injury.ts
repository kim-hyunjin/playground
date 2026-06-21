import type { Player } from '../types/game'

export const INJURY_TYPES = [
  '어깨',
  '햄스트링',
  '타박상',
  '손목',
  '무릎',
  '허리',
] as const

export type InjuryType = (typeof INJURY_TYPES)[number]

export function isPlayerAvailable(player: Player): boolean {
  return !player.injuryDays || player.injuryDays <= 0
}

/** 주간 회복 — injuryDays 1 감소 */
export function tickInjuryDays(player: Player): Player {
  if (!player.injuryDays || player.injuryDays <= 0) {
    return { ...player, injuryDays: undefined, injuryType: undefined }
  }
  const next = player.injuryDays - 1
  if (next <= 0) {
    return { ...player, injuryDays: undefined, injuryType: undefined }
  }
  return { ...player, injuryDays: next }
}

/** 피로·부상 누적 선수 소량 부상 롤 (주 1회) */
export function rollWeeklyInjuries(players: Player[]): Player[] {
  return players.map((p) => {
    if (!isPlayerAvailable(p)) return p
    if (p.fatigue < 35) return p
    if (Math.random() > 0.003) return p
    const days = 7 + Math.floor(Math.random() * 15)
    const injuryType = INJURY_TYPES[Math.floor(Math.random() * INJURY_TYPES.length)]!
    return { ...p, injuryDays: days, injuryType }
  })
}

export function recoverTeamInjuries(players: Player[]): Player[] {
  return players.map(tickInjuryDays)
}
