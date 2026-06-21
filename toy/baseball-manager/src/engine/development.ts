import type { Coach, Player, Team } from '../types/game'
import { coachByRole } from './coachGenerator'
import { isPitcher } from './generator'
import {
  ageDevelopmentMultiplier,
  canDevelopStats,
  pickGrowthStat,
  rosterDevelopmentMultiplier,
  xpGrowthBonus,
  XP_PER_GROWTH_TICK,
} from './playerDevelopment'

function clamp(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, n))
}

function tryBoost(player: Player, stat: keyof Player, value: number, chance: number): Player {
  if (Math.random() >= chance || value >= 99) return player
  return { ...player, [stat]: clamp(value + 1) } as Player
}

function coachTeachingBonus(coaches: Coach[]): number {
  const farm = coachByRole(coaches, 'farm')
  const avg = coaches.reduce((s, c) => s + c.teaching, 0) / Math.max(1, coaches.length)
  const farmBonus = farm ? farm.teaching * 0.35 : 0
  return (avg + farmBonus) / 120
}

function roleCoachBonus(coaches: Coach[], player: Player): number {
  if (isPitcher(player)) {
    const pitching = coachByRole(coaches, 'pitching')
    return pitching ? pitching.teaching / 200 : 0
  }
  const hitting = coachByRole(coaches, 'hitting')
  const fielding = coachByRole(coaches, 'fielding')
  return (hitting ? hitting.teaching / 220 : 0) + (fielding ? fielding.teaching / 400 : 0)
}

function moraleBoost(player: Player, coaches: Coach[]): Player {
  const farm = coachByRole(coaches, 'farm')
  const avgMotivation =
    coaches.reduce((s, c) => s + c.motivation, 0) / Math.max(1, coaches.length)
  const boost = (avgMotivation + (farm?.motivation ?? 0) * 0.5) / 200
  if (Math.random() >= boost) return player
  return { ...player, morale: clamp(player.morale + 1, 1, 99) }
}

function growthAttempts(player: Player): number {
  const xp = player.developmentXp ?? 0
  const fromXp = Math.min(2, Math.floor(xp / XP_PER_GROWTH_TICK / 2))
  const fromFarm = player.rosterLevel === 'farm' ? 1 : 0
  return 1 + fromXp + fromFarm
}

export function developPlayer(player: Player, coaches: Coach[]): Player {
  let next = moraleBoost(player, coaches)

  if (!canDevelopStats(next)) return next

  const base =
    coachTeachingBonus(coaches) *
    rosterDevelopmentMultiplier(next) *
    ageDevelopmentMultiplier(next.age)
  const xpBonus = xpGrowthBonus(next)
  const roleBonus = roleCoachBonus(coaches, next)

  for (let i = 0; i < growthAttempts(next); i++) {
    const stat = pickGrowthStat(next)
    if (!stat) break
    const value = next[stat] as number
    const chance = base + xpBonus + roleBonus
    next = tryBoost(next, stat, value, Math.min(0.85, chance))
  }

  return next
}

export function developTeam(team: Team): Team {
  const coaches = team.coaches ?? []
  return {
    ...team,
    players: team.players.map((p) => developPlayer(p, coaches)),
  }
}
