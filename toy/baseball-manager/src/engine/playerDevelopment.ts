import type { Player, RosterLevel } from '../types/game'
import type { BatterGameLine, PitcherGameLine } from '../types/game'
import { isPitcher, overallRating } from './generator'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const XP_PER_GROWTH_TICK = 120

export function rollPotential(
  tier: 'star' | 'avg' | 'weak',
  age: number,
  rosterLevel: RosterLevel,
  currentOvr: number,
): number {
  let ceiling =
    tier === 'star' ? rand(78, 94) : tier === 'avg' ? rand(62, 84) : rand(48, 70)

  if (rosterLevel === 'farm' && age <= 22) ceiling += rand(4, 14)
  if (rosterLevel === 'farm' && age <= 24) ceiling += rand(0, 6)

  if (age >= 32) ceiling = Math.min(ceiling, currentOvr + rand(1, 5))
  else if (age >= 28) ceiling = Math.min(ceiling, currentOvr + rand(3, 10))

  return clamp(Math.max(ceiling, currentOvr + 2), currentOvr, 99)
}

export function defaultPotentialForPlayer(player: Player): number {
  const ovr = overallRating(player)
  const tier = ovr >= 75 ? 'star' : ovr >= 58 ? 'avg' : 'weak'
  return rollPotential(tier, player.age, player.rosterLevel ?? 'first', ovr)
}

export function hasGrowthRoom(player: Player): boolean {
  return overallRating(player) < player.potential - 1
}

export function growthRoom(player: Player): number {
  return Math.max(0, player.potential - overallRating(player))
}

/** 0~1 — XP가 쌓일수록 주간 성장 확률 보너스 */
export function xpGrowthBonus(player: Player): number {
  const xp = player.developmentXp ?? 0
  return Math.min(0.45, xp / 600)
}

export function ageDevelopmentMultiplier(age: number): number {
  if (age <= 21) return 1.35
  if (age <= 24) return 1.15
  if (age <= 27) return 0.85
  if (age <= 29) return 0.45
  return 0.15
}

export interface DevelopmentProgress {
  xp: number
  xpInBand: number
  xpToNextTick: number
  progressPct: number
  potential: number
  ovr: number
  room: number
  phase: string
}

export function developmentProgress(player: Player): DevelopmentProgress {
  const xp = player.developmentXp ?? 0
  const xpInBand = xp % XP_PER_GROWTH_TICK
  const xpToNextTick = XP_PER_GROWTH_TICK - xpInBand
  const ovr = overallRating(player)
  const potential = player.potential ?? ovr
  const room = growthRoom({ ...player, potential })

  let phase = '정점'
  if (room >= 12) phase = '고성장'
  else if (room >= 6) phase = '성장'
  else if (room >= 2) phase = '미세 성장'

  return {
    xp,
    xpInBand,
    xpToNextTick,
    progressPct: Math.round((xpInBand / XP_PER_GROWTH_TICK) * 100),
    potential,
    ovr,
    room,
    phase,
  }
}

export function awardXpFromGameLine(
  player: Player,
  bat: BatterGameLine | undefined,
  pit: PitcherGameLine | undefined,
  target: 'first' | 'farm',
): Player {
  if (!hasGrowthRoom(player) && player.age > 28) return player

  const ageMult = ageDevelopmentMultiplier(player.age)
  const levelMult = target === 'farm' ? 1 : 0.35
  let gained = 0

  if (bat && bat.pa > 0) {
    gained += (6 + bat.pa * 2) * ageMult * levelMult
  }
  if (pit && pit.bf > 0) {
    gained += (8 + Math.floor(pit.bf / 2)) * ageMult * levelMult
  }

  if (gained <= 0) return player

  return {
    ...player,
    developmentXp: Math.round((player.developmentXp ?? 0) + gained),
  }
}

export function rosterDevelopmentMultiplier(player: Player): number {
  if (player.rosterLevel === 'farm') return 1
  if (player.age <= 24) return 0.5
  return 0.12
}

export function canDevelopStats(player: Player): boolean {
  if (player.age > 28) return false
  if (!hasGrowthRoom(player)) return false
  return true
}

export function pickGrowthStat(player: Player): keyof Player | null {
  if (isPitcher(player)) {
    const stats = ['velocity', 'control', 'movement', 'stamina'] as const
    const weights = stats.map((s) => {
      const val = player[s]
      const headroom = (player.potential ?? 99) - val
      return headroom > 0 ? headroom : 0
    })
    const total = weights.reduce((a, b) => a + b, 0)
    if (total <= 0) return null
    let roll = Math.random() * total
    for (let i = 0; i < stats.length; i++) {
      roll -= weights[i]!
      if (roll <= 0) return stats[i]!
    }
    return stats[0]!
  }

  const stats = ['contact', 'power', 'eye', 'speed', 'fielding'] as const
  const weights = stats.map((s) => {
    const val = player[s]
    return (player.potential ?? 99) - val > 0 ? (player.potential ?? 99) - val : 0
  })
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return null
  let roll = Math.random() * total
  for (let i = 0; i < stats.length; i++) {
    roll -= weights[i]!
    if (roll <= 0) return stats[i]!
  }
  return stats[0]!
}
