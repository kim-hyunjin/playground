export type FieldPosition = 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH'
export type PlayerRole = FieldPosition | 'SP' | 'RP'

export interface Player {
  id: string
  name: string
  age: number
  role: PlayerRole
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
}

export interface BatterStats {
  type: 'batter'
  games: number
  ab: number
  hits: number
  hr: number
  rbi: number
  avg: number
}

export interface PitcherStats {
  type: 'pitcher'
  games: number
  ip: number
  wins: number
  losses: number
  era: number
  strikeouts: number
}

export interface Team {
  id: string
  name: string
  city: string
  abbr: string
  color: string
  budget: number
  players: Player[]
  wins: number
  losses: number
  runsScored: number
  runsAllowed: number
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
}

export type View =
  | 'dashboard'
  | 'squad'
  | 'lineup'
  | 'rotation'
  | 'match'
  | 'standings'
  | 'transfers'

export interface GameState {
  version: 1
  userTeamId: string
  teams: Team[]
  schedule: ScheduledGame[]
  currentWeek: number
  totalWeeks: number
  lineup: Record<FieldPosition, string>
  rotation: string[]
  rotationIndex: number
  results: GameResult[]
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
