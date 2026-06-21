export type FieldPosition = 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH'
export type PlayerRole = FieldPosition | 'SP' | 'RP'
export type RosterLevel = 'first' | 'farm'

export interface Player {
  id: string
  name: string
  age: number
  role: PlayerRole
  rosterLevel: RosterLevel
  contact: number
  power: number
  eye: number
  speed: number
  fielding: number
  velocity: number
  control: number
  movement: number
  stamina: number
  salary: number
  morale: number
  fatigue: number
  seasonStats: BatterStats | PitcherStats
  farmSeasonStats: BatterStats | PitcherStats
}

/** 시즌 누적 타격 기록 (파생 스탯은 sabermetrics.ts에서 계산) */
export interface BatterStats {
  type: 'batter'
  games: number
  pa: number
  ab: number
  hits: number
  singles: number
  doubles: number
  triples: number
  hr: number
  bb: number
  hbp: number
  k: number
  rbi: number
  runs: number
  sb: number
}

/** 시즌 누적 투구 기록 — ip는 아웃카운트/3 으로 표시 */
export interface PitcherStats {
  type: 'pitcher'
  games: number
  gs: number
  outs: number
  wins: number
  losses: number
  saves: number
  h: number
  r: number
  er: number
  bb: number
  hbp: number
  k: number
  hr: number
  bf: number
}

export interface BatterGameLine {
  pa: number
  ab: number
  hits: number
  singles: number
  doubles: number
  triples: number
  hr: number
  bb: number
  hbp: number
  k: number
  rbi: number
  runs: number
  sb: number
}

export interface PitcherGameLine {
  outs: number
  gs: boolean
  h: number
  r: number
  er: number
  bb: number
  hbp: number
  k: number
  hr: number
  bf: number
}

export interface GameBoxScore {
  batters: Record<string, BatterGameLine>
  pitchers: Record<string, PitcherGameLine>
  awayStarterId: string
  homeStarterId: string
}

export interface Team {
  id: string
  name: string
  city: string
  abbr: string
  color: string
  stadium: string
  budget: number
  players: Player[]
  wins: number
  losses: number
  runsScored: number
  runsAllowed: number
  farmWins: number
  farmLosses: number
  farmRunsScored: number
  farmRunsAllowed: number
}

export interface ScheduledGame {
  id: string
  week: number
  homeId: string
  awayId: string
  played: boolean
  homeScore?: number
  awayScore?: number
}

export type AtBatOutcome =
  | 'strikeout'
  | 'walk'
  | 'single'
  | 'double'
  | 'triple'
  | 'homerun'
  | 'out'
  | 'sacrifice'
  | 'error'

export interface PlayLog {
  inning: number
  half: 'top' | 'bottom'
  text: string
  outcome?: AtBatOutcome
  runsScored: number
  batterId?: string
  pitcherId?: string
  rbi?: number
}

export interface InningScore {
  top?: number
  bottom?: number
}

export interface GameResult {
  gameId: string
  homeId: string
  awayId: string
  homeScore: number
  awayScore: number
  innings: InningScore[]
  logs: PlayLog[]
  week: number
  boxScore: GameBoxScore
}

export type View =
  | 'dashboard'
  | 'squad'
  | 'farm'
  | 'lineup'
  | 'rotation'
  | 'match'
  | 'standings'
  | 'transfers'
  | 'stats'

export interface GameState {
  version: 3
  userTeamId: string
  teams: Team[]
  schedule: ScheduledGame[]
  farmSchedule: ScheduledGame[]
  currentWeek: number
  totalWeeks: number
  lineup: Record<FieldPosition, string>
  rotation: string[]
  rotationIndex: number
  results: GameResult[]
  farmResults: GameResult[]
  managerName: string
}

export const FIELD_POSITIONS: FieldPosition[] = [
  'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH',
]

export const POSITION_LABEL: Record<PlayerRole, string> = {
  C: '포수',
  '1B': '1루',
  '2B': '2루',
  '3B': '3루',
  SS: '유격',
  LF: '좌익',
  CF: '중견',
  RF: '우익',
  DH: '지명',
  SP: '선발',
  RP: '불펜',
}

export function emptyBatterGameLine(): BatterGameLine {
  return {
    pa: 0, ab: 0, hits: 0, singles: 0, doubles: 0, triples: 0, hr: 0,
    bb: 0, hbp: 0, k: 0, rbi: 0, runs: 0, sb: 0,
  }
}

export function emptyPitcherGameLine(gs = false): PitcherGameLine {
  return {
    outs: 0, gs, h: 0, r: 0, er: 0, bb: 0, hbp: 0, k: 0, hr: 0, bf: 0,
  }
}

export function emptyBatterStats(): BatterStats {
  return {
    type: 'batter', games: 0, pa: 0, ab: 0, hits: 0,
    singles: 0, doubles: 0, triples: 0, hr: 0,
    bb: 0, hbp: 0, k: 0, rbi: 0, runs: 0, sb: 0,
  }
}

export function emptyPitcherStats(): PitcherStats {
  return {
    type: 'pitcher', games: 0, gs: 0, outs: 0,
    wins: 0, losses: 0, saves: 0,
    h: 0, r: 0, er: 0, bb: 0, hbp: 0, k: 0, hr: 0, bf: 0,
  }
}
