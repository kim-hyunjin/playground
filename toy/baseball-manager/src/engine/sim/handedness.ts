import type { PitchingStyle, Player, PlayerRole } from '../../types/game'

export type Hand = 'L' | 'R' | 'S'

export const HAND_LABEL: Record<Hand, string> = {
  L: '좌',
  R: '우',
  S: '스위치',
}

function isPitcherRole(role: PlayerRole): boolean {
  return role === 'SP' || role === 'RP'
}

function hashId(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** 선수 ID 기반 결정론적 투타 (로스터 JSON 미기재 시) */
export function inferBats(player: Pick<Player, 'id' | 'role' | 'bats'>): Hand {
  if (player.bats) return player.bats
  if (isPitcherRole(player.role)) {
    return inferThrows(player)
  }
  const roll = hashId(`${player.id}:bats`) % 100
  if (roll < 8) return 'S'
  if (roll < 54) return 'R'
  return 'L'
}

export function inferThrows(player: Pick<Player, 'id' | 'role' | 'throws'>): Hand {
  if (player.throws) return player.throws
  const roll = hashId(`${player.id}:throws`) % 100
  return roll < 72 ? 'R' : 'L'
}

/** 미기재 투구폼은 선수 ID 기반으로 한 번 정해지는 결정적 분배를 사용한다. */
export function inferPitchingStyle(
  player: Pick<Player, 'id' | 'pitchingStyle'>,
): PitchingStyle {
  if (player.pitchingStyle) return player.pitchingStyle
  const roll = hashId(`${player.id}:pitchingStyle`) % 100
  if (roll < 55) return 'overhand'
  if (roll < 88) return 'threeQuarter'
  if (roll < 97) return 'sidearm'
  return 'underhand'
}

export function ensureHandedness(player: Player): Player {
  const throws = inferThrows(player)
  const pitcher = isPitcherRole(player.role)
  const bats = pitcher ? throws : inferBats(player)
  return {
    ...player,
    bats: player.bats ?? bats,
    throws: player.throws ?? throws,
    ...(pitcher ? { pitchingStyle: player.pitchingStyle ?? inferPitchingStyle(player) } : {}),
  }
}

/** 스위치 타자는 투수와 반대 편으로 타석 */
export function batterSideForMatchup(bats: Hand, pitcherThrows: Hand): 'L' | 'R' {
  if (bats === 'S') return pitcherThrows === 'R' ? 'L' : 'R'
  return bats
}

/** 동타·동투 −4%, 이타·이투 +4% contact / power */
export function platoonMultiplier(batterSide: 'L' | 'R', pitcherThrows: Hand): {
  contact: number
  power: number
} {
  const sameHand = batterSide === pitcherThrows
  if (sameHand) return { contact: 0.96, power: 0.97 }
  return { contact: 1.04, power: 1.03 }
}

export function formatHandedness(player: Player): string {
  const b = inferBats(player)
  const t = inferThrows(player)
  if (isPitcherRole(player.role)) return `${HAND_LABEL[t]}투`
  if (b === 'S') return '스위치'
  return `${HAND_LABEL[b]}타 ${HAND_LABEL[t]}투`
}
