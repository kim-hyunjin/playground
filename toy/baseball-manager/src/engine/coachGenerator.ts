import type { Coach, CoachRole } from '../types/game'
import { COACH_ROLES } from '../types/game'
import { generateName } from './generator'

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, n))
}

function roleStatBoost(role: CoachRole, stat: 'teaching' | 'motivation' | 'scouting'): number {
  if (role === 'farm') {
    if (stat === 'scouting') return rand(8, 18)
    if (stat === 'teaching') return rand(5, 12)
    return rand(3, 8)
  }
  if (role === 'hitting' || role === 'pitching') {
    if (stat === 'teaching') return rand(8, 16)
    return rand(2, 6)
  }
  // fielding
  if (stat === 'teaching') return rand(6, 14)
  return rand(2, 6)
}

export function generateCoach(role: CoachRole, tier: 'avg' | 'good' | 'elite' = 'avg'): Coach {
  const base = tier === 'elite' ? rand(78, 92) : tier === 'good' ? rand(62, 82) : rand(45, 68)
  const variance = () => clamp(base + rand(-6, 6) + roleStatBoost(role, 'teaching'))

  return {
    id: crypto.randomUUID(),
    name: generateName(),
    role,
    age: rand(32, 58),
    teaching: clamp(variance()),
    motivation: clamp(base + rand(-8, 8) + roleStatBoost(role, 'motivation')),
    scouting: clamp(base + rand(-8, 8) + roleStatBoost(role, 'scouting')),
    salary: rand(40, tier === 'elite' ? 180 : tier === 'good' ? 120 : 80) * 10_000,
    contractYears: 1,
  }
}

export function generateDefaultStaff(starBoost = false): Coach[] {
  return COACH_ROLES.map((role) => {
    const tier = starBoost && role === 'farm' ? 'good' : 'avg'
    return generateCoach(role, tier)
  })
}

export function generateCoachMarket(count = 16): Coach[] {
  const coaches: Coach[] = []
  for (let i = 0; i < count; i++) {
    const role = COACH_ROLES[i % COACH_ROLES.length]!
    const tierRoll = Math.random()
    const tier = tierRoll > 0.92 ? 'elite' : tierRoll > 0.65 ? 'good' : 'avg'
    coaches.push(generateCoach(role, tier))
  }
  return coaches.sort((a, b) => b.teaching - a.teaching)
}

export function coachByRole(coaches: Coach[], role: CoachRole): Coach | undefined {
  return coaches.find((c) => c.role === role)
}

export function coachOverall(c: Coach): number {
  return Math.round((c.teaching + c.motivation + c.scouting) / 3)
}

export function teamCoachPayroll(team: { coaches: Coach[] }): number {
  return team.coaches.reduce((s, c) => s + c.salary, 0)
}

export function refreshCoachMarket(market: Coach[], minSize = 12): Coach[] {
  const next = [...market]
  while (next.length < minSize) {
    const role = COACH_ROLES[rand(0, COACH_ROLES.length - 1)]!
    next.push(generateCoach(role, Math.random() > 0.7 ? 'good' : 'avg'))
  }
  return next
}
