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
  /** OVR 성장 상한 (1~99) */
  potential: number
  /** 경기 출전으로 누적 — 주간 육성 확률에 반영 */
  developmentXp: number
  /** 실데이터 로스터 출처 (2026 JSON) */
  realPlayerId?: string
  dataSeason?: number
  /** fillFarmGaps·드래프트 보충 등 프로시저럴 생성 */
  isGenerated?: boolean
  /** 타격 (L/R/S) — 미기재 시 ID 해시로 추론 */
  bats?: 'L' | 'R' | 'S'
  /** 투구 (L/R) */
  throws?: 'L' | 'R' | 'S'
  /** 부상 잔여 일수 (0 이하 = 출전 가능) */
  injuryDays?: number
  injuryType?: string
  /** 잔여 계약 연수 (시즌 종료마다 -1, 0 이하 FA 후보) */
  contractYears?: number
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
  saves?: number
  holds?: number
}

export interface GameBoxScore {
  batters: Record<string, BatterGameLine>
  pitchers: Record<string, PitcherGameLine>
  awayStarterId: string
  homeStarterId: string
  winningPitcherId?: string
  losingPitcherId?: string
  savePitcherId?: string
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
  coaches: Coach[]
  wins: number
  losses: number
  runsScored: number
  runsAllowed: number
  farmWins: number
  farmLosses: number
  farmRunsScored: number
  farmRunsAllowed: number
}

export type CoachRole = 'farm' | 'hitting' | 'pitching' | 'fielding'

/** 코치 능력: teaching=육성, motivation=사기, scouting=콜업/스카우팅 */
export interface Coach {
  id: string
  name: string
  role: CoachRole
  age: number
  teaching: number
  motivation: number
  scouting: number
  salary: number
}

export interface CallUpSuggestion {
  id: string
  week: number
  playerId: string
  coachId: string
  coachName: string
  reason: string
}

export const GAME_DAYS = ['tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type GameDay = (typeof GAME_DAYS)[number]

export const DAY_LABELS: Record<GameDay, string> = {
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
}

export interface ScheduledGame {
  id: string
  week: number
  /** 화~일 (정규시즌 주간 일정) */
  day: GameDay
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
  /** 구조화된 이벤트 분류. 이전 저장 데이터에는 없을 수 있다. */
  eventType?: 'plateAppearance' | 'stolenBase'
  situationBefore?: GameSituation
  situationAfter?: GameSituation
}

export interface BaseRunners {
  firstId?: string
  secondId?: string
  thirdId?: string
}

/** 한 플레이 전후의 화면 표시 및 경기 재생에 사용하는 상황 스냅샷 */
export interface GameSituation {
  inning: number
  half: 'top' | 'bottom'
  outs: number
  runners: BaseRunners
  homeScore: number
  awayScore: number
  batterId?: string
  pitcherId?: string
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
  day?: GameDay
  boxScore: GameBoxScore
  /** 홈 구장 (park factor 적용 기준) */
  parkAbbr?: string
  parkStadium?: string
}

export type SeasonPhase = 'regular' | 'stove'

export interface FreeAgentListing {
  player: Player
  askingSalary: number
  formerTeamName?: string
}

export interface DraftPick {
  round: number
  overall: number
  teamId: string
  playerId: string
}

export interface DraftState {
  pool: Player[]
  /** 역순 순위 (최하위 → 최상위) */
  order: string[]
  pickSequence: string[]
  currentPick: number
  totalPicks: number
  picks: DraftPick[]
  complete: boolean
}

export type View =
  | 'dashboard'
  | 'squad'
  | 'farm'
  | 'lineup'
  | 'rotation'
  | 'match'
  | 'schedule'
  | 'standings'
  | 'transfers'
  | 'coaches'
  | 'stats'
  | 'stove'
  | 'draft'

export interface GameState {
  userTeamId: string
  teams: Team[]
  schedule: ScheduledGame[]
  farmSchedule: ScheduledGame[]
  coachMarket: Coach[]
  callUpSuggestions: CallUpSuggestion[]
  seasonYear: number
  phase: SeasonPhase
  freeAgents: FreeAgentListing[]
  draft?: DraftState
  stoveWeek?: number
  stoveTotalWeeks?: number
  currentWeek: number
  totalWeeks: number
  lineup: Record<FieldPosition, string>
  rotation: string[]
  rotationIndex: number
  results: GameResult[]
  farmResults: GameResult[]
  managerName: string
}

export const COACH_ROLE_LABEL: Record<CoachRole, string> = {
  farm: '2군 감독',
  hitting: '타격 코치',
  pitching: '투수 코치',
  fielding: '수비 코치',
}

export const COACH_ROLES: CoachRole[] = ['farm', 'hitting', 'pitching', 'fielding']

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
