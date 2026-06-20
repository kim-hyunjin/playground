import type { FieldPosition, Player, PlayerRole, Team } from '../types/game'
import { emptyBatterStats, emptyPitcherStats } from '../types/game'

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

export function generatePlayer(role: PlayerRole, tier: 'star' | 'avg' | 'weak' = 'avg'): Player {
  const base = tier === 'star' ? rand(72, 92) : tier === 'avg' ? rand(52, 78) : rand(38, 58)
  const variance = () => clamp(base + rand(-8, 8))

  const isPitcher = role === 'SP' || role === 'RP'

  return {
    id: crypto.randomUUID(),
    name: generateName(),
    age: rand(21, 36),
    role,
    contact: isPitcher ? rand(25, 45) : variance(),
    power: isPitcher ? rand(20, 40) : variance(),
    eye: isPitcher ? rand(25, 45) : variance(),
    speed: isPitcher ? rand(30, 55) : variance(),
    fielding: isPitcher ? rand(40, 60) : variance(),
    velocity: isPitcher ? variance() : rand(20, 40),
    control: isPitcher ? variance() : rand(20, 40),
    movement: isPitcher ? variance() : rand(20, 40),
    stamina: isPitcher ? (role === 'SP' ? variance() : rand(45, 70)) : rand(50, 80),
    salary: isPitcher ? rand(80, 350) * 10000 : rand(30, 200) * 10000,
    morale: rand(65, 95),
    fatigue: rand(0, 15),
    seasonStats: isPitcher ? emptyPitcherStats() : emptyBatterStats(),
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

function rosterTier(index: number, role: PlayerRole): 'star' | 'avg' | 'weak' {
  if (role === 'SP' && index < 2) return 'star'
  if (['SS', 'CF', 'C'].includes(role) && index === 0) return 'star'
  if (index < 9) return 'avg'
  return 'weak'
}

export function generateTeam(def: (typeof TEAM_DEFS)[number], starBoost = false): Team {
  const players = ROSTER_TEMPLATE.map((role, i) => {
    const tier = starBoost && i < 3 ? 'star' : rosterTier(i, role)
    return generatePlayer(role, tier)
  })

  return {
    id: crypto.randomUUID(),
    name: def.name,
    city: def.city,
    abbr: def.abbr,
    color: def.color,
    stadium: def.stadium,
    budget: rand(8, 15) * 1_000_000,
    players,
    wins: 0,
    losses: 0,
    runsScored: 0,
    runsAllowed: 0,
  }
}

export function generateLeague(userTeamIndex: number): Team[] {
  return TEAM_DEFS.map((def, i) => generateTeam(def, i === userTeamIndex))
}

export function defaultLineup(team: Team): Record<FieldPosition, string> {
  const positions: FieldPosition[] = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']
  const lineup = {} as Record<FieldPosition, string>

  for (const pos of positions) {
    const player = team.players.find((p) => p.role === pos)
    if (player) lineup[pos] = player.id
  }

  return lineup
}

export function defaultRotation(team: Team): string[] {
  return team.players.filter((p) => p.role === 'SP').map((p) => p.id)
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
