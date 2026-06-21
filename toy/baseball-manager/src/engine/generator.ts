import type { FieldPosition, Player, PlayerRole, RosterLevel, Team } from '../types/game'
import { emptyBatterStats, emptyPitcherStats } from '../types/game'
import { generateDefaultStaff } from './coachGenerator'
import { rollPotential } from './playerDevelopment'

const LAST_NAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '류', '홍',
]
const FIRST_NAMES = [
  '민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '준서', '건우',
  '현우', '우진', '선우', '연우', '정우', '승우', '태양', '재윤', '민재', '성민',
  '지훈', '동현', '승현', '준혁', '태민', '영호', '상우', '재원', '현석', '경민',
]

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)]!
}

function clamp(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, n))
}


export function generateName(): string {
  return `${pick(LAST_NAMES)}${pick(FIRST_NAMES)}`
}

export function generatePlayer(
  role: PlayerRole,
  tier: 'star' | 'avg' | 'weak' = 'avg',
  options: { rosterLevel?: RosterLevel; ageMin?: number; ageMax?: number } = {},
): Player {
  const rosterLevel = options.rosterLevel ?? 'first'
  const ageMin = options.ageMin ?? (rosterLevel === 'farm' ? 18 : 21)
  const ageMax = options.ageMax ?? (rosterLevel === 'farm' ? 24 : 36)
  const base = tier === 'star' ? rand(72, 92) : tier === 'avg' ? rand(52, 78) : rand(38, 58)
  const farmBase = tier === 'avg' ? rand(45, 62) : rand(35, 52)
  const effectiveBase = rosterLevel === 'farm' ? farmBase : base
  const variance = () => clamp(effectiveBase + rand(-8, 8))

  const isPitcherRole = role === 'SP' || role === 'RP'

  const attrs = {
    id: crypto.randomUUID(),
    name: generateName(),
    age: rand(ageMin, ageMax),
    role,
    rosterLevel,
    contact: isPitcherRole ? rand(25, 45) : variance(),
    power: isPitcherRole ? rand(20, 40) : variance(),
    eye: isPitcherRole ? rand(25, 45) : variance(),
    speed: isPitcherRole ? rand(30, 55) : variance(),
    fielding: isPitcherRole ? rand(40, 60) : variance(),
    velocity: isPitcherRole ? variance() : rand(20, 40),
    control: isPitcherRole ? variance() : rand(20, 40),
    movement: isPitcherRole ? variance() : rand(20, 40),
    stamina: isPitcherRole ? (role === 'SP' ? variance() : rand(45, 70)) : rand(50, 80),
    salary: isPitcherRole ? rand(80, 350) * 10000 : rand(30, 200) * 10000,
    morale: rand(65, 95),
    fatigue: rand(0, 15),
    seasonStats: isPitcherRole ? emptyPitcherStats() : emptyBatterStats(),
    farmSeasonStats: isPitcherRole ? emptyPitcherStats() : emptyBatterStats(),
  } satisfies Omit<Player, 'potential' | 'developmentXp'>

  const ovr = overallRating(attrs as Player)
  return {
    ...attrs,
    potential: rollPotential(tier, attrs.age, rosterLevel, ovr),
    developmentXp: 0,
  }
}

export const TEAM_DEFS = [
  { city: '광주', name: '기아 타이거즈', abbr: 'KIA', color: '#EA0029', stadium: '광주-기아 챔피언스 필드' },
  { city: '창원', name: 'NC 다이노스', abbr: 'NC', color: '#315288', stadium: '창원 NC 파크' },
  { city: '인천', name: 'SSG 랜더스', abbr: 'SSG', color: '#CE0E2D', stadium: '인천 SSG 랜더스필드' },
  { city: '서울', name: '키움 히어로즈', abbr: 'WO', color: '#570514', stadium: '고척 스카이돔' },
  { city: '수원', name: 'KT 위즈', abbr: 'KT', color: '#000000', stadium: 'KT 위즈파크' },
  { city: '서울', name: '두산 베어스', abbr: 'DS', color: '#131230', stadium: '잠실 야구장' },
  { city: '서울', name: 'LG 트윈스', abbr: 'LG', color: '#C30452', stadium: '잠실 야구장' },
  { city: '부산', name: '롯데 자이언츠', abbr: 'LT', color: '#041E42', stadium: '사직야구장' },
  { city: '대전', name: '한화 이글스', abbr: 'HH', color: '#FF6600', stadium: '대전 한화생명 이글스파크' },
  { city: '대구', name: '삼성 라이온즈', abbr: 'SS', color: '#074CA1', stadium: '대구 삼성 라이온즈 파크' },
]

const ROSTER_TEMPLATE: PlayerRole[] = [
  'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH',
  'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF',
  'SP', 'SP', 'SP', 'SP', 'SP',
  'RP', 'RP', 'RP', 'RP', 'RP',
]

const FARM_ROSTER_TEMPLATE: PlayerRole[] = [
  'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH',
  'C', '2B', 'SS', 'LF', 'CF', 'RF',
  'SP', 'SP', 'SP', 'SP',
  'RP', 'RP', 'RP', 'RP', 'RP', 'RP',
]

function farmRosterTier(index: number): 'avg' | 'weak' {
  return index < 4 ? 'avg' : 'weak'
}

export function generateFarmRosterPlayers(): Player[] {
  return FARM_ROSTER_TEMPLATE.map((role, i) =>
    generatePlayer(role, farmRosterTier(i), { rosterLevel: 'farm' }),
  )
}

function rosterTier(index: number, role: PlayerRole): 'star' | 'avg' | 'weak' {
  if (role === 'SP' && index < 2) return 'star'
  if (['SS', 'CF', 'C'].includes(role) && index === 0) return 'star'
  if (index < 9) return 'avg'
  return 'weak'
}

export function generateTeam(def: (typeof TEAM_DEFS)[number], starBoost = false): Team {
  const firstPlayers = ROSTER_TEMPLATE.map((role, i) => {
    const tier = starBoost && i < 3 ? 'star' : rosterTier(i, role)
    return generatePlayer(role, tier, { rosterLevel: 'first' })
  })
  const farmPlayers = generateFarmRosterPlayers()

  return {
    id: crypto.randomUUID(),
    name: def.name,
    city: def.city,
    abbr: def.abbr,
    color: def.color,
    stadium: def.stadium,
    budget: rand(8, 15) * 1_000_000,
    players: [...firstPlayers, ...farmPlayers],
    wins: 0,
    losses: 0,
    runsScored: 0,
    runsAllowed: 0,
    farmWins: 0,
    farmLosses: 0,
    farmRunsScored: 0,
    farmRunsAllowed: 0,
    coaches: generateDefaultStaff(starBoost),
  }
}

export function generateLeague(userTeamIndex: number): Team[] {
  return TEAM_DEFS.map((def, i) => generateTeam(def, i === userTeamIndex))
}

export function defaultLineup(team: Team): Record<FieldPosition, string> {
  const positions: FieldPosition[] = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']
  const lineup = {} as Record<FieldPosition, string>
  const pool = team.players.filter((p) => p.rosterLevel !== 'farm')

  for (const pos of positions) {
    const player = pool.find((p) => p.role === pos)
    if (player) lineup[pos] = player.id
  }

  return lineup
}

export function defaultRotation(team: Team): string[] {
  return team.players.filter((p) => p.role === 'SP' && p.rosterLevel !== 'farm').map((p) => p.id)
}

export function isPitcher(p: Player) {
  return p.role === 'SP' || p.role === 'RP'
}

export function isBatter(p: Player) {
  return !isPitcher(p)
}

export function overallRating(p: Player): number {
  if (isPitcher(p)) {
    return Math.round((p.velocity + p.control + p.movement + p.stamina) / 4)
  }
  return Math.round((p.contact + p.power + p.eye + p.speed + p.fielding) / 5)
}

export function formatSalary(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return `$${Math.round(n / 1000)}K`
}

export function teamPayroll(team: Team) {
  return team.players.reduce((s, p) => s + p.salary, 0)
}
