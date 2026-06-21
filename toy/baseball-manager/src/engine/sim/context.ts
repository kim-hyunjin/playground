import type { ParkProfile } from '../../data/parks/kbo2026'
import { NEUTRAL_PARK } from '../../data/parks/kbo2026'

export type SimLeagueLevel = 'first' | 'farm'

export interface SimContext {
  leagueLevel: SimLeagueLevel
  park: ParkProfile
  inning: number
  half: 'top' | 'bottom'
}

export function createSimContext(
  leagueLevel: SimLeagueLevel,
  park: ParkProfile = NEUTRAL_PARK,
  inning = 1,
  half: 'top' | 'bottom' = 'top',
): SimContext {
  return { leagueLevel, park, inning, half }
}

/** 1군·2군 리그 강도 — farm은 타격·투구 모두 상대적으로 약화 */
export const LEAGUE_STRENGTH: Record<
  SimLeagueLevel,
  { batterMult: number; pitcherMult: number }
> = {
  first: { batterMult: 1.0, pitcherMult: 1.0 },
  /** 2군: 저연령 타자 대비 투수 방어 보정 (farm roster OVR과 병행) */
  farm: { batterMult: 0.88, pitcherMult: 1.04 },
}
