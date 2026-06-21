import type { PlayerRole } from '../../src/types/game'
import type { PitcherSourceStats } from '../../src/data/types'

const INFIELD = new Set(['1B', '2B', '3B', 'SS'])
const OUTFIELD = new Set(['LF', 'CF', 'RF', 'DH'])

/** KBO 검색 포지션·프로필 문자열 → 게임 role (신규 선수용) */
export function mapKboRole(
  kboRole: string,
  positionLabel: string,
  pitcherStats?: Pick<PitcherSourceStats, 'gs' | 'games' | 'ip'>,
  prefer?: PlayerRole,
): PlayerRole {
  if (prefer && (prefer === 'SP' || prefer === 'RP' || INFIELD.has(prefer) || OUTFIELD.has(prefer) || prefer === 'C')) {
    // refresh 시 기존 포지션 유지 (KBO는 내/외야만 구분하는 경우가 많음)
    if (kboRole.includes('투수') || positionLabel.includes('투수')) {
      return inferPitcherRole(pitcherStats, prefer)
    }
    if (kboRole.includes('포수') || positionLabel.includes('포수')) return 'C'
    return prefer
  }

  if (kboRole.includes('투수') || positionLabel.includes('투수')) {
    return inferPitcherRole(pitcherStats)
  }
  if (kboRole.includes('포수') || positionLabel.includes('포수')) return 'C'
  if (kboRole.includes('외야') || positionLabel.includes('외야')) return 'CF'
  if (kboRole.includes('내야') || positionLabel.includes('내야')) return 'SS'
  return 'DH'
}

function inferPitcherRole(
  stats?: Pick<PitcherSourceStats, 'gs' | 'games' | 'ip'>,
  prefer?: PlayerRole,
): 'SP' | 'RP' {
  if (prefer === 'SP' || prefer === 'RP') {
    if (stats?.games && stats.gs != null) {
      const gsRate = stats.gs / stats.games
      if (gsRate >= 0.45) return 'SP'
      if (gsRate <= 0.15) return 'RP'
    }
    return prefer
  }
  if (stats?.games && stats.gs != null) {
    const gsRate = stats.gs / stats.games
    if (gsRate >= 0.35 || (stats.ip ?? 0) >= 60) return 'SP'
  }
  return 'RP'
}
