import type { Player, PlayerRole, RosterLevel } from '../types/game'

export type TeamAbbr = 'KIA' | 'NC' | 'SSG' | 'WO' | 'KT' | 'DS' | 'LG' | 'LT' | 'HH' | 'SS'

export interface BatterSourceStats {
  pa: number
  woba?: number
  iso?: number
  bbPct?: number
  kPct?: number
  sb?: number
}

export interface PitcherSourceStats {
  ip: number
  era?: number
  fip?: number
  k9?: number
  bb9?: number
  gs?: number
  games?: number
}

export type PlayerRatings = Pick<
  Player,
  'contact' | 'power' | 'eye' | 'speed' | 'fielding' | 'velocity' | 'control' | 'movement' | 'stamina'
>

export interface PlayerRecord {
  id: string
  name: string
  teamAbbr: TeamAbbr
  role: PlayerRole
  rosterLevel: RosterLevel
  age: number
  /** 원화 연봉 (선택) */
  salaryKrw?: number
  /** 환산 입력 — ratings 미지정 시 사용 */
  sourceStats?: BatterSourceStats | PitcherSourceStats
  /** 직접 지정 시 sourceStats 무시 */
  ratings?: Partial<PlayerRatings>
  potential?: number
  /** 로더에서 OVR 맞춤용 (sourceStats 형태 유지) */
  targetOvr?: number
  /** 프로시저럴 보충 선수 표시 */
  generated?: boolean
  bats?: 'L' | 'R' | 'S'
  throws?: 'L' | 'R' | 'S'
}

export interface TeamRosterFile {
  teamAbbr: TeamAbbr
  season: number
  first: PlayerRecord[]
  farm: PlayerRecord[]
}
